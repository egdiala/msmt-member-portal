import { IconStethoscope } from "@/components/icons";
import { cn } from "@/lib/utils";

interface ITransactionMobileCard {
  id: string | number;
  type: string;
  status: string;
  description: string;
  date: string;
  time: string;
  amount: string;
}
export const TransactionMobileCard = (transaction: ITransactionMobileCard) => {
  return (
    <div
      key={transaction.id}
      className="bg-input-field px-3 py-4 grid gap-y-2 rounded-sm"
    >
      <div className="flex items-center justify-between font-medium text-xs capitalize">
        <h3 className="text-brand-1">{transaction.type}</h3>
        <p
          className={cn(
            transaction.status === "success" ? "text-green-600" : "text-red-600"
          )}
        >
          {transaction.status}
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
            {transaction.date} • {transaction.time}
          </p>
        </div>

        <p className="text-brand-2 font-medium text-xs">
          ₦{transaction.amount}
        </p>
      </div>
    </div>
  );
};
