import { useMutation } from "@tanstack/react-query";
import {
  completeOrgBooking,
  validateOrgBooking,
} from "@/services/api/appointment";
import { CompleteOrgBookingPayload } from "@/types/appointment";
import { toast } from "sonner";

export const useCompleteOrgBooking = (fn?: (res: any) => void) => {
  return useMutation({
    mutationFn: (payload: CompleteOrgBookingPayload) =>
      completeOrgBooking(payload),
    onSuccess: (res: any) => {
      toast.success("Booking completed successfully!");
      fn?.(res);
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.msg || "Booking failed. Please try again."
      );
    },
  });
};

export const useValidateOrgBooking = (fn?: (res: any) => void) => {
  return useMutation({
    mutationFn: validateOrgBooking,
    onSuccess: (res: any) => {
      toast.success("Booking validated!");
      fn?.(res);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg);
    },
  });
};
