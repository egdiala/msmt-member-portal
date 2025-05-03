import {
  BookingQuestionnaireType,
  BookSelfAppointmentType,
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
