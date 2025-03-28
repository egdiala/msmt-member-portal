import { ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DialogPortal } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Dialog, DialogOverlay, DialogTitle } from "../ui";
import { IconClose } from "../icons";
import { RenderIf } from "./render-if";

interface IModal {
  className?: string;
  children: ReactNode;
  isOpen: boolean;
  showCloseButton?: boolean;
  handleClose: () => void;
}
export const Modal = ({
  isOpen,
  className,
  children,
  handleClose,
  showCloseButton = true,
  ...props
}: IModal) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogPortal data-slot="dialog-portal">
        <DialogOverlay />
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className={cn(
            "bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg p-3 md:p-6 shadow-modal-shadow duration-200 sm:max-w-lg",
            className
          )}
          {...props}
        >
          <DialogTitle className="hidden"></DialogTitle>
          {children}
          <RenderIf condition={showCloseButton}>
            <DialogPrimitive.Close className="ring-offset-background stroke-text-tertiary hover:stroke-white hover:bg-button-primary hover:rounded-full hover: p-2 cursor-pointer focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100  focus:ring-offset-none focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
              <IconClose />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </RenderIf>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};
