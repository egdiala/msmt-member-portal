export interface FetchWalletTransactionsQuery {
  status?: string; // 1=Successful | 2=Failed | 3=Abandoned
  transaction_type?: string; // 1=Credit | 2=Debit
  item_per_page?: string;
  page?: string;
  component?: "count" | "count-status";
}

export type InitFundWalletType = {
  amount: string;
};

export type CompleteFundWalletType = {
  transaction_id: string;
};
