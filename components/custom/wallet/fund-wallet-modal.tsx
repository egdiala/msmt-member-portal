import { IconDollarSign } from "@/components/icons";
import { Modal } from "@/components/shared";
import { Button, Input } from "@/components/ui";

interface IFundWalletModal {
  isOpen: boolean;
  handleClose: () => void;
}

export const FundWalletModal = ({ isOpen, handleClose }: IFundWalletModal) => {
  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className="grid gap-y-6">
      <h3 className="font-bold text-2xl">Fund Wallet</h3>

      <div className="relative">
        <Input placeholder="Amount to Buy" className="pr-8" />
        <IconDollarSign className="stroke-grey-300 size-4 absolute right-2 top-4" />
      </div>

      <div className="bg-blue-400 py-3 flex flex-col justify-center items-center gap-y-1 rounded-lg">
        <p className="text-brand-2 text-xs">$1 = 2 units</p>
        <div className="flex items-center gap-x-1">
          <p className="text-brand-2 text-xs">$12 will get you</p>
          <p className="font-medium text-sm text-brand-1">42 units</p>
        </div>
      </div>

      <div className="flex justify-end items-center md:pt-8 gap-x-4">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button>Buy Unit</Button>
      </div>
    </Modal>
  );
};
