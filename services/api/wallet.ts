import {
  CompleteFundWalletType,
  FetchWalletTransactionsQuery,
  InitFundWalletType,
} from "@/types/wallet";
import { createQueryString } from "@/lib/utils";
import { axiosBookingService } from "../axios-instance";

export const getWalletTransactions = async (
  query: FetchWalletTransactionsQuery
) => {
  const res = await axiosBookingService.get(
    `users/members/wallets${createQueryString(query)}`
  );
  return res.data;
};

export const initFundWallet = async (data: InitFundWalletType) => {
  const res = await axiosBookingService.post("users/members/wallets", data);
  return res.data.data;
};

export const completeFundWallet = async (data: CompleteFundWalletType) => {
  const res = await axiosBookingService.put("users/members/wallets", data);
  return res.data.data;
};
