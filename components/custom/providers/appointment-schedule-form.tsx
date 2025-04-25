"use client";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  addMonths,
  eachDayOfInterval,
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
import { Button } from "@/components/ui/button";
import { RenderIf, SelectCmp } from "@/components/shared";
import { Avatar, AvatarImage, Switch } from "@/components/ui";
import {
  IconAudioLines,
  IconCreditCard,
  IconUsers,
  IconVideo,
  IconWallet,
  IconArrowDown,
} from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ISetScheduleStep {
  isOrganisation?: boolean;
  setStep: Dispatch<SetStateAction<string | number>>;
}
export const SetScheduleStep = ({
  isOrganisation,
  setStep,
}: ISetScheduleStep) => {
  const navigate = useRouter();

  const paymentMethods = [
    { id: 1, name: "Family", icon: IconUsers },
    { id: 2, name: "Wallet", icon: IconWallet },
    { id: 3, name: "Card", icon: IconCreditCard },
  ];

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState([
    "Family",
  ]);

  const isLoggedIn = Cookies.get("authToken");

  const communicationPreferences = [
    { id: 1, name: "Video", icon: IconVideo },
    { id: 2, name: "Audio", icon: IconAudioLines },
  ];

  const [selectedCommunicationPreference, setSelectedCommunicationPreference] =
    useState("Video");

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
    }
  };

  return (
    <div className="min-h-full pb-12 grid gap-y-4">
      <span className="text-center font-bold text-xl md:text-2xl text-brand-1 py-5">
        Book an Appointment
      </span>

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
                  src="https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
              </Avatar>

              <div className="grid gap-y-0.5">
                <h3 className="font-semibold text-brand-1">
                  {isOrganisation ? "Leadway Health" : "Jide Kosoko"}
                </h3>
                <p className="text-brand-2 text-xs">
                  {isOrganisation ? "Clinic" : "Psychologist"}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate.push("/providers")}
              className="underline text-button-primary font-semibold underline-offset-3 decoration-1 text-sm cursor-pointer"
            >
              Change
            </button>
          </div>

          <RenderIf condition={!!isOrganisation}>
            <div className="border-t border-divider"></div>

            <div className="flex justify-between items-center">
              <div className="grid gap-y-0.5">
                <p className="font-semibold text-brand-1">Jide Kosoko</p>
                <p className="text-brand-2 text-xs">Psychologist</p>
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

      <div className="bg-white rounded-2xl p-3 md:p-4 grid gap-y-4">
        <div className="grid gap-y-2">
          <p className="font-semibold text-brand-2 text-sm md:text-base">
            Services
          </p>
          <SelectCmp selectItems={[]} placeholder="Select Service" />
        </div>

        <div className="bg-blue-400 rounded-lg flex items-center justify-between p-3 font-medium text-brand-1">
          <p className="text-sm">Charge</p>
          <p className="text-lg">$45/hr</p>
        </div>

        <div className="border-t border-divider"></div>

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
          <p className="font-medium text-sm text-brand-1">Payment Method</p>

          <div className="flex items-center gap-x-2">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => {
                  if (selectedPaymentMethod.includes(method.name)) {
                    setSelectedPaymentMethod(
                      selectedPaymentMethod.filter((val) => val !== method.name)
                    );
                  } else {
                    setSelectedPaymentMethod([
                      ...selectedPaymentMethod,
                      method.name,
                    ]);
                  }
                }}
                className="flex items-center gap-x-2 px-3 py-2 rounded-full border border-divider cursor-pointer hover:bg-blue-400"
              >
                {selectedPaymentMethod.includes(method.name) ? (
                  <Checkbox
                    checked={selectedPaymentMethod.includes(method.name)}
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
            ))}
          </div>
        </div>

        <div className="border-t border-divider"></div>

        <div className="flex justify-between items-center bg-input-field px-3 py-2 rounded-sm">
          <p className="text-xs font-medium text-brand-1">
            I agree to cancellation and refund policy
          </p>

          <Switch />
        </div>
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

        <div className="border-t border-divider"></div>

        <SelectCmp selectItems={[]} placeholder="Select time (WAT)" />

        <div className="border-t border-divider"></div>

        <div className="flex flex-col gap-2 md:flex-row  md:items-center justify-between">
          <p className="font-medium text-sm">Communication preference</p>

          <div className="flex items-center gap-x-2">
            {communicationPreferences.map((preference) => (
              <button
                onClick={() =>
                  setSelectedCommunicationPreference(preference.name)
                }
                key={preference.id}
                className={cn(
                  "flex items-center gap-x-2 px-3 py-1 border rounded-full cursor-pointer",
                  preference.name === selectedCommunicationPreference
                    ? "bg-blue-400 border-button-primary"
                    : "border-divider bg-white"
                )}
              >
                <preference.icon
                  className={cn(
                    "size-3.5",
                    preference.name === selectedCommunicationPreference
                      ? "stroke-button-primary"
                      : "stroke-brand-3"
                  )}
                />

                <p
                  className={cn(
                    "text-sm",
                    preference.name === selectedCommunicationPreference
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
      </div>

      <div className="grid grid-cols-2 md:flex md:items-center md:justify-end gap-x-5">
        <Button variant="secondary" onClick={() => navigate.back()}>
          Go Back
        </Button>
        <RenderIf condition={!!isLoggedIn}>
          <Button onClick={() => setStep("gateway")}>Proceed to Pay</Button>
        </RenderIf>

        <RenderIf condition={!isLoggedIn}>
          <Button onClick={() => setStep(2)}>Continue</Button>
        </RenderIf>
      </div>
    </div>
  );
};
