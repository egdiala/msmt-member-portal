"use client";

import { useState, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyEmailSchema } from "@/lib/validations";
import { useCompleteRegister } from "@/services/hooks/mutations/use-auth";
import { Loader } from "@/components/shared/loader";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";

export default function VerifyEmail() {
  const router = useRouter();
  const { mutate, isPending } = useCompleteRegister((path) => {
    localStorage.removeItem("email_to_verify")
    router.push(path)
  })
  const [timeLeft, setTimeLeft] = useState(31);

  const emailToVerify = localStorage.getItem("email_to_verify")

  const form = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  async function onSubmit(values: z.infer<typeof verifyEmailSchema>) {
    mutate({ ...values, email: emailToVerify as string });
  }
  
  const buttonCopy = {
    idle: "Verify Email",
    loading: <Loader className="spinner size-4" />
  };

  const buttonState = useMemo(() => { return isPending ? "loading" : "idle" },[isPending])

  const handleResendCode = async () => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-xl p-4 lg:p-6 space-y-5">
          <div className="space-y-1">
            <p className="font-semibold text-left text-brand-1">
              Enter OTP
            </p>
            <span className="text-xs text-brand-2">
              Please enter the 6-digit code has been sent to
              {emailToVerify || ""}{" "}
              <Link
                href="/reset-password"
                className="text-brand-accent-2 underline hover:opacity-80"
              >
                Edit email
              </Link>
            </span>
          </div>
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormControl>
                  <InputOTP
                    maxLength={5}
                    value={field.value}
                    onChange={field.onChange}
                    render={({ slots }) => (
                      <InputOTPGroup className="gap-3 lg:gap-4 w-full">
                        {slots.map((slot, index) => (
                          <InputOTPSlot
                            key={index}
                            {...slot}
                            className="h-11 w-11 lg:h-12 lg:w-12 bg-input-field border-input-field focus:border-brand-accent-2 rounded-sm"
                          />
                        ))}
                      </InputOTPGroup>
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-left">
            {timeLeft > 0 ? (
              <p className="text-sm text-brand-2">
                Resend code in{" "}
                <span className="no-underline text-brand-2 font-bold">
                  {timeLeft}s
                </span>
              </p>
            ) : (
              <Button
                type="button"
                variant="link"
                className="text-brand-2 underline p-0 h-auto"
                onClick={handleResendCode}
              >
                Resend code
              </Button>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <Button type="submit" disabled={isPending} className="rounded-full w-27.5">
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
        </div>
      </form>
    </Form>
  );
}
