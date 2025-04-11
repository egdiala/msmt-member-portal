import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  completeRegister,
  confirmOtp,
  forgotPassword,
  initRegister,
  login,
  resendOtp,
  resetPassword,
} from "@/services/api/auth";
import { LoginResponse } from "@/types/auth";

export const useInitRegister = (fn?: () => void) => {
  return useMutation({
    mutationFn: initRegister,
    onSuccess: () => {
      toast.success("Successful! Kindly check your email");
      fn?.();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};

export const useCompleteRegister = (fn?: (v: string) => void) => {
  return useMutation({
    mutationFn: completeRegister,
    onSuccess: (res: LoginResponse) => {
      localStorage.setItem("user", JSON.stringify(res));
      toast.success("Successful! Login to access your account");
      fn?.("/home");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};

export const useLogin = (
  fn?: ({ href, res }: { href: string; res: LoginResponse }) => void
) => {
  return useMutation({
    mutationFn: login,
    onSuccess: (res: LoginResponse) => {
      toast.success("Login was successful!");
      fn?.({ href: "/home", res });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};

export const useForgotPassword = (fn?: (v: string) => void) => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (res: any) => {
      toast.success(
        "An OTP has been sent to your email! Please use it to continue the process."
      );
      fn?.("/verify-email?isResetPassword=true");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};

export const useConfirmOtp = (fn?: (v: string) => void) => {
  return useMutation({
    mutationFn: confirmOtp,
    onSuccess: (res: any) => {
      toast.success(
        "Successfully confirmed OTP! Please enter your new password."
      );
      fn?.("/set-password");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};

export const useResetPassword = (fn?: (v: string) => void) => {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Successful! Please login to continue.");
      fn?.("/login");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: resendOtp,
    onSuccess: () => {
      toast.success(
        "A new OTP has been sent to your email! Please use it to continue the process."
      );
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};
