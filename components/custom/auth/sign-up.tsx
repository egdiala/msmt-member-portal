"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import PasswordInput from "@/components/shared/password-input";
import { IconEmail, IconCaseSensitive } from "@/components/icons";

import { format } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import useMeasure from "react-use-measure";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FloatingInput } from "@/components/shared/floating-input";
import { Switch } from "@/components/ui/switch";
import { Loader } from "@/components/shared/loader";
import { DatePickerField } from "@/components/shared/date-picker-field";
import { signUpSchema } from "@/lib/validations";
import { useInitRegister } from "@/services/hooks/mutations/use-auth";

export default function SignUp() {
  const router = useRouter();
  const [ref, bounds] = useMeasure();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useInitRegister(() => {
    localStorage.setItem("email_to_verify", form.getValues("email"));
    queryClient.setQueryData(["sign-up-details"], form.getValues());
    router.push("/verify-email");
  });

  type SignUpFormValues = z.infer<typeof signUpSchema>;

  const signUpDetails: SignUpFormValues | undefined = queryClient.getQueryData([
    "sign-up-details",
  ]);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      first_name: signUpDetails?.first_name || "",
      last_name: signUpDetails?.last_name || "",
      email: signUpDetails?.email || "",
      dob: signUpDetails?.dob || undefined,
      password: signUpDetails?.password || "",
      terms: signUpDetails?.terms || false,
    },
  });

  function onSubmit({
    first_name,
    last_name,
    dob,
    password,
    email,
  }: z.infer<typeof signUpSchema>) {
    mutate({
      first_name,
      last_name,
      email,
      password,
      dob: format(dob, "yyyy-MM-dd"),
    });
  }

  const buttonCopy = {
    idle: "Sign Up",
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending ? "loading" : "idle";
  }, [isPending]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <motion.div animate={{ height: bounds.height }}>
          <div
            ref={ref}
            className="space-y-4 bg-white rounded-xl px-3 py-4 lg:p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <FloatingInput
                          label="First Name"
                          className="pr-8"
                          {...field}
                        />
                        <IconCaseSensitive className="absolute right-3 bottom-2 -translate-y-1/2 h-5 w-5 stroke-brand-3" />
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
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <FloatingInput
                          label="Last Name"
                          className="pr-8"
                          {...field}
                        />
                        <IconCaseSensitive className="absolute right-3 bottom-2 -translate-y-1/2 h-5 w-5 stroke-brand-3" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormControl>
                      <DatePickerField
                        value={field.value}
                        onChange={field.onChange}
                        label="Date of Birth"
                        isDOB
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
                          type="email"
                          className="pr-10"
                          {...field}
                        />
                        <IconEmail className="absolute right-3 bottom-2 -translate-y-1/2 h-5 w-5 stroke-brand-3" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      value={field.value}
                      onChange={field.onChange}
                      id={field.name}
                      name={field.name}
                      labelTitle="Password"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-sm border-grey-400 bg-input-field py-2 px-3 text-brand-1">
                    <div className="leading-none">
                      <label className="text-xs font-medium">
                        I accept the{" "}
                        <Link
                          href="https://themsmt.com/terms-of-service/"
                          target="_blank"
                          className="underline"
                        >
                          terms & conditions
                        </Link>{" "}
                        of this service
                      </label>
                    </div>
                    <FormControl>
                      <div className="flex items-center">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </motion.div>

        <motion.div layout className="flex justify-center space-x-6">
          <Button
            type="submit"
            disabled={isPending || !form.formState.isValid}
            className="rounded-full w-21"
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
  );
}
