import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InvalidateQueryFilters } from "@tanstack/react-query";
import {
  disableProfile,
  removeProfileAvatar,
  updateProfile,
  uploadProfileAvatar,
} from "@/services/api/profile";

export const useUpdateProfile = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (res) => {
      toast.success(res?.message || "Profile updated successfully");
      queryClient.invalidateQueries(["get-profile"] as InvalidateQueryFilters);
      onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg);
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadProfileAvatar,
    onSuccess: () => {
      toast.success("Profile picture updated successfully");
      queryClient.invalidateQueries(["get-profile"] as InvalidateQueryFilters);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.msg);
    },
  });
};

export const useRemoveAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeProfileAvatar,
    onSuccess: () => {
      toast.success("Profile picture has been successfully removed!");
      queryClient.invalidateQueries(["get-profile"] as InvalidateQueryFilters);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.msg);
    },
  });
};

export const useDisableProfile = (success: () => void) => {
  return useMutation({
    mutationFn: disableProfile,
    onSuccess: () => {
      toast.success("Profile disabled successfully");
      success?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.msg);
    },
  });
};
