import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  format,
  addMonths,
  getDay,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import { RescheduleAppointmentPayload } from "@/types/booking";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { RenderIf, SelectCmp } from "@/components/shared";
import {
  Avatar,
  AvatarImage,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Switch,
} from "@/components/ui";
import {
  IconAudioLines,
  IconVideo,
  IconWallet,
  IconArrowDown,
  IconUsers,
} from "@/components/icons";
import { Loader } from "@/components/shared/loader";
import { formatNumberWithCommas } from "@/hooks/use-format-currency";
import {
  cn,
  formatTimeToAMPM,
  formatTimeToHH,
  getDaysOfMonth,
  mergeAvailabilityWithDays,
} from "@/lib/utils";
import { setAppointmentSchedule } from "@/lib/validations";
import {
  useGetProviderSchedule,
  useGetServiceProviders,
} from "@/services/hooks/queries/use-providers";
import {
  FetchedProviderSchedule,
  FetchedProviderScheduleTimes,
  FetchOrganizationProvider,
  FetchSingleProvider,
} from "@/types/providers";
import { useRescheduleAppointment } from "@/services/hooks/mutations/use-appointment";
import { useGetSingleFamilyOrFriend } from "@/services/hooks/queries/use-family-and-friends";
import { FetchedPaymentOptionFamilyType } from "@/types/family-and-friends";
import { useGetWalletTransactions } from "@/services/hooks/queries/use-wallet";
import type { FetchedWalletTransactionsStatsType } from "@/types/wallet";
import { toast } from "sonner";
import { FundWalletModal } from "../wallet/fund-wallet-modal";
import { useGetAppointmentsById } from "@/services/hooks/queries/use-appointments";
import { ResecheduleAppointmentDialog } from "./RescheduleAppointmentDialog";

