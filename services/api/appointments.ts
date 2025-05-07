import {
  AppointmentType,
  GetAppointmentIdType,
  SessionRatingPayload,
} from "@/types/appointment";
import { axiosBookingService } from "../axios-instance";

const APPOINTMENT_BASE_URL = "users/members/appointments";

export const getAppointments = async (
  query: string
): Promise<{ data: AppointmentType[] }> => {
  const res = await axiosBookingService.get(`${APPOINTMENT_BASE_URL}${query}`);
  return res.data;
};

export const getAppointmentsById = async (
  id: string
): Promise<{ data: GetAppointmentIdType }> => {
  const res = await axiosBookingService.get(`${APPOINTMENT_BASE_URL}/${id}`);
  return res.data;
};

export const submitSessionRating = async (payload: SessionRatingPayload) => {
  const res = await axiosBookingService.post(
    "/users/members/session-ratings",
    payload
  );
  return res.data;
};

export const cancelAppointment = async ({
  component,
  appointment_id,
}: {
  component?: string;
  appointment_id: string;
}) => {
  const res = await axiosBookingService.delete(
    `/users/members/appointments/${appointment_id}`,
    {
      data: {
        ...(component && { component: component }),
      },
    }
  );
  return res.data;
};
