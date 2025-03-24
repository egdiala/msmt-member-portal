"use client";

import Image from "next/image";
import Link from "next/link";
import { Drawer as DrawerPrimitive } from "vaul";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Drawer, DrawerPortal } from "@/components/ui/drawer";
import { Button } from "@/components/ui";
import { IconClose } from "@/components/icons";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

interface IDashboardMobileMenu {
  isOpen: boolean;
  handleClose: () => void;
}

export const DashboardMobileMenu = ({
  isOpen,
  handleClose,
}: IDashboardMobileMenu) => {
  return (
    <Drawer open={isOpen}>
      <DrawerPortal>
        <DrawerPrimitive.Content
          className={cn(
            "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
            "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-none data-[vaul-drawer-direction=top]:border-b",
            "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-none data-[vaul-drawer-direction=bottom]:border-t",
            "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
            "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
            "min-h-full bg-button-secondary md:hidden"
          )}
        >
          <DialogTitle className="hidden">Dashboard Mobile Menu</DialogTitle>
          <div className="w-full flex items-center justify-between px-2 py-3">
            <Image src="./msmt-logo.svg" alt="msmt" width={32} height={32} />

            <button
              className="bg-button-primary rounded-full size-8 p-1.5"
              onClick={handleClose}
            >
              <IconClose className="stroke-white size-5" />
            </button>
          </div>

          <div className="py-[25px] px-4 grid gap-y-4">
            {NAV_ITEMS.map((nav_item) => (
              <Link
                key={nav_item.id}
                href={nav_item.href}
                className="text-white text-center w-full py-4 rounded-lg border border-text-bg-3"
              >
                {nav_item.name}
              </Link>
            ))}

            <Button className="rounded-[100px]">Book An Appointment</Button>
          </div>
        </DrawerPrimitive.Content>
      </DrawerPortal>
    </Drawer>
  );
};
