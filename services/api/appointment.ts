import { CompleteOrgBookingPayload, RequestOrgBookingPayload } from "@/types/appointment";
import {  axiosBookingService } from "../axios-instance";

export const completeOrgBooking = async (
  payload: CompleteOrgBookingPayload
) => {
  const res = await axiosBookingService.post(
    "users/requests/org-bookings",
    payload
  );
  return res.data;
};

export const validateOrgBooking = async (
  payload: RequestOrgBookingPayload
) => {
  const res = await axiosBookingService.post(
    "users/requests/org-bookings",
    payload
  );
  return res.data;
};



