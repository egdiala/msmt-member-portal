import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { requestLiveSession } from '@/services/api/session';

export const useRequestLiveSession = (fn?: (res: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestLiveSession,
    onSuccess: (res: any) => {
      toast.success('Live session requested successfully!');
      fn?.(res);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || 'Failed to request live session');
    },
  });
};
