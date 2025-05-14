import { useQuery } from "@tanstack/react-query";
import { getBookOrganization } from "@/services/api/appointment";
import { QueryResponseType } from "@/types/utils";
import { BookOrgDetails } from "@/types/booking";

export const useGetBookOrganization = (booking_link: string) => {
  return useQuery<QueryResponseType<BookOrgDetails>, Error, BookOrgDetails>({
    queryKey: ["get-booking-org", booking_link],
    queryFn: () => getBookOrganization(booking_link),
    select: (res) => {
      return res.data;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
};
