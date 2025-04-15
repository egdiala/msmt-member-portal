"use client";

import { useState } from "react";
import type * as z from "zod";
import { useForm } from "react-hook-form";
import { profileSecuritySchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui";
import { IconEye, IconEyeOff } from "@/components/icons";
import { FloatingInput, RenderIf } from "@/components/shared";

export const UpdatePasswordForm = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof profileSecuritySchema>>({
    resolver: zodResolver(profileSecuritySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof profileSecuritySchema>) {
    console.log(values);
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
                  <div className="relative">
                    <FloatingInput
                      label="Current Password"
                      type={showCurrentPassword ? "text" : "password"}
                      className="pr-10"
                      {...field}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 stroke-brand-3">
                      <button
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="cursor-pointer"
                      >
                        <RenderIf condition={!showCurrentPassword}>
                          <IconEyeOff className="h-4 w-4" />
                        </RenderIf>

                        <RenderIf condition={showCurrentPassword}>
                          <IconEye className="h-4 w-4" />
                        </RenderIf>
                      </button>
                    </div>
                  </div>
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
                  <div className="relative">
                    <FloatingInput
                      label="New Password"
                      type={showNewPassword ? "text" : "password"}
                      className="pr-10"
                      {...field}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 stroke-brand-3">
                      <button
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="cursor-pointer"
                      >
                        <RenderIf condition={!showNewPassword}>
                          <IconEyeOff className="h-4 w-4" />
                        </RenderIf>

                        <RenderIf condition={showNewPassword}>
                          <IconEye className="h-4 w-4" />
                        </RenderIf>
                      </button>
                    </div>
                  </div>
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
                  <div className="relative">
                    <FloatingInput
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      className="pr-10"
                      {...field}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 stroke-brand-3">
                      <button
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="cursor-pointer"
                      >
                        <RenderIf condition={!showConfirmPassword}>
                          <IconEyeOff className="h-4 w-4" />
                        </RenderIf>

                        <RenderIf condition={showConfirmPassword}>
                          <IconEye className="h-4 w-4" />
                        </RenderIf>
                      </button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button variant="secondary" className="w-fit">
          Update Password
        </Button>
      </form>
    </Form>
  );
};
