export interface Appointment {
  id: string;
  date: string;
  appt_date: string;
  appt_time: string;
  consultant: string;
  amount: string;
  serviceOffered: string;
  status: string;
}

export interface FormOption {
  id: string;
  value: string;
  name: string;
}

export type AppointmentType = {
  member_id: string;
  provider_id: string;
  service_offer_id: string;
  service_cat_id: string;
  booking_ref: string;
  booking_link: string;
  comm_mode: "audio" | "video" | string;
  member_questionnaire: any[];
  appt_schedule: string;
  appt_date: string;
  appt_day: number;
  appt_time: number;
  amount: number;
  refunded_amount: number;
  status: number;
  status_cancel: number;
  notify_count: number;
  member_gender: "male" | "female" | string;
  charge_status: number;
  payment_option: number;
  meeting_id: string;
  member_token: string;
  provider_token: string;
  systemdata_charge: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  provider_data: {
    name: string;
    avatar: string;
    email: string;
    service_cat_id: string;
    gender: "male" | "female" | string;
    user_id: string;
    specialty: string;
  };
  appointment_id: string;
  service_offer_name: string;
};

export interface GetAppointmentsQuery {
  status?: string;
  start_date?: string;
  end_date?: string;
  item_per_page?: string;
  page?: string;
  component?: string;
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

interface MemberQuestion {
  question: string;
  answer: string | string[];
  sub_question?: string;
}

interface ProviderData {
  name: string;
  avatar: string;
  email: string;
  service_cat_id: string;
  gender: string;
  user_id: string;
  isfav_provider: boolean;
  specialty: string;
}

export interface GetAppointmentIdType {
  member_id: string;
  provider_id: string;
  service_offer_id: string;
  service_cat_id: string;
  booking_ref: string;
  booking_link: string;
  payment_by: number;
  comm_mode: string;
  member_questionnaire: MemberQuestion[];
  appt_schedule: string;
  appt_date: string;
  appt_day: number;
  appt_time: number;
  amount: number;
  refunded_amount: number;
  status: number;
  status_cancel: number;
  notify_count: number;
  member_gender: string;
  charge_status: number;
  payment_option: number;
  meeting_id: string;
  member_token: string;
  provider_token: string;
  systemdata_charge: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  provider_data: ProviderData;
  rating_data: any[];
  appointment_id: string;
  service_offer_name: string;
  org_payer_id?: string;
}

export interface SessionRatingPayload {
  rating: string;
  provider_on_time: string;
  appointment_id: string;
  comment?: string;
}
