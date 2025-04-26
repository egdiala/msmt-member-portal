import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookSelfAppointment } from "@/services/api/booking";

export const useBookSelfAppointment = (fn?: () => void) => {
  return useMutation({
    mutationFn: bookSelfAppointment,
    onSuccess: () => {
      toast.success("Successfully initiated appointment booking process.");
      fn?.();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};
