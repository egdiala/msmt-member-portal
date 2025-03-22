"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";

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
import { signUpSchema } from "@/lib/validations";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconEye,
  IconEyeOff,
  IconEmail,
  IconCaseSensitive,
  IconHouseAddress,
} from "@/components/icons";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      organizationType: "provider",
      providerType: "",
      organizationName: "",
      industryType: "",
      officeAddress: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const organizationType = form.watch("organizationType");

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    console.log(values);
    // In a real app, you would handle registration here
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 lg:space-y-8"
          >
            {/* Organization Type Section */}
            <div className="space-y-5 bg-white rounded-2xl px-3 py-4 lg:p-6">
              <div className="space-y-1">
                <h4 className="text-brand-1 font-semibold text-sm lg:text-base">
                  {" "}
                  Organisation Type
                </h4>
                <p className="text-xs  lg:text-sm font-normal text-brand-2">
                  Select what your organisation intend to do on MBHT
                </p>
              </div>

              <FormField
                control={form.control}
                name="organizationType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4"
                      >
                        <label
                          htmlFor="client"
                          className={`flex-1 border cursor-pointer transition-colors duration-200 rounded-sm p-4 ${
                            field.value === "client"
                              ? "border-brand-accent-2 bg-blue-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-2">
                              <p className="font-medium text-sm text-brand-1">
                                We are a Client
                              </p>
                              <p className="text-xs text-brand-2">
                                My organisation would like to onboard its
                                employees to consult professionals on this
                                platform.
                              </p>
                            </div>
                            <div
                              className={`flex items-center justify-center   w-4 h-4 min-w-4 min-h-4  rounded-xs ${
                                field.value === "client"
                                  ? "bg-brand-accent-2"
                                  : "border border-brand-3"
                              }`}
                            >
                              {field.value === "client" && (
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                            <RadioGroupItem
                              value="client"
                              id="client"
                              className="sr-only"
                            />
                          </div>
                        </label>

                        <label
                          htmlFor="provider"
                          className={`flex-1 border transition-colors duration-200 cursor-pointer rounded-sm p-4 ${
                            field.value === "provider"
                              ? "border-brand-accent-2 bg-blue-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-2">
                              <p className="font-medium text-sm text-brand-1">
                                We are a Service provider
                              </p>
                              <p className="text-xs text-brand-2">
                                We are a health service provider and would like
                                to offer health services to clients on this
                                platform.
                              </p>
                            </div>
                            <div
                              className={`flex items-center justify-center w-4 h-4 min-w-4 min-h-4  rounded-xs   ${
                                field.value === "provider"
                                  ? "bg-brand-accent-2"
                                  : "border border-brand-3"
                              }`}
                            >
                              {field.value === "provider" && (
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                            <RadioGroupItem
                              value="provider"
                              id="provider"
                              className="sr-only"
                            />
                          </div>
                        </label>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {organizationType === "provider" && (
                <FormField
                  control={form.control}
                  name="providerType"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Provider Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hospital">Hospital</SelectItem>
                          <SelectItem value="clinic">Clinic</SelectItem>
                          <SelectItem value="individual">
                            Individual Practitioner
                          </SelectItem>
                          <SelectItem value="pharmacy">Pharmacy</SelectItem>
                          <SelectItem value="laboratory">Laboratory</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Basic Details Section */}
            <div className="space-y-5 bg-white rounded-2xl px-3 py-4 lg:p-6">
              <div className="space-y-1">
                <h4 className="text-brand-1 font-semibold text-sm lg:text-base">
                  {" "}
                  Basic Details
                </h4>
                <p className="text-xs lg:text-sm font-normal text-brand-2">
                  Tell us a little about yourself so we can tailor your
                  experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <FloatingInput
                            label="Organization name"
                            className="pr-10"
                            {...field}
                          />
                          <div className="absolute right-3 top-7 -translate-y-1/2 stroke-brand-3 pointer-events-none">
                            <IconCaseSensitive className="h-4 w-4" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industryType"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Industry Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="manufacturing">
                            Manufacturing
                          </SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="officeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <FloatingInput
                          className="pr-10"
                          label="Registered office address"
                          {...field}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 stroke-brand-3 pointer-events-none">
                          <IconHouseAddress className="h-4 w-4" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Login Details Section */}
            <div className="space-y-5 bg-white rounded-2xl px-3 py-4 lg:p-6">
              <div className="space-y-1">
                <h4 className="text-brand-1 font-semibold text-sm lg:text-base">
                  {" "}
                  Login Details
                </h4>

                <p className="text-xs lg:text-sm font-normal text-brand-2">
                  Secure your account with a strong password. Your privacy
                  matters.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <FloatingInput
                            className="pr-10"
                            label="Email"
                            type="email"
                            {...field}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2  pointer-events-none">
                            <IconEmail className="h-4 w-4 stroke-brand-3" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <FloatingInput
                            label="Password"
                            className="pr-10"
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-2  w-10 h-10 rounded-full"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <IconEyeOff className="h-4 w-4 stroke-brand-3" />
                            ) : (
                              <IconEye className="h-4 w-4 stroke-brand-3" />
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
              </div>

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
                Continue
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
