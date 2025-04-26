"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  addMonths,
  eachDayOfInterval,
  eachMinuteOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
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
import { cn } from "@/lib/utils";
import { setAppointmentSchedule } from "@/lib/validations";
import {
  useGetProviderSchedule,
  useGetServiceProviders,
} from "@/services/hooks/queries/use-providers";
import { useMultipleRequestVariables } from "@/services/hooks/queries/use-profile";
import { useBookSelfAppointment } from "@/services/hooks/mutations/use-booking";
import { FetchSingleProvider } from "@/types/providers";

interface ISetScheduleStep {
  isOrganisation?: boolean;
  setStep: Dispatch<SetStateAction<string | number>>;
}
export const SetScheduleStep = ({
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

  const { data: providerSchedule } = useGetProviderSchedule({
    provider_id: provider_id,
    time_zone: new Date().getTimezoneOffset()?.toString(),
  });

  const today = new Date();
  const yesterday = subDays(today, 1);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState(today);

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });
  const startDay = getDay(start);

  const handlePrev = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNext = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateClick = (date: any) => {
    if (!isBefore(startOfDay(date), yesterday)) {
      setSelectedDate(date);
      form.setValue("appointmentDate", date);
    }
  };

  const timesOfDay = eachMinuteOfInterval(
    {
      start: new Date(2023, 0, 1, 0, 0),
      end: new Date(2023, 0, 1, 23, 59),
    },
    { step: 30 }
  ).map((time, index) => {
    return {
      id: index,
      value: format(time, "hh:mm a"),
    };
  });

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

  const { mutate } = useBookSelfAppointment(() => setStep("gateway"));

  async function onSubmit(values: z.infer<typeof setAppointmentSchedule>) {
    console.log(values);
    mutate({
      provider_id: provider_id,
      service_offer_id: requestVariables["service-offering"]?.filter(
        (val: { name: string }) => val.name === values.service
      )[0]?.service_offer_id,
      appt_date: format(values.appointmentDate, "yyy-MM-dd"),
      appt_time: values.appointmentTime,
      comm_mode: values.communicationPreference?.toLowerCase() as
        | "video"
        | "audio",
      time_zone: new Date().getTimezoneOffset()?.toString(),
    });
  }

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
                          onSelect={(val) => form.setValue("service", val)}
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
                                    form.setValue("paymentMethod", newVal);
                                  } else {
                                    const newVal = [
                                      ...selectedPaymentMethod,
                                      method.name,
                                    ];
                                    setSelectedPaymentMethod(newVal);
                                    form.setValue("paymentMethod", newVal);
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
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="grid gap-y-4.5">
                        <div className="flex items-center justify-between">
                          <Button
                            className="py-4.5 px-3 "
                            variant="secondary"
                            onClick={handlePrev}
                          >
                            <IconArrowDown className="stroke-button-primary rotate-90 stroke-3" />
                          </Button>

                          <h2 className="text-lg font-semibold">
                            {format(currentMonth, "MMMM yyyy")}
                          </h2>

                          <Button
                            className="py-4.5 px-3 "
                            variant="secondary"
                            onClick={handleNext}
                          >
                            <IconArrowDown className="stroke-button-primary rotate-270 stroke-3" />
                          </Button>
                        </div>

                        <div className="grid gap-2 grid-cols-4 md:grid-cols-7">
                          {Array.from({ length: startDay }).map((_, i) => (
                            <div key={`empty-${i}`}></div>
                          ))}

                          {days.map((date, i) => (
                            <button
                              key={i}
                              className={cn(
                                "flex flex-col items-center justify-center text-xs py-2.5 rounded-lg cursor-pointer disabled:cursor-not-allowed",
                                isSameDay(date, selectedDate)
                                  ? "font-bold bg-button-primary"
                                  : "bg-input-field"
                              )}
                              disabled={isBefore(startOfDay(date), yesterday)}
                              onClick={() => {
                                handleDateClick(date);
                              }}
                            >
                              <p
                                className={
                                  isSameDay(date, selectedDate)
                                    ? "text-white"
                                    : "text-brand-2"
                                }
                              >
                                {format(date, "EEE")}
                              </p>

                              <p
                                className={
                                  isSameDay(date, selectedDate)
                                    ? "text-white"
                                    : "text-brand-1"
                                }
                              >
                                {format(date, "d")}
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

              <div className="border-t border-divider"></div>

              <FormField
                control={form.control}
                name="appointmentTime"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectCmp
                        selectItems={timesOfDay}
                        placeholder="Select time (WAT)"
                        onSelect={(val) =>
                          form.setValue("appointmentTime", val)
                        }
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
                                form.setValue(
                                  "communicationPreference",
                                  preference.name
                                );
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
              <Button type="submit">Proceed to Pay</Button>
            </div>
          </form>
        </Form>
      </RenderIf>
    </div>
  );
};
