"use client";

import { useMemo, useEffect } from "react";
import type * as z from "zod";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import useMeasure from "react-use-measure";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconEmail, IconUserRound } from "@/components/icons";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui";
import { Loader } from "@/components/shared/loader";
import { addMemberSchema } from "@/lib/validations";
import { useAddFamilyOrFriend } from "@/services/hooks/mutations/use-family-and-friends";
import { FloatingInput, Modal, SelectCmp } from "../../shared";
import { PhoneInputWithLabel } from "@/components/shared/phone-input";

interface IAddMemberModal {
  handleClose: () => void;
  isOpen: boolean;
}
export const AddMemberModal = ({ isOpen, handleClose }: IAddMemberModal) => {
  const onClose = () => {
    form.reset();
    handleClose();
  };
  const [ref, bounds] = useMeasure();
  const { mutate, isPending } = useAddFamilyOrFriend(onClose);

  const form = useForm<z.infer<typeof addMemberSchema>>({
    resolver: zodResolver(addMemberSchema),
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_prefix: "",
      phone_number: "",
      gender: "",
      email: "",
      relationship: "",
    },
  });

  useEffect(() => {
    form.register("phone_prefix");
  }, [form]);

  async function onSubmit({
    first_name,
    last_name,
    email,
    gender,
    phone_number,
    relationship,
  }: z.infer<typeof addMemberSchema>) {
    mutate({
      first_name,
      last_name,
      email,
      gender: gender.toLowerCase(),
      phone_number: `${phone_number}`,
      relationship: relationship.toLowerCase() === "family" ? "1" : "2",
    });
  }

  const buttonCopy = {
    idle: "Add Member",
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending ? "loading" : "idle";
  }, [isPending]);

  return (
    <Modal isOpen={isOpen} handleClose={onClose} className="gap-y-6">
      <h2 className="font-bold text-2xl text-brand-1">Add Member</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
          <motion.div animate={{ height: bounds.height }}>
            <div ref={ref} className="grid gap-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:content-start md:gap-6 w-full">
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
                        onSelect={(val) => form.setValue("gender", val)}
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
                        onSelect={(val) => form.setValue("relationship", val)}
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

            <Button type="submit" className="w-28">
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
