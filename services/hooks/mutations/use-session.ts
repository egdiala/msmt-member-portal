import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { requestLiveSession, startSession } from "@/services/api/session";

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

export const useStartSession = (fn?: (res: any) => void) => {
  return useMutation({
    mutationFn: startSession,
    onSuccess: (res: any) => {
      toast.success("Session Started!");
      fn?.(res);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Failed to update appointment");
    },
  });
};
