import { ReactNode } from "react";
import { Dialog, DialogContent } from "../ui";

interface IModal {
  className?: string;
  children: ReactNode;
  isOpen: boolean;
  handleClose: () => void;
}
export const Modal = ({ isOpen, className, children, handleClose }: IModal) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={className}>{children}</DialogContent>
    </Dialog>
  );
};
