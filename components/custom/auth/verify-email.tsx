"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { AnimatePresence, motion } from "motion/react";
import { useQueryClient } from "@tanstack/react-query";

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
import { Loader } from "@/components/shared/loader";
import { verifyEmailSchema } from "@/lib/validations";
import {
  useCompleteRegister,
  useConfirmOtp,
  useResendOtp,
} from "@/services/hooks/mutations/use-auth";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const isResetPassword = searchParams.get("isResetPassword");

  const router = useRouter();

  const { mutate: confirmOtp, isPending: isPendingOtpConfirmation } =
    useConfirmOtp((path) => {
      localStorage.setItem("otp-for-reset", form.getValues().otp);
      queryClient.removeQueries({ queryKey: ["sign-up-details"] });
      router.push(path);
    });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useCompleteRegister((path) => {
    localStorage.removeItem("email_to_verify");
    router.push(path);
  });

  const [timeLeft, setTimeLeft] = useState(31);

  const [emailToVerify, setEmailToVerify] = useState("");

  useEffect(() => {
    if (window !== undefined) {
      setEmailToVerify(
        isResetPassword
          ? (localStorage.getItem("email-for-reset") as string)
          : (localStorage.getItem("email_to_verify") as string)
      );
    }
    //eslint-disable-next-line
  }, []);

  const form = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
    mode: "onChange",
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
    if (isResetPassword) {
      confirmOtp({ ...values, email: emailToVerify });
    } else {
      mutate({ ...values, email: emailToVerify });
    }
  }

  const buttonCopy = {
    idle: "Verify Email",
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending || isPendingOtpConfirmation ? "loading" : "idle";
  }, [isPending, isPendingOtpConfirmation]);

  const { mutate: resendOtp, isPending: isResendingOtp } = useResendOtp();

  const handleResendCode = async () => {
    resendOtp({ email: emailToVerify });
  };

  const resendOtpButtonCopy = {
    idle: "Resend code",
    loading: <Loader className="spinner size-4" />,
  };

  const resendOtpButtonState = useMemo(() => {
    return isResendingOtp ? "loading" : "idle";
  }, [isResendingOtp]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-xl p-4 lg:p-6 space-y-5">
          <div className="space-y-1">
            <p className="font-semibold text-left text-brand-1">Enter OTP</p>
            <span className="text-xs text-brand-2">
              Please enter the 6-digit code has been sent to{" "}
              {emailToVerify || ""}{" "}
              <Link
                href={isResetPassword ? "/reset-password" : "/sign-up"}
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
                disabled={isResendingOtp}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                    initial={{ opacity: 0, y: -25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 25 }}
                    key={resendOtpButtonState}
                  >
                    {resendOtpButtonCopy[buttonState]}
                  </motion.span>
                </AnimatePresence>
              </Button>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isPending || isPendingOtpConfirmation}
            className="rounded-full w-27.5"
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
        </div>
      </form>
    </Form>
  );
}
