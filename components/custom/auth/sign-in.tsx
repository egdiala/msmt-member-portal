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
import { signInSchema } from "@/lib/validations";
import { IconEye, IconEyeOff, IconEmail } from "@/components/icons";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {}

  return (
    <div className="space-y-6 max-w-[650px] mx-auto w-full px-1">
      <div className="space-y-1 text-center">
        <h1 className="lg:text-2xl font-bold">Sign In</h1>
        <p className="text-sm text-brand-2">
          Welcome Back to Care That Fits Your Life
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white w-full rounded-xl p-4 lg:p-6 space-y-4">
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
                        autoComplete="email"
                        className=" pr-10"
                        {...field}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 stroke-brand-3 pointer-events-none">
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <FloatingInput
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        className=" pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 inset-y-1 h-10 w-10"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <IconEyeOff className="h-4 w-4  stroke-brand-3 " />
                        ) : (
                          <IconEye className="h-4 w-4 stroke-brand-3 " />
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
            <Link
              href="/auth/reset-password"
              className="text-sm text-brand-accent-2 underline transition-colors font-medium hover:opacity-80 "
            >
              Reset password
            </Link>
          </div>

          <div className="flex items-center justify-center">
            <Button type="submit" className="w-fit">
              Sign into your Account
            </Button>
          </div>
        </form>
      </Form>
      <div className="text-center text-sm font-medium">
        <span className="text-brand-btn-secondary">
          Do not have an account?{" "}
        </span>
        <Link
          href="/auth/sign-up"
          className="text-brand-accent-2 underline transition-colors  hover:opacity-80 "
        >
          Sign up instead
        </Link>
      </div>
    </div>
  );
}
