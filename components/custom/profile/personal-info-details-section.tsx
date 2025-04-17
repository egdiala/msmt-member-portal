"use client";

import { useState } from "react";
import Image from "next/image";
import { IconPen } from "@/components/icons";
import { Button } from "@/components/ui";
import { UpdateProfileDetailsModal } from "./update-profile-details-modal";

export const PersonalInfoDetailsSection = () => {
  const personalInfo = [
    { id: 1, key: "Phone number", value: "0801 234 5678" },
    { id: 2, key: "Religion", value: "Christianity" },
    { id: 3, key: "Gender", value: "Male" },
    { id: 4, key: "Marital Status", value: "Single" },
    { id: 5, key: "Country", value: "Nigeria" },
    { id: 6, key: "Preferred Language", value: "English" },
  ];

  const [openUpdateProfileDetailsModal, setOpenUpdateProfileDetailsModal] =
    useState(false);

  return (
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

      <UpdateProfileDetailsModal
        handleClose={() => setOpenUpdateProfileDetailsModal(false)}
        isOpen={openUpdateProfileDetailsModal}
      />
    </div>
  );
};
