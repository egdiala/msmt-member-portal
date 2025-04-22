export interface FetchServiceProvidersQuery {
  q?: string;
  item_per_page?: string;
  page?: string;
  service_cat_id?: string; // for provider type
  service_offer_id?: string; // for service type
  user_id?: string;
  user_type?: string; // provider | org
  gender?: string;
  religion?: string;
  amount?: string;
  language?: string;
  comm_mode?: string; // video | audio
  appt_date?: string; // Appointment date / availability date. It is in format YYYY-MM-DD
  time_zone?: string; // The user's device time zone. Required when there's appt_date
  component?: string; // count | count-status
}

export interface FetchOrganizationProvidersQuery {
  item_per_page?: string;
  page?: string;
  org_id: string;
  tier_id?: string;
  service_cat_id?: string; // for provider type
  service_offer_id?: string; // for service type
  gender?: string;
  religion?: string;
  language?: string;
  comm_mode?: string; // video | audio
  appt_date?: string; // Appointment date / availability date. It is in format YYYY-MM-DD
  time_zone?: string; // The user's device time zone. Required when there's appt_date
  component?: string; // count | count-status
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
    rating?: string;
  };
  industry_data?: {
    _id: string;
    name: string;
  };
}

export interface FetchedServiceProvidersCountType {
  _id: string | null;
  total: number;
}
