"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import {
  IconEmail,
  IconCaseSensitive,
  IconCalendar,
  IconEye,
  IconEyeOff,
} from "@/components/icons";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FloatingInput } from "@/components/shared/floating-input";
import { signUpSchema } from "@/lib/validations";
import { Switch } from "@/components/ui/switch";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  type SignUpFormValues = z.infer<typeof signUpSchema>;

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: undefined, 
      password: "",
      terms: false,
    },
  });

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    console.log(values);
  }

  return (
    <div className="max-w-2xl mx-auto px-2">
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-lg lg:text-2xl font-bold">Create an Account</h1>
          <p className="text-sm text-muted-foreground">
            Find expert support, schedule sessions, or grow your practice. Sign
            up in minutes.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 bg-white rounded-xl px-3 py-4 lg:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <FloatingInput
                            label="First Name"
                            className="pr-8"
                            {...field}
                          />
                          <IconCaseSensitive className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 stroke-brand-3" />
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
                            className="pr-8"
                            {...field}
                          />
                          <IconCaseSensitive className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 stroke-brand-3" />
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
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <div className="relative cursor-pointer">
                              <FloatingInput
                                label="Date of Birth"
                                readOnly
                                value={
                                  field.value ? format(field.value, "PPP") : ""
                                }
                                className="pr-8 cursor-pointer"
                                onClick={(e) => e.currentTarget.focus()}
                              />
                              <IconCalendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 stroke-brand-3 pointer-events-none" />
                            </div>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          side="bottom"
                          align="start"
                          className="w-auto p-0 z-50"
                          sideOffset={5}
                          alignOffset={0}
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const today = new Date();
                              const eighteenYearsAgo = new Date(
                                today.getFullYear() - 18,
                                today.getMonth(),
                                today.getDate()
                              );
                              return (
                                date > eighteenYearsAgo || date > new Date()
                              );
                            }}
                            initialFocus
                            className="border-none p-3"
                            captionLayout="buttons"
                            fromYear={1920}
                            toYear={new Date().getFullYear() - 18}
                            defaultMonth={new Date(2000, 0)}
                            showOutsideDays={false}
                          />
                        </PopoverContent>
                      </Popover>
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
                            className="pr-8"
                            {...field}
                          />
                          <IconEmail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 stroke-brand-3" />
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
                      <div className="relative">
                        <FloatingInput
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          className="pr-8"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <IconEyeOff className="h-5 w-5 stroke-brand-3" />
                          ) : (
                            <IconEye className="h-5 w-5 stroke-brand-3" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
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
                          I accept the terms & conditions of this service
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

            <div className="grid grid-cols-2 lg:flex justify-center space-x-6">
              <Button
                type="button"
                variant="secondary"
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-full">
                Sign up
              </Button>
            </div>
          </form>
        </Form>

        <div className="text-center text-sm font-semibold">
          <span className="text-brand-btn-secondary">
            Already have an account?{" "}
          </span>
          <Link
            href="/sign-in"
            className="text-brand-accent-2 underline transition-colors  hover:opacity-80"
          >
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
}
