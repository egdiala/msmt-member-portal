import { axiosUserService } from "@/services/axios-instance";
import type {
  ChangePasswordType,
  CompleteRegisterType,
  InitRegisterType,
  LoginType,
} from "@/types/auth";

export const initRegister = async (data: InitRegisterType) => {
  const res = await axiosUserService.post("members/auths/init-register", data);
  return res.data;
};

export const completeRegister = async (data: CompleteRegisterType) => {
  const res = await axiosUserService.post(
    "members/auths/complete-register",
    data
  );
  return res.data.data;
};

export const login = async (data: LoginType) => {
  const res = await axiosUserService.post("members/auths/login", data);
  return res.data.data;
};

export const forgotPassword = async (data: Partial<LoginType>) => {
  const res = await axiosUserService.post(
    "members/auths/forgot-password",
    data
  );
  return res.data;
};

export const confirmOtp = async (data: CompleteRegisterType) => {
  const res = await axiosUserService.post("members/auths/confirm-otp", data);
  return res.data;
};

export const resetPassword = async (
  data: CompleteRegisterType & { password: string }
) => {
  const res = await axiosUserService.post("members/auths/reset-password", data);
  return res.data;
};

export const resendOtp = async (data: Partial<LoginType>) => {
  const res = await axiosUserService.post("members/auths/resend-otp", data);
  return res.data;
};


export const changePassword = async (data: ChangePasswordType) => {
  const res = await axiosUserService.put("members/accounts", data);
  return res.data;
};
