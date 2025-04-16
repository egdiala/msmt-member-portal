export type NotificationQueryType = {
  status?: string;
  item_per_page?: string;
  page?: string;
  component?: string;
};

export interface NotificationsCount {
  total: number;
}