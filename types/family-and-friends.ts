export interface FetchFamilyAndFriendsQuery {
  item_per_page?: string;
  page?: string;
  component?: "count" | "count-status" | "count-stats" | "stats";
  q?: string;
  familyfriend_id?: string;
}

export type AddFamilyAndFriendsType = {
  first_name: string;
  last_name: string;
  email: string;
  relationship: string; // 1=family | 2=friend
};

export type UpdateFamilyAndFriendsStatus = {
  status: string;
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
}
