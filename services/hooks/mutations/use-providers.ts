import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addFavouriteProvider,
  removeFavouriteProvider,
} from "@/services/api/providers";

export const useAddFavouriteProvider = (fn?: (res: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavouriteProvider,
    onSuccess: (res: any) => {
      toast.success("Successfully added this provider as your favourite!");
      queryClient.invalidateQueries({ queryKey: ["get-favourite-provider"] });
      queryClient.invalidateQueries({ queryKey: ["get-service-providers"] });
      fn?.(res);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};

export const useRemoveFavouriteProvider = (fn?: (res: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFavouriteProvider,
    onSuccess: (res: any) => {
      toast.success("Successfully removed this provider from your favourites!");
      queryClient.invalidateQueries({ queryKey: ["get-favourite-provider"] });
      queryClient.invalidateQueries({ queryKey: ["get-service-providers"] });
      fn?.(res);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Something went wrong");
    },
  });
};
