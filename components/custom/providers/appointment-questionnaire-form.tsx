"use client";

import { Dispatch, SetStateAction, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { AnimatePresence, motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui";
import { RenderIf } from "@/components/shared";
import { Loader } from "@/components/shared/loader";
import {
  getFieldNameFromQuestion,
  convertToFormOptions,
  mapAnswersToData,
} from "@/lib/utils";
import { createAppointmentQuestionnaireSchema } from "@/lib/validations";
import { useMultipleRequestVariables } from "@/services/hooks/queries/use-profile";
import { useSubmitBookingQuestionnaire } from "@/services/hooks/mutations/use-booking";
import { useSubmitOrgBookingQuestionnaire } from "@/services/hooks/mutations/use-appointment";
import { ChildQuestion } from "@/types/appointment";
import { CheckboxGroup } from "./checkbox-group";
import { RadioButtonGroup } from "./radio-button-group";

interface IFillAppointmentQuestionnaireForm {
  setStep: Dispatch<SetStateAction<string | number>>;
}

export const FillAppointmentQuestionnaireForm = ({
  setStep,
}: IFillAppointmentQuestionnaireForm) => {
  const router = useRouter();

  const { data, isLoading } = useMultipleRequestVariables(["booking-question"]);
  const { mutate, isPending } = useSubmitBookingQuestionnaire(() =>
    router.push("/appointments")
  );
  const { mutate: submitOrgQuestionnaire, isPending: isSubmitting } =
    useSubmitOrgBookingQuestionnaire(() => {
      router.push("/");
    });

  const questions = data?.["booking-question"];
  const schema = useMemo(
    () => createAppointmentQuestionnaireSchema(questions),
    [questions]
  );

  const defaultValues = useMemo(() => {
    const values: Record<string, any> = {};

    if (Array.isArray(questions)) {
      questions.forEach((question) => {
        const fieldName = getFieldNameFromQuestion(question.question);

        if (question.has_child && question.child_question) {
          question.child_question.forEach((childQ: ChildQuestion) => {
            const childFieldName = getFieldNameFromQuestion(childQ.question);
            values[childFieldName] = "";
          });
        } else if (question.option_type === "checkbox") {
          values[fieldName] = [];
        } else {
          values[fieldName] = "";
        }
      });
    }

    return values;
  }, [questions]);

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues,
  });

  const searchParams = useSearchParams();

  async function onSubmit(values: z.infer<typeof schema>) {
    const bookingId = localStorage.getItem("booking-appointment-id");
    const booking_link = searchParams.get("booking_link") as string | undefined;
    console.log({ bookingId });
    const isLoggedIn = Cookies.get("authToken");

    if (!!isLoggedIn) {
      mutate({
        data: mapAnswersToData(questions, values),
        appointment_id: bookingId as string,
      });
    } else {
      submitOrgQuestionnaire({
        data: mapAnswersToData(questions, values),
        appointment_id: booking_link as string,
      });
    }
  }

  const buttonCopy = {
    idle: "Complete Booking",
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending || isSubmitting ? "loading" : "idle";
  }, [isPending, isSubmitting]);

  return (
    <div className="min-h-full pb-12">
      <RenderIf condition={!isLoading}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-y-8 content-start"
          >
            <div className="grid gap-y-1 text-brand-1 py-5 text-center">
              <h2 className="font-bold text-xl md:text-2xl">
                Appointment questionnaire
              </h2>
              {/* <p className="text-brand-2 text-sm">
                Fill in your details to book sessions and enjoy a seamless
                experience
              </p> */}
            </div>

            <div className="grid gap-y-5">
              {Array.isArray(questions) &&
                questions?.map((question, index) => {
                  const fieldName = getFieldNameFromQuestion(question.question);

                  if (
                    question.has_child &&
                    question.child_question &&
                    question.child_question.length > 0
                  ) {
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-2xl p-3 md:p-6 grid gap-y-5"
                      >
                        <h3 className="font-bold text-brand-1">
                          {question.question}
                        </h3>

                        {question.child_question.map(
                          (childQ: ChildQuestion, childIndex: number) => {
                            const childFieldName = getFieldNameFromQuestion(
                              childQ.question
                            );
                            const childOptions = convertToFormOptions(
                              childQ.option || [],
                              childFieldName
                            );

                            return (
                              <div key={childIndex} className="grid gap-y-2">
                                {childIndex > 0 && (
                                  <div className="border-t border-divider"></div>
                                )}

                                <RadioButtonGroup
                                  name={childFieldName}
                                  control={form.control}
                                  options={childOptions}
                                  question={childQ.question}
                                />
                              </div>
                            );
                          }
                        )}
                      </div>
                    );
                  } else if (
                    question.option_type === "checkbox" &&
                    question.option &&
                    question.option.length > 0
                  ) {
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-2xl p-3 md:p-6 grid gap-y-4"
                      >
                        <CheckboxGroup
                          name={fieldName}
                          control={form.control}
                          options={convertToFormOptions(
                            question.option,
                            fieldName
                          )}
                          question={question.question}
                        />
                      </div>
                    );
                  } else if (
                    question.option_type === "radio" &&
                    question.option &&
                    question.option.length > 0
                  ) {
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-2xl p-3 md:p-6 grid gap-y-4"
                      >
                        <RadioButtonGroup
                          name={fieldName}
                          control={form.control}
                          options={convertToFormOptions(
                            question.option,
                            fieldName
                          )}
                          question={question.question}
                        />
                      </div>
                    );
                  }

                  return null;
                })}
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

              <Button
                type="submit"
                disabled={isPending || isSubmitting}
                className="w-39"
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
      <RenderIf condition={isLoading}>
        <div className="h-[400px] w-full flex flex-col items-center justify-center">
          <Loader />
        </div>
      </RenderIf>
    </div>
  );
};
