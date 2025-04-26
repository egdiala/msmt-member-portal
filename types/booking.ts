export type BookSelfAppointmentType = {
  provider_id: string;
  service_offer_id: string;
  appt_date: string;
  appt_time: string;
  comm_mode: "video" | "audio";
  time_zone: string;
  org_provider_id?: string;
  org_payer_id?: string;
};
