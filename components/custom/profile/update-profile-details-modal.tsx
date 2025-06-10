"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type * as z from "zod";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetDefinedVariables } from "@/hooks/use-get-variables";
import { IconCamera, IconTrash2, IconUserRound } from "@/components/icons";
import {
  Avatar,
  AvatarImage,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui";
import { Loader } from "@/components/shared/loader";
import { PhoneInputWithLabel } from "@/components/shared/phone-input";
import { editProfileDetailsSchema } from "@/lib/validations";
import {
  useRemoveAvatar,
  useUpdateProfile,
  useUploadAvatar,
} from "@/services/hooks/mutations/use-profile";
import { UpdateProfileType } from "@/types/profile";
import { FloatingInput, SelectCmp, Modal, RenderIf } from "../../shared";

interface IUpdateProfileDetailsModal {
  handleClose: () => void;
  handleSuccess: () => void;
  isOpen: boolean;
  data: Partial<UpdateProfileType>;
}
export const UpdateProfileDetailsModal = ({
  handleClose,
  handleSuccess,
  isOpen,
  data,
}: IUpdateProfileDetailsModal) => {
  const handleCancel = () => {
    setAvatar(data?.avatar);
    handleClose();
  };

  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const { requestVariables, variableList, countryList } =
    useGetDefinedVariables();
  const countryListArray = countryList ? countryList : [];

  const form = useForm<z.infer<typeof editProfileDetailsSchema>>({
    resolver: zodResolver(editProfileDetailsSchema),
    mode: "onChange",
    defaultValues: {
      preferredName: data?.nickname || "",
      phone_prefix: data?.phone_prefix || "",
      phoneNumber: data?.phone_number || "",
      religion: data?.religion || "",
      gender: data?.gender
        ? data.gender.charAt(0).toUpperCase() +
          data.gender.slice(1).toLowerCase()
        : "",
      maritalStatus: data?.marital_status || "",
      country: data?.origin_country || "",
      preferredLanguage: data?.preferred_lan || "",
      avatar: data?.avatar || undefined,
    },
  });

  const [avatar, setAvatar] = useState<File | string | undefined>(undefined);
  const { mutateAsync: uploadAvatar, isPending: isLoading } = useUploadAvatar();
  const { mutateAsync: removeAvatar, isPending: isRemovingPicture } =
    useRemoveAvatar();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUpdate, setIsUpdate] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
    }
  };
  useEffect(
    () => {
      setAvatar(data?.avatar);
    },
    // eslint-disable-next-line
    []
  );

  async function onSubmit(values: z.infer<typeof editProfileDetailsSchema>) {
    await updateProfile(
      {
        preferred_lan: values.preferredLanguage,
        phone_prefix: values.phone_prefix,
        nickname: values.preferredName,
        phone_number: values.phoneNumber,
        religion: values.religion,
        gender:
          values.gender?.toLowerCase() === "prefer not to say"
            ? ""
            : values.gender?.toLowerCase(),
        marital_status: values.maritalStatus,
        origin_country: values.country,
      },
      {
        onSuccess: async () => {
          try {
            if (avatar) {
              await uploadAvatar(avatar === undefined ? "" : (avatar as File), {
                onSuccess: () => handleSuccess(),
              });
            } else {
              await removeAvatar(undefined, { onSuccess: handleSuccess });
            }
          } catch (error) {
            console.error("Failed to upload avatar", error);
          }
        },
      }
    );
  }

  const buttonCopy = {
    idle: "Update",
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending || isLoading || isRemovingPicture ? "loading" : "idle";
  }, [isPending, isLoading, isRemovingPicture]);

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleCancel}
      className="bg-white overflow-hidden"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="update-form"
          className="grid gap-y-6"
        >
          <h2 className="font-bold text-lg md:text-2xl">Profile Details</h2>

          <div className="flex flex-col gap-2 justify-center items-center">
            <Avatar className="h-25 w-25 rounded-full">
              <AvatarImage
                src={
                  avatar instanceof File
                    ? URL.createObjectURL(avatar)
                    : avatar || "/assets/blank-profile-picture.png"
                }
                className="object-cover w-full h-full"
                alt={`${data?.first_name} ${data?.last_name}`}
              />
            </Avatar>

            <div className="flex items-center gap-4">
              <button
                className="p-0 gap-x-1 flex items-center text-sm underline text-button-primary font-medium cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setIsUpdate(true);
                  fileInputRef.current?.click();
                }}
                disabled={isLoading}
              >
                <IconCamera className="stroke-text-tertiary size-4" />
                {isLoading && isUpdate
                  ? "Uploading..."
                  : "Upload Profile Picture"}
              </button>

              <RenderIf condition={!!data?.avatar || !!avatar}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setAvatar(undefined);
                  }}
                  disabled={isRemovingPicture}
                  className="p-0 gap-x-1 flex items-center text-sm underline text-status-danger font-medium cursor-pointer"
                >
                  <IconTrash2 className="stroke-text-tertiary size-4" />

                  {isRemovingPicture ? "Removing..." : " Remove Picture"}
                </button>
              </RenderIf>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="overflow-y-auto max-h-[48vh] pr-2">
            <div className="grid gap-y-4">
              <FormField
                control={form.control}
                name="religion"
                render={({ field }) => (
                  <div className="space-y-1">
                    <h1 className="text-sm font-medium text-brand-2">
                      Religion
                    </h1>
                    <SelectCmp
                      selectItems={
                        variableList
                          ? variableList(requestVariables?.["religion-list"])
                          : []
                      }
                      onSelect={field.onChange}
                      placeholder={"Religion"}
                      {...field}
                    />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <div className="space-y-1">
                    <h1 className="text-sm font-medium text-brand-2">Gender</h1>
                    <SelectCmp
                      selectItems={[
                        { value: "Male", id: 1 },
                        { value: "Female", id: 2 },
                        { value: "Prefer not to say", id: 3 },
                      ]}
                      lowercase={false}
                      onSelect={field.onChange}
                      placeholder={"Gender"}
                      {...field}
                    />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                  <div className="space-y-1">
                    <h1 className="text-sm font-medium text-brand-2">
                      Marital Status
                    </h1>
                    <SelectCmp
                      selectItems={
                        variableList
                          ? variableList(requestVariables?.["marital-status"])
                          : []
                      }
                      onSelect={field.onChange}
                      placeholder={"Marital Status"}
                      {...field}
                    />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <div className="space-y-1">
                    <h1 className="text-sm font-medium text-brand-2">
                      Country
                    </h1>
                    <SelectCmp
                      selectItems={[...countryListArray]}
                      placeholder={"Country"}
                      onSelect={field.onChange}
                      {...field}
                    />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="preferredLanguage"
                render={({ field }) => (
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-brand-2">
                      Preferred Language
                    </h3>
                    <SelectCmp
                      selectItems={
                        variableList
                          ? variableList(requestVariables?.["preferred-lan"])
                          : []
                      }
                      onSelect={field.onChange}
                      placeholder={"Preferred Language"}
                      {...field}
                    />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PhoneInputWithLabel
                        value={field.value!}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        onCountryChange={(value) => {
                          form.setValue("phone_prefix", value);
                        }}
                        phonePrefix={form.getValues("phone_prefix")}
                        defaultCountry="NG"
                        placeholder="Phone Number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <FloatingInput
                          label="Preferred Name (Optional)"
                          className="pr-10"
                          {...field}
                        />
                        <div className="absolute right-3 bottom-2 -translate-y-1/2 stroke-brand-3">
                          <IconUserRound className="h-4 w-4" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex justify-end gap-x-4 pt-4 h-fit">
            <Button variant="secondary" onClick={handleCancel} type="button">
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                !form.formState.isValid ||
                isPending ||
                isLoading ||
                isRemovingPicture
              }
              id="update-form"
              className="cursor-pointer w-21"
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
          </div>
        </form>
      </Form>
    </Modal>
  );
};
