"use client";

import type * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui";
import { IconEmail, IconUserRound } from "@/components/icons";
import { contactPersonDetailsSchema } from "@/lib/validations";
import { FloatingInput, Modal } from "../../shared";
import { UpdateProfileType } from "@/types/profile";
import { useUpdateProfile } from "@/services/hooks/mutations/use-profile";
import { capitalizeFirstLetter } from "@/lib/hooks";
import { PhoneInputWithLabel } from "@/components/shared/phone-input";

interface IUpdateContactPersonDetailsModal {
  handleClose: () => void;
  isOpen: boolean;
  data: Partial<UpdateProfileType>;
}
export const UpdateContactPersonDetailsModal = ({
  handleClose,
  isOpen,
  data,
}: IUpdateContactPersonDetailsModal) => {
  const { mutate: updateProfile, isPending } = useUpdateProfile(() =>
    handleClose()
  );
  const form = useForm<z.infer<typeof contactPersonDetailsSchema>>({
    resolver: zodResolver(contactPersonDetailsSchema),
    defaultValues: {
      firstName: data?.contact_person?.name?.split(" ")[0] || "",
      phone_prefix: data?.contact_person?.phone_prefix || "",
      lastName: data?.contact_person?.name?.split(" ")[1] || " ",
      phoneNumber: data?.contact_person?.phone_number || "",
      email: data?.contact_person?.email || "",
      relationship: data?.contact_person?.relationship || "",
    },
  });

  async function onSubmit(values: z.infer<typeof contactPersonDetailsSchema>) {
    await updateProfile({
      contact_person: {
        name: `${capitalizeFirstLetter(
          values.firstName
        )} ${capitalizeFirstLetter(values.lastName)}`,
        phone_number: values.phoneNumber,
        email: values.email,
        phone_prefix: values.phone_prefix,
        relationship: values.relationship,
      },
    });
  }

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className="grid gap-y-6">
      <h2 className="font-bold text-lg md:text-2xl">
        Update Contact Person Details
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
          <div className="grid gap-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <FloatingInput
                        label="First Name"
                        className="pr-10"
                        {...field}
                      />
                      <div className="absolute right-3 bottom-2 -translate-y-1/2 stroke-brand-3">
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <FloatingInput
                        label="Last Name"
                        className="pr-10"
                        {...field}
                      />
                      <div className="absolute right-3 bottom-2 -translate-y-1/2 stroke-brand-3">
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
                    <PhoneInputWithLabel
                      value={field.value!}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      onCountryChange={(value) => {
                        form.setValue("phone_prefix", value);
                      }}
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
                      <div className="absolute right-3 bottom-2 -translate-y-1/2 stroke-brand-3">
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
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput
                      label="Relationship"
                      className="pr-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-x-4 pt-10">
            <Button variant="secondary" type="button" onClick={handleClose}>
              Cancel
            </Button>

            <Button type="submit">{isPending ? "Submitting" : "Update"}</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
