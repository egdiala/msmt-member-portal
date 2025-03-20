import * as DialogPrimitive from "@radix-ui/react-dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Dialog, DialogOverlay, DialogPortal, DialogTitle } from "../ui";

interface ISuccessModal {
  className?: string;
  successMessage: string;
  isOpen: boolean;
}
export const SuccessModal = ({
  className,
  successMessage,
  isOpen,
  ...props
}: ISuccessModal) => {
  return (
    <Dialog defaultOpen={true}>
      <DialogPortal data-slot="dialog-portal">
        <DialogOverlay />
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className={cn(
            "bg-white data-[state=open]:animate-in flex flex-col justify-center items-center gap-y-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 w-[400px] max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg p-8 duration-200 sm:max-w-lg",
            className
          )}
          {...props}
        >
          <Image src="/success.gif" alt="Success Gif" width={87} height={87} />

          <DialogTitle>{successMessage}</DialogTitle>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};
