"use client";

import { useState } from "react";
import Image from "next/image";
import type * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconEye, IconEyeOff, IconPen } from "@/components/icons";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui";
import {
  DeleteAccountModal,
  UpdateContactPersonDetailsModal,
  UpdateProfileDetailsModal,
} from "@/components/custom";
import { FloatingInput, RenderIf } from "@/components/shared";
import { profileSecuritySchema } from "@/lib/validations";

const Profile = () => {
  const personalInfo = [
    { id: 1, key: "Phone number", value: "0801 234 5678" },
    { id: 2, key: "Religion", value: "Christianity" },
    { id: 3, key: "Gender", value: "Male" },
    { id: 4, key: "Marital Status", value: "Single" },
    { id: 5, key: "Country", value: "Nigeria" },
    { id: 6, key: "Preferred Language", value: "English" },
  ];

  const contactPerson = [
    { id: 1, key: "Full name", value: "James Dada" },
    { id: 2, key: "Phone number", value: "0801 234 5678" },
    { id: 3, key: "Email", value: "example@email.com" },
    { id: 4, key: "Relationship", value: "Mother" },
  ];

  const [openUpdateProfileDetailsModal, setOpenUpdateProfileDetailsModal] =
    useState(false);
  const [
    openUpdateContactPersonDetailsModal,
    setOpenUpdateContactPersonDetailsModal,
  ] = useState(false);
  const [openDeleteAccountModal, setOpenDeleteAccountModal] = useState(false);

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
    <div className="rounded-lg md:rounded-2xl bg-white p-3 md:p-6 flex gap-x-5 w-full">
      <div className="w-full md:w-calc(100%-227px) grid gap-y-4 md:gap-y-8">
        <div className="border border-divider rounded-lg p-4 md:py-4 md:px-6 w-full grid gap-y-6">
          <div className="flex justify-between">
            <div className="grid gap-y-4">
              <Image
                alt="man"
                src="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="rounded-full h-20 object-cover"
                width={80}
                height={80}
              />

              <div className="grid gap-y-0.5">
                <h2 className="text-text-1 font-bold text-xl md:text-2xl">
                  James John
                </h2>
                <p className="text-text-2 text-sm">example@email.com</p>
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={() => setOpenUpdateProfileDetailsModal(true)}
            >
              <IconPen className="stroke-button-secondary" /> Edit
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {personalInfo.map((info) => (
              <div key={info.id}>
                <h4 className="text-text-2 text-sm">{info.key}</h4>
                <p className="text-sm font-medium">{info.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-divider rounded-lg p-4 md:py-4 md:px-6 w-full grid gap-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-text-1 text-sm md:text-base">
              Contact Person
            </h2>

            <Button
              variant="secondary"
              onClick={() => setOpenUpdateContactPersonDetailsModal(true)}
            >
              <IconPen className="stroke-button-secondary" /> Edit
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {contactPerson.map((info) => (
              <div key={info.id}>
                <h4 className="text-text-2 text-sm">{info.key}</h4>
                <p className="text-sm font-medium">{info.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-divider rounded-lg p-4 md:py-4 md:px-6 w-full grid gap-y-5">
          <h2 className="font-bold text-text-1 text-sm md:text-base">
            Security
          </h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-y-5"
            >
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
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
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

          <div className="border-b border-divider w-full"></div>

          <div className="bg-blue-400 rounded-lg p-2 flex justify-between items-start md:items-center flex-col gap-3 lg:flex-row">
            <div className="grid gap-y-0.5 ml-2">
              <h2 className="font-bold text-text-1 text-sm md:text-base">
                Delete Account
              </h2>
              <p className="text-xs md:text-sm text-text-2">
                This would remove your details from MSMT and irreversible.
              </p>
            </div>

            <Button
              variant="ghost"
              className="text-sm text-status-danger underline font-semibold pl-2 py-0 pr-0 md:p-0 md:mr-1"
              onClick={() => setOpenDeleteAccountModal(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      <UpdateProfileDetailsModal
        handleClose={() => setOpenUpdateProfileDetailsModal(false)}
        isOpen={openUpdateProfileDetailsModal}
      />

      <UpdateContactPersonDetailsModal
        handleClose={() => setOpenUpdateContactPersonDetailsModal(false)}
        isOpen={openUpdateContactPersonDetailsModal}
      />

      <DeleteAccountModal
        handleClose={() => setOpenDeleteAccountModal(false)}
        isOpen={openDeleteAccountModal}
      />
    </div>
  );
};

export default Profile;
