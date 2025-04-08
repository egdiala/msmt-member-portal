import { axiosUserService } from "@/services/axios-instance";
import { InitRegisterType } from "@/types/auth";

export const initRegister = async (data: InitRegisterType) => {
  const res = await axiosUserService.post("members/auths/init-register", data);
  return res.data;
};