"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconBell, IconHamMenu } from "@/components/icons";
import { DashboardMobileMenu } from "@/components/shared";
import { DASHBOARD, NOTIFICATIONS } from "@/lib/routes";
import MSMT_LOGO from "../../public/msmt-logo.svg";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const router = useRouter();
  return (
    <div className="w-full bg-portal">
      <div className="mx-auto min-h-screen items-center w-full max-w-[1500px] grid gap-y-6 md:gap-y-8 content-start px-2 md:px-[50px] pb-[50px]">
        <div className="flex items-center justify-center fixed top-0 left-0 right-0 bg-portal z-30">
          <div className="w-full flex items-center justify-between max-w-[1500px] py-4 md:pt-[50px] md:pb-[32px] px-2 md:px-[50px]">
            <button
              className="cursor-pointer"
              onClick={() => router.push(DASHBOARD)}
            >
              <Image src={MSMT_LOGO} width={40.12} height={40.12} alt="logo" />
            </button>

            <div className="flex items-center gap-x-6">
              <button
                className="bg-white p-2 rounded-full relative cursor-pointer"
                onClick={() => router.push(NOTIFICATIONS)}
              >
                <IconBell className="stroke-text-bg-1" />
                <div className="py-0.5 px-1 bg-status-danger rounded-[92.49px] absolute -top-[7px] -right-[7px] tracking-[-2%] font-medium text-white text-xs">
                  9+
                </div>
              </button>

              <button
                onClick={() => setOpenMobileMenu(true)}
                className="bg-button-primary rounded-full p-1.5 inline-flex md:hidden"
              >
                <IconHamMenu className="stroke-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-22 md:pt-[123px] w-full">{children}</div>
      </div>

      <DashboardMobileMenu
        isOpen={openMobileMenu}
        handleClose={() => setOpenMobileMenu(false)}
      />
    </div>
  );
};

export default DashboardLayout;
