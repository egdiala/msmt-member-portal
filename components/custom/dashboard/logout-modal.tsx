import { Button } from "@/components/ui";
import { Modal } from "@/components/shared";

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
      className="w-full md:w-100 grid gap-y-2"
    >
      <h2 className="font-bold text-lg md:text-2xl">Log out?</h2>

      <div className="grid gap-y-6">
        <p className="text-text-1 text-sm">
          This action would log you out. you would need to login again to access
          this MSMT
        </p>

        <div className="grid grid-cols-2 gap-x-4">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button>Log out</Button>
        </div>
      </div>
    </Modal>
  );
};
