"use client";

import { useState } from "react";
import Image from "next/image";
import { IconPen } from "@/components/icons";
import { Button, Input } from "@/components/ui";
import {
  DeleteAccountModal,
  UpdateContactPersonDetailsModal,
  UpdateProfileDetailsModal,
} from "@/components/shared";

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
                <p className="text-text-2 text-sm tracking-[0%]">
                  example@email.com
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              className="rounded-[100px] text-button-secondary font-semibold tracking-[-2%] bg-blue-400 cursor-pointer"
              onClick={() => setOpenUpdateProfileDetailsModal(true)}
            >
              <IconPen className="stroke-button-secondary" /> Edit
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {personalInfo.map((info) => (
              <div key={info.id} className="tracking-[0%]">
                <h4 className="text-text-2 text-sm">{info.key}</h4>
                <p className="text-sm font-medium">{info.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-divider rounded-lg p-4 md:py-4 md:px-6 w-full grid gap-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-bold tracking-[0%] text-text-1 text-sm md:text-base">
              Contact Person
            </h2>

            <Button
              variant="secondary"
              className="rounded-[100px] text-button-secondary font-semibold tracking-[-2%] bg-blue-400 cursor-pointer"
              onClick={() => setOpenUpdateContactPersonDetailsModal(true)}
            >
              <IconPen className="stroke-button-secondary" /> Edit
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {contactPerson.map((info) => (
              <div key={info.id} className="tracking-[0%]">
                <h4 className="text-text-2 text-sm">{info.key}</h4>
                <p className="text-sm font-medium">{info.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-divider rounded-lg p-4 md:py-4 md:px-6 w-full grid gap-y-5">
          <h2 className="font-bold tracking-[0%] text-text-1 text-sm md:text-base">
            Security
          </h2>

          <div className="grid gap-4 grid-cols-2">
            <Input
              type="password"
              placeholder="Current Password"
              className="h-[50px] bg-input-field px-2 py-[15px] border-none outline-none focus-visible:ring-offset-0 focus-visible:ring-0 shadow-none"
            />
            <Input
              type="password"
              placeholder="New Password"
              className="h-[50px] bg-input-field px-2 py-[15px] border-none outline-none focus-visible:ring-offset-0 focus-visible:ring-0 shadow-none"
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              className="h-[50px] bg-input-field px-2 py-[15px] border-none outline-none focus-visible:ring-offset-0 focus-visible:ring-0 shadow-none"
            />
          </div>

          <Button
            variant="secondary"
            className="rounded-[100px] bg-blue-400 w-fit font-semibold tracking-[-2%] cursor-pointer"
          >
            Update Password
          </Button>

          <div className="border-b border-divider w-full"></div>

          <div className="bg-blue-400 rounded-lg p-2 flex justify-between flex-col gap-3 lg:flex-row">
            <div className="grid gap-y-0.5">
              <h2 className="font-bold tracking-[0%] text-text-1 text-sm md:text-base">
                Delete Account
              </h2>
              <p className="text-xs md:text-sm text-text-2 tracking-[-2%]">
                This would remove your details from MSMT and irreversible.{" "}
              </p>
            </div>

            <Button
              variant="ghost"
              className="underline font-semibold text-status-danger w-fit p-0 cursor-pointer"
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
