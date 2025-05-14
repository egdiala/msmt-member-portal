"use client";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/shared/loader";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from "motion/react";

interface CancelAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel?: () => void;
  isRemoving: boolean;
}

export function CancelAppointmentDialog({
  open,
  onOpenChange,
  onCancel,
  isRemoving,
}: CancelAppointmentDialogProps) {
  const buttonCopy = {
    idle: "Cancel",
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isRemoving ? "loading" : "idle";
  }, [isRemoving]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] px-4 md:px-6 gap-6">
        <DialogHeader className="gap-2">
          <DialogTitle className="text-left text-xl md:text-2xl font-bold text-brand-1">
            Cancel Appointment ?
          </DialogTitle>
          <DialogDescription className="text-left text-sm text-brand-1">
            This action will cancel your appointment, and you’ll need to
            reschedule to see a provider.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className=" grid grid-cols-2 md:flex flex-row justify-between gap-2 md:gap-4">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Back
          </Button>

          <motion.div layout className="flex items-center justify-center">
            <Button
              onClick={() => {
                if (onCancel) onCancel();
              }}
              variant="outline"
              className="flex-1 w-40"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                  initial={{ opacity: 0, y: -25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 25 }}
                  key={buttonState}
                >
                  {buttonCopy[buttonState]}
                </motion.span>
              </AnimatePresence>
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
