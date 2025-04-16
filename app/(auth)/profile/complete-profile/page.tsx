"use client";
import type * as z from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { IconCamera, IconPhone, IconUserRound } from "@/components/icons";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui";
import { FloatingInput, SelectCmp } from "@/components/shared";
import { profileDetailsSchema } from "@/lib/validations";
import Link from "next/link";
import { useGetProfile } from "@/services/hooks/queries/use-profile";
import { useGetDefinedVariables } from "@/hooks/use-get-variables";
import {
  useUpdateProfile,
  useUploadAvatar,
} from "@/services/hooks/mutations/use-profile";

const CompleteProfile = () => {
  const { data } = useGetProfile();
  const { mutate: uploadAvatar, isPending: isLoading } = useUploadAvatar();
  const { requestVariables, variableList, countryList } =
    useGetDefinedVariables();

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const form = useForm<z.infer<typeof profileDetailsSchema>>({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: {
      preferredName: "",
      avatar: undefined as File | undefined,
      phoneNumber: "",
      religion: "",
      gender: "",
      maritalStatus: "",
      country: "",
      preferredLanguage: "",
    },
  });
  const { reset, watch } = form;
  const avatarFile = watch("avatar");

  useEffect(() => {
    if (data) {
      reset({
        preferredName: data?.nickname || "",
        avatar: data?.avatar as unknown as File || undefined,
        phoneNumber: data?.phone_number || "",
        religion: data?.religion || "",
        gender: data?.gender || "",
        maritalStatus: data?.marital_status || "",
        country: data?.origin_country || "",
        preferredLanguage: data?.preferred_lan || "",
      });
    }
  }, [data, reset]);

  async function onSubmit(values: z.infer<typeof profileDetailsSchema>) {
    try {
      if (values.avatar && values.avatar instanceof File) {
        await uploadAvatar(values.avatar);
      }

      await updateProfile({
        preferred_lan: values.preferredLanguage,
        nickname: values.preferredName,
        phone_number: values.phoneNumber,
        religion: values.religion,
        gender: values.gender?.toLowerCase(),
        marital_status: values.maritalStatus,
        origin_country: values.country,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }

    console.log(values);
  }

  return (
    <div className="flex items-center justify-center flex-col gap-y-8">
      <div className="text-center grid gap-y-1">
        <h2 className="text-2xl font-bold text-text-1">Complete Profile</h2>
        <p className="text-text-2 text-sm">
          Fill in your details to book sessions and enjoy a seamless experience
        </p>
      </div>

      <div className="grid gap-y-5 w-full md:justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full grid gap-y-5"
          >
            <div className="flex items-center justify-center flex-col gap-2">
              <Avatar className="h-25 w-25 rounded-full">
                <AvatarImage
                  src={
                    avatarFile instanceof File
                      ? URL.createObjectURL(avatarFile)
                      : avatarFile || "/placeholder.svg"
                  }
                  className="object-cover"
                  alt={`${data?.first_name} ${data?.last_name}`}
                />
                <AvatarFallback className="rounded-full text-brand-1 font-semibold text-lg md:text-xl bg-brand-btn-primary">
                  {data?.first_name.charAt(0)}
                  {data?.last_name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div>
                        <input
                          type="file"
                          id="avatar-upload"
                          accept="image/jpeg, image/png"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                            }
                            e.target.value = "";
                          }}
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="p-0 gap-x-1 text-sm flex items-center  underline text-button-primary font-medium cursor-pointer"
                        >
                          <IconCamera className="stroke-text-tertiary size-4" />
                          Upload Profile Picture
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-y-8">
              <div className="bg-white rounded-2xl p-3 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4 w-full md:w-162">
                <FormField
                  control={form.control}
                  name="preferredName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <FloatingInput
                            label="Preferred Name"
                            className="pr-10"
                            {...field}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 stroke-brand-3">
                            <IconUserRound className="h-4 w-4" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <FloatingInput
                            label="Phone number"
                            className="pr-10"
                            {...field}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 stroke-brand-3">
                            <IconPhone className="h-4 w-4" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="religion"
                  render={({ field }) => (
                    <SelectCmp
                      selectItems={variableList(
                        requestVariables?.["religion-list"]
                      )}
                      placeholder={"Religion"}
                     {...field}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <SelectCmp
                      selectItems={[
                        { value: "male", id: 1 },
                        { value: "female", id: 2 },
                      ]}
                      placeholder={"Gender"}
                      {...field}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <SelectCmp
                      selectItems={variableList(
                        requestVariables?.["marital-status"]
                      )}
                      placeholder={"Marital Status"}
                      {...field}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <SelectCmp
                      selectItems={countryList}
                      placeholder={"Country"}
                      {...field}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredLanguage"
                  render={({ field }) => (
                    <SelectCmp
                      selectItems={variableList(
                        requestVariables?.["preferred-lan"]
                      )}
                      placeholder={"Preferred Language"}
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="flex justify-center gap-8 flex-col-reverse md:flex-row w-full">
                <Button asChild variant="secondary">
                  <Link href="/home">Cancel</Link>
                </Button>

                <Button type="submit">
                  {isPending || isLoading ? "Submitting" : "Complete Profile"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CompleteProfile;
