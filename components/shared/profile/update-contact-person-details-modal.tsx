import type * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui";
import { IconEmail, IconPhone, IconUserRound } from "@/components/icons";
import { contactPersonDetailsSchema } from "@/lib/validations";
import { Modal } from "../modal";
import { FloatingInput } from "..";

interface IUpdateContactPersonDetailsModal {
  handleClose: () => void;
  isOpen: boolean;
}
export const UpdateContactPersonDetailsModal = ({
  handleClose,
  isOpen,
}: IUpdateContactPersonDetailsModal) => {
  const form = useForm<z.infer<typeof contactPersonDetailsSchema>>({
    resolver: zodResolver(contactPersonDetailsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      relationship: "",
    },
  });

  async function onSubmit(values: z.infer<typeof contactPersonDetailsSchema>) {
    console.log(values);
  }

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      className="max-w-[578px] grid gap-y-6"
    >
      <h2 className="font-bold text-lg md:text-2xl tracking-[0%]">
        Update Contact Person Details
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
          <div className="grid gap-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <FloatingInput
                        label="First Name"
                        className="pr-10"
                        {...field}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 stroke-brand-3">
                        <IconUserRound className="h-4 w-4" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <FloatingInput
                        label="Last Name"
                        className="pr-10"
                        {...field}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 stroke-brand-3">
                        <IconUserRound className="h-4 w-4" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <FloatingInput
                        label="Phone number"
                        className="pr-10"
                        {...field}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 stroke-brand-3">
                        <IconPhone className="h-4 w-4" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <FloatingInput
                        label="Email"
                        className="pr-10"
                        {...field}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 stroke-brand-3">
                        <IconEmail className="h-4 w-4" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput
                      label="Relationship"
                      className="pr-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-x-4 tracking-[-2%] pt-10">
            <Button
              variant="secondary"
              type="button"
              className="bg-blue-400 rounded-[100px] font-semibold text-sm cursor-pointer"
              onClick={handleClose}
            >
              Cancel
            </Button>

            <Button className="bg-button-primary text-white rounded-[100px] font-semibold text-sm cursor-pointer">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
