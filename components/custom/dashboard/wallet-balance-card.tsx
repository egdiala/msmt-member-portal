import { IconExternalLink, IconMedicalSavings } from "@/components/icons";
import { Button } from "@/components/ui";

export const WalletBalanceCard = () => {
  return (
    <div className="order-3 relative p-6 w-full md:w-[48%] xl:w-[32%] 3xl:!w-[283px] max-w-full md:max-w-[48%] xl:max-w-[32%] 3xl:!max-w-[283px] h-[370px] rounded-2xl bg-text-bg-3 grid gap-y-1 content-start">
      <h5 className="text-sm text-white">Wallet balance</h5>
      <p className="text-2xl text-white leading-[140%]">₦235,402,853</p>
      <Button
        variant="secondary"
        className="mt-2 rounded-[100px] w-fit text-button-primary gap-x-1"
      >
        Wallet
        <IconExternalLink className="stroke-button-primary size-4" />
      </Button>

      <IconMedicalSavings className="absolute bottom-0 right-0" />
    </div>
  );
};
