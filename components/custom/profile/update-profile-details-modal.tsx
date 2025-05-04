"use client";

import type * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetDefinedVariables } from "@/hooks/use-get-variables";
import { IconPhone, IconUserRound } from "@/components/icons";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui";
import { editProfileDetailsSchema } from "@/lib/validations";
import { FloatingInput, SelectCmp, Modal } from "../../shared";
import { UpdateProfileType } from "@/types/profile";
import { useUpdateProfile } from "@/services/hooks/mutations/use-profile";
import { AnimatePresence, motion } from "motion/react";
import { Loader } from "@/components/shared/loader";
import { useMemo } from "react";

interface IUpdateProfileDetailsModal {
  handleClose: () => void;
  isOpen: boolean;
  data: Partial<UpdateProfileType>;
}
export const UpdateProfileDetailsModal = ({
  handleClose,
  isOpen,
  data,
}: IUpdateProfileDetailsModal) => {
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile(() =>
    handleClose()
  );

  const { requestVariables, variableList, countryList } =
    useGetDefinedVariables();

  const form = useForm<z.infer<typeof editProfileDetailsSchema>>({
    resolver: zodResolver(editProfileDetailsSchema),
    mode: "onChange",
    defaultValues: {
      preferredName: data?.nickname || "",
      phoneNumber: data?.phone_number || "",
      religion: data?.religion || "",
      gender: data?.gender || "",
      maritalStatus: data?.marital_status || "",
      country: data?.origin_country || "",
      preferredLanguage: data?.preferred_lan || "",
    },
  });

  async function onSubmit(values: z.infer<typeof editProfileDetailsSchema>) {
    await updateProfile({
      preferred_lan: values.preferredLanguage,
      nickname: values.preferredName,
      phone_number: values.phoneNumber,
      religion: values.religion,
      gender: values.gender?.toLowerCase(),
      marital_status: values.maritalStatus,
      origin_country: values.country,
    });
  }

  const buttonCopy = {
    idle: "Update",
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending ? "loading" : "idle";
  }, [isPending]);

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className="grid gap-y-6">
      <h2 className="font-bold text-lg md:text-2xl">Profile Details</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
          <div className="grid gap-y-4">
            <FormField
              control={form.control}
              name="preferredName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <FloatingInput
                        label="Preferred Name"
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
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <FloatingInput
                        label="Phone number"
                        className="pr-10"
                        {...field}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 stroke-brand-3">
                        <IconPhone className="h-4 w-4" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="religion"
              render={({ field }) => (
                <SelectCmp
                  selectItems={variableList(
                    requestVariables?.["religion-list"]
                  )}
                  onSelect={field.onChange}
                  placeholder={"Religion"}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <SelectCmp
                  selectItems={[
                    { value: "male", id: 1 },
                    { value: "female", id: 2 },
                  ]}
                  onSelect={field.onChange}
                  placeholder={"Gender"}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <SelectCmp
                  selectItems={variableList(
                    requestVariables?.["marital-status"]
                  )}
                  onSelect={field.onChange}
                  placeholder={"Marital Status"}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <SelectCmp
                  selectItems={[...countryList]}
                  placeholder={"Country"}
                  onSelect={field.onChange}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="preferredLanguage"
              render={({ field }) => (
                <SelectCmp
                  selectItems={[
                    ...variableList(requestVariables?.["preferred-lan"]),
                  ]}
                  onSelect={field.onChange}
                  placeholder={"Preferred Language"}
                  {...field}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-x-4 pt-10">
            <Button variant="secondary" onClick={handleClose} type="button">
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!form.formState.isValid || isPending}
              className="cursor-pointer w-21"
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
    </Modal>
  );
};
