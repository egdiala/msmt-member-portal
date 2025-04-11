"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { IconEmail } from "@/components/icons";
import { Loader } from "@/components/shared/loader";
import { resetPasswordSchema } from "@/lib/validations";
import { useForgotPassword } from "@/services/hooks/mutations/use-auth";

export default function ResetPassword() {
  const router = useRouter();
  const [ref, bounds] = useMeasure();

  const { mutate, isPending } = useForgotPassword((href) => {
    localStorage.setItem("email-for-reset", form.getValues().email);
    router.push(href);
  });

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit({ email }: z.infer<typeof resetPasswordSchema>) {
    mutate({ email });
  }

  const buttonCopy = {
    idle: "Send Password",
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending ? "loading" : "idle";
  }, [isPending]);

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
          </motion.div>

          <motion.div layout className="flex items-center justify-center">
            <Button type="submit" disabled={isPending} className="w-41">
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
