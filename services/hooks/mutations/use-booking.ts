import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  bookSelfAppointment,
  submitBookingQuestionnaire,
} from "@/services/api/booking";

export const useBookSelfAppointment = (fn?: (res: any) => void) => {
  return useMutation({
    mutationFn: bookSelfAppointment,
    onSuccess: (res: any) => {
      toast.success("Successfully initiated appointment booking process.");
      fn?.(res);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};

export const useSubmitBookingQuestionnaire = (fn?: () => void) => {
  return useMutation({
    mutationFn: submitBookingQuestionnaire,
    onSuccess: () => {
      toast.success("Successfully booked your appointment.");
      fn?.();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};
