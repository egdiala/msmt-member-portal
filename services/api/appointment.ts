import { CompleteOrgBookingPayload } from "@/types/appointment";
import {  axiosRequestService } from "../axios-instance";

export const completeOrgBooking = async (
  payload: CompleteOrgBookingPayload
) => {
  const res = await axiosRequestService.post(
    "users/requests/org-bookings",
    payload
  );
  return res.data;
};
