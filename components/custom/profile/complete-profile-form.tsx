"use client";

import Link from "next/link";
import type * as z from "zod";
import { IconCamera, IconPhone, IconUserRound } from "@/components/icons";
import { FloatingInput, SelectCmp } from "@/components/shared";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui";
import { profileDetailsSchema } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetDefinedVariables } from "@/hooks/use-get-variables";
import {
  useUpdateProfile,
  useUploadAvatar,
} from "@/services/hooks/mutations/use-profile";
import { useRouter } from "next/navigation";
import { UserProfileType } from "@/types/profile";

export const CompleteProfileForm = ({ data }: { data: UserProfileType }) => {
  const router = useRouter();
  const { mutateAsync: uploadAvatar, isPending: isLoading } = useUploadAvatar();
  const { requestVariables, variableList, countryList } =
    useGetDefinedVariables();

  const { mutateAsync: updateProfile, isPending } = useUpdateProfile(() =>
    router.push("/home")
  );
  const form = useForm<z.infer<typeof profileDetailsSchema>>({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: {
      preferredName: data?.nickname || "",
      avatar: (data?.avatar as unknown as File) || undefined,
      phoneNumber: data?.phone_number || "",
      religion: data?.religion || "",
      gender: data?.gender || "",
      maritalStatus: data?.marital_status || "",
      country: data?.origin_country || "",
      preferredLanguage: data?.preferred_lan || "",
    },
  });
  const { watch } = form;
  const avatarFile = watch("avatar");
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
  }
  return (
    <div className="grid gap-y-5 w-full md:justify-center">
      <div className="flex items-center justify-center flex-col">
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

        <Button
          variant="ghost"
          className="p-0 gap-x-1 underline text-button-primary font-medium cursor-pointer"
        >
          <IconCamera className="stroke-text-tertiary size-4" />
          Upload Profile Picture
        </Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full grid gap-y-8"
        >
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
                  selectItems={[
                    ...variableList(requestVariables?.["religion-list"]),
                  ]}
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
                  selectItems={[
                    ...variableList(requestVariables?.["marital-status"]),
                  ]}
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
                  selectItems={[...countryList]}
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
                  selectItems={[
                    ...variableList(requestVariables?.["preferred-lan"]),
                  ]}
                  placeholder={"Preferred Language"}
                  {...field}
                />
              )}
            />
          </div>

          <div className="flex justify-center gap-8 flex-col-reverse md:flex-row w-full">
            <Button type="button" asChild variant="secondary">
              <Link href="/home">Cancel</Link>
            </Button>

            <Button type="submit">
              {isPending || isLoading ? "Submitting" : "Complete Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
