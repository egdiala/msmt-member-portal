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
  data: {
    question: string;
    sub_question?: string | string[];
    answer: string | string[];
  }[];
};

export interface FetchedQuestionsForQuestionnaireType {
  question: string;
  option?: string[];
  option_type?: string;
  has_child: boolean;
  child_question?: {
    question: string;
    option: string[];
    option_type: string;
    answer: string;
  }[];
}

export interface FetchedQuestionnaireSchemaType
  extends FetchedQuestionsForQuestionnaireType {
  answer: string | string[];
}

export interface BookOrgDetails {
  member_org_id: string;
  service_offer_id: string;
  tier_id: string;
  status: 0 | 1;
  org_data: {
    name: string;
    avatar: string;
    industry_id: string;
    org_id: string;
    industry_name: string;
  };
  member_first_name: string;
}

export type RescheduleAppointmentPayload = {
  appt_date: string;
  appt_time: string;
  time_zone: string;
};
