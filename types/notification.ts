export type NotificationQueryType = {
  status?: "0" | "1"; // 0=Unread | 1=Read
  item_per_page?: string;
  page?: string;
  component?: string;
};

export interface NotificationsCount {
  total: number;
}