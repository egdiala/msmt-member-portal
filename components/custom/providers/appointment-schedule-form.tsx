"use client";

import { Dispatch, SetStateAction, useMemo, useState } from "react";
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
import { useMultipleRequestVariables } from "@/services/hooks/queries/use-profile";
import { useBookSelfAppointment } from "@/services/hooks/mutations/use-booking";
import {
  FetchedProviderSchedule,
  FetchedProviderScheduleTimes,
  FetchSingleProvider,
} from "@/types/providers";

interface ISetScheduleStep {
  isOrganisation?: boolean;
  setStep: Dispatch<SetStateAction<string | number>>;
}
export const SetScheduleStep = ({
  // eslint-disable-next-line
  isOrganisation,
  setStep,
}: ISetScheduleStep) => {
  const navigate = useRouter();

  const searchParams = useSearchParams();
  const provider_id = searchParams.get("provider_id") as string;
  const user_type = searchParams.get("type") as "provider" | "org";
  const account_service_type = searchParams.get("service_type") as
    | "provider"
    | "payer";

  const { data: providerInfo, isLoading: isLoadingProviderInfo } =
    useGetServiceProviders<FetchSingleProvider>({
      user_id: provider_id?.toString(),
      user_type: user_type,
      account_service_type: account_service_type,
    });

  const { data: requestVariables } = useMultipleRequestVariables([
    "service-offering",
  ]);

  const paymentMethods = [{ id: 1, name: "Wallet", icon: IconWallet }];

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string[]>(
    []
  );

  const communicationPreferences = [
    { id: 1, name: "Video", icon: IconVideo },
    { id: 2, name: "Audio", icon: IconAudioLines },
  ];

  const [selectedCommunicationPreference, setSelectedCommunicationPreference] =
    useState("");

  const [intialDate, setInitialDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<any>(""); // Default is current date

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
    const formattedStartTimeAMPM = formatTimeToAMPM(slot.start_time); // Convert start_time to AM/PM format
    const formattedEndTimeAMPM = formatTimeToAMPM(slot.end_time); // Convert end_time to AM/PM format
    const formattedStartTimeHH = formatTimeToHH(slot.start_time); // Convert start_time to 24-hour (HH) format
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
      paymentMethod: [],
      appointmentDate: new Date(),
      appointmentTime: "",
      communicationPreference: "",
    },
  });

  const { mutate, isPending } = useBookSelfAppointment((res) => {
    localStorage.setItem("booking-appointment-id", res?.appointment_id);
    setStep(2);
  });

  async function onSubmit(values: z.infer<typeof setAppointmentSchedule>) {
    const dataToBeSent = {
      provider_id: provider_id,
      service_offer_id: requestVariables["service-offering"]?.filter(
        (val: { name: string }) => val.name === values.service
      )[0]?.service_offer_id,
      appt_date: format(values.appointmentDate, "yyyy-MM-dd"),
      appt_time:
        formattedSlots?.filter(
          (val) => val?.value === values.appointmentTime
        )[0]?.real ?? "",
      comm_mode: values.communicationPreference?.toLowerCase() as
        | "video"
        | "audio",
      time_zone: new Date().getTimezoneOffset()?.toString(),
    };

    mutate(dataToBeSent);
  }

  const buttonCopy = {
    idle: "Proceed to Pay",
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending ? "loading" : "idle";
  }, [isPending]);

  return (
    <div className="min-h-full pb-12 grid gap-y-4 content-start">
      <span className="text-center font-bold text-xl md:text-2xl text-brand-1 py-5">
        Book an Appointment
      </span>

      <RenderIf condition={isLoadingProviderInfo}>
        <div className="bg-white h-screen flex justify-center items-center">
          <Loader />
        </div>
      </RenderIf>

      <RenderIf condition={!isLoadingProviderInfo}>
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
                      providerInfo?.avatar ||
                      "/assets/blank-profile-picture.png"
                    }
                  />
                </Avatar>

                <div className="grid gap-y-0.5">
                  <h3 className="font-semibold text-brand-1">
                    {providerInfo?.name}
                  </h3>
                  <p className="text-brand-2 text-xs capitalize">
                    {providerInfo?.specialty}
                  </p>
                </div>
              </div>

              <Button
                asChild
                variant="link"
                className="underline text-button-primary font-semibold underline-offset-3 decoration-1 text-sm cursor-pointer"
              >
                <Link href="/providers">Change</Link>
              </Button>
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

                <Link
                  href=""
                  className="underline text-button-primary font-semibold underline-offset-3 decoration-1 text-sm"
                >
                  Change
                </Link>
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
                          selectItems={requestVariables[
                            "service-offering"
                          ]?.map((val: { name: string }, index: number) => {
                            return {
                              id: index,
                              value: val?.name,
                            };
                          })}
                          onSelect={(val) => field.onChange(val)}
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
                  {formatNumberWithCommas(
                    providerInfo ? providerInfo?.charge_from : 0
                  )}
                  /hr
                </p>
              </div>

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
                                onClick={() => {
                                  if (
                                    selectedPaymentMethod.includes(method.name)
                                  ) {
                                    const newVal = selectedPaymentMethod.filter(
                                      (val) => val !== method.name
                                    );
                                    setSelectedPaymentMethod(newVal);
                                    field.onChange(newVal);
                                  } else {
                                    const newVal = [
                                      ...selectedPaymentMethod,
                                      method.name,
                                    ];
                                    setSelectedPaymentMethod(newVal);
                                    field.onChange(newVal);
                                  }
                                }}
                                className="flex items-center gap-x-2 px-3 py-2 rounded-full border border-divider cursor-pointer hover:bg-blue-400"
                              >
                                {selectedPaymentMethod.includes(method.name) ? (
                                  <Checkbox
                                    checked={selectedPaymentMethod.includes(
                                      method.name
                                    )}
                                  />
                                ) : (
                                  <method.icon className="stroke-brand-3 size-3.5" />
                                )}

                                <p
                                  className={cn(
                                    "text-sm",
                                    selectedPaymentMethod.includes(method.name)
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

              <div className="border-t border-divider"></div>

              <FormField
                control={form.control}
                name="agreeToCancellation"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-between items-center bg-input-field px-3 py-2 rounded-sm">
                        <p className="text-xs font-medium text-brand-1">
                          I agree to cancellation and refund policy
                        </p>

                        <Switch
                          checked={field.value}
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
                        {...field}
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
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate.back()}
              >
                Go Back
              </Button>
              <Button type="submit" disabled={isPending} className="w-29">
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
    </div>
  );
};
