"use client";

import { useState } from "react";
import { IconPen } from "@/components/icons";
import { Button } from "@/components/ui";
import { UpdateContactPersonDetailsModal } from "./update-contact-person-details-modal";
import { useGetProfile } from "@/services/hooks/queries/use-profile";

export const ContactInfoDetailsSection = () => {
  const { data } = useGetProfile();
  const contactPerson = [
    {
      id: 2,
      key: "Phone number",
      value:
        data?.contact_person && Object.keys(data?.contact_person)?.length === 0
          ? "-"
          : `+${data?.contact_person?.phone_prefix || ""}${
              data?.contact_person?.phone_number
            }` || "_",
    },
    { id: 3, key: "Email", value: data?.contact_person?.email || "_" },
    {
      id: 4,
      key: "Relationship",
      value: data?.contact_person?.relationship || "_",
    },
  ];

  const [
    openUpdateContactPersonDetailsModal,
    setOpenUpdateContactPersonDetailsModal,
  ] = useState(false);

  return (
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
            <p className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              {info.value}
            </p>
          </div>
        ))}
      </div>

      <UpdateContactPersonDetailsModal
        key={data ? "Update Contact loading" : "Update Contact loaded"}
        data={data!}
        handleClose={() => setOpenUpdateContactPersonDetailsModal(false)}
        isOpen={openUpdateContactPersonDetailsModal}
      />
    </div>
  );
};
