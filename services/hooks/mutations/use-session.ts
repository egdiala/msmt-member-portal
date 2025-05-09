import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { requestLiveSession, updateAppointment } from "@/services/api/session";

export const useRequestLiveSession = (fn?: (res: any) => void) => {
  return useMutation({
    mutationFn: requestLiveSession,
    onSuccess: (res: any) => {
      toast.success("Live session requested successfully!");
      fn?.(res);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Failed to request live session");
    },
  });
};

export const useUpdateAppointment = (fn?: (res: any) => void) => {
  return useMutation({
    mutationFn: updateAppointment,
    onSuccess: (res: any) => {
      toast.success("Appointment updated successfully!");
      fn?.(res);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Failed to update appointment");
    },
  });
};
