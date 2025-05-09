import { axiosBookingService } from "../axios-instance";

export const requestLiveSession = async (
  payload: LiveSessionRequestPayload
) => {
  const res = await axiosBookingService.post(
    "/users/requests/live-sessions",
    payload
  );

  return res.data;
};

export const updateAppointment = async (payload: {
  appointment_id: string;
}) => {
  const res = await axiosBookingService.put(
    "/users/members/appointments",
    payload
  );

  return res.data;
};
