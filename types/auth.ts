export type InitRegisterType = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  dob: string; // Must be +18. Format is YYYY-MM-DD
};

export type CompleteRegisterType = {
  email: string;
  otp: string;
};

export interface LoginResponse {
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
  deletion_data: {
    status: number;
  };
  marital_status: string;
  firebase_token: string;
  nickname: string;
  religion: string;
  referral_code: string;
  preferred_lan: string;
  questionnaire: [];
  contact_person: Record<PropertyKey, any>;
  createdAt: Date | string;
  updatedAt: Date | string;
  __v: number;
  user_id: string;
  token: string;
}

export type LoginType = {
  email: string;
  password: string;
};

export interface ChangePasswordType {
  new_password: string;
  old_password: string;
}
