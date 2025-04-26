import { BookSelfAppointmentType } from "@/types/booking";
import { axiosBookingService } from "../axios-instance";

export const bookSelfAppointment = async (data: BookSelfAppointmentType) => {
  const res = await axiosBookingService.post(
    "users/members/appointments",
    data
  );
  return res.data.data;
};
