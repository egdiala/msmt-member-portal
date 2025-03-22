import { IconExternalLink, IconMedicalSavings } from "@/components/icons";
import { Button } from "@/components/ui";

export const WalletBalanceCard = () => {
  return (
    <div className="relative p-6 w-full md:w-[283px] max-w-full md:max-w-[283px] h-[370px] rounded-2xl bg-text-bg-3 grid gap-y-1 content-start">
      <h5 className="text-sm text-white">Wallet balance</h5>
      <p className="text-2xl text-white leading-[140%]">₦235,402,853</p>
      <Button className="bg-white text-button-primary w-fit rounded-[100px] mt-2 font-semibold">
        Wallet
        <IconExternalLink className="stroke-button-primary" />
      </Button>

      <IconMedicalSavings className="absolute bottom-0 right-0" />
    </div>
  );
};
