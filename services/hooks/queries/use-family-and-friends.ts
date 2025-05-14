import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  getFamilyAndFriends,
  getSingleFamilyOrFriend,
} from "@/services/api/family-and-friends";
import { FetchFamilyAndFriendsQuery } from "@/types/family-and-friends";

export const useGetFamilyAndFriends = <T>(
  query: FetchFamilyAndFriendsQuery
) => {
  return useQuery({
    queryKey: ["get-family-and-friends", query],
    queryFn: () => getFamilyAndFriends(query),
    select: (res) => res?.data as T,
    retry: false,
    throwOnError(error: any) {
      toast.error(error?.response?.data?.msg || "Something went wrong");
      return false;
    },
  });
};

export const useGetSingleFamilyOrFriend = <T>(
  query: FetchFamilyAndFriendsQuery, config?: any
) => {
  return useQuery({
    ...config,
    queryKey: ["get-single-family-or-friend", query],
    queryFn: () => getSingleFamilyOrFriend(query),
    select: (res: any) => res?.data as T,
    retry: false,
    throwOnError(error: any) {
      toast.error(error?.response?.data?.msg || "Something went wrong");
      return false;
    },
  });
};
