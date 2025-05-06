import { IconStethoscope } from "@/components/icons";
import { RenderIf } from "@/components/shared";
import { formatNumberWithCommas } from "@/hooks/use-format-currency";
import { WALLET_TRANSACTION_TYPE_FILTER_ENUM } from "@/lib/constants";
import { cn, formatTableDate } from "@/lib/utils";
import { FetchedWalletTransactionsType } from "@/types/wallet";

export const TransactionMobileCard = (
  transaction: FetchedWalletTransactionsType
) => {
  return (
    <div
      key={transaction.transaction_id}
      className="bg-input-field px-3 py-4 grid gap-y-2 rounded-sm"
    >
      <div className="flex items-center justify-between font-medium text-xs capitalize">
        <h3 className="text-brand-1 capitalize">
          {WALLET_TRANSACTION_TYPE_FILTER_ENUM[transaction.transaction_type]}
        </h3>
        <p
          className={cn(
            "capitalize",
            transaction.status === 1 ? "text-green-500" : "text-red-500"
          )}
        >
          <RenderIf condition={transaction.status === 1}>Successful</RenderIf>
          <RenderIf condition={transaction.status === 2}>Failed</RenderIf>
          <RenderIf condition={transaction.status === 3}>Abandoned</RenderIf>
        </p>
      </div>

      <div className="border-b border-divider"></div>

      <div className="flex justify-between">
        <div className="grid gap-y-2">
          <div className="flex items-center gap-x-1">
            <IconStethoscope className="stroke-brand-3 size-3" />
            <p className="text-xs text-brand-1 whitespace-pre-wrap">
              {transaction.description}
            </p>
          </div>

          <p className="text-brand-3 text-xs">
            {transaction.createdAt
              ? formatTableDate(transaction.createdAt)
              : ""}
          </p>
        </div>

        <p className="text-brand-2 font-medium text-xs">
          {formatNumberWithCommas(transaction.amount ?? 0)}
        </p>
      </div>
    </div>
  );
};
