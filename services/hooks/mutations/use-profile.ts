import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InvalidateQueryFilters } from "@tanstack/react-query";
import { updateProfile } from "@/services/api/profile";

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
