"use client";

import { useMemo } from "react";
import type * as z from "zod";
import { AnimatePresence, motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Textarea,
} from "@/components/ui";
import { Loader } from "@/components/shared/loader";
import { suspendMemberSchema } from "@/lib/validations";
import { useUpdateFamilyOrFriendStatus } from "@/services/hooks/mutations/use-family-and-friends";
import { Modal } from "../../shared";

interface IActivateMemberModal {
  handleClose: () => void;
  isOpen: boolean;
  memberDetail: {
    first_name: string;
    last_name: string;
    status: string;
    familyfriend_id: string;
  };
}
export const ActivateMemberModal = ({
  handleClose,
  isOpen,
  memberDetail,
}: IActivateMemberModal) => {
  const onClose = () => {
    form.reset();
    handleClose();
  };

  const { mutate, isPending } = useUpdateFamilyOrFriendStatus(onClose);

  const buttonCopy = {
    idle: memberDetail?.status === "Active" ? "Suspend" : "Activate",
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending ? "loading" : "idle";
  }, [isPending]);

  const form = useForm<z.infer<typeof suspendMemberSchema>>({
    resolver: zodResolver(suspendMemberSchema),
    mode: "onChange",
    defaultValues: {
      reason: "",
    },
  });

  async function onSubmit({ reason }: z.infer<typeof suspendMemberSchema>) {
    mutate({
      status: memberDetail?.status === "Active" ? "2" : "1",
      familyfriend_id: memberDetail?.familyfriend_id,
      reason: reason,
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      handleClose={onClose}
      showCloseButton={false}
      className="w-full grid gap-y-2"
    >
      <h2 className="font-bold text-lg md:text-2xl">
        {memberDetail?.status === "Active" ? "Suspend" : "Activate"}{" "}
        <b>
          {memberDetail?.first_name} {memberDetail?.last_name}
        </b>
        ?
      </h2>

      <div className="grid gap-y-6">
        <p className="text-text-1 text-sm">
          This action would{" "}
          {memberDetail?.status === "Active" ? "suspend" : "activate"}{" "}
          <b>
            {memberDetail?.first_name} {memberDetail?.last_name}
          </b>{" "}
          and they would {memberDetail?.status === "Active" ? "not" : ""} be
          able to have sessions with providers
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-y-6 w-full"
          >
            <div className="grid gap-y-4">
              <div className="flex items-center gap-4 md:gap-6 flex-col md:flex-row w-full">
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Textarea placeholder="Reason" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>

              <Button type="submit">
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
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
