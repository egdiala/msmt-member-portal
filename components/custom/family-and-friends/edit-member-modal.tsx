"use client";

import type * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconEmail, IconUserRound } from "@/components/icons";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui";
import { addMemberSchema } from "@/lib/validations";
import { FloatingInput, Modal, SelectCmp } from "../../shared";

interface IEditMemberModal {
  handleClose: () => void;
  isOpen: boolean;
  memberDetail: {
    first_name: string;
    last_name: string;
    email: string;
    relationship: string;
  };
}
export const EditMemberModal = ({
  isOpen,
  handleClose,
  memberDetail,
}: IEditMemberModal) => {
  const form = useForm<z.infer<typeof addMemberSchema>>({
    resolver: zodResolver(addMemberSchema),
    mode: "onChange",
    values: {
      first_name: memberDetail?.first_name,
      last_name: memberDetail?.last_name,
      gender: "",
      email: memberDetail?.email,
      relationship: memberDetail?.relationship === "1" ? "Family" : "Friend",
      gender: "",
    },
  });

  async function onSubmit(values: z.infer<typeof addMemberSchema>) {
    console.log(values);
  }

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className="gap-y-6">
      <h2 className="font-bold text-2xl text-brand-1">Edit Member</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
          <div className="grid gap-y-4">
            <div className="flex items-center gap-4 md:gap-6 flex-col md:flex-row w-full">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="w-full">
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
                name="last_name"
                render={({ field }) => (
                  <FormItem className="w-full">
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
            </div>

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
                    <SelectCmp
                      onSelect={(val) => form.setValue("relationship", val)}
                      selectItems={[
                        { id: 1, value: "Family" },
                        { id: 2, value: "Friend" },
                      ]}
                      placeholder={"Relationship"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-x-4 pt-10">
            <Button variant="secondary" onClick={handleClose} type="button">
              Cancel
            </Button>

            <Button>Update</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
