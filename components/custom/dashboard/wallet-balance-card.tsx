import Link from "next/link";
import { IconExternalLink, IconMedicalSavings } from "@/components/icons";
import { Button } from "@/components/ui";

export const WalletBalanceCard = () => {
  return (
    <div className="order-3 pt-6 px-6 col-span-1 xl:col-span-3 rounded-2xl bg-text-bg-3 flex flex-col justify-between gap-y-2.5 content-start">
      <div className="grid gap-y-1">
        <h5 className="text-sm text-white">Wallet balance</h5>
        <p className="text-2xl text-white">₦235,402,853</p>
          <Button asChild variant="secondary" className="mt-2 w-fit text-button-primary gap-x-1">
            <Link href="/wallet">
              Wallet
              <IconExternalLink className="stroke-button-primary size-4" />
            </Link>
        </Button>
      </div>

      <div className="flex justify-end -mr-6">
        <IconMedicalSavings />
      </div>
    </div>
  );
};
