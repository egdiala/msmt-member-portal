"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";

interface CancelAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel?: () => void;
}

export function CancelAppointmentDialog({
  open,
  onOpenChange,
  onCancel,
}: CancelAppointmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] gap-6">
        <DialogHeader className="gap-2">
          <DialogTitle className="text-xl md:text-2xl font-bold text-brand-1">Cancel Appointment ?</DialogTitle>
          <DialogDescription className=" text-sm text-brand-1">
            This action would cancel appoint and You would need to reschedule
            appointment again to see a provider
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="justify-between gap-4">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              if (onCancel) onCancel();
              onOpenChange(false);
            }}
          >
            Cancel Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
