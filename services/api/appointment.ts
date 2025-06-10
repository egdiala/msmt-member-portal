import {
  CompleteOrgBookingPayload,
  RequestOrgBookingPayload,
} from "@/types/appointment";
import { axiosPublicBookingService } from "../axios-instance";
import { BookingQuestionnaireType } from "@/types/booking";

export const completeOrgBooking = async (
  payload: CompleteOrgBookingPayload
) => {
  const res = await axiosPublicBookingService.put(
    "/users/requests/org-bookings",
    payload
  );
  return res.data;
};

export const getBookOrganization = async (booking_link: string) => {
  const res = await axiosPublicBookingService.get(
    `/users/requests/org-bookings?booking_link=${booking_link}`
  );
  return res.data;
};

export const submitOrgBookingQuestionnaire = async (
  payload: BookingQuestionnaireType
) => {
  const { appointment_id, data, booking_link } = payload;
  const res = await axiosPublicBookingService.patch(
    `/users/requests/org-bookings/${appointment_id}`,
    { data: data, booking_link: booking_link }
  );
  return res.data;
};

export const validateOrgBooking = async (payload: RequestOrgBookingPayload) => {
  const res = await axiosPublicBookingService.post(
    "/users/requests/org-bookings",
    payload
  );
  return res.data;
};
