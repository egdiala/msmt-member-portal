type ContactPersonType = {
  name?: string;
  email?: string;
  relationship?: string;
  phone_number?: string;
  phone_prefix?: string;
};

export type UpdateProfileType = {
  first_name?: string;
  last_name?: string;
  avatar?: string;
  phone_number?: string;
  phone_prefix?: string;
  gender?: string;
  religion?: string;
  origin_state?: string;
  origin_country?: string;
  residence_country?: string;
  residence_state?: string;
  residence_address?: string;
  preferred_lan?: string;
  nickname?: string;
  marital_status?: string;
  contact_person?: ContactPersonType;
};
type DeletionData = {
  status: number;
};

export type RequestVariableComponent =
  | "religion-list"
  | "marital-status"
  | "country-list"
  | "preferred-lan"
  | "service-offering"
  | "service-category"
  | "booking-prices"
  | "booking-question"
  | "bank-list";

export type UserProfileType = {
  first_name: string;
  last_name: string;
  avatar: string;
  email: string;
  phone_number: string;
  phone_prefix: string;
  phone_status: number;
  email_status: number;
  gender: string;
  dob: string;
  residence_address: string;
  residence_state: string;
  residence_country: string;
  origin_state: string;
  origin_country: string;
  origin_lga: string;
  status: number;
  deletion_data: DeletionData;
  marital_status: string;
  nickname: string;
  religion: string;
  referral_code: string;
  preferred_lan: string;
  questionnaire: any[];
  contact_person: ContactPersonType;
  createdAt: string;
  updatedAt: string;
  user_id: string;
  org_data: {
    avatar: string;
    industry_name: string;
    name: string;
    org_id: string;
    tier_id: string;
  }[];
  funding_unitrate: number;
};
