import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/services/api/notifications";
import { createQueryString } from "@/lib/utils";
import type { NotificationQueryType } from "@/types/notification";

export const useGetAllNotifications = <T>(query: NotificationQueryType) => {
  const searchQuery =  createQueryString(query);
  return useQuery({
    queryKey: ["get-notifications", query],
    queryFn: () => getNotifications(searchQuery),
    select: (res) => {
      return res.data as T;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
};
