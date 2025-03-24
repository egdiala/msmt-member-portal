"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconExternalLink, IconLogOut } from "@/components/icons";
import { Button } from "@/components/ui";
import { PROFILE_ORGANISATIONS_DATA } from "@/lib/mock";
import { PROFILE } from "@/lib/routes";
import { LogoutModal } from "./logout-modal";

export const ProfileCard = () => {
  const router = useRouter();
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  return (
    <div className="w-full md:w-[48%] xl:w-[32%] 3xl:!w-[375px] h-[349px] max-w-full md:max-w-[48%] xl:max-w-[32%] 3xl:!max-w-[375px] grid gap-y-3 rounded-2xl bg-white py-[28.5px] px-6">
      <div className="grid gap-y-2 content-start">
        <Image
          alt="man"
          className="h-25 object-cover rounded-xl"
          src="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          width={100}
          height={100}
        />

        <div className="grid gap-y-0.5">
          <h2 className="text-text-2 font-semibold">James John</h2>
          <p className="text-text-tertiary text-xs tracking-[-2%]">
            example@email.com
          </p>
        </div>
      </div>

      <div className="grid gap-y-1">
        <h4 className="text-text-2 text-xs tracking-[-2%]">
          Your organisation(s)
        </h4>

        <div className="flex items-center gap-2 flex-wrap">
          {PROFILE_ORGANISATIONS_DATA.map((organisation) => (
            <div
              key={organisation.id}
              className="py-1 px-2 flex items-center gap-x-1 border border-grey-400 rounded-sm"
            >
              <Image
                src={organisation.icon}
                alt="organisation-icon"
                className="size-6 bg-[#FFFFFF20] object-cover rounded-[2.98px]"
                width={24}
                height={24}
              />
              <p className="text-xs text-text-2 tracking-[-2%]">
                {organisation.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between">
        <Button
          variant="secondary"
          className="rounded-[100px] text-button-primary gap-x-1"
          onClick={() => router.push(PROFILE)}
        >
          Profile
          <IconExternalLink className="stroke-button-primary" />
        </Button>

        <Button
          variant="outline"
          className="rounded-[100px] text-button-primary"
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
