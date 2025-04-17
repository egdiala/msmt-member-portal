"use client";

import { useState, ReactNode } from "react";
import { useAutoLogout } from "@/hooks/use-auto-logout";
import { DashboardMobileMenu } from "@/components/custom";
import { IconBell, IconHamMenu } from "@/components/icons";
import Image from "next/image";
import Link from "next/link";
import MSMT_LOGO from "../../../public/msmt-logo.svg";
import { useGetAllNotifications } from "@/services/hooks/queries/use-notifications";

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const { data } = useGetAllNotifications<{ total: number }>({
    component: "count",
    page: "1",
    item_per_page: "10",
  });

  // Auto logout if JWT token expires
  useAutoLogout();

  return (
    <div className="w-full bg-portal">
      <div className="mx-auto min-h-screen items-center w-full max-w-screen-2xl grid gap-y-6 md:gap-y-8 content-start px-2 md:px-7 xl:px-12 pb-12">
        <div className="flex items-center justify-center fixed top-0 left-0 right-0 bg-portal z-30">
          <div className="w-full flex items-center justify-between max-w-screen-2xl py-4 md:pt-12 md:pb-8 px-2 md:px-7 xl:px-12">
            <Link className="cursor-pointer" href="/home">
              <Image src={MSMT_LOGO} width={40.12} height={40.12} alt="logo" />
            </Link>

            <div className="flex items-center gap-x-6">
              <Link
                className="bg-white p-2 rounded-full relative cursor-pointer"
                href="/notifications"
              >
                <IconBell className="stroke-text-bg-1" />
                <div className="py-0.5 px-1 bg-status-danger rounded-full absolute -top-1.5 -right-1.5 font-medium text-white text-xs">
                  {data?.total}
                </div>
              </Link>

              <button
                onClick={() => setOpenMobileMenu(true)}
                className="bg-button-primary rounded-full p-1.5 inline-flex md:hidden"
              >
                <IconHamMenu className="stroke-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-22 md:pt-32 xl:pt-31 w-full">{children}</div>
      </div>

      <DashboardMobileMenu
        isOpen={openMobileMenu}
        handleClose={() => setOpenMobileMenu(false)}
      />
    </div>
  );
}
