import { useMutation } from "@tanstack/react-query";
import {
  completeOrgBooking,
  validateOrgBooking,

} from "@/services/api/appointment";
import { submitSessionRating } from "@/services/api/appointments";
import { CompleteOrgBookingPayload, SessionRatingPayload } from "@/types/appointment";
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

export const useSubmitSessionRating = (onSuccessCallback?: (res: any) => void) => {
  return useMutation({
    mutationFn: (payload: SessionRatingPayload) => submitSessionRating(payload),
    onSuccess: (res: any) => {
      toast.success("Session review submitted!");
      onSuccessCallback?.(res);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Failed to submit session rating.");
    },
  });
};
