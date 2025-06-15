import { useQuery } from "@tanstack/react-query";
import { getCountryInfo } from "@/services/api/auth";

export const useGetUserCountryInfo = () => {
  return useQuery({
    queryKey: ["get-country-info"],
    queryFn: () => getCountryInfo(),
    refetchOnWindowFocus: false,
    retry: 1,
    refetchOnMount: false,
  });
};
