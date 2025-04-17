export interface FetchWalletTransactionsQuery {
  status?: string; // 1=Successful | 2=Failed | 3=Abandoned
  transaction_type?: string; // 1=Credit | 2=Debit
  item_per_page?: string;
  page?: string;
  component?: "count" | "count-status";
  q?: string;
}

export type InitFundWalletType = {
  amount: string;
};

export type CompleteFundWalletType = {
  transaction_id: string;
};

export interface InitFundWalletResponse {
  transaction_id: string;
  paystack_key: string;
  amount: number;
}

export interface FetchedWalletTransactionsType {
  actual_amount: number;
  amount: number;
  createdAt: string;
  data_mode: string;
  description: string;
  payment_method: string;
  payment_type: string;
  save_card: boolean;
  sponsor_id: string;
  status: number;
  transaction_id: string;
  transaction_type: number;
  updatedAt: string;
  user_id: string;
  user_type: string;
}

export interface FetchedWalletTransactionsCountType {
  _id: string | null;
  total: number;
}

export interface FetchedWalletTransactionsStatsType {
  total_credit: number;
  total_debit: number;
  total_balance: number;
}
