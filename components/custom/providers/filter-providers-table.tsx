import { ReactNode } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { IconClose, IconListFilter } from "@/components/icons";
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerPortal,
  DrawerTitle,
} from "@/components/ui";
import { cn } from "@/lib/utils";

export const FilterProvidersTable = ({
  children,
  openMobileDrawer,
  setOpenMobileDrawer,
}: {
  children: ReactNode;
  openMobileDrawer: boolean;
  setOpenMobileDrawer: (val: boolean) => void;
}) => {
  return (
    <div className="md:hidden">
      <Button
        variant="secondary"
        className="px-2 md:px-3 py-2 shadow-none"
        onClick={() => setOpenMobileDrawer(true)}
      >
        <IconListFilter className="stroke-brand-btn-secondary" />
      </Button>

      <Drawer
        open={openMobileDrawer}
        onOpenChange={() => setOpenMobileDrawer(!openMobileDrawer)}
      >
        <DrawerPortal>
          <DrawerPrimitive.Content
            className={cn(
              "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
              "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-none data-[vaul-drawer-direction=top]:border-b",
              "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-none data-[vaul-drawer-direction=bottom]:border-t",
              "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
              "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
              "min-h-full md:hidden"
            )}
          >
            <DrawerTitle className="hidden"></DrawerTitle>

            <DrawerClose
              onClick={() => setOpenMobileDrawer(false)}
              className="stroke-text-tertiary hover:stroke-white hover:bg-button-primary hover:rounded-full hover: p-2 absolute top-2 right-2"
            >
              <IconClose />
            </DrawerClose>

            {children}
          </DrawerPrimitive.Content>
        </DrawerPortal>
      </Drawer>
    </div>
  );
};
