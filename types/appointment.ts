export interface Appointment {
  id: string;
  date: string;
  time: string;
  consultant: string;
  amount: string;
  bookedBy: string;
  status: "Upcoming" | "Completed" | "Cancelled" | "Pending";
}

export interface FormOption {
  id: string;
  value: string;
  name: string;
}

export interface ChildQuestion {
  question: string;
  option: string[];
  option_type: string;
}

export interface FormQuestion {
  question: string;
  option?: string[];
  option_type?: string;
  has_child: boolean;
  child_question?: ChildQuestion[];
}

export type FormQuestions = FormQuestion[];

export interface CompleteOrgBookingPayload {
  booking_link: string;
  provider_id: string;
  service_offer_id: string;
  appt_date: string;
  appt_time: string;
  comm_mode: "video" | "audio";
  time_zone: string;
}

export interface RequestOrgBookingPayload {
  booking_link: string;
  otp_code: string;
}
