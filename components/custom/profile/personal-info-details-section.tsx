"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconPen } from "@/components/icons";
import { Button, Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { hasCompletedBasicProfile } from "@/lib/utils";
import { useGetProfile } from "@/services/hooks/queries/use-profile";
import { UpdateProfileDetailsModal } from "./update-profile-details-modal";

export const PersonalInfoDetailsSection = () => {
  const router = useRouter();

  const { data } = useGetProfile();
  const hasntCompletedProfile = !hasCompletedBasicProfile(data!);

  const personalInfo = [
    {
      id: 1,
      key: "Phone number",
      value:
        data?.phone_prefix === "" && data?.phone_number === ""
          ? "-"
          : `+${data?.phone_prefix || ""}${data?.phone_number}` || "_",
    },
    { id: 2, key: "Religion", value: data?.religion || "_" },
    { id: 3, key: "Gender", value: data?.gender || "_" },
    { id: 4, key: "Marital Status", value: data?.marital_status || "_" },
    { id: 5, key: "Country", value: data?.origin_country || "_" },
    { id: 6, key: "Preferred Language", value: data?.preferred_lan || "_" },
  ];

  const [openUpdateProfileDetailsModal, setOpenUpdateProfileDetailsModal] =
    useState(false);

  useEffect(
    () => {
      if (hasntCompletedProfile) {
        setOpenUpdateProfileDetailsModal(true);
      }
    },
    // eslint-disable-next-line
    []
  );

  return (
    <div className="border border-divider rounded-lg p-4 md:py-4 md:px-6 w-full grid gap-y-6">
      <div className="flex justify-between">
        <div className="grid gap-y-4">
          <div className="flex flex-col gap-y-3">
            <Avatar className="h-25 w-25 rounded-full">
              <AvatarImage
                src={data?.avatar || "/assets/blank-profile-picture.png"}
                className="object-cover w-full h-full"
                alt={`${data?.first_name} ${data?.last_name}`}
              />
              <AvatarFallback className="rounded-full text-brand-1 font-semibold text-lg md:text-xl bg-brand-btn-primary">
                {data?.first_name?.charAt(0)}
                {data?.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="grid gap-y-0.5">
            <h2 className="text-text-1 font-bold text-xl md:text-2xl">
              {data?.first_name || "_"} {data?.last_name || "_"}
            </h2>
            <p className="text-text-2 text-sm">{data?.email || "_"}</p>
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
            <p className="text-sm font-medium capitalize">{info.value}</p>
          </div>
        ))}
      </div>

      <UpdateProfileDetailsModal
        data={data!}
        key={data ? "Data is Loading" : "Data Loaded"}
        handleClose={() => {
          setOpenUpdateProfileDetailsModal(false);
        }}
        handleSuccess={() => {
          if (hasntCompletedProfile) {
            router.push("/home");
          } else {
            setOpenUpdateProfileDetailsModal(false);
          }
        }}
        isOpen={openUpdateProfileDetailsModal}
      />
    </div>
  );
};
