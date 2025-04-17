import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InvalidateQueryFilters } from "@tanstack/react-query";
import { toast } from "sonner";
import { markNotificationsAsRead } from "@/services/api/notifications";

export const useMarkNotificationAsRead = (fn?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries([
        "get-notifications",
      ] as InvalidateQueryFilters);
      toast.success("Notifications marked as read successfully!");
      fn?.();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};
