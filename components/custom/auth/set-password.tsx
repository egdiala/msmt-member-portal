"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PasswordInput from "@/components/shared/password-input";
import type * as z from "zod";
import { AnimatePresence, motion } from "motion/react";
import useMeasure from "react-use-measure";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { setNewPasswordSchema } from "@/lib/validations";
import { useResetPassword } from "@/services/hooks/mutations/use-auth";
import { Loader } from "@/components/shared/loader";

export default function SetNewPassword() {
  const router = useRouter();
  const [ref, bounds] = useMeasure();

  const { mutate, isPending } = useResetPassword((href) => {
    localStorage.removeItem("email-for-reset");
    localStorage.removeItem("otp-for-reset");
    router.push(href);
  });

  const form = useForm<z.infer<typeof setNewPasswordSchema>>({
    resolver: zodResolver(setNewPasswordSchema),
    mode: "onChange",
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
                      <PasswordInput
                        value={field.value}
                        onChange={field.onChange}
                        id={field.name}
                        name={field.name}
                        labelTitle="Password"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordInput
                        value={field.value}
                        onChange={field.onChange}
                        id={field.name}
                        labelTitle="Confirm Password"
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
          </motion.div>

          <motion.div layout className="flex items-center justify-center">
            <Button type="submit" className="w-30">
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
