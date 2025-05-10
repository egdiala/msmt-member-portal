import axios from "axios";
import { axiosBookingService } from "../axios-instance";

export const requestLiveSession = async (
  payload: LiveSessionRequestPayload
) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_MSMT_BOOKING_SERVICE_URL}/users/requests/live-sessions`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_REQUEST_VARIABLES_TOKEN}`,
      },
    }
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
