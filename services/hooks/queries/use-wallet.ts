import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getWalletTransactions } from "@/services/api/wallet";
import { FetchWalletTransactionsQuery } from "@/types/wallet";

export const useGetWalletTransactions = <T>(query: FetchWalletTransactionsQuery, config?: any) => {
  return useQuery({
    ...config,
    queryKey: ["get-wallet-transactions", query],
    queryFn: () => getWalletTransactions(query),
    select: (res: any) => res?.data as T,
    retry: false,
    throwOnError(error: any) {
      toast.error(error?.response?.data?.msg || "Something went wrong");
      return false;
    },
  });
};
