import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InvalidateQueryFilters } from "@tanstack/react-query";
import { updateProfile, uploadProfileAvatar } from "@/services/api/profile";

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
      mutationFn: uploadProfileAvatar ,
      onSuccess: () => {
        toast.success("Profile picture updated successfully");
        queryClient.invalidateQueries(["get-profile"] as InvalidateQueryFilters);   
      },
      onError: (error:any) => {
        toast.error(error?.response?.data?.msg);
      },
    });
  };
