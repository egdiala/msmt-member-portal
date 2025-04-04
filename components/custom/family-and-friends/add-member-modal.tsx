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
  Switch,
} from "@/components/ui";
import { addMemberSchema } from "@/lib/validations";
import { FloatingInput, Modal, SelectCmp } from "../../shared";

interface IAddMemberModal {
  handleClose: () => void;
  isOpen: boolean;
}
export const AddMemberModal = ({ isOpen, handleClose }: IAddMemberModal) => {
  const form = useForm<z.infer<typeof addMemberSchema>>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      relationship: "",
      isAbove18: false,
    },
  });

  async function onSubmit(values: z.infer<typeof addMemberSchema>) {
    console.log(values);
  }

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className="gap-y-6">
      <h2 className="font-bold text-2xl text-brand-1">Add Member</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
          <div className="grid gap-y-4">
            <div className="flex items-center gap-4 md:gap-6 flex-col md:flex-row w-full">
              <FormField
                control={form.control}
                name="firstName"
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
                name="lastName"
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
                <SelectCmp
                  selectItems={[]}
                  placeholder={"Relationship"}
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="isAbove18"
              render={({ field }) => (
                <div className="flex justify-between border border-grey-400 bg-input-field rounded-sm px-3 py-2">
                  <p className="text-xs font-medium text-brand-1">
                    This member is above 18 years of age
                  </p>
                  <Switch
                    id="airplane-mode"
                    {...field}
                    value={field.value.toString()}
                  />
                </div>
              )}
            />
          </div>

          <div className="flex justify-end gap-x-4 pt-10">
            <Button variant="secondary" onClick={handleClose} type="button">
              Cancel
            </Button>

            <Button>Add Member</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
