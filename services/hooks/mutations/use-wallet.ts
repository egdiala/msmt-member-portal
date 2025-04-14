import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { completeFundWallet, initFundWallet } from "@/services/api/wallet";

export const useInitFundWallet = (fn?: () => void) => {
  return useMutation({
    mutationFn: initFundWallet,
    onSuccess: () => {
      toast.success("Successfully initiated fund wallet.");
      fn?.();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};

export const useCompleteFundWallet = (fn?: () => void) => {
  return useMutation({
    mutationFn: completeFundWallet,
    onSuccess: () => {
      toast.success("Successfully funded wallet.");
      fn?.();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};
