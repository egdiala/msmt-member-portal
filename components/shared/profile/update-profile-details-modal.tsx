import { Button, Input } from "@/components/ui";
import { Modal } from "../modal";
import { SelectCmp } from "../select";

interface IUpdateProfileDetailsModal {
  handleClose: () => void;
  isOpen: boolean;
}
export const UpdateProfileDetailsModal = ({
  handleClose,
  isOpen,
}: IUpdateProfileDetailsModal) => {
  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      className="max-w-[578px] grid gap-y-6"
    >
      <h2 className="font-bold text-lg md:text-2xl tracking-[0%]">
        Profile Details
      </h2>

      <form className="grid gap-y-4">
        <Input
          placeholder="Preferred Name"
          className="h-[50px] bg-input-field px-2 py-[15px] border-none outline-none focus-visible:ring-offset-0 focus-visible:ring-0 shadow-none"
        />
        <Input
          placeholder="Placeholder"
          className="h-[50px] bg-input-field px-2 py-[15px] border-none outline-none focus-visible:ring-offset-0 focus-visible:ring-0 shadow-none"
        />
        <SelectCmp selectItems={[]} placeholder={"Religion"} />
        <SelectCmp selectItems={[]} placeholder={"Gender"} />
        <SelectCmp selectItems={[]} placeholder={"Marital Status"} />
        <SelectCmp selectItems={[]} placeholder={"Country"} />
        <SelectCmp selectItems={[]} placeholder={"Preferred Language"} />
      </form>

      <div className="flex justify-end gap-x-4 tracking-[-2%] pt-10">
        <Button
          variant="secondary"
          className="bg-blue-400 rounded-[100px] font-semibold text-sm cursor-pointer"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button className="bg-button-primary text-white rounded-[100px] font-semibold text-sm cursor-pointer">
          Update
        </Button>
      </div>
    </Modal>
  );
};
