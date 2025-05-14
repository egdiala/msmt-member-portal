import { toast } from "sonner";
import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { getWalletTransactions } from "@/services/api/wallet";
import { FetchWalletTransactionsQuery } from "@/types/wallet";

export const useGetWalletTransactions = <T>(query: FetchWalletTransactionsQuery, config?: Partial<UndefinedInitialDataOptions<any, Error, T, string[]>>) => {
  return useQuery({
    ...config,
    queryKey: ["get-wallet-transactions", query as any],
    queryFn: () => getWalletTransactions(query),
    select: (res) => (res as any)?.data as T,
    retry: false,
    throwOnError(error: any) {
      toast.error(error?.response?.data?.msg || "Something went wrong");
      return false;
    },
  });
};
