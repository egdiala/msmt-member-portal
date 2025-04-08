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

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    console.log(values)
  }

  return (
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
            href="/reset-password"
            className="text-sm text-brand-1 underline transition-colors font-medium hover:opacity-80 "
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
  );
}
