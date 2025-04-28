"use client";

import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { RadioButton, RenderIf } from "@/components/shared";
import {
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  RadioGroup,
} from "@/components/ui";
import { Loader } from "@/components/shared/loader";
import { generateDefaultValues, generateValidationSchema } from "@/lib/utils";
import { useMultipleRequestVariables } from "@/services/hooks/queries/use-profile";
import { FetchedQuestionsForQuestionnaireType } from "@/types/booking";

interface IFillAppointmentQuestionnaireForm {
  setStep: Dispatch<SetStateAction<string | number>>;
}

export const FillAppointmentQuestionnaireForm = ({
  setStep,
}: IFillAppointmentQuestionnaireForm) => {
  const { data, isLoading } = useMultipleRequestVariables(["booking-question"]);

  const form = useForm({
    resolver: zodResolver(generateValidationSchema(data["booking-question"])),
    mode: "onChange",
    defaultValues: generateDefaultValues(data["booking-question"]),
  });

  async function onSubmit(values: any) {
    console.log(values);
  }

  console.log({ errors: form.formState?.errors });

  return (
    <div className="min-h-full pb-12">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-y-8 content-start"
        >
          <div className="grid gap-y-1 text-brand-1 py-5 text-center">
            <h2 className="font-bold text-xl md:text-2xl">
              Appointment questionnaire
            </h2>

            <p className="text-brand-2 text-sm">
              Fill in your details to book sessions and enjoy a seamless
              experience
            </p>
          </div>

          <div className="grid gap-y-5">
            <div className="bg-white rounded-2xl p-3 md:p-6 grid gap-y-4">
              <RenderIf condition={isLoading}>
                <div className="w-full h-screen flex justify-center items-center">
                  <Loader />
                </div>
              </RenderIf>

              <RenderIf condition={!isLoading}>
                {data["booking-question"]?.map(
                  (
                    bookingQuestion: FetchedQuestionsForQuestionnaireType,
                    index: number
                  ) => {
                    if (bookingQuestion?.option_type === "radio") {
                      return (
                        <div className="grid gap-y-4" key={index}>
                          <div className="grid gap-y-2">
                            <p className="font-medium text-xs md:text-sm text-brand-1">
                              {bookingQuestion?.question}
                            </p>

                            <FormField
                              control={form.control}
                              name={`questions[${index}].option`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <RadioGroup
                                      defaultValue={field.value}
                                      onValueChange={field.onChange}
                                      className="flex items-center flex-wrap"
                                    >
                                      {bookingQuestion?.option?.map(
                                        (option) => (
                                          <RadioButton
                                            key={option}
                                            isActive={field.value === option}
                                            option={{
                                              id: `questions[${index}]-${option}`,
                                              value: option,
                                              name: option,
                                            }}
                                            className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                                          />
                                        )
                                      )}
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <RenderIf
                            condition={
                              index < data["booking-question"]?.length - 1
                            }
                          >
                            <div className="border-t border-divider"></div>
                          </RenderIf>
                        </div>
                      );
                    } else if (bookingQuestion?.option_type === "checkbox") {
                      return (
                        <div className="grid gap-y-4" key={index}>
                          <div className="grid gap-y-2">
                            <div className="grid gap-y-0.5">
                              <h4 className="text-sm font-medium text-brand-1">
                                {bookingQuestion?.question}
                              </h4>

                              <p className="text-xs text-brand-2">
                                You can select multiple answers
                              </p>
                            </div>

                            <FormField
                              control={form.control}
                              name={`questions[${index}].option`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className="flex gap-4 flex-wrap">
                                      {bookingQuestion?.option?.map(
                                        (option, idx) => (
                                          <div
                                            key={idx}
                                            className="flex items-center gap-x-2 rounded-full border border-divider px-3 py-2 cursor-pointer"
                                            onClick={() => {
                                              // Ensure field.value is always an array
                                              const value = Array.isArray(
                                                field.value
                                              )
                                                ? field.value
                                                : [];

                                              // Update the value array for checkbox options
                                              const updatedValues =
                                                value.includes(option)
                                                  ? value.filter(
                                                      (val: any) =>
                                                        val !== option
                                                    )
                                                  : [...value, option];

                                              // Call the onChange function from react-hook-form to update the state
                                              field.onChange(updatedValues);
                                            }}
                                          >
                                            <Checkbox
                                              checked={field?.value?.includes(
                                                option
                                              )}
                                            />

                                            <p className="text-brand-2 text-sm">
                                              {option}
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

                          <RenderIf
                            condition={
                              index < data["booking-question"]?.length - 1
                            }
                          >
                            <div className="border-t border-divider"></div>
                          </RenderIf>
                        </div>
                      );
                    } else if (bookingQuestion?.has_child) {
                      return (
                        <div className="grid gap-y-4" key={index}>
                          <div className="grid gap-y-2">
                            <h3 className="text-sm font-medium text-brand-1">
                              {bookingQuestion?.question}
                            </h3>

                            <div className="grid gap-y-4">
                              {bookingQuestion?.child_question?.map(
                                (childQuestion, childIdx) => (
                                  <div className="grid gap-y-2" key={childIdx}>
                                    <p className="text-xs text-brand-2">
                                      {childQuestion?.question}
                                    </p>

                                    <FormField
                                      control={form.control}
                                      name={`questions.${index}.child_question.${childIdx}.option`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <RadioGroup
                                              defaultValue={field.value}
                                              onValueChange={field.onChange}
                                              className="flex items-center flex-wrap"
                                            >
                                              {childQuestion?.option?.map(
                                                (option) => (
                                                  <RadioButton
                                                    key={option}
                                                    isActive={
                                                      field.value === option
                                                    }
                                                    option={{
                                                      id: `questions[${index}].child_question[${childIdx}]-${option}`,
                                                      value: option,
                                                      name: option,
                                                    }}
                                                    className="rounded-full border border-divider px-3 md:px-3 py-2 md:py-2"
                                                  />
                                                )
                                              )}
                                            </RadioGroup>
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          <RenderIf
                            condition={
                              index < data["booking-question"]?.length - 1
                            }
                          >
                            <div className="border-t border-divider"></div>
                          </RenderIf>
                        </div>
                      );
                    }
                  }
                )}
              </RenderIf>
            </div>
          </div>

          <div className="grid grid-cols-2 md:flex md:items-center md:justify-end gap-x-5">
            <Button
              className="shadow-none"
              variant="secondary"
              onClick={() => setStep(1)}
              type="button"
            >
              Cancel
            </Button>

            <Button type="submit">Complete Booking</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
