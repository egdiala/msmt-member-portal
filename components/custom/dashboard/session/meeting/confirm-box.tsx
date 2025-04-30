"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmBoxProps = {
  successText: string;
  rejectText?: string;
  onSuccess: () => void;
  onReject?: () => void;
  open: boolean;
  title: string;
  subTitle?: string;
  subTitleColor?: string;
};

const ConfirmBox = ({
  successText,
  rejectText,
  onSuccess,
  open,
  onReject,
  title,
  subTitle,
  subTitleColor,
}: ConfirmBoxProps) => {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md bg-gray-750 text-white">
        <DialogHeader>
          <DialogTitle className="text-base">{title}</DialogTitle>
          {subTitle && (
            <DialogDescription
              className="text-base"
              style={{ color: subTitleColor || "#9FA0A7" }}
            >
              {subTitle}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2 pt-4">
          {rejectText && (
            <Button
              variant="ghost"
              onClick={onReject}
              className="text-white hover:bg-gray-700"
            >
              {rejectText}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onSuccess}
            className="border-white bg-transparent text-white hover:bg-gray-700"
          >
            {successText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmBox;
