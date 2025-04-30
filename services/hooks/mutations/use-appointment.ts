import { useMutation } from "@tanstack/react-query";
import { completeOrgBooking } from "@/services/api/appointment";
import { CompleteOrgBookingPayload } from "@/types/appointment";
import { toast } from "sonner"; 

export const useCompleteOrgBooking = (fn?: () => void) => {
  return useMutation({
    mutationFn: (payload: CompleteOrgBookingPayload) =>
      completeOrgBooking(payload),
    onSuccess: () => {
      toast.success("Booking completed successfully!");
      fn?.();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Booking failed. Please try again.");
    },
  });
};
