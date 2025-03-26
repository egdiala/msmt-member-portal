import { Button } from "@/components/ui";
import { Modal } from "../../shared";

interface IDeleteAccountModal {
  handleClose: () => void;
  isOpen: boolean;
}
export const DeleteAccountModal = ({
  handleClose,
  isOpen,
}: IDeleteAccountModal) => {
  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      showCloseButton={false}
      className="w-full md:w-[400px] grid gap-y-2"
    >
      <h2 className="font-bold text-lg md:text-2xl tracking-[0%]">
        Delete Your Account?
      </h2>

      <div className="grid gap-y-6">
        <p className="text-text-1 text-sm">
          This would remove your details from MSMT and irreversible. You would
          need to sign up again to access this platorm
        </p>

        <div className="grid grid-cols-2 gap-x-4">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button>Delete Account</Button>
        </div>
      </div>
    </Modal>
  );
};
