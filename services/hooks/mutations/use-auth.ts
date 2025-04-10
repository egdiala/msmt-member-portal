import { completeRegister, initRegister } from "@/services/api/auth";
import { LoginResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useInitRegister = (fn?: () => void) => {
  return useMutation({
    mutationFn: initRegister,
    onSuccess: () => {
        toast.success("Successful! Kindly check your email")
        fn?.()
    },
    onError: (err: any) => {
        toast.error(err?.response?.data?.msg || "Something went wrong")
    },
  });
};

export const useCompleteRegister = (fn?: (v: string) => void) => {
  return useMutation({
    mutationFn: completeRegister,
    onSuccess: (res: LoginResponse) => {
      console.log(res)
      toast.success("Successful! Login to access your account")
      fn?.("/home")
    },
    onError: (err: any) => {
        toast.error(err?.response?.data?.msg || "Something went wrong")
    },
  });
};