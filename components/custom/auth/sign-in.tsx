"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import useMeasure from "react-use-measure";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FloatingInput } from "@/components/shared/floating-input";
import { IconEye, IconEyeOff, IconEmail } from "@/components/icons";
import { Loader } from "@/components/shared/loader";
import { signInSchema } from "@/lib/validations";
import { useLogin } from "@/services/hooks/mutations/use-auth";

export default function SignIn() {
  const router = useRouter();
  const [ref, bounds] = useMeasure();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useLogin((href) => {
    const callbackUrl = searchParams.get("callbackUrl");
    router.push(callbackUrl || href);
  });

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit({ email, password }: z.infer<typeof signInSchema>) {
    mutate({ email, password });
  }

  const buttonCopy = {
    idle: "Sign into your Account",
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
            className="bg-white w-full rounded-xl p-4 lg:p-6 space-y-4"
          >
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
                      <div className="absolute right-3 bottom-2 -translate-y-1/2 stroke-brand-3 pointer-events-none">
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
                        className="absolute right-0 bottom-2 h-10 w-10 hover:bg-transparent"
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

            <div className="w-full flex justify-end">
              <Link
                href="/reset-password"
                className="text-sm text-brand-1 underline transition-colors font-medium hover:opacity-80"
              >
                Forgot password
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div layout className="flex items-center justify-center">
          <Button type="submit" disabled={isPending} className="w-55">
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
