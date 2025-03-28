import { Button } from "@/components/ui";
import { Modal } from "../../shared";

interface IActivateMemberModal {
  handleClose: () => void;
  isOpen: boolean;
}
export const ActivateMemberModal = ({
  handleClose,
  isOpen,
}: IActivateMemberModal) => {
  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      showCloseButton={false}
      className="w-full md:w-88 grid gap-y-2"
    >
      <h2 className="font-bold text-lg md:text-2xl">Activate [member name]?</h2>

      <div className="grid gap-y-6">
        <p className="text-text-1 text-sm">
          This action would activate [member name] and would be able to take
          sessions with providers
        </p>

        <div className="grid grid-cols-2 gap-x-4">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button>Activate</Button>
        </div>
      </div>
    </Modal>
  );
};
