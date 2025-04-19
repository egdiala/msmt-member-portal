import { axiosBookingService } from "../axios-instance";

const APPOINTMENT_BASE_URL = "users/members/appointments";

export const getAppointments = async (query: string) => {
  const res = await axiosBookingService.get(`${APPOINTMENT_BASE_URL}${query}`);
  return res.data;
};
