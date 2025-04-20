import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/services/api/notifications";
import { createQueryString } from "@/lib/utils";
import type { NotificationList, NotificationQueryType } from "@/types/notification";
import { QueryResponseType } from "@/types/utils";

export const useGetAllNotifications = (query: NotificationQueryType) => {
  const searchQuery =  createQueryString(query);
  return useQuery<QueryResponseType<NotificationList>, Error, NotificationList>({
    queryKey: ["get-notifications", query],
    queryFn: () => getNotifications(searchQuery),
    select: (res) => {
      return res.data;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
};
