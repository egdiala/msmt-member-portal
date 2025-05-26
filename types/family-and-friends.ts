export interface FetchFamilyAndFriendsQuery {
  item_per_page?: string;
  page?: string;
  component?: "count" | "count-relationship" | "payment-option";
  q?: string;
  familyfriend_id?: string;
}

export type AddFamilyAndFriendsType = {
  first_name: string;
  last_name: string;
  email: string;
  relationship: string; // 1=family | 2=friend
  gender: string;
  phone_number?: string;
};

export type UpdateFamilyOrFriendType = {
  first_name?: string;
  last_name?: string;
  relationship?: string; // 1=family | 2=friend
  gender?: string;
  phone_number?: string;
  familyfriend_id: string;
};

export type UpdateFamilyAndFriendsStatus = {
  status: string;
  reason: string;
  familyfriend_id: string;
};

export interface FetchedFamilyAndFriendType {
  createdAt: string;
  email: string;
  familyfriend_id: string;
  first_name: string;
  last_name: string;
  relationship: number;
  status: number;
  total_appointment: number;
  total_spent: number;
  updatedAt: string;
  user_id: string;
}

export interface FetchedFamilyAndFriendCountType {
  _id: string | null;
  total: number;
}

export interface FetchedFamilyAndFriendStats {
  total_family: number;
  total_friend: number;
  _id: string | null;
}

export interface FetchedSingleFamilyOrFriendType {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  relationship: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  familyfriend_id: string;
  total_appointment: number;
  total_spent: number;
  gender: string;
  phone_number: string;
}

export interface FetchedPaymentOptionFamilyType {
  familyfriend_id: string;
  familyfriend_name: string;
}
