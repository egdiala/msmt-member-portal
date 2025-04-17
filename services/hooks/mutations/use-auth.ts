import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Cookies from "js-cookie";
import {
  completeRegister,
  confirmOtp,
  forgotPassword,
  initRegister,
  login,
  resendOtp,
  resetPassword,
} from "@/services/api/auth";
import { axiosInit } from "@/services/axios-init";
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
    onSuccess: ({ token, ...user }: LoginResponse) => {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", JSON.stringify(token));

      // Set auth cookie for middleware with proper cookie settings
      // This should work in both development and production
      document.cookie = `authToken=${token}; path=/; max-age=${
        30 * 24 * 60 * 60
      }; SameSite=Lax`;

      // Also set with js-cookie as a backup method
      Cookies.set("authToken", token, {
        expires: 30, // 30 days
        path: "/",
        sameSite: "lax",
      });

      axiosInit(token);

      toast.success("Successful! Login to access your account");
      fn?.("/home");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};

export const useLogin = (fn?: (href: string) => void) => {
  return useMutation({
    mutationFn: login,
    onSuccess: (res: LoginResponse) => {
      // Store in localStorage for backward compatibility
      localStorage.setItem("user", JSON.stringify(res));
      localStorage.setItem("token", res.token);

      // Set auth cookie for middleware with proper cookie settings
      // This should work in both development and production
      document.cookie = `authToken=${res.token}; path=/; max-age=${
        30 * 24 * 60 * 60
      }; SameSite=Lax`;

      // Also set with js-cookie as a backup method
      Cookies.set("authToken", res.token, {
        expires: 30, // 30 days
        path: "/",
        sameSite: "lax",
      });

      axiosInit(res.token);

      toast.success("Login was successful!");
      fn?.("/home");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};

export const useForgotPassword = (fn?: (v: string) => void) => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
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
    onSuccess: () => {
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
