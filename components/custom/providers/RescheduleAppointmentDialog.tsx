"use client";
import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader } from "@/components/shared/loader";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { RescheduleAppointmentPayload } from "@/types/booking";
import { AnimatePresence, motion } from "motion/react";
import { useRescheduleAppointment } from "@/services/hooks/mutations/use-appointment";

interface ResecheduleAppointmentDialogProps {
  open: boolean;
  rescheduleData: RescheduleAppointmentPayload;
  onOpenChange: (value: boolean) => void;
}

export function ResecheduleAppointmentDialog({
  open,
  rescheduleData,
  onOpenChange,
}: ResecheduleAppointmentDialogProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointment_id = searchParams.get("appointment_id");
  const { mutate, isPending: isRemoving } = useRescheduleAppointment(() => {
    toast.success("Appointment rescheduled successfully!");
    onOpenChange(false);
    router.push(`/appointments/${appointment_id}`);
  });
  const buttonCopy = {
    idle: "Reschedule",
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
            Reschedule Appointment
          </DialogTitle>
          <DialogDescription className="text-left text-sm text-brand-1">
            This action will reschedule your appointment to see a provider.
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
                mutate({
                  payload: rescheduleData,
                  appointmentId: appointment_id as string,
                });
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
