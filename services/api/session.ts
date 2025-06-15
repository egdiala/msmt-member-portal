import {
  axiosBookingService,
  axiosPublicBookingService,
} from "../axios-instance";
import { LiveSessionRequestPayload } from "@/types/session";

export const requestLiveSession = async (
  payload: LiveSessionRequestPayload
) => {
  const res = await axiosPublicBookingService.post(
    "users/requests/live-sessions",
    payload
  );

  return res?.data;
};

export const startSession = async (payload: { appointment_id: string }) => {
  const res = await axiosBookingService.put(
    "/users/members/appointments",
    payload
  );

  return res.data;
};
