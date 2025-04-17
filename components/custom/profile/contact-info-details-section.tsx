"use client";

import { useState } from "react";
import { IconPen } from "@/components/icons";
import { Button } from "@/components/ui";
import { UpdateContactPersonDetailsModal } from "./update-contact-person-details-modal";

export const ContactInfoDetailsSection = () => {
  const contactPerson = [
    { id: 1, key: "Full name", value: "James Dada" },
    { id: 2, key: "Phone number", value: "0801 234 5678" },
    { id: 3, key: "Email", value: "example@email.com" },
    { id: 4, key: "Relationship", value: "Mother" },
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
            <p className="text-sm font-medium">{info.value}</p>
          </div>
        ))}
      </div>

      <UpdateContactPersonDetailsModal
        handleClose={() => setOpenUpdateContactPersonDetailsModal(false)}
        isOpen={openUpdateContactPersonDetailsModal}
      />
    </div>
  );
};
