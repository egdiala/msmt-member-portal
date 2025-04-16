import { axiosUserService } from "@/services/axios-instance";

export const getNotifications = async (query: string) => {
  const res = await axiosUserService.get(
    `members/accounts/notifications?${query}`
  );
  return res.data;
};
