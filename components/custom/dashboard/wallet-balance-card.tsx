import Link from "next/link";
import { IconExternalLink, IconMedicalSavings } from "@/components/icons";
import { Button } from "@/components/ui";
import { WALLET } from "@/lib/routes";

export const WalletBalanceCard = () => {
  return (
    <div className="relative order-3 p-6 col-span-1 xl:col-span-3 h-[370px] rounded-2xl bg-text-bg-3 grid gap-y-1 content-start">
      <h5 className="text-sm text-white">Wallet balance</h5>
      <p className="text-2xl text-white leading-[140%]">₦235,402,853</p>
      <Link href={WALLET}>
        <Button
          variant="secondary"
          className="mt-2 w-fit text-button-primary gap-x-1"
        >
          Wallet
          <IconExternalLink className="stroke-button-primary size-4" />
        </Button>
      </Link>

      <IconMedicalSavings className="absolute bottom-0 right-0" />
    </div>
  );
};
