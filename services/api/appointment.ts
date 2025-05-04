import {
  CompleteOrgBookingPayload,
  RequestOrgBookingPayload,
} from "@/types/appointment";
import { axiosBookingService } from "../axios-instance";
import { BookingQuestionnaireType } from "@/types/booking";

export const completeOrgBooking = async (
  payload: CompleteOrgBookingPayload
) => {
  const res = await axiosBookingService.put(
    "/users/requests/org-bookings",
    payload
  );
  return res.data;
};

export const submitOrgBookingQuestionnaire = async (
  payload: BookingQuestionnaireType
) => {
  const { appointment_id, data } = payload;
  const res = await axiosBookingService.patch(
    `/users/requests/org-bookings/${appointment_id}`,
    { data: data }
  );
  return res.data;
};

export const validateOrgBooking = async (payload: RequestOrgBookingPayload) => {
  const res = await axiosBookingService.post(
    "/users/requests/org-bookings",
    payload
  );
  return res.data;
};
