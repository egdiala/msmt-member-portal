import {
  BookingQuestionnaireType,
  BookSelfAppointmentType,
  RescheduleAppointmentPayload,
} from "@/types/booking";
import { axiosBookingService } from "../axios-instance";

export const bookSelfAppointment = async (data: BookSelfAppointmentType) => {
  const res = await axiosBookingService.post(
    "users/members/appointments",
    data
  );
  return res.data.data;
};

export const submitBookingQuestionnaire = async ({
  appointment_id,
  data,
}: BookingQuestionnaireType) => {
  const res = await axiosBookingService.patch(
    `users/members/appointments/${appointment_id}`,
    { data: data }
  );
  return res.data.data;
};

export const rescheduleAppointment = async (
  appointmentId: string,
  payload?: RescheduleAppointmentPayload,
  component: string = ""
) => {
  const res = await axiosBookingService.put(
    `users/members/appointments/${appointmentId}`,
    payload,
    {
      params: component ? { component } : {},
    }
  );

  return res.data;
};
