"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconExternalLink, IconLogOut } from "@/components/icons";
import { Button } from "@/components/ui";
import { PROFILE_ORGANISATIONS_DATA } from "@/lib/mock";
import { LogoutModal } from "./logout-modal";
import { useGetProfile } from "@/services/hooks/queries/use-profile";

export const ProfileCard = () => {
  const { data } = useGetProfile();
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  return (
    <div className="col-span-1 xl:col-span-3 flex flex-col gap-y-3 rounded-2xl bg-white p-4 md:p-6">
      <div className="grid gap-y-2 content-start">
        <Image
          alt={`${data?.first_name} ${data?.last_name}`}
          className="h-25 object-cover rounded-full"
          src={data?.avatar || '/placeholder.svg'}
          width={100}
          height={100}
        />

        <div className="grid gap-y-0.5">
          <h2 className="text-text-2 font-semibold">
            {data?.first_name} {data?.last_name}
          </h2>
          <p className="text-text-tertiary text-xs">{data?.email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-y-1 flex-1">
        <h4 className="text-text-2 text-xs">Your organisation(s)</h4>

        <div className="flex items-center gap-2 flex-wrap">
          {PROFILE_ORGANISATIONS_DATA.map((organisation) => (
            <div
              key={organisation.id}
              className="py-1 px-2 flex items-center gap-x-1 border border-grey-400 rounded-sm"
            >
              <Image
                src={organisation.icon}
                alt="organisation-icon"
                className="size-6 bg-[#FFFFFF20] object-cover rounded-xs"
                width={24}
                height={24}
              />
              <p className="text-xs text-text-2">{organisation.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between">
        <Button
          asChild
          variant="secondary"
          className="text-button-primary gap-x-1"
        >
          <Link href="/profile">
            Profile
            <IconExternalLink className="stroke-button-primary" />
          </Link>
        </Button>

        <Button
          variant="outline"
          className="text-button-primary hover:text-button-primary"
          onClick={() => setOpenLogoutModal(true)}
        >
          <IconLogOut className="stroke-button-primary" />
          Logout
        </Button>
      </div>

      <LogoutModal
        handleClose={() => setOpenLogoutModal(false)}
        isOpen={openLogoutModal}
      />
    </div>
  );
};
