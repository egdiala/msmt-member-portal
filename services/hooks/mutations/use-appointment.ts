import { useMutation } from "@tanstack/react-query";
import {
  completeOrgBooking,
  submitOrgBookingQuestionnaire,
  validateOrgBooking,
} from "@/services/api/appointment";
import { rescheduleAppointment } from "@/services/api/booking";
import { useQueryClient, InvalidateQueryFilters } from "@tanstack/react-query";
import {
  submitSessionRating,
  cancelAppointment,
} from "@/services/api/appointments";
import {
  CompleteOrgBookingPayload,
  SessionRatingPayload,
} from "@/types/appointment";
import { toast } from "sonner";
import {
  BookingQuestionnaireType,
  RescheduleAppointmentPayload,
} from "@/types/booking";

export const useCompleteOrgBooking = (fn?: (res: any) => void) => {
  return useMutation({
    mutationFn: (payload: CompleteOrgBookingPayload) =>
      completeOrgBooking(payload),
    onSuccess: (res: any) => {
      toast.success("Booking completed successfully!");
      fn?.(res);
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.msg || "Booking failed. Please try again."
      );
    },
  });
};

export const useRescheduleAppointment = (onSuccessFn?: (res: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      appointmentId,
      payload,
      component,
    }: {
      appointmentId: string;
      payload?: RescheduleAppointmentPayload;
      component?: string;
    }) => rescheduleAppointment(appointmentId, payload, component),
    onSuccess: (res) => {
      onSuccessFn?.(res);
      queryClient.invalidateQueries([
        "get-appointments",
      ] as InvalidateQueryFilters);
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.msg || "Rescheduling failed. Please try again."
      );
    },
  });
};

export const useSubmitOrgBookingQuestionnaire = (fn?: (res: any) => void) => {
  return useMutation({
    mutationFn: (payload: BookingQuestionnaireType) =>
      submitOrgBookingQuestionnaire(payload),
    onSuccess: (res: any) => {
      toast.success("Booking questionnaire has been successfully submitted!");
      fn?.(res);
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.msg || "Booking failed. Please try again."
      );
    },
  });
};

export const useValidateOrgBooking = (fn?: (res: any) => void) => {
  return useMutation({
    mutationFn: validateOrgBooking,
    onSuccess: (res: any) => {
      toast.success("Booking validated!");
      fn?.(res);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg);
    },
  });
};

export const useSubmitSessionRating = (
  onSuccessCallback?: (res: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SessionRatingPayload) => submitSessionRating(payload),
    onSuccess: (res: any) => {
      toast.success("Session review submitted!");
      queryClient.invalidateQueries([
        "get-appointments",
      ] as InvalidateQueryFilters);
      onSuccessCallback?.(res);
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.msg || "Failed to submit session rating."
      );
    },
  });
};

export const useCancelAppointment = (
  onSuccessCallback?: (res: any) => void
) => {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess: (res: any) => {
      // toast.success("Appointment cancelled successfully.");
      // queryClient.invalidateQueries([
      //   "get-appointments",
      // ] as InvalidateQueryFilters);
      onSuccessCallback?.(res);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Failed.");
    },
  });
};

export const useCancelAppointmentWithoutNotice = (
  onSuccessCallback?: (res: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess: (res: any) => {
      toast.success("Appointment cancelled successfully.");
      queryClient.invalidateQueries([
        "get-appointments",
      ] as InvalidateQueryFilters);
      onSuccessCallback?.(res);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "Failed to cancel appointment.");
    },
  });
};
