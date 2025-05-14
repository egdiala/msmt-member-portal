"use client";
import { useMemo } from "react";
import { Button } from "@/components/ui";
import { OrganizationCard } from "@/components/custom/dashboard/session/organization-card";

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
import { z } from "zod";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader } from "@/components/shared/loader";
import { AnimatePresence, motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useValidateOrgBooking } from "@/services/hooks/mutations/use-appointment";
import { useGetBookOrganization } from "@/services/hooks/queries/use-booking";
import { RenderIf } from "@/components/shared";
import Link from "next/link";
const formSchema = z.object({
  code: z
    .string()
    .min(5, { message: "Code must be 5 digits" })
    .max(5, { message: "Code must be 5 digits" }),
});

type FormValues = z.infer<typeof formSchema>;

const VerifyBooking = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { data, status } = useGetBookOrganization(token as string)
  const { mutate, isPending } = useValidateOrgBooking(() => {
    localStorage.setItem("booking-link", token!);
    router.push(`/organisation/${data?.org_data?.org_id}?type=org&service_type=payer&booking_link=${token}`)
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = (data: FormValues) => {
    mutate({ otp_code: data?.code, booking_link: token! });
  };
  const buttonCopy = {
    idle: "Verify Booking Code",
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending ? "loading" : "idle";
  }, [isPending]);

  return (
    <main className="flex flex-col justify-center w-full h-[calc(100vh-200px)]">
      <div className="mx-auto max-w-[650px] w-full flex flex-col gap-4">
        <RenderIf condition={(data === undefined) && (status == "error")}>
          <div className="flex flex-col items-center justify-center flex-1 gap-1 max-w-md mx-auto w-full">
            <Image src="/link-expired.svg" alt="error" width={212.25} height={194.56} />
            <h1 className="text-brand-1 text-3xl font-bold">Link Expired</h1>
            <p className="text-brand-2 text-center text-base font-medium">This link has expired cannot be used again. Please contact your administrator or book a new appointment</p>
          </div>
        </RenderIf>
        <RenderIf condition={data !== undefined}>
          <div className="py-5 grid gap-1 text-center">
            <h1 className="text-text-1 text-lg md:text-2xl font-bold">Welcome</h1>
            <p className="text-sm font-normal text-text-2">
              {" "}
              Your organization has taken the first step in booking an appointment
              on your behalf. To complete the process, we will need you to select
              a provider of your choice and set your availability.
            </p>
          </div>
          <OrganizationCard
            organization={{ name: data?.org_data?.name || "", type: data?.org_data?.industry_name || "", avatar: data?.org_data?.avatar || "" }}
          />
        </RenderIf>

        <RenderIf condition={data?.status === 0}>
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
                  Please enter the five digit code has been sent to
                  your email
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

          <div className="flex justify-center mt-4">
            <motion.div layout className="flex items-center justify-center">
              <Button
                form="verify-booking-form"
                type="submit"
                className="rounded-full w-41"
                disabled={isPending}
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
            </motion.div>
          </div>
        </RenderIf>
        <RenderIf condition={data?.status === 1}>
          <div className="flex justify-center mt-4">
            <Button asChild className="rounded-full w-41">
              <Link href={`/organisation/${data?.org_data?.org_id}?type=org&service_type=payer&booking_link=${token}`}>Continue</Link>
            </Button>
          </div>
        </RenderIf>
      </div>
    </main>
  );
};

export default VerifyBooking;