interface EditAppointmentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const RescheduleAppointmentForm = ({
  onSuccess,
}: EditAppointmentFormProps) => {
  const navigate = useRouter();
  const [openReschedule, setOpenReschedule] = useState(false);
  const [rescheduleData, setRescheduleData] =
    useState<RescheduleAppointmentPayload>({} as RescheduleAppointmentPayload);
  const [openFundWalletModal, setOpenFundWalletModal] = useState(false);

  const searchParams = useSearchParams();
  const appointment_id = searchParams.get("appointment_id") as string;
  const provider_id = searchParams.get("provider_id") as string;
  const org_id = searchParams.get("org_id") as string;
  const user_type = searchParams.get("type") as "provider" | "org";
  const account_service_type = searchParams.get("service_type") as
    | "provider"
    | "payer";

  // Load appointment data
  const {
    data: appointmentData,
    isPending: isLoadingAppointment,
    refetch: refetchAppointment,
    isRefetching: isRefetchingAppointment,
  } = useGetAppointmentsById(appointment_id);

  // Load provider/org info
  const {
    data: providerInfo,
    isLoading: isLoadingProviderInfo,
    isRefetching: isRefetchingProviderInfo,
    refetch: refetchProviderInfo,
  } = useGetServiceProviders<FetchSingleProvider>({
    user_id: provider_id?.toString(),
    user_type: "provider",
    account_service_type: "provider",
  });

  const {
    data: orgInfo,
    isLoading: isLoadingOrgInfo,
    isRefetching: isRefetchingOrgInfo,
    refetch: refetchOrgInfo,
  } = useGetServiceProviders<FetchOrganizationProvider>({
    user_id: org_id?.toString(),
    user_type: "org",
    account_service_type: "payer",
  });

  // Family/friend payment option
  const { data: familyFriendInfo } =
    useGetSingleFamilyOrFriend<FetchedPaymentOptionFamilyType>(
      {
        familyfriend_id: provider_id,
        component: "payment-option",
      },
      { enabled: !!provider_id }
    );

  // Wallet data
  const { data: walletCountStatus } =
    useGetWalletTransactions<FetchedWalletTransactionsStatsType>({
      component: "count-status",
    });

  // Reschedule mutation
  const { mutate: rescheduleAppointment, isPending: isSubmittingReschedule } =
    useRescheduleAppointment(() => {
      setOpenReschedule(true);
      onSuccess?.();
    });

  // Form state
  const [selectedCommunicationPreference, setSelectedCommunicationPreference] =
    useState("");
  const [initialDate, setInitialDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<any>("");

  // Provider schedule data
  const { data: providerDates } = useGetProviderSchedule<
    FetchedProviderSchedule[]
  >({
    provider_id: provider_id,
    time_zone: new Date().getTimezoneOffset()?.toString(),
  });

  const { data: providerTimes } = useGetProviderSchedule<
    FetchedProviderScheduleTimes[]
  >({
    provider_id: provider_id,
    time_zone: new Date().getTimezoneOffset()?.toString(),
    ...(selectedDate ? { appt_date: format(selectedDate, "yyyy-MM-dd") } : {}),
  });

  // Available time slots
  const availableTimeBasedOnApptDate = providerTimes?.filter(
    (val) => val?.status === 0
  );
  const formattedSlots = availableTimeBasedOnApptDate?.map((slot, index) => {
    const formattedStartTimeAMPM = formatTimeToAMPM(slot.start_time);
    const formattedEndTimeAMPM = formatTimeToAMPM(slot.end_time);
    const formattedStartTimeHH = formatTimeToHH(slot.start_time);
    return {
      id: index,
      value: `${formattedStartTimeAMPM} - ${formattedEndTimeAMPM}`,
      real: formattedStartTimeHH,
    };
  });

  // Payment methods
  const paymentMethods = [
    { id: 1, name: "Wallet", icon: IconWallet },
    ...(familyFriendInfo &&
    (familyFriendInfo as FetchedPaymentOptionFamilyType)?.familyfriend_id
      ? [{ id: 2, name: "Family", icon: IconUsers }]
      : []),
  ];

  // Communication preferences
  const communicationPreferences = [
    { id: 1, name: "Video", icon: IconVideo },
    { id: 2, name: "Audio", icon: IconAudioLines },
  ];

  // Calendar logic
  const today = new Date();
  const yesterday = subDays(today, 1);

  const goToNextMonth = () => {
    setInitialDate(addMonths(initialDate, 1));
  };

  const goToPreviousMonth = () => {
    setInitialDate(subMonths(initialDate, 1));
  };

  const currentMonth = initialDate.getMonth();
  const currentYear = initialDate.getFullYear();
  const start = startOfMonth(currentMonth);
  const startDay = getDay(start);

  const mergedAvailability = providerDates
    ? mergeAvailabilityWithDays(
        getDaysOfMonth(currentYear, currentMonth),
        providerDates
      )
    : [];

  function isDateBeforeToday(date: Date): boolean {
    const today = startOfDay(new Date());
    return isBefore(date, today);
  }

  const handleDateClick = (date: any, field: any) => {
    if (!isBefore(startOfDay(date), yesterday)) {
      setSelectedDate(date);
      field?.onChange(date);
    }
  };

  // Form setup
  const form = useForm<z.infer<typeof setAppointmentSchedule>>({
    resolver: zodResolver(setAppointmentSchedule),
    mode: "onChange",
    defaultValues: {
      service: "",
      paymentMethod: "Wallet",
      appointmentDate: new Date(),
      appointmentTime: "",
      communicationPreference: "",
      agreeToCancellation: true,
    },
  });

  useEffect(() => {
    return () => {
      form.reset({
        service: "",
        paymentMethod: "Wallet",
        appointmentDate: new Date(),
        appointmentTime: "",
        communicationPreference: "",
        agreeToCancellation: true,
      });
    };
  }, [appointment_id, form]);

  useEffect(
    () => {
      refetchAppointment();
      refetchProviderInfo();
      refetchOrgInfo();
    },
    // eslint-disable-next-line
    []
  );

  useEffect(
    () => {
      if (!appointmentData || !appointment_id || isLoadingAppointment) return;

      const serviceData =
        account_service_type === "provider" && user_type === "org"
          ? orgInfo?.service_data
          : providerInfo?.service_data;

      const matchingService = serviceData?.find(
        (service: { service_offer_id: string; name: string; amount: number }) =>
          service.service_offer_id === appointmentData.service_offer_id
      );

      const formattedService =
        matchingService && appointmentData
          ? appointmentData?.payment_by !== 1
            ? `${matchingService.name} - ${formatNumberWithCommas(
                matchingService.amount
              )}`
            : matchingService.name
          : "";

      const appointmentDate = new Date(appointmentData.appt_schedule);

      // Set the selected date and initial date
      setSelectedDate(appointmentDate);
      setInitialDate(appointmentDate);

      const communicationPref =
        appointmentData.comm_mode.charAt(0).toUpperCase() +
        appointmentData.comm_mode.slice(1);
      setSelectedCommunicationPreference(communicationPref);

      const paymentMethod =
        appointmentData.payment_by === 2 ? "Family" : "Wallet";
      // setSelectedPaymentMethod(paymentMethod);

      // Set form data
      const baseFormData = {
        service: formattedService,
        paymentMethod: paymentMethod,
        appointmentDate: appointmentDate,
        communicationPreference: communicationPref,
        agreeToCancellation: true,
        appointmentTime: "",
      };

      form.reset(baseFormData);
    },
    // eslint-disable-next-line
    [
      appointmentData,
      appointment_id,
      isLoadingAppointment,
      isLoadingProviderInfo,
      isLoadingOrgInfo,
      isRefetchingProviderInfo,
      isRefetchingOrgInfo,
      isRefetchingAppointment,
      account_service_type,
      user_type,
      form,
    ]
  );

  async function onSubmit(values: z.infer<typeof setAppointmentSchedule>) {
    // Trigger reschedule notice
    rescheduleAppointment({
      appointmentId: appointment_id,
      component: "notice",
    });

    // Set reschedule data for dialog
    setRescheduleData({
      appt_date: format(values.appointmentDate, "yyyy-MM-dd"),
      appt_time:
        formattedSlots?.filter(
          (val) => val?.value === values.appointmentTime
        )[0]?.real ?? "",
      time_zone: new Date().getTimezoneOffset()?.toString(),
    });
  }

  const buttonState = useMemo(() => {
    return isSubmittingReschedule ? "loading" : "idle";
  }, [isSubmittingReschedule]);

  const formService = form.watch("service");
  const formPaymentMethod = form.watch("paymentMethod");

  // Wallet balance check
  useEffect(() => {
    const serviceAmount = parseInt(
      formService
        .split(" - ")?.[1]
        ?.replace(/,/g, "")
        ?.split(".")?.[0]
        ?.substring(1)
    );
    if (
      formService &&
      serviceAmount >
        ((walletCountStatus as FetchedWalletTransactionsStatsType)
          ?.total_balance || 0) &&
      formPaymentMethod &&
      formPaymentMethod.toLowerCase() === "wallet"
    ) {
      toast.info(
        () => (
          <div className="grid gap-4 text-grey-200">
            <p>Insufficient balance. Please top up your wallet.</p>
            <Button type="button" onClick={() => setOpenFundWalletModal(true)}>
              Top Up Wallet
            </Button>
          </div>
        ),
        { icon: <></> }
      );
    }
  }, [formService, formPaymentMethod, walletCountStatus]);

  if (isLoadingProviderInfo || isLoadingAppointment) {
    return (
      <div className="bg-white h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-full pb-12 grid gap-y-4">
      <span className="text-center font-bold text-xl md:text-2xl text-brand-1 py-5">
        Reschedule Appointment
      </span>

      <div className="bg-white p-3 md:p-4 grid gap-y-4 rounded-2xl h-fit">
        <h4 className="font-semibold text-brand-1 text-sm md:text-base">
          Current Provider
        </h4>

        <div className="p-2 grid gap-y-3 bg-blue-400 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Avatar className="size-11 rounded-sm">
                <AvatarImage
                  className="object-cover"
                  src={
                    org_id
                      ? orgInfo?.avatar || "/assets/blank-profile-picture.png"
                      : providerInfo?.avatar ||
                        "/assets/blank-profile-picture.png"
                  }
                />
              </Avatar>

              <div className="grid gap-y-0.5">
                <h3 className="font-semibold text-brand-1">
                  {org_id ? orgInfo?.name : providerInfo?.name}
                </h3>
                <p className="text-brand-2 text-xs capitalize">
                  {org_id ? orgInfo?.industry_name : providerInfo?.specialty}
                </p>
              </div>
            </div>

            <span className="text-gray-400 text-sm">Current Provider</span>
          </div>

          <RenderIf condition={user_type === "org"}>
            <div className="border-t border-divider"></div>
            <div className="flex justify-between items-center">
              <div className="grid gap-y-0.5">
                <p className="font-semibold text-brand-1">
                  {providerInfo?.name}
                </p>
                <p className="text-brand-2 text-xs capitalize">
                  {providerInfo?.specialty}
                </p>
              </div>
            </div>
          </RenderIf>
        </div>
      </div>

      <Form {...form}>
        <form className="grid gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl p-3 md:p-4 grid gap-y-4">
            <div className="grid gap-y-2">
              <p className="font-semibold text-brand-2 text-sm md:text-base">
                Services
              </p>

              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectCmp
                        disabled={true}
                        selectItems={
                          account_service_type === "provider" &&
                          user_type === "org"
                            ? orgInfo?.service_data?.map(
                                (
                                  val: { name: string; amount: number },
                                  index: number
                                ) => ({
                                  id: index,
                                  value:
                                    appointmentData?.payment_by !== 1
                                      ? `${
                                          val?.name
                                        } - ${formatNumberWithCommas(
                                          val?.amount
                                        )}`
                                      : val?.name,
                                })
                              ) ?? []
                            : providerInfo?.service_data?.map(
                                (
                                  val: { name: string; amount: number },
                                  index: number
                                ) => ({
                                  id: index,
                                  value:
                                    appointmentData?.payment_by !== 1 ||
                                    account_service_type === "payer"
                                      ? `${
                                          val?.name
                                        } - ${formatNumberWithCommas(
                                          val?.amount
                                        )}`
                                      : val?.name,
                                })
                              ) ?? []
                        }
                        onSelect={(val) => field.onChange(val)}
                        placeholder="Service"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-blue-400 rounded-lg flex items-center justify-between p-3 font-medium text-brand-1">
              <p className="text-sm">Charge</p>
              <p className="text-lg">
                {appointmentData?.payment_by !== 1 ||
                account_service_type === "payer"
                  ? `${
                      form.watch("service").split(" - ")[1] ||
                      formatNumberWithCommas(0)
                    }/hr`
                  : "N/A"}
              </p>
            </div>

            <RenderIf
              condition={
                !!familyFriendInfo &&
                !!(familyFriendInfo as FetchedPaymentOptionFamilyType)
                  ?.familyfriend_id &&
                account_service_type !== "payer"
              }
            >
              <div className="border-t border-divider"></div>

              <div className="flex flex-col gap-2">
                <p className="font-medium text-sm text-brand-1">
                  Payment Method
                </p>

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SelectCmp
                          disabled={!!appointment_id}
                          onSelect={(e) => {
                            field.onChange(e);
                          }}
                          selectItems={
                            paymentMethods?.map((val) => {
                              return {
                                id: val.id,
                                value: val.name,
                              };
                            }) ?? []
                          }
                          placeholder="Payment Method"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </RenderIf>

            <div className="border-t border-divider"></div>

            <FormField
              control={form.control}
              name="agreeToCancellation"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex justify-between items-center bg-input-field px-3 py-2 rounded-sm">
                      <p className="text-xs font-medium text-brand-1">
                        I agree to{" "}
                        <a
                          href="https://themsmt.com/terms-of-service/"
                          target="_blank"
                          className="underline"
                        >
                          cancellation and refund policy
                        </a>
                      </p>
                      <Switch
                        checked={field.value}
                        disabled={true}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-white rounded-2xl p-4 grid gap-y-4">
            <div className="grid gap-y-0.5">
              <h3 className="font-semibold text-brand-1 text-sm md:text-base">
                New Schedule Preference
              </h3>
              <p className="text-xs text-brand-2">
                Select a new date and time for your appointment
              </p>
            </div>

            <FormField
              control={form.control}
              name="appointmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-y-4.5">
                      <div className="flex items-center justify-between">
                        <Button
                          className="py-4.5 px-3 disabled:cursor-not-allowed"
                          variant="secondary"
                          type="button"
                          onClick={goToPreviousMonth}
                          disabled={
                            currentMonth === new Date().getMonth() &&
                            currentYear === new Date().getFullYear()
                          }
                        >
                          <IconArrowDown className="stroke-button-primary rotate-90 stroke-3" />
                        </Button>

                        <h2 className="text-lg font-semibold">
                          {format(initialDate, "MMMM yyyy")}
                        </h2>

                        <Button
                          className="py-4.5 px-3"
                          variant="secondary"
                          onClick={goToNextMonth}
                          type="button"
                        >
                          <IconArrowDown className="stroke-button-primary rotate-270 stroke-3" />
                        </Button>
                      </div>

                      <div className="grid gap-2 grid-cols-4 md:grid-cols-7">
                        {Array.from({ length: startDay }).map((_, i) => (
                          <div key={`empty-${i}`}></div>
                        ))}

                        {mergedAvailability?.map((val, i) => (
                          <button
                            key={i}
                            type="button"
                            className={cn(
                              "flex flex-col items-center justify-center text-xs py-2.5 rounded-lg cursor-pointer disabled:cursor-not-allowed",
                              isSameDay(val?.date, selectedDate) &&
                                val?.available &&
                                !isDateBeforeToday(val?.date)
                                ? "font-semibold bg-button-primary text-white"
                                : isDateBeforeToday(val?.date) ||
                                  !val?.available
                                ? "bg-gray-300 text-white"
                                : "bg-input-field"
                            )}
                            disabled={
                              isDateBeforeToday(val?.date) || !val?.available
                            }
                            onClick={() => handleDateClick(val?.date, field)}
                          >
                            <p>{format(val?.date, "EEE")}</p>
                            <p>{format(val?.date, "d")}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t border-divider"></div>

            <FormField
              control={form.control}
              name="appointmentTime"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-brand-2">
                        Appointment Time
                      </h3>
                      <SelectCmp
                        selectItems={formattedSlots ?? []}
                        placeholder="time (WAT)"
                        onSelect={(val) => field.onChange(val)}
                        value={field.value}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t border-divider"></div>

            <FormField
              control={form.control}
              name="communicationPreference"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
                      <p className="font-medium text-sm">
                        Communication preference
                      </p>

                      <div className="flex items-center gap-x-2">
                        {communicationPreferences.map((preference) => (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCommunicationPreference(
                                preference.name
                              );
                              field.onChange(preference.name);
                            }}
                            key={preference.id}
                            className={cn(
                              "flex items-center gap-x-2 px-3 py-1 border rounded-full cursor-pointer",
                              preference.name ===
                                selectedCommunicationPreference
                                ? "bg-blue-400 border-button-primary"
                                : "border-divider bg-white"
                            )}
                          >
                            <preference.icon
                              className={cn(
                                "size-3.5",
                                preference.name ===
                                  selectedCommunicationPreference
                                  ? "stroke-button-primary"
                                  : "stroke-brand-3"
                              )}
                            />
                            <p
                              className={cn(
                                "text-sm",
                                preference.name ===
                                  selectedCommunicationPreference
                                  ? "text-button-primary"
                                  : "text-brand-2"
                              )}
                            >
                              {preference.name}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 md:flex md:items-center md:justify-end gap-x-5">
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isValid || isSubmittingReschedule}
              className="w-29"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                  initial={{ opacity: 0, y: -25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 25 }}
                  key={buttonState}
                >
                  {isSubmittingReschedule ? (
                    <Loader className="spinner size-4" />
                  ) : (
                    "Reschedule"
                  )}
                </motion.span>
              </AnimatePresence>
            </Button>
          </div>
        </form>
      </Form>

      <FundWalletModal
        isPublic={false}
        isOpen={openFundWalletModal}
        handleClose={() => setOpenFundWalletModal(false)}
      />

      <ResecheduleAppointmentDialog
        open={openReschedule}
        rescheduleData={rescheduleData}
        onOpenChange={setOpenReschedule}
      />
    </div>
  );
};
