"use client";

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
import { resetPasswordSchema } from "@/lib/validations";
import { IconEmail } from "@/components/icons";

export default function ResetPassword() {
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    console.log(values)
  }

  return (
    <div className="space-y-6 max-w-[650px] mx-auto w-full px-2">
      <div className="space-y-1 text-center">
        <h1 className="lg:text-2xl text-brand-1 font-bold">Enter Your Email</h1>
        <p className="text-sm text-brand-2">
          Enter the email associated with your account. We would send password
          reset instructions to your email
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
          </div>

          <div className="flex items-center justify-center">
            <Button type="submit" className="w-fit">
              Send Password
            </Button>
          </div>
        </form>
      </Form>
      <div className="text-center text-sm font-semibold">
        <span className="text-brand-btn-secondary">
          Already have an account {""}
        </span>
        <Link
          href="/sign-in"
          className="text-brand-accent-2 underline transition-colors  hover:opacity-80 "
        >
          Sign in Instead
        </Link>
      </div>
    </div>
  );
}
