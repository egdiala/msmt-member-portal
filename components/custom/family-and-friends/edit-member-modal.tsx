"use client";

import { useEffect, useMemo } from "react";
import type * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useMeasure from "react-use-measure";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { IconEmail, IconUserRound } from "@/components/icons";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui";
import { PhoneInputWithLabel } from "@/components/shared/phone-input";
import { Loader } from "@/components/shared/loader";
import { addMemberSchema } from "@/lib/validations";
import { capitalizeFirstLetter } from "@/lib/hooks";
import { useUpdateFamilyOrFriend } from "@/services/hooks/mutations/use-family-and-friends";
import { FloatingInput, Modal, SelectCmp } from "../../shared";

interface IEditMemberModal {
  handleClose: () => void;
  isOpen: boolean;
  memberDetail: {
    first_name: string;
    last_name: string;
    email: string;
    relationship: string;
    phone_number: string;
    gender: string;
    familyfriend_id: string;
  };
}
export const EditMemberModal = ({
  isOpen,
  handleClose,
  memberDetail,
}: IEditMemberModal) => {
  const form = useForm<z.infer<typeof addMemberSchema>>({
    resolver: zodResolver(addMemberSchema),
    mode: "onChange",
    values: {
      first_name: memberDetail?.first_name,
      last_name: memberDetail?.last_name,
      email: memberDetail?.email,
      relationship: memberDetail?.relationship === "1" ? "Family" : "Friend",
      gender: capitalizeFirstLetter(memberDetail?.gender),
      phone_number: memberDetail?.phone_number,
    },
  });

  const onClose = () => {
    form.reset();
    handleClose();
  };

  useEffect(() => {
    form.register("phone_prefix");
  }, [form]);

  const [ref, bounds] = useMeasure();

  const { mutate, isPending } = useUpdateFamilyOrFriend(onClose);

  async function onSubmit(values: z.infer<typeof addMemberSchema>) {
    const relationship =
      values.relationship.toLowerCase() === "family" ? "1" : "2";
    const dataToBeSubmitted = {
      ...(values?.first_name !== memberDetail?.first_name
        ? { first_name: values?.first_name }
        : {}),
      ...(values?.last_name !== memberDetail?.last_name
        ? { last_name: values?.last_name }
        : {}),
      ...(relationship !== memberDetail?.relationship
        ? { relationship: relationship }
        : {}),
      ...(values?.phone_number !== memberDetail?.phone_number
        ? { phone_number: `${values?.phone_prefix}${values?.phone_number}` }
        : {}),
      ...(values?.gender?.toLowerCase() !== memberDetail?.gender
        ? { gender: values?.gender?.toLowerCase() }
        : {}),
    };

    if (Object.values(dataToBeSubmitted)?.length === 0) {
      toast.error("No changes have been made");
    } else {
      mutate({
        ...dataToBeSubmitted,
        familyfriend_id: memberDetail?.familyfriend_id,
      });
    }
  }

  const buttonCopy = {
    idle: "Update",
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending ? "loading" : "idle";
  }, [isPending]);

  return (
    <Modal
      isOpen={isOpen}
      handleClose={() => {
        onClose();
        form.formState.isDirty = false;
      }}
      className="gap-y-6"
    >
      <h2 className="font-bold text-2xl text-brand-1">Edit Member</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
          <motion.div animate={{ height: bounds.height }}>
            <div ref={ref} className="grid gap-y-4">
              <div className="flex items-center gap-4 md:gap-6 flex-col md:flex-row w-full">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="relative">
                          <FloatingInput
                            label="First Name"
                            className="pr-10"
                            {...field}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 stroke-brand-3">
                            <IconUserRound className="h-4 w-4" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="relative">
                          <FloatingInput
                            label="Last Name"
                            className="pr-10"
                            {...field}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 stroke-brand-3">
                            <IconUserRound className="h-4 w-4" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <FloatingInput
                          label="Email"
                          className="pr-10"
                          disabled={true}
                          {...field}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 stroke-brand-3">
                          <IconEmail className="h-4 w-4" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <PhoneInputWithLabel
                        value={field.value!}
                        onChange={(val) => field.onChange(val)}
                        onCountryChange={(value) =>
                          form.setValue("phone_prefix", value)
                        }
                        defaultCountry="NG"
                        phonePrefix={form.getValues("phone_prefix")}
                        placeholder="Phone Number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectCmp
                        onSelect={(val) => field.onChange(val)}
                        selectItems={[
                          { id: 1, value: "Male" },
                          { id: 2, value: "Female" },
                        ]}
                        placeholder={"Gender"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectCmp
                        onSelect={(val) => field.onChange(val)}
                        selectItems={[
                          { id: 1, value: "Family" },
                          { id: 2, value: "Friend" },
                        ]}
                        placeholder={"Relationship"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>

          <motion.div layout className="flex justify-end gap-x-4 pt-10">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>

            <Button
              type="submit"
              className="w-19"
              disabled={
                isPending || !form.formState.isValid || !form.formState.isDirty
              }
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
          </motion.div>
        </form>
      </Form>
    </Modal>
  );
};
