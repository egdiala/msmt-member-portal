import { CompleteProfileForm } from "@/components/custom";
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
import { useRouter } from "next/navigation";

const CompleteProfile = () => {
  const router = useRouter()
  const { data } = useGetProfile();
  const { mutateAsync: uploadAvatar, isPending: isLoading } = useUploadAvatar();
  const { requestVariables, variableList, countryList } = useGetDefinedVariables();

  const { mutateAsync: updateProfile, isPending } = useUpdateProfile(() => router.push("/home"));

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
  }

  return (
    <div className="flex items-center justify-center flex-col gap-y-8">
      <div className="text-center grid gap-y-1">
        <h2 className="text-2xl font-bold text-text-1">Complete Profile</h2>
        <p className="text-text-2 text-sm">
          Fill in your details to book sessions and enjoy a seamless experience
        </p>
      </div>

      <CompleteProfileForm />
    </div>
  );
};

export default CompleteProfile;
