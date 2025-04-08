"use client";

import { Dispatch, SetStateAction } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { RadioButton } from "@/components/shared";
import {
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  RadioGroup,
} from "@/components/ui";
import { appointmentQuestionnaireSchema } from "@/lib/validations";

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

  const form = useForm<z.infer<typeof appointmentQuestionnaireSchema>>({
    resolver: zodResolver(appointmentQuestionnaireSchema),
    mode: "onChange",
    defaultValues: {
      safePlace: "",
      aloneWithSomeone: "",
      experiencingFear: "",
      everBeenInCounselling: "",
      experiencingSadness: "",
      reasonForSeekingHelp: [],
      currentPhysicalHealthRate: "",
      currentEatingHabits: "",
      currentSleepingHabits: "",
      employmentStatus: "",
      alcoholIntakeFrequency: "",
      eatingHabits: "",
      sleepingHabits: "",
    },
  });

  async function onSubmit(
    values: z.infer<typeof appointmentQuestionnaireSchema>
  ) {
    console.log(values);
  }

  const handleChangeSeekHelpArray = ({
    val,
    arrayVals,
  }: {
    val: string;
    arrayVals: string[];
  }) => {
    if (arrayVals.includes(val)) {
      form.setValue(
        "reasonForSeekingHelp",
        arrayVals.filter((innerVal) => innerVal !== val)
      );
    } else {
      form.setValue("reasonForSeekingHelp", [...arrayVals, val]);
    }
  };

  return (
    <div className="min-h-full pb-12">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-y-8 content-start"
        >
          <div className="grid gap-y-1 text-brand-1 py-5 text-center">
            <h2 className="font-bold text-xl md:text-2xl">
              Appointment questionaire
            </h2>

            <p className="text-brand-2 text-sm">
              Fill in your details to book sessions and enjoy a seamless
              experience
            </p>
          </div>

          <div className="grid gap-y-5">
            <div className="bg-white rounded-2xl p-6 grid gap-y-4">
              <div className="flex justify-between items-center">
                <p className="font-medium text-sm text-brand-1">
                  Are you in a safe place?
                </p>

                <FormField
                  control={form.control}
                  name="safePlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          className="flex items-center flex-wrap"
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          {yesOrNoOptions.map((option) => (
                            <RadioButton
                              key={option}
                              isActive={field.value === option}
                              option={{
                                id: `safePlace-${option}`,
                                value: option,
                                name: option,
                              }}
                              className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t border-divider"></div>

              <div className="flex justify-between items-center">
                <p className="font-medium text-sm text-brand-1">
                  Are you alone with someone?
                </p>

                <FormField
                  control={form.control}
                  name="aloneWithSomeone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          className="flex items-center flex-wrap"
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          {yesOrNoOptions.map((option) => (
                            <RadioButton
                              key={option}
                              isActive={field.value === option}
                              option={{
                                id: `aloneWithSomeone-${option}`,
                                value: option,
                                name: option,
                              }}
                              className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t border-divider"></div>

              <div className="flex justify-between items-center">
                <p className="font-medium text-sm text-brand-1">
                  Are you experiencing any fear or worry?
                </p>

                <FormField
                  control={form.control}
                  name="experiencingFear"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="flex items-center flex-wrap"
                        >
                          {yesOrNoOptions.map((option) => (
                            <RadioButton
                              key={option}
                              isActive={field.value === option}
                              option={{
                                id: `experiencingFear-${option}`,
                                value: option,
                                name: option,
                              }}
                              className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t border-divider"></div>

              <div className="flex justify-between items-center">
                <p className="font-medium text-sm text-brand-1">
                  Have you ever been in counselling or therapy before?
                </p>

                <FormField
                  control={form.control}
                  name="everBeenInCounselling"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="flex items-center flex-wrap"
                        >
                          {yesOrNoOptions.map((option) => (
                            <RadioButton
                              key={option}
                              isActive={field.value === option}
                              option={{
                                id: `everBeenInCounselling-${option}`,
                                value: option,
                                name: option,
                              }}
                              className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t border-divider"></div>

              <div className="flex justify-between items-center">
                <p className="font-medium text-sm text-brand-1 basis-3/5">
                  Are you currently experiencing overwhelming sadness, grief, or
                  having emotional struggles?
                </p>

                <FormField
                  control={form.control}
                  name="experiencingSadness"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="flex items-center flex-wrap"
                        >
                          {yesOrNoOptions.map((option) => (
                            <RadioButton
                              key={option}
                              isActive={field.value === option}
                              option={{
                                id: `experiencingSadness-${option}`,
                                value: option,
                                name: option,
                              }}
                              className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

                <FormField
                  control={form.control}
                  name="reasonForSeekingHelp"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex gap-4 flex-wrap">
                          {helpOptions.map((option) => (
                            <div
                              key={option}
                              className="flex items-center gap-x-2 rounded-full border border-divider px-3 py-2"
                            >
                              <Checkbox
                                onCheckedChange={() =>
                                  handleChangeSeekHelpArray({
                                    val: option,
                                    arrayVals: field.value,
                                  })
                                }
                                checked={field.value.includes(option)}
                              />
                              <p className="text-brand-2 text-sm">{option}</p>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 grid gap-y-5">
              <h3 className="font-bold text-brand-1">
                How would you rate your current:
              </h3>

              <div className="grid gap-y-2">
                <p className="font-medium text-sm text-brand-1">
                  Physical health
                </p>

                <FormField
                  control={form.control}
                  name="currentPhysicalHealthRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="flex items-center flex-wrap"
                        >
                          {otherOptions.map((option) => (
                            <RadioButton
                              key={option}
                              isActive={field.value === option}
                              option={{
                                id: `currentPhysicalHealthRate-${option}`,
                                value: option,
                                name: option,
                              }}
                              className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t border-divider"></div>

              <div className="grid gap-y-2">
                <p className="font-medium text-sm text-brand-1">
                  Eating habits
                </p>

                <FormField
                  control={form.control}
                  name="currentEatingHabits"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="flex items-center flex-wrap"
                        >
                          {otherOptions.map((option) => (
                            <RadioButton
                              key={option}
                              isActive={field.value === option}
                              option={{
                                id: `currentEatingHabits-${option}`,
                                value: option,
                                name: option,
                              }}
                              className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t border-divider"></div>

              <div className="grid gap-y-2">
                <p className="font-medium text-sm text-brand-1">
                  Sleeping habits
                </p>

                <FormField
                  control={form.control}
                  name="currentSleepingHabits"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="flex items-center flex-wrap"
                        >
                          {otherOptions.map((option) => (
                            <RadioButton
                              key={option}
                              isActive={field.value === option}
                              option={{
                                id: `currentSleepingHabits-${option}`,
                                value: option,
                                name: option,
                              }}
                              className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 grid gap-y-5">
              <div className="grid gap-y-2">
                <p className="font-medium text-sm text-brand-1">
                  Employment status
                </p>

                <FormField
                  control={form.control}
                  name="employmentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="flex items-center flex-wrap"
                        >
                          {employmentStatuses.map((option) => (
                            <RadioButton
                              key={option}
                              isActive={field.value === option}
                              option={{
                                id: `employmentStatus-${option}`,
                                value: option,
                                name: option,
                              }}
                              className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t border-divider"></div>

              <div className="grid gap-y-2">
                <p className="font-medium text-sm text-brand-1">
                  How often do you drink alcohol?
                </p>

                <FormField
                  control={form.control}
                  name="alcoholIntakeFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="flex items-center flex-wrap"
                        >
                          {alcoholIntakeFrequencies.map((option) => (
                            <RadioButton
                              key={option}
                              isActive={field.value === option}
                              option={{
                                id: `alcoholIntakeFrequency-${option}`,
                                value: option,
                                name: option,
                              }}
                              className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t border-divider"></div>

              <div className="grid gap-y-2">
                <p className="font-medium text-sm text-brand-1">
                  Eating habits
                </p>

                <FormField
                  control={form.control}
                  name="eatingHabits"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="flex items-center flex-wrap"
                        >
                          {otherOptions.map((option) => (
                            <RadioButton
                              key={option}
                              isActive={field.value === option}
                              option={{
                                id: `eatingHabits-${option}`,
                                value: option,
                                name: option,
                              }}
                              className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t border-divider"></div>

              <div className="grid gap-y-2">
                <p className="font-medium text-sm text-brand-1">
                  Sleeping habits
                </p>

                <FormField
                  control={form.control}
                  name="sleepingHabits"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="flex items-center flex-wrap"
                        >
                          {otherOptions.map((option) => (
                            <RadioButton
                              key={option}
                              isActive={field.value === option}
                              option={{
                                id: `sleepingHabits-${option}`,
                                value: option,
                                name: option,
                              }}
                              className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:flex md:items-center md:justify-end gap-x-5">
            <Button variant="secondary" onClick={() => setStep(1)}>
              Go Back
            </Button>

            <Button onClick={() => setStep("gateway")}>Complete Booking</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
