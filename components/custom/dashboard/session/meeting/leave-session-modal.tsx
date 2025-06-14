"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

type LeaveSessionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleLeaveSession: () => void;
};

export function LeaveSessionModal({
  open,
  onOpenChange,
  handleLeaveSession,
}: LeaveSessionModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Thank you for joining the call</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave now?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay</AlertDialogCancel>
          <AlertDialogAction onClick={handleLeaveSession}>
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
