"use client";

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
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useValidateOrgBooking } from "@/services/hooks/mutations/use-appointment";

const formSchema = z.object({
  code: z
    .string()
    .min(5, { message: "Code must be 5 digits" })
    .max(5, { message: "Code must be 5 digits" }),
});

type FormValues = z.infer<typeof formSchema>;

export const VerifyBookingForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { mutate } = useValidateOrgBooking(() => {
    localStorage.setItem("booking-link", token!);
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Submitted code:", data.code);
    mutate({ otp_code: data?.code, booking_link: token! });
  };

  return (
    <Form {...form}>
      <form
        id="verify-booking-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white p-3 md:p-4 grid gap-2 md:gap-4 rounded-xl"
      >
        <div className="grid gap-1">
          <h2 className="text-sm md:text-base text-brand-1 font-medium md:font-semibold">
            Enter booking code
          </h2>
          <span className="text-text-1 text-xs">
            Please enter the six digit code has been sent to example@email.com
          </span>
        </div>

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
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
      </form>
    </Form>
  );
};
