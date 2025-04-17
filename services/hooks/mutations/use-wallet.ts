import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeFundWallet, initFundWallet } from "@/services/api/wallet";
import { InitFundWalletResponse } from "@/types/wallet";

export const useInitFundWallet = (
  fn?: (res: InitFundWalletResponse) => void
) => {
  return useMutation({
    mutationFn: initFundWallet,
    onSuccess: (res: InitFundWalletResponse) => {
      toast.success("Successfully initiated fund wallet.");
      fn?.(res);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};

export const useCompleteFundWallet = (fn?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeFundWallet,
    onSuccess: () => {
      toast.success("Successfully funded wallet.");
      queryClient.invalidateQueries({
        queryKey: ["get-wallet-transactions"],
      });
      fn?.();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};
