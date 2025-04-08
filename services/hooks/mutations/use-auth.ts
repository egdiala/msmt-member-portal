import { initRegister } from "@/services/api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useInitRegister = (fn?: () => void) => {
  return useMutation({
    mutationFn: initRegister,
    onSuccess: () => {
        toast.success("Successful! Kindly check your email")
        fn?.()
    },
    onError: () => {
        toast.error("Something went wrong")
    },
  });
};