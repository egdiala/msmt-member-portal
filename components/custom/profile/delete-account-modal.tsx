"use client";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
} from "@/components/ui";
import { useRouter } from "next/navigation";
import { Modal } from "../../shared";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { disableProfileSchema } from "@/lib/validations";
import { useDisableProfile } from "@/services/hooks/mutations/use-profile";
import PasswordInput from "@/components/shared/password-input";
import { clearAllCookies } from "@/lib/cookies";

interface IDeleteAccountModal {
  handleClose: () => void;
  isOpen: boolean;
}
export const DeleteAccountModal = ({
  handleClose,
  isOpen,
}: IDeleteAccountModal) => {
  const form = useForm<z.infer<typeof disableProfileSchema>>({
    resolver: zodResolver(disableProfileSchema),
    defaultValues: {
      password: "",
    },
  });

  const router = useRouter();

  const { mutate: disableProfile, isPending } = useDisableProfile(() => {
    clearAllCookies();
    router.push("/sign-up");
  });

  async function onSubmit(values: z.infer<typeof disableProfileSchema>) {
    await disableProfile({
      password: values.password,
    });
  }
  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      showCloseButton={false}
      className="w-full md:w-100 grid gap-y-2"
    >
      <h2 className="font-bold text-lg md:text-2xl">Delete Your Account?</h2>

      <Form {...form}>
        <form className="grid gap-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <p className="text-text-1 text-sm">
            This would remove your details from MSMT and irreversible. You would
            need to sign up again to access this platorm
          </p>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    value={field.value}
                    onChange={field.onChange}
                    id={field.name}
                    name={field.name}
                    showRequirements={false}
                    labelTitle="Password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-x-4">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isPending ? "Submitting" : "Delete Account"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
