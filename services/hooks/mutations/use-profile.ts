import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { updateProfile} from "@/services/api/profile";

export const useUpdateProfile = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (res) => {
      console.log(res);
      toast.success(res?.message || "Profile updated successfully");
      onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg);
    },
  });
};


