export interface FetchServiceProvidersQuery {
  q?: string;
  item_per_page?: string;
  page?: string;
  service_cat_id?: string; // for provider type
  service_offer_id?: string; // for service type
  user_id?: string;
  user_type?: "provider" | "org";
  account_service_type?: "provider" | "payer";
  gender?: string;
  religion?: string;
  amount?: string;
  language?: string;
  comm_mode?: "video" | "audio";
  appt_date?: string; // Appointment date / availability date. It is in format YYYY-MM-DD
  time_zone?: string; // The user's device time zone. Required when there's appt_date
  component?: "count";
}

export interface FetchOrganizationProvidersQuery {
  q?: string;
  item_per_page?: string;
  page?: string;
  org_id: string;
  tier_id?: string;
  service_cat_id?: string; // for provider type
  service_offer_id?: string; // for service type
  gender?: string;
  religion?: string;
  language?: string;
  comm_mode?: "video" | "audio";
  appt_date?: string; // Appointment date / availability date. It is in format YYYY-MM-DD
  time_zone?: string; // The user's device time zone. Required when there's appt_date
  component?: "count";
}

export interface FetchProviderScheduleQuery {
  provider_id?: string;
  appt_date?: string; // Appointment date / availability date. It is in format YYYY-MM-DD
  time_zone?: string; // The user's device time zone. Required when there's appt_date
}

export interface FetchedServiceProvidersType {
  charge_from: number;
  provider_data: {
    name: string;
    avatar: string;
    user_type: "org" | "provider";
    account_type: "individual" | "payer";
    account_service_type: "provider" | "payer";
    user_id: string;
    specialty?: string;
    createdAt: string;
    industry_id?: string;
    industry?: string;
    industry_name?: string;
    rating?: string;
  };
}

export interface FetchedServiceProvidersCountType {
  _id: string | null;
  total: number;
}

export interface FetchOrganizationProvider {
  name: string;
  avatar: string;
  industry_id: string;
  comm_mode: string[];
  user_id: string;
  industry_data: {
    _id: string;
    name: string;
  };
  completed_appointment: number;
  charge_from: number;
  service_data: {
    service_offer_id: string;
    amount: number;
    name: string;
  }[];
  specialty?: string;
}

export interface FetchSingleProvider {
  name: string;
  avatar: string;
  comm_mode: Array<"audio" | "video">;
  user_id: string;
  rating_data: {
    _id: null;
    rating: number;
  };
  completed_appointment: number;
  charge_from: number;
  service_data: Array<{
    service_offer_id: string;
    amount: number;
    name: string;
  }>;
  specialty: string;
  total_provider: number;
  total_member: number;
  rating: number;
  total_certification: number;
  total_publication: number;
  service_start_year: number;
  special_training_data: Array<{
    name: string;
    year: number;
  }>;
}

export interface FetchedSingleOrganizationProviders {
  org_id: string;
  provider_id: string;
  tier_id: string;
  status: number;
  createdAt: string;
  suspend_reason: string;
  suspended_by: string;
  updatedAt: string;
  user_data: {
    _id: string;
    name: string;
    avatar: string;
    service_cat_id: string;
    specialty: string;
    charge_from: number;
  };
  rating: number;
}
