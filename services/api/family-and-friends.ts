import { createQueryString } from "@/lib/utils";
import {
  AddFamilyAndFriendsType,
  FetchFamilyAndFriendsQuery,
  UpdateFamilyAndFriendsStatus,
} from "@/types/family-and-friends";
import { axiosUserService } from "../axios-instance";

const FAMILY_AND_FRIENDS_BASE_URL = "members/accounts/familyfriends";
export const getFamilyAndFriends = async (
  query: FetchFamilyAndFriendsQuery
) => {
  const res = await axiosUserService.get(
    `${FAMILY_AND_FRIENDS_BASE_URL}/${createQueryString(query)}`
  );
  return res.data;
};

export const getSingleFamilyOrFriend = async (
  query: FetchFamilyAndFriendsQuery
) => {
  const { familyfriend_id, ...rest } = query;
  const res = await axiosUserService.get(
    `${FAMILY_AND_FRIENDS_BASE_URL}/${
      query.familyfriend_id
    }/${createQueryString(rest)}`
  );
  return res.data;
};

export const addFamilyAndFriends = async (data: AddFamilyAndFriendsType) => {
  const res = await axiosUserService.post(
    `${FAMILY_AND_FRIENDS_BASE_URL}/`,
    data
  );
  return res.data;
};

export const updateFamilyAndFriendsStatus = async ({
  status,
  reason,
  familyfriend_id,
}: UpdateFamilyAndFriendsStatus) => {
  const res = await axiosUserService.patch(
    `${FAMILY_AND_FRIENDS_BASE_URL}/${familyfriend_id}`,
    { status, reason }
  );
  return res.data;
};

export const deleteFamilyOrFriend = async ({
  familyfriend_id,
}: Partial<UpdateFamilyAndFriendsStatus>) => {
  const res = await axiosUserService.delete(
    `${FAMILY_AND_FRIENDS_BASE_URL}/${familyfriend_id}`
  );
  return res.data;
};
