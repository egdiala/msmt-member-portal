"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

interface CancelAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancel?: () => void
}

export function CancelAppointmentDialog({ open, onOpenChange, onCancel }: CancelAppointmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Cancel Appointment ?</DialogTitle>
        <DialogDescription>
          This action would cancel appoint and You would need to reschedule appointment again to see a provider
        </DialogDescription>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => {
              if (onCancel) onCancel()
              onOpenChange(false)
            }}
          >
            Cancel Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

