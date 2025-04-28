export type BookSelfAppointmentType = {
  provider_id: string;
  service_offer_id: string;
  appt_date: string;
  appt_time: string;
  comm_mode: "video" | "audio";
  time_zone: string;
  org_provider_id?: string;
  org_payer_id?: string;
  familyuser_id?: string;
};

export type BookingQuestionnaireType = {
  appointment_id: string;
  data: any;
};

export interface FetchedQuestionsForQuestionnaireType {
  question: string;
  option: string[];
  option_type?: "radio" | "checkbox";
  has_child: boolean;
  child_question?: {
    question: string;
    option: string[];
    option_type: string;
  }[];
}
