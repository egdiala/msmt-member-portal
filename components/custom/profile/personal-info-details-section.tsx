"use client";

import { useState } from "react";
import Image from "next/image";
import { IconPen } from "@/components/icons";
import { Button } from "@/components/ui";
import { UpdateProfileDetailsModal } from "./update-profile-details-modal";
import { useGetProfile } from "@/services/hooks/queries/use-profile";

export const PersonalInfoDetailsSection = () => {
  const { data } = useGetProfile();
  const personalInfo = [
    { id: 1, key: "Phone number", value: data?.phone_number || "_" },
    { id: 2, key: "Religion", value: data?.religion || "_" },
    { id: 3, key: "Gender", value: data?.gender || "_" },
    { id: 4, key: "Marital Status", value: data?.marital_status || "_" },
    { id: 5, key: "Country", value: data?.origin_country || "_" },
    { id: 6, key: "Preferred Language", value: data?.preferred_lan || "_" },
  ];

  const [openUpdateProfileDetailsModal, setOpenUpdateProfileDetailsModal] =
    useState(false);

  return (
    <div className="border border-divider rounded-lg p-4 md:py-4 md:px-6 w-full grid gap-y-6">
      <div className="flex justify-between">
        <div className="grid gap-y-4">
          <Image
            alt="man"
            src={data?.avatar || "/placeholder.svg"}
            className="rounded-full h-20 object-cover"
            width={80}
            height={80}
          />

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
            <p className="text-sm font-medium">{info.value}</p>
          </div>
        ))}
      </div>

      <UpdateProfileDetailsModal
        data={data!}
        key={data ? "Data is Loading" : "Data Loaded"}
        handleClose={() => setOpenUpdateProfileDetailsModal(false)}
        isOpen={openUpdateProfileDetailsModal}
      />
    </div>
  );
};
