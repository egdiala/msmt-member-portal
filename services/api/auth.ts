import { axiosUserService } from "@/services/axios-instance";
import type { CompleteRegisterType, InitRegisterType } from "@/types/auth";

export const initRegister = async (data: InitRegisterType) => {
  const res = await axiosUserService.post("members/auths/init-register", data);
  return res.data;
};

export const completeRegister = async (data: CompleteRegisterType) => {
  const res = await axiosUserService.post("members/auths/complete-register", data);
  return res.data;
};