import { Button } from "@/components/ui";
import { Modal } from "../modal";

interface ILogoutModal {
  handleClose: () => void;
  isOpen: boolean;
}
export const LogoutModal = ({ handleClose, isOpen }: ILogoutModal) => {
  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      showCloseButton={false}
      className="w-full md:w-[400px] grid gap-y-2"
    >
      <h2 className="font-bold text-lg md:text-2xl tracking-[0%]">Log out?</h2>

      <div className="grid gap-y-6">
        <p className="text-text-1 text-sm">
          This action would log you out. you would need to login again to access
          this MSMT
        </p>

        <div className="grid grid-cols-2 gap-x-4">
          <Button
            variant="secondary"
            className="bg-blue-400 rounded-[100px] font-semibold text-sm cursor-pointer h-[38px]"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button className="bg-button-primary text-white rounded-[100px] font-semibold text-sm cursor-pointer h-[38px]">
            Log out
          </Button>
        </div>
      </div>
    </Modal>
  );
};
