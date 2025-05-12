"use client";

import { useEffect, useMemo, useState } from "react";
import type * as z from "zod";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import useMeasure from "react-use-measure";
import { HookConfig, InitializePayment } from "react-paystack/dist/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FloatingInput, Modal } from "@/components/shared";
import { Loader } from "@/components/shared/loader";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui";
import { fundWalletSchema } from "@/lib/validations";
import {
  useInitFundWallet,
  useCompleteFundWallet,
} from "@/services/hooks/mutations/use-wallet";
import { useGetProfile } from "@/services/hooks/queries/use-profile";
import { formatNumberWithCommas } from "@/hooks/use-format-currency";

interface IFundWalletModal {
  isOpen: boolean;
  handleClose: () => void;
}

async function loadPaystackHook() {
  const customHook = await import("react-paystack");

  return customHook;
}

export const FundWalletModal = ({ isOpen, handleClose }: IFundWalletModal) => {
  const [config, setConfig] = useState({
    reference: "",
    email: "",
    amount: 0,
    publicKey: "",
  });

  const [usePaystackPayment, setUseCustomHook] = useState<
    (hookConfig: HookConfig) => InitializePayment
  >(() => () => {});

  useEffect(() => {
    loadPaystackHook().then((customHook) =>
      setUseCustomHook(() => customHook.usePaystackPayment)
    );
  }, []);

  const onClose = () => {
    form.reset();
    handleClose();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setConfig((prev) => ({
        ...prev,
        email: JSON.parse(localStorage.getItem("user") as string)?.email || "",
      }));
    }
  }, []);

  const initializePayment = usePaystackPayment(config);
  const { mutate: completeWalletFunding } = useCompleteFundWallet(() => {
    onClose();
  });

  const { data: userProfile } = useGetProfile();

  const { mutate, isPending } = useInitFundWallet((res) => {
    onClose();
    setConfig((prev) => ({
      ...prev,
      reference: res?.transaction_id,
      amount: res?.amount,
      publicKey: res?.paystack_key,
    }));
  });

  useEffect(
    () => {
      if (config?.reference) {
        initializePayment({
          onSuccess: () => {
            completeWalletFunding({ transaction_id: config.reference });
          },
        });
      }
    },
    //eslint-disable-next-line
    [config?.reference]
  );

  const form = useForm<z.infer<typeof fundWalletSchema>>({
    resolver: zodResolver(fundWalletSchema),
    mode: "onChange",
    defaultValues: {
      amount: 0,
    },
  });

  async function onSubmit({ amount }: z.infer<typeof fundWalletSchema>) {
    mutate({ amount: amount.toString() });
  }

  const [ref, bounds] = useMeasure();
  const formAmount = form.watch("amount")

  const buttonCopy = {
    idle: "Buy Unit",
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending ? "loading" : "idle";
  }, [isPending]);

  return (
    <Modal isOpen={isOpen} handleClose={onClose} className="grid gap-y-6">
      <h3 className="font-bold text-2xl">Fund Wallet</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
          <motion.div animate={{ height: bounds.height }}>
            <div ref={ref} className="grid gap-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <FloatingInput
                          label="Amount to Buy"
                          className=" pr-8"
                          {...field}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-300 pointer-events-none">
                          ₦
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-blue-400 py-3 flex flex-col justify-center items-center gap-y-1 rounded-lg">
                <p className="text-brand-2 text-xs">
                  ₦1 = {userProfile?.funding_unitrate ?? 0} unit
                  {userProfile
                    ? userProfile?.funding_unitrate > 1
                      ? "s"
                      : ""
                    : ""}
                </p>
                <div className="flex items-center gap-x-1">
                  <p className="text-brand-2 text-xs">{formatNumberWithCommas(formAmount)} will get you</p>
                  <p className="font-medium text-sm text-brand-1">
                    {Intl.NumberFormat("en-US").format((userProfile?.funding_unitrate || 0) * formAmount)} units
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            layout
            className="flex justify-end items-center md:pt-8 gap-x-4"
          >
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>

            <Button disabled={isPending} type="submit" className="w-21">
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
        </form>
      </Form>
    </Modal>
  );
};
