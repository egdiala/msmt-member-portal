"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { DeleteAccountModal } from "./delete-account-modal";

export const DeleteAccountSection = () => {
  const [openDeleteAccountModal, setOpenDeleteAccountModal] = useState(false);

  return (
    <div className="bg-blue-400 rounded-lg p-2 flex justify-between items-start md:items-center flex-col gap-3 lg:flex-row">
      <div className="grid gap-y-0.5 ml-2">
        <h2 className="font-bold text-text-1 text-sm md:text-base">
          Delete Account
        </h2>
        <p className="text-xs md:text-sm text-text-2">
          This will permanently remove your details from MSMT. You'll need to
          sign up again to use the platform.
        </p>
      </div>

      <Button
        variant="ghost"
        className="text-sm text-status-danger underline font-semibold pl-2 py-0 pr-0 md:p-0 md:mr-1 hover:!px-2"
        onClick={() => setOpenDeleteAccountModal(true)}
      >
        Delete Account
      </Button>

      <DeleteAccountModal
        handleClose={() => setOpenDeleteAccountModal(false)}
        isOpen={openDeleteAccountModal}
      />
    </div>
  );
};
