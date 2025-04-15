import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addFamilyAndFriends,
  deleteFamilyOrFriend,
  updateFamilyAndFriendsStatus,
} from "@/services/api/family-and-friends";

export const useAddFamilyOrFriend = (fn?: (res: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFamilyAndFriends,
    onSuccess: (res: any) => {
      toast.success("Successfully added a new family or friend!");
      queryClient.invalidateQueries({ queryKey: ["get-family-and-friends"] });
      fn?.(res);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};

export const useUpdateFamilyOrFriendStatus = (fn?: (res: any) => void) => {
  return useMutation({
    mutationFn: updateFamilyAndFriendsStatus,
    onSuccess: (res: any) => {
      toast.success("Successfully updated status!");
      fn?.(res);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};

export const useDeleteFamilyOrFriend = (fn?: (res: any) => void) => {
  return useMutation({
    mutationFn: deleteFamilyOrFriend,
    onSuccess: (res: any) => {
      toast.success("Successfully deleted family or friend!");
      fn?.(res);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};
