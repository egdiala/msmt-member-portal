"use client";

import type * as z from "zod";
import { useRouter } from "next/navigation";
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
import { DASHBOARD } from "@/lib/routes";
import { profileDetailsSchema } from "@/lib/validations";

const CompleteProfile = () => {
  const router = useRouter();

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
                  <SelectCmp
                    selectItems={[]}
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
              <Button
                variant="secondary"
                onClick={() => router.push(DASHBOARD)}
                type="button"
              >
                Cancel
              </Button>

              <Button>Complete Profile</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CompleteProfile;
