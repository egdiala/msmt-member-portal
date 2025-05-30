"use client";

import Cookies from "js-cookie";
import { Dispatch, SetStateAction, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  addMonths,
  format,
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
import { Checkbox } from "@/components/ui/checkbox";
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
import { useBookSelfAppointment } from "@/services/hooks/mutations/use-booking";
import {
  FetchedProviderSchedule,
  FetchedProviderScheduleTimes,
  FetchOrganizationProvider,
  FetchSingleProvider,
} from "@/types/providers";
import {
  useCompleteOrgBooking,
  useRescheduleAppointment,
} from "@/services/hooks/mutations/use-appointment";
import { useGetSingleFamilyOrFriend } from "@/services/hooks/queries/use-family-and-friends";
import { FetchedPaymentOptionFamilyType } from "@/types/family-and-friends";
import { useGetWalletTransactions } from "@/services/hooks/queries/use-wallet";
import type { FetchedWalletTransactionsStatsType } from "@/types/wallet";
import { toast } from "sonner";
import { FundWalletModal } from "../wallet/fund-wallet-modal";
import { useGetAppointmentsById } from "@/services/hooks/queries/use-appointments";
import { ResecheduleAppointmentDialog } from "./RescheduleAppointmentDialog";

interface ISetScheduleStep {
  setStep: Dispatch<SetStateAction<string | number>>;
  isPublic?: boolean;
}
export const SetScheduleStep = ({ setStep, isPublic }: ISetScheduleStep) => {
  const navigate = useRouter();
  const [openReschedule, setOpenReschedule] = useState(false);
  const [rescheduleData, setRescheduleData] =
    useState<RescheduleAppointmentPayload>({} as RescheduleAppointmentPayload);
  const { data: walletCountStatus } =
    useGetWalletTransactions<FetchedWalletTransactionsStatsType>(
      {
        component: "count-status",
      },
      { enabled: !isPublic }
    );

  const searchParams = useSearchParams();
  const booking_link = searchParams.get("booking_link") as string | undefined;
  const provider_id = searchParams.get("provider_id") as string;
  const org_id = searchParams.get("org_id") as string;
  const appointment_id = searchParams.get("appointment_id") as
    | string
    | undefined;
  const user_type = searchParams.get("type") as "provider" | "org";
  const { mutate: rescheduleAppointment, isPending: isSubmittingReschedule } =
    useRescheduleAppointment(() => {
      setOpenReschedule(true);
    });
  const account_service_type = searchParams.get("service_type") as
    | "provider"
    | "payer";

  const { data, isPending: isLoadingAppointment } = useGetAppointmentsById(
    appointment_id as string
  );
  console.log(data);
  const { data: familyFriendInfo } =
    useGetSingleFamilyOrFriend<FetchedPaymentOptionFamilyType>(
      {
        familyfriend_id: provider_id,
        component: "payment-option",
      },
      { enabled: isPublic ? false : !!provider_id }
    );

  const { data: providerInfo, isLoading: isLoadingProviderInfo } =
    useGetServiceProviders<FetchSingleProvider>({
      user_id: provider_id?.toString(),
      user_type: "provider",
      account_service_type: "provider",
    });

  const { data: orgInfo } = useGetServiceProviders<FetchOrganizationProvider>({
    user_id: org_id?.toString(),
    user_type: "org",
    account_service_type: "payer",
  });

  const paymentMethods = [
    { id: 1, name: "Wallet", icon: IconWallet },
    ...(familyFriendInfo &&
    (familyFriendInfo as FetchedPaymentOptionFamilyType)?.familyfriend_id
      ? [{ id: 2, name: "Family", icon: IconUsers }]
      : []),
  ];

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Wallet");
  const [openFundWalletModal, setOpenFundWalletModal] = useState(false);

  const isLoggedIn = Cookies.get("authToken");

  const communicationPreferences = [
    { id: 1, name: "Video", icon: IconVideo },
    { id: 2, name: "Audio", icon: IconAudioLines },
  ];

  const [selectedCommunicationPreference, setSelectedCommunicationPreference] =
    useState("");

  const [intialDate, setInitialDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<any>("");

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

  const availableTimeBasedOnApptDate = providerTimes?.filter(
    (val) => val?.status === 0
  );

  const formattedSlots = availableTimeBasedOnApptDate?.map((slot, index) => {
    const formattedStartTimeAMPM = formatTimeToAMPM(slot.start_time);
    const formattedEndTimeAMPM = formatTimeToAMPM(slot.end_time); //
    const formattedStartTimeHH = formatTimeToHH(slot.start_time); //
    return {
      id: index, // Using the index as the id
      value: `${formattedStartTimeAMPM} - ${formattedEndTimeAMPM}`, // Combine both times as the value
      real: formattedStartTimeHH, // Add the start_time in 24-hour format (HH)
    };
  });

  const today = new Date();
  const yesterday = subDays(today, 1);

  // Handlers for navigation
  const goToNextMonth = () => {
    setInitialDate(addMonths(intialDate, 1)); // Move to the next month
  };

  const goToPreviousMonth = () => {
    setInitialDate(subMonths(intialDate, 1)); // Move to the previous month
  };

  const currentMonth = intialDate.getMonth(); // Current selected month
  const currentYear = intialDate.getFullYear(); // Current selected year

  const start = startOfMonth(currentMonth);
  const startDay = getDay(start);

  // Get availability for the selected month
  const mergedAvailability = providerDates
    ? mergeAvailabilityWithDays(
        getDaysOfMonth(currentYear, currentMonth),
        providerDates
      )
    : [];

  function isDateBeforeToday(date: Date): boolean {
    const today = startOfDay(new Date()); // Normalize to midnight to compare only the date, not the time
    return isBefore(date, today); // Returns true if the date is before today
  }

  const handleDateClick = (date: any, field: any) => {
    if (!isBefore(startOfDay(date), yesterday)) {
      setSelectedDate(date);
      field?.onChange(date);
    }
  };

  const form = useForm<z.infer<typeof setAppointmentSchedule>>({
    resolver: zodResolver(setAppointmentSchedule),
    mode: "onChange",
    defaultValues: {
      service: "",
      paymentMethod: "",
      appointmentDate: new Date(),
      appointmentTime: "",
      communicationPreference: "",
    },
  });

  const { mutate, isPending } = useBookSelfAppointment((res) => {
    localStorage.setItem("booking-appointment-id", res?.appointment_id);
    setStep(2);
  });

  const { mutate: completeOrgBooking, isPending: isSubmitting } =
    useCompleteOrgBooking((res) => {
      localStorage.setItem("booking-appointment-id", res?.appointment_id);
      setStep(3);
    });

  async function onSubmit(values: z.infer<typeof setAppointmentSchedule>) {
    const dataToBeSent = {
      provider_id: provider_id,
      service_offer_id:
        account_service_type === "provider" && user_type === "org"
          ? orgInfo?.service_data?.filter(
              (val: { name: string }) =>
                val.name === values.service.split(" - ")[0]
            )[0]?.service_offer_id ?? ""
          : providerInfo?.service_data?.filter(
              (val: { name: string }) =>
                val.name === values.service.split(" - ")[0]
            )[0]?.service_offer_id ?? "",
      appt_date: format(values.appointmentDate, "yyyy-MM-dd"),
      appt_time:
        formattedSlots?.filter(
          (val) => val?.value === values.appointmentTime
        )[0]?.real ?? "",
      comm_mode: values.communicationPreference?.toLowerCase() as
        | "video"
        | "audio",
      time_zone: new Date().getTimezoneOffset()?.toString(),
      ...(selectedPaymentMethod === "Family"
        ? {
            familyuser_id: (familyFriendInfo as FetchedPaymentOptionFamilyType)
              ?.familyfriend_id,
          }
        : {}),
      ...(account_service_type === "provider"
        ? { org_provider_id: orgInfo?.user_id }
        : {}),
      ...(account_service_type === "payer"
        ? { org_payer_id: orgInfo?.user_id }
        : {}),
    };
    if (!!isLoggedIn && !appointment_id) {
      mutate(dataToBeSent);
    }
    if (appointment_id) {
      console.log("Booking link333:", booking_link);
      rescheduleAppointment({
        appointmentId: appointment_id as string,
        component: "notice",
      });
    }
    setRescheduleData({
      appt_date: dataToBeSent?.appt_date,
      appt_time: dataToBeSent?.appt_time,
      time_zone: dataToBeSent?.time_zone,
    });

    if (!isLoggedIn) {
      console.log("Booking link:", booking_link);
      completeOrgBooking({
        ...dataToBeSent,
        booking_link: booking_link || "",
      });
    }
  }

  const buttonCopy = {
    idle: !!isLoggedIn
      ? !!appointment_id
        ? "Reschedule"
        : "Proceed to Pay"
      : "Continue",
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending || isSubmitting || isSubmittingReschedule
      ? "loading"
      : "idle";
  }, [isPending, isSubmitting, isSubmittingReschedule]);

  const formService = form.watch("service");
  const formPaymentMethod = form.watch("paymentMethod");

  useEffect(
    () => {
      form.setValue("paymentMethod", "Wallet");
    },
    // eslint-disable-next-line
    []
  );

  useEffect(() => {
    const serviceAmount = parseInt(
      formService
        .split(" - ")?.[1]
        ?.replace(/,/g, "")
        ?.split(".")?.[0]
        ?.substring(1)
    );
    if (
      !isPublic &&
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
  }, [formService, formPaymentMethod, walletCountStatus, isPublic]);

  return (
    <div className="min-h-full pb-12 grid gap-y-4">
      <RenderIf condition={!!isLoggedIn}>
        <span className="text-center font-bold text-xl md:text-2xl text-brand-1 py-5">
          Book an Appointment
        </span>
      </RenderIf>
      <RenderIf condition={!isLoggedIn}>
        <span className="text-center font-bold text-xl md:text-2xl text-brand-1 pb-5 md:py-5">
          Set Schedule Preference
        </span>
      </RenderIf>

      <RenderIf condition={isLoadingProviderInfo || isLoadingAppointment}>
        <div className="bg-white h-screen flex justify-center items-center">
          <Loader />
        </div>
      </RenderIf>

      <RenderIf condition={!isLoadingProviderInfo && !isLoadingAppointment}>
        <div className="bg-white p-3 md:p-4 grid gap-y-4 rounded-2xl h-fit">
          <h4 className="font-semibold text-brand-1 text-sm md:text-base">
            Preferred Provider
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

              <RenderIf condition={!!isLoggedIn}>
                <Button
                  asChild
                  variant="link"
                  className={cn(
                    "underline text-button-primary font-semibold underline-offset-3 decoration-1 text-sm",
                    !!appointment_id
                      ? "pointer-events-none text-gray-400 cursor-not-allowed"
                      : "cursor-pointer"
                  )}
                >
                  <Link
                    href={!!appointment_id ? "#" : "/providers"}
                    onClick={(e) => {
                      if (!!appointment_id) {
                        e.preventDefault();
                      }
                    }}
                  >
                    Change
                  </Link>
                </Button>
              </RenderIf>

              <RenderIf condition={!isLoggedIn}>
                <button
                  disabled={!!appointment_id}
                  onClick={() => navigate.back()}
                  className="underline text-button-primary font-semibold underline-offset-3 decoration-1 text-sm cursor-pointer"
                >
                  Change
                </button>
              </RenderIf>
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

                <button
                  type="button"
                  disabled={!!appointment_id}
                  onClick={() =>
                    navigate.push(
                      `/providers/organisation/${orgInfo?.user_id}?type=${user_type}&service_type=${account_service_type}`
                    )
                  }
                  className="underline text-button-primary font-semibold underline-offset-3 decoration-1 text-sm cursor-pointer"
                >
                  Change
                </button>
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
                          disabled={!!appointment_id}
                          selectItems={
                            account_service_type === "provider" &&
                            user_type === "org"
                              ? orgInfo?.service_data?.map(
                                  (
                                    val: { name: string; amount: number },
                                    index: number
                                  ) => {
                                    return {
                                      id: index,
                                      value: `${
                                        val?.name
                                      } - ${formatNumberWithCommas(
                                        val?.amount
                                      )}`,
                                    };
                                  }
                                ) ?? []
                              : providerInfo?.service_data?.map(
                                  (
                                    val: { name: string; amount: number },
                                    index: number
                                  ) => {
                                    return {
                                      id: index,
                                      value: `${
                                        val?.name
                                      } - ${formatNumberWithCommas(
                                        val?.amount
                                      )}`,
                                    };
                                  }
                                ) ?? []
                          }
                          onSelect={(val) => {
                            field.onChange(val);
                          }}
                          placeholder="Select Service"
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
                  {form.watch("service").split(" - ")[1] ||
                    formatNumberWithCommas(0)}
                  /hr
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

                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                  <p className="font-medium text-sm text-brand-1">
                    Payment Method
                  </p>

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center gap-x-2">
                            {paymentMethods.map(
                              (method: {
                                name: string;
                                id: number;
                                icon: any;
                              }) => (
                                <div
                                  key={method.id}
                                  onClick={
                                    appointment_id
                                      ? undefined
                                      : () => {
                                          setSelectedPaymentMethod(method.name);
                                          field.onChange(method.name);
                                        }
                                  }
                                  className={cn(
                                    "flex items-center gap-x-2 px-3 py-2 rounded-full border border-divider cursor-pointer hover:bg-blue-400",
                                    appointment_id &&
                                      "cursor-not-allowed text-gray-500 bg-gray-100"
                                  )}
                                >
                                  {selectedPaymentMethod.toLowerCase() ===
                                  method.name.toLowerCase() ? (
                                    <Checkbox
                                      disabled={!!appointment_id}
                                      checked={
                                        selectedPaymentMethod.toLowerCase() ===
                                        method.name.toLowerCase()
                                      }
                                    />
                                  ) : (
                                    <method.icon className="stroke-brand-3 size-3.5" />
                                  )}

                                  <p
                                    className={cn(
                                      "text-sm",
                                      selectedPaymentMethod.toLowerCase() ===
                                        method.name.toLowerCase()
                                        ? "text-button-primary"
                                        : "text-brand-2"
                                    )}
                                  >
                                    {method.name}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
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
                          <Link
                            href="https://themsmt.com/terms-of-service/"
                            target="_blank"
                            className="underline"
                          >
                            cancellation and refund policy
                          </Link>
                        </p>

                        <Switch
                          checked={field.value}
                          disabled={!!appointment_id}
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
                  Schedule preference
                </h3>
                <p className="text-xs text-brand-2">
                  Select the date and time for your appointment
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
                            {format(intialDate, "MMMM yyyy")}
                          </h2>

                          <Button
                            className="py-4.5 px-3 "
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
                              onClick={() => {
                                handleDateClick(val?.date, field);
                              }}
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
                      <SelectCmp
                        selectItems={formattedSlots ?? []}
                        placeholder="Select time (WAT)"
                        onSelect={(val) => field.onChange(val)}
                        value={field.value}
                      />
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
                      <div className="flex flex-col gap-2 md:flex-row  md:items-center justify-between">
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

            {/** Button section */}
            <div className="grid grid-cols-2 md:flex md:items-center md:justify-end gap-x-5">
              <Button variant="secondary" asChild>
                <Link href="/providers">Go Back</Link>
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid || isPending || isSubmitting}
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
                    {buttonCopy[buttonState]}
                  </motion.span>
                </AnimatePresence>
              </Button>
            </div>
          </form>
        </Form>
      </RenderIf>

      <FundWalletModal
        isPublic={isPublic}
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
