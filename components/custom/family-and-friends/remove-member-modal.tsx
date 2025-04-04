import type * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Textarea,
} from "@/components/ui";
import { removeMemberSchema } from "@/lib/validations";
import { Modal } from "../../shared";

interface IRemoveMemberModal {
  handleClose: () => void;
  isOpen: boolean;
}
export const RemoveMemberModal = ({
  isOpen,
  handleClose,
}: IRemoveMemberModal) => {
  const form = useForm<z.infer<typeof removeMemberSchema>>({
    resolver: zodResolver(removeMemberSchema),
    defaultValues: {
      reason: "",
    },
  });

  async function onSubmit(values: z.infer<typeof removeMemberSchema>) {
    console.log(values);
  }

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      className="gap-y-6"
    >
      <DialogHeader className="grid gap-y-2 text-brand-1">
        <DialogTitle className="text-left font-bold text-2xl">Remove Member</DialogTitle>
        <DialogDescription className="text-left text-sm">This action would remove [member name] from this platform</DialogDescription>
      </DialogHeader>

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

          <div className="grid grid-cols-2 items-center gap-x-4 pt-10 w-full">
            <Button variant="secondary" onClick={handleClose} type="button">
              Cancel
            </Button>

            <Button>Remove</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
