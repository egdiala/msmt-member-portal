"use client";
import type * as z from "zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCamera, IconPhone, IconUserRound } from "@/components/icons";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui";
import { FloatingInput, SelectCmp } from "@/components/shared";
import { profileDetailsSchema } from "@/lib/validations";
import Link from "next/link";
import { useGetProfile } from "@/services/hooks/queries/use-profile";
import { useGetDefinedVariables } from "@/hooks/use-get-variables";
import { useUpdateProfile } from "@/services/hooks/mutations/use-profile";

const CompleteProfile = () => {
  const { data } = useGetProfile();
  const { requestVariables, variableList, countryList } =
    useGetDefinedVariables();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const form = useForm<z.infer<typeof profileDetailsSchema>>({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: {
      preferredName: "",
      phoneNumber: data?.phone_number || "",
      religion: data?.religion || "",
      gender: data?.gender || "",
      maritalStatus: data?.marital_status || "",
      country: data?.origin_country || "",
      preferredLanguage: data?.preferred_lan || "",
    },
  });
  const { reset } = form;

  useMemo(() => {
    if (data) {
      reset({
        preferredName: "",
        phoneNumber: data?.phone_number || "",
        religion: data?.religion || "",
        gender: data?.gender || "",
        maritalStatus: data?.marital_status || "",
        country: data?.origin_country || "",
        preferredLanguage: data?.preferred_lan || "",
      });
    }
  }, [data, requestVariables, reset]);

  async function onSubmit(values: z.infer<typeof profileDetailsSchema>) {
    await updateProfile({
      preferred_lan: values.preferredLanguage,
      phone_number: values.phoneNumber,
      religion: values.religion,
      gender: values.gender.toLowerCase(),
      marital_status: values.maritalStatus,
      origin_country: values.country,
    });
    console.log(values);
  }

  return (
    <div className="flex items-center justify-center flex-col gap-y-8">
      <div className="text-center grid gap-y-1">
        <h2 className="text-2xl font-bold text-text-1">Complete Profile</h2>
        <p className="text-text-2 text-sm">
          Fill in your details to book sessions and enjoy a seamless experience
        </p>
      </div>

      <div className="grid gap-y-5 w-full md:justify-center">
        <div className="flex items-center justify-center flex-col">
          <div className="border border-text-tertiary rounded-full size-25 bg-white"></div>

          <Button
            variant="ghost"
            className="p-0 gap-x-1 underline text-button-primary font-medium cursor-pointer"
          >
            <IconCamera className="stroke-text-tertiary size-4" />
            Upload Profile Picture
          </Button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full grid gap-y-8"
          >
            <div className="bg-white rounded-2xl p-3 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4 w-full md:w-162">
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
                    placeholder={"Religion"}
                    field={field}
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
                    placeholder={"Gender"}
                    field={field}
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
                    placeholder={"Marital Status"}
                    field={field}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <SelectCmp
                    selectItems={countryList}
                    placeholder={"Country"}
                    field={field}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="preferredLanguage"
                render={({ field }) => (
                  <SelectCmp
                    selectItems={variableList(
                      requestVariables?.["preferred-lan"]
                    )}
                    placeholder={"Preferred Language"}
                    field={field}
                  />
                )}
              />
            </div>

            <div className="flex justify-center gap-8 flex-col-reverse md:flex-row w-full">
              <Button asChild variant="secondary">
                <Link href="/home">Cancel</Link>
              </Button>

              <Button type="submit">
                {isPending ? "Submitting" : "Complete Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CompleteProfile;
