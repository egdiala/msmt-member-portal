import { useQuery } from "@tanstack/react-query";
import { getBookOrganization } from "@/services/api/appointment";
import type { NotificationList} from "@/types/notification";
import { QueryResponseType } from "@/types/utils";

export const useGetBookOrganization = (booking_link: string) => {
  return useQuery<QueryResponseType<NotificationList>, Error, NotificationList>({
    queryKey: ["get-booking-org", booking_link],
    queryFn: () => getBookOrganization(booking_link),
    select: (res) => {
      return res.data;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
};
