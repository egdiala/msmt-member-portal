import { axiosUserService } from "@/services/axios-instance";
import { NotificationList } from "@/types/notification";

export const getNotifications = async (
  query: string
): Promise<NotificationList> => {
  const res = await axiosUserService.get(
    `members/accounts/notifications${query}`
  );
  return res.data;
};

export const markNotificationsAsRead = async () => {
  const res = await axiosUserService.put(`/members/accounts/notifications`);
  return res.data;
};
