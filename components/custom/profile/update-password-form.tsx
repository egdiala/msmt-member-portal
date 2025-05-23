"use client";

import type * as z from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { profileSecuritySchema } from "@/lib/validations";
import { clearAllCookies } from "@/lib/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui";
import PasswordInput from "@/components/shared/password-input";
import { useChangePassword } from "@/services/hooks/mutations/use-auth";

export const UpdatePasswordForm = () => {
  const router = useRouter();

  const { mutate, isPending } = useChangePassword(() => {
    clearAllCookies();
    localStorage.clear();
    router.push("/sign-in");
  });

  const form = useForm<z.infer<typeof profileSecuritySchema>>({
    resolver: zodResolver(profileSecuritySchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof profileSecuritySchema>) {
    await mutate({
      old_password: values.currentPassword,
      new_password: values.newPassword,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-5">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    value={field.value}
                    onChange={field.onChange}
                    id={field.name}
                    name={field.name}
                    labelTitle="Current Password"
                    turnOffAutocomplete
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    value={field.value}
                    onChange={field.onChange}
                    id={field.name}
                    name={field.name}
                    labelTitle="New Password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    value={field.value}
                    onChange={field.onChange}
                    id={field.name}
                    name={field.name}
                    labelTitle="Confirm Password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" variant="secondary" className="w-fit">
          {isPending ? "Submitting" : "Update Password"}
        </Button>
      </form>
    </Form>
  );
};
