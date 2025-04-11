"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { AnimatePresence, motion } from "motion/react";
import useMeasure from "react-use-measure";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FloatingInput } from "@/components/shared/floating-input";
import { IconEye, IconEyeOff } from "@/components/icons";
import { setNewPasswordSchema } from "@/lib/validations";
import { useResetPassword } from "@/services/hooks/mutations/use-auth";
import { Loader } from "@/components/shared/loader";

export default function SetNewPassword() {
  const router = useRouter();
  const [ref, bounds] = useMeasure();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate, isPending } = useResetPassword((href) => {
    localStorage.removeItem("email-for-reset");
    router.push(href);
  });

  const form = useForm<z.infer<typeof setNewPasswordSchema>>({
    resolver: zodResolver(setNewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const [otpForReset, setOtpForReset] = useState("");
  const [emailForReset, setEmailForReset] = useState("");

  useEffect(() => {
    if (window !== undefined) {
      setOtpForReset(localStorage.getItem("otp-for-reset") as string);
      setEmailForReset(localStorage.getItem("email-for-reset") as string);
    }
  }, []);

  async function onSubmit({ password }: z.infer<typeof setNewPasswordSchema>) {
    mutate({ otp: otpForReset, email: emailForReset, password });
  }

  const buttonCopy = {
    idle: "Set Password",
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending ? "loading" : "idle";
  }, [isPending]);

  return (
    <div className="space-y-6 max-w-[650px] mx-auto w-full px-2">
      <div className="space-y-1 text-center">
        <h1 className="lg:text-2xl font-bold">Set New Password</h1>
        <p className="text-sm text-brand-2">
          Create a new password to keep your account secure.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <motion.div animate={{ height: bounds.height }}>
            <div
              ref={ref}
              className="bg-white w-full rounded-xl p-4 lg:p-6 space-y-4"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <FloatingInput
                          label="Password"
                          type="password"
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
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <FloatingInput
                          label="Confirm Password"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="current-password"
                          className=" pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 inset-y-1 h-10 w-10"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <IconEyeOff className="h-4 w-4  stroke-brand-3 " />
                          ) : (
                            <IconEye className="h-4 w-4 stroke-brand-3 " />
                          )}
                          <span className="sr-only">
                            {showConfirmPassword
                              ? "Hide password"
                              : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>

          <motion.div layout className="flex items-center justify-center">
            <Button type="submit" className="w-fit">
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
      <div className="text-center text-sm font-semibold">
        <span className="text-brand-btn-secondary">
          Do not have an account?{" "}
        </span>
        <Link
          href="/sign-up"
          className="text-brand-accent-2 underline transition-colors  hover:opacity-80 "
        >
          Sign up instead
        </Link>
      </div>
    </div>
  );
}
