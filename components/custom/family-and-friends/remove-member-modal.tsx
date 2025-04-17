"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  Button,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { Loader } from "@/components/shared/loader";
import { useDeleteFamilyOrFriend } from "@/services/hooks/mutations/use-family-and-friends";
import { Modal } from "../../shared";

interface IRemoveMemberModal {
  handleClose: () => void;
  isOpen: boolean;
  familyfriend_id: string;
  memberName: string;
}
export const RemoveMemberModal = ({
  isOpen,
  handleClose,
  familyfriend_id,
  memberName,
}: IRemoveMemberModal) => {
  const router = useRouter();

  const { mutate, isPending } = useDeleteFamilyOrFriend(() => {
    handleClose();
    router.back();
  });

  const buttonCopy = {
    idle: "Remove",
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending ? "loading" : "idle";
  }, [isPending]);

  const handleRemove = () => {
    mutate({ familyfriend_id });
  };

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className="gap-y-6">
      <DialogHeader className="grid gap-y-2 text-brand-1">
        <DialogTitle className="text-left font-bold text-2xl">
          Remove Member
        </DialogTitle>
        <DialogDescription className="text-left text-sm">
          This action would remove<b className="capitalize"> {memberName} </b>
          from this platform
        </DialogDescription>
      </DialogHeader>

      <motion.div
        layout
        className="grid grid-cols-2 items-center gap-x-4 w-full"
      >
        <Button variant="secondary" onClick={handleClose} type="button">
          Cancel
        </Button>

        <Button onClick={handleRemove}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              initial={{ opacity: 0, y: -25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 25 }}
              key={buttonState}
            >
              {buttonCopy[buttonState]}
            </motion.span>
          </AnimatePresence>
        </Button>
      </motion.div>
    </Modal>
  );
};
