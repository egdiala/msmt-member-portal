"use client";

import Link from "next/link";
import type * as z from "zod";
import { IconCamera, IconPhone, IconUserRound } from "@/components/icons";
import { FloatingInput, SelectCmp } from "@/components/shared";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui";
import { profileDetailsSchema } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const CompleteProfileForm = () => {
  const form = useForm<z.infer<typeof profileDetailsSchema>>({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: {
      preferredName: "",
      phoneNumber: "",
      religion: "",
      gender: "",
      maritalStatus: "",
      country: "",
      preferredLanguage: "",
    },
  });

  async function onSubmit(values: z.infer<typeof profileDetailsSchema>) {
    console.log(values);
  }
  return (
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
                  selectItems={[]}
                  placeholder={"Religion"}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <SelectCmp selectItems={[]} placeholder={"Gender"} {...field} />
              )}
            />

            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <SelectCmp
                  selectItems={[]}
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
                  selectItems={[]}
                  placeholder={"Country"}
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="preferredLanguage"
              render={({ field }) => (
                <SelectCmp
                  selectItems={[]}
                  placeholder={"Preferred Language"}
                  {...field}
                />
              )}
            />
          </div>

          <div className="flex justify-center gap-8 flex-col-reverse md:flex-row w-full">
            <Button asChild variant="secondary">
              <Link href="/home">Cancel</Link>
            </Button>

            <Button>Complete Profile</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
