"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconBell, IconHamMenu } from "@/components/icons";
import { DashboardMobileMenu } from "@/components/custom";
import { RenderIf } from "@/components/shared";
import { isAuthenticated } from "@/lib/utils";
import MSMT_LOGO from "../../public/msmt-logo.svg";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const isLoggedIn = isAuthenticated();

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.clear();
      router.replace("/");
    }
  }, [isLoggedIn, router]);

  return (
    <RenderIf condition={isLoggedIn}>
      <div className="w-full bg-portal">
        <div className="mx-auto min-h-screen items-center w-full max-w-screen-2xl grid gap-y-6 md:gap-y-8 content-start px-2 md:px-7 xl:px-12 pb-12">
          <div className="flex items-center justify-center fixed top-0 left-0 right-0 bg-portal z-30">
            <div className="w-full flex items-center justify-between max-w-screen-2xl py-4 md:pt-12 md:pb-8 px-2 md:px-7 xl:px-12">
              <Link className="cursor-pointer" href="/home">
                <Image
                  src={MSMT_LOGO}
                  width={40.12}
                  height={40.12}
                  alt="logo"
                />
              </Link>

              <div className="flex items-center gap-x-6">
                <Link
                  className="bg-white p-2 rounded-full relative cursor-pointer"
                  href="/notifications"
                >
                  <IconBell className="stroke-text-bg-1" />
                  <div className="py-0.5 px-1 bg-status-danger rounded-full absolute -top-1.5 -right-1.5 font-medium text-white text-xs">
                    9+
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
    </RenderIf>
  );
};

export default DashboardLayout;
