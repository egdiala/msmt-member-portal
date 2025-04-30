"use client";

import { Dispatch, SetStateAction, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CheckboxGroup } from "./checkbox-group";
import { RadioButtonGroup } from "./radio-button-group";
import { Form } from "@/components/ui";
import { useMultipleRequestVariables } from "@/services/hooks/queries/use-profile";
import {
  createAppointmentQuestionnaireSchema,
} from "@/lib/validations";
import { getFieldNameFromQuestion, convertToFormOptions } from "@/lib/utils";
import { ChildQuestion} from "@/types/appointment";

interface IFillAppointmentQuestionnaireForm {
  setStep: Dispatch<SetStateAction<string | number>>;
}

// booking-question
export const FillAppointmentQuestionnaireForm = ({
  setStep,
}: IFillAppointmentQuestionnaireForm) => {
  const { data } = useMultipleRequestVariables(["booking-question"]);
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

  console.log(defaultValues, "DEFAULTVALUES")

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues,
  });

  async function onSubmit(
    values: z.infer<typeof schema>
  ) {
    console.log(values);
  }

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

                      {question.child_question.map((childQ:ChildQuestion, childIndex:number) => {
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
                      })}
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

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Complete Booking
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
