export type NotificationQueryType = {
  status?: "0" | "1"; // 0=Unread | 1=Read
  item_per_page?: string;
  page?: string;
  component?: string;
};

export interface NotificationsCount {
  total: number;
}

export interface FetchedNotification {
    user_id: string;
    user_type: string;
    subject: string;
    body: string;
    status: 0 | 1;
    data: {
        appointment_id: string;
    };
    createdAt: string | Date;
    updatedAt: string | Date;
    notification_id: string;
}