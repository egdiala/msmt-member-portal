import { AppointmentType } from "@/types/appointment";
import { axiosBookingService } from "../axios-instance";

const APPOINTMENT_BASE_URL = "users/members/appointments";

export const getAppointments = async (
  query: string
): Promise<{ data: AppointmentType[] }> => {
  const res = await axiosBookingService.get(`${APPOINTMENT_BASE_URL}${query}`);
  return res.data;
};
