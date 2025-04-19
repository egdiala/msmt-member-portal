export type NotificationQueryType = {
  status?: "0" | "1"; // 0=Unread | 1=Read
  item_per_page?: string;
  page?: string;
  component?: string;
};

export type NotificationData = {
  appointment_id: string;
};

export type Notification = {
  user_id: string;
  user_type: "member" | string;
  subject: string;
  body: string;
  status: number;
  data: NotificationData;
  createdAt: string;
  updatedAt: string;
  notification_id: string;
};

export type NotificationList = Notification[] & { total: number };
