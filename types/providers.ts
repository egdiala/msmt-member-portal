export interface FetchServiceProvidersQuery {
  q?: string;
  item_per_page?: string;
  page?: string;
  service_cat_id?: string; // for provider type
  service_offer_id?: string; // for service type
  user_id?: string;
  user_type?: "provider" | "payer";
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
  user_type: string;
  charge_from: number;
  provider_data: {
    name: string;
    avatar: string;
    user_type: string;
    account_type: string;
    user_id: string;
    specialty?: string;
    createdAt: string;
    industry_id?: string;
    industry?: string;
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
