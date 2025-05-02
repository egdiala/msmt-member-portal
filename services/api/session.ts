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
