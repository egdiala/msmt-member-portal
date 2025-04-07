"use client";

import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { RadioButton } from "@/components/shared";
import { Checkbox, RadioGroup } from "@/components/ui";

interface IFillAppointmentQuestionnaireForm {
  setStep: Dispatch<SetStateAction<string | number>>;
}

export const FillAppointmentQuestionnaireForm = ({
  setStep,
}: IFillAppointmentQuestionnaireForm) => {
  const employmentStatuses = ["Employed", "Unemployed", "Retired", "Student"];
  const alcoholIntakeFrequencies = [
    "Infrequently",
    "Daily",
    "Weekly",
    "Monthly",
    "Never",
  ];
  const otherOptions = ["Good", "Fair", "Poor"];
  const yesOrNoOptions = ["Yes", "No"];
  const helpOptions = [
    "Traumatic experience (Past or Present)",
    "Stress at work or school",
    "Curiosity",
    "Feeling down or having emotional struggles",
    "Difficulty in relationships",
    "Worry about something",
    "Addiction or substance abuse",
    "Struggling with medical problems",
    "Trouble sleeping",
    "Other (Please specify)",
  ];

  return (
    <div className="min-h-full pb-12 grid gap-y-8 content-start">
      <div className="grid gap-y-1 text-brand-1 py-5 text-center">
        <h2 className="font-bold text-xl md:text-2xl">
          Appointment questionaire
        </h2>

        <p className="text-brand-2 text-sm">
          Fill in your details to book sessions and enjoy a seamless experience
        </p>
      </div>

      <div className="grid gap-y-5">
        <div className="bg-white rounded-2xl p-6 grid gap-y-4">
          <div className="flex justify-between items-center">
            <p className="font-medium text-sm text-brand-1">
              Are you in a safe place?
            </p>

            <RadioGroup className="flex items-center flex-wrap">
              {yesOrNoOptions.map((option) => (
                <RadioButton
                  key={option}
                  isActive={false}
                  option={{
                    id: option,
                    value: option,
                    name: option,
                  }}
                  className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                />
              ))}
            </RadioGroup>
          </div>

          <div className="border-t border-divider"></div>

          <div className="flex justify-between items-center">
            <p className="font-medium text-sm text-brand-1">
              Are you alone with someone?
            </p>

            <RadioGroup className="flex items-center flex-wrap">
              {yesOrNoOptions.map((option) => (
                <RadioButton
                  key={option}
                  isActive={false}
                  option={{
                    id: option,
                    value: option,
                    name: option,
                  }}
                  className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                />
              ))}
            </RadioGroup>
          </div>

          <div className="border-t border-divider"></div>

          <div className="flex justify-between items-center">
            <p className="font-medium text-sm text-brand-1">
              Are you experiencing any fear or worry?
            </p>

            <RadioGroup className="flex items-center flex-wrap">
              {yesOrNoOptions.map((option) => (
                <RadioButton
                  key={option}
                  isActive={false}
                  option={{
                    id: option,
                    value: option,
                    name: option,
                  }}
                  className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                />
              ))}
            </RadioGroup>
          </div>

          <div className="border-t border-divider"></div>

          <div className="flex justify-between items-center">
            <p className="font-medium text-sm text-brand-1">
              Have you ever been in counselling or therapy before?
            </p>

            <RadioGroup className="flex items-center flex-wrap">
              {yesOrNoOptions.map((option) => (
                <RadioButton
                  key={option}
                  isActive={false}
                  option={{
                    id: option,
                    value: option,
                    name: option,
                  }}
                  className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                />
              ))}
            </RadioGroup>
          </div>

          <div className="border-t border-divider"></div>

          <div className="flex justify-between items-center">
            <p className="font-medium text-sm text-brand-1 basis-3/5">
              Are you currently experiencing overwhelming sadness, grief, or
              having emotional struggles?
            </p>

            <RadioGroup className="flex items-center flex-wrap">
              {yesOrNoOptions.map((option) => (
                <RadioButton
                  key={option}
                  isActive={false}
                  option={{
                    id: option,
                    value: option,
                    name: option,
                  }}
                  className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                />
              ))}
            </RadioGroup>
          </div>

          <div className="border-t border-divider"></div>

          <div className="grid gap-y-2">
            <div className="grid gap-y-0.5">
              <h4 className="text-sm font-medium text-brand-1">
                What led you to seek help today?
              </h4>

              <p className="text-xs text-brand-2">
                You can select multiple answers
              </p>
            </div>

            <div className="flex gap-4 flex-wrap">
              {helpOptions.map((option) => (
                <div
                  key={option}
                  className="flex items-center gap-x-2 rounded-full border border-divider px-3 py-2"
                >
                  <Checkbox />
                  <p className="text-brand-2 text-sm">{option}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 grid gap-y-5">
          <h3 className="font-bold text-brand-1">
            How would you rate your current:
          </h3>

          <div className="grid gap-y-2">
            <p className="font-medium text-sm text-brand-1">Physical health</p>

            <RadioGroup className="flex items-center flex-wrap">
              {otherOptions.map((option) => (
                <RadioButton
                  key={option}
                  isActive={false}
                  option={{
                    id: option,
                    value: option,
                    name: option,
                  }}
                  className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                />
              ))}
            </RadioGroup>
          </div>

          <div className="border-t border-divider"></div>

          <div className="grid gap-y-2">
            <p className="font-medium text-sm text-brand-1">Eating habits</p>

            <RadioGroup className="flex items-center flex-wrap">
              {otherOptions.map((option) => (
                <RadioButton
                  key={option}
                  isActive={false}
                  option={{
                    id: option,
                    value: option,
                    name: option,
                  }}
                  className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                />
              ))}
            </RadioGroup>
          </div>

          <div className="border-t border-divider"></div>

          <div className="grid gap-y-2">
            <p className="font-medium text-sm text-brand-1">Sleeping habits</p>

            <RadioGroup className="flex items-center flex-wrap">
              {otherOptions.map((option) => (
                <RadioButton
                  key={option}
                  isActive={false}
                  option={{
                    id: option,
                    value: option,
                    name: option,
                  }}
                  className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                />
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 grid gap-y-5">
          <div className="grid gap-y-2">
            <p className="font-medium text-sm text-brand-1">
              Employment status
            </p>

            <RadioGroup className="flex items-center flex-wrap">
              {employmentStatuses.map((employmentStatus) => (
                <RadioButton
                  key={employmentStatus}
                  isActive={false}
                  option={{
                    id: employmentStatus,
                    value: employmentStatus,
                    name: employmentStatus,
                  }}
                  className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                />
              ))}
            </RadioGroup>
          </div>

          <div className="border-t border-divider"></div>

          <div className="grid gap-y-2">
            <p className="font-medium text-sm text-brand-1">
              How often do you drink alcohol?
            </p>

            <RadioGroup className="flex items-center flex-wrap">
              {alcoholIntakeFrequencies.map((frequency) => (
                <RadioButton
                  key={frequency}
                  isActive={false}
                  option={{
                    id: frequency,
                    value: frequency,
                    name: frequency,
                  }}
                  className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                />
              ))}
            </RadioGroup>
          </div>

          <div className="border-t border-divider"></div>

          <div className="grid gap-y-2">
            <p className="font-medium text-sm text-brand-1">Eating habits</p>

            <RadioGroup className="flex items-center flex-wrap">
              {otherOptions.map((option) => (
                <RadioButton
                  key={option}
                  isActive={false}
                  option={{
                    id: option,
                    value: option,
                    name: option,
                  }}
                  className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                />
              ))}
            </RadioGroup>
          </div>

          <div className="border-t border-divider"></div>

          <div className="grid gap-y-2">
            <p className="font-medium text-sm text-brand-1">Sleeping habits</p>

            <RadioGroup className="flex items-center flex-wrap">
              {otherOptions.map((option) => (
                <RadioButton
                  key={option}
                  isActive={false}
                  option={{
                    id: option,
                    value: option,
                    name: option,
                  }}
                  className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                />
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:flex md:items-center md:justify-end gap-x-5">
        <Button variant="secondary" onClick={() => setStep(1)}>
          Go Back
        </Button>

        <Button onClick={() => setStep("gateway")}>Complete Booking</Button>
      </div>
    </div>
  );
};
