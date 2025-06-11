import { useQuery } from "@tanstack/react-query";
import {
  getAppointments,
  getAppointmentsById,
} from "@/services/api/appointments";
import { requestLiveSession } from "@/services/api/session";
import { createQueryString } from "@/lib/utils";
import { GetAppointmentsQuery } from "@/types/appointment";
import { LiveSessionRequestPayload } from "@/types/session";

export const useGetAppointments = (query?: GetAppointmentsQuery) => {
  const searchQuery = createQueryString(query!);
  return useQuery({
    queryKey: ["get-appointments", searchQuery],
    queryFn: () => getAppointments(searchQuery),
    select: (res) => {
      return res.data;
    },
  });
};

export const useGetLiveSession = (payload: LiveSessionRequestPayload) => {
  return useQuery({
    queryKey: ["get-live-session"],
    queryFn: () => requestLiveSession(payload),
    select: (res) => {
      return res?.data;
    },
  });
};

export const useGetAppointmentsById = (id: string) => {
  return useQuery({
    queryKey: ["get-appointments", id],
    queryFn: () => getAppointmentsById(id),
    select: (res) => {
      return res.data;
    },
  });
};
