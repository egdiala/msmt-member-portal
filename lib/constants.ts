import { type ChartConfig } from "@/components/ui/chart";

export const NAV_ITEMS = [
  { id: 1, name: "Dashboard", href: "/home" },
  { id: 2, name: "Appointments", href: "/appointments" },
  { id: 3, name: "Wallet", href: "/wallet" },
  { id: 4, name: "Family & Friends", href: "/family-and-friends" },
  { id: 5, name: "Notifications", href: "/notifications" },
  { id: 6, name: "Profile", href: "/profile" },
];

export const COLORS = ["#DD2418", "#0AA571"];

export const CHART_CONFIG = {
  desktop: {
    label: "Family",
    color: "#DD2418",
  },
  mobile: {
    label: "Friends",
    color: "#0AA571",
  },
} satisfies ChartConfig;

export const NOTIFICATION_TABLE_HEADERS = [
  { key: "date_and_time_added", value: "Date & Time Added" },
  { key: "message", value: "Message" },
];

export const WALLET_TABLE_HEADERS = [
  { key: "date_and_time", value: "Date & Time" },
  { key: "description", value: "Description" },
  { key: "amount", value: "Amount" },
  { key: "type", value: "Type" },
  { key: "status", value: "Status" },
];

export const TRANSACTIONS_FILTER_DATE_OPTIONS = [
  { id: "date-1", name: "Today", value: "today" },
  { id: "date-2", name: "This Month", value: "this-month" },
  { id: "date-3", name: "All Time", value: "all-time" },
  { id: "date-4", name: "Custom Range", value: "custom-range" },
];

export const TRANSACTIONS_FILTER_TYPE_OPTIONS = [
  { id: "type-1", name: "Debit", value: "debit" },
  { id: "type-2", name: "Credit", value: "credit" },
  { id: "type-3", name: "All", value: "" },
];

export const TRANSACTIONS_FILTER_STATUS_OPTIONS = [
  { id: "status-1", name: "Failed", value: "failed" },
  { id: "status-2", name: "Successful", value: "successful" },
  { id: "status-3", name: "All", value: "" },
];

export const FAMILY_AND_FRIENDS_TABLE_HEADERS = [
  { key: "date_and_time", value: "Date & Time" },
  { key: "name", value: "Name" },
  { key: "email", value: "Email address" },
  { key: "relationship", value: "Relationship" },
];

export const FAMILY_AND_FRIENDS_APPOINTMENTS_TABLE_HEADERS = [
  { key: "date_and_time", value: "Date & Time" },
  { key: "consultant", value: "Consultant" },
  { key: "booked_by", value: "Booked By" },
  { key: "status", value: "Status" },
];

export const APPLICATIONS_FILTER_STATUS_OPTIONS = [
  { id: "status-1", name: "Upcoming", value: "upcoming" },
  { id: "status-2", name: "Pending", value: "pending" },
  { id: "status-3", name: "Completed", value: "completed" },
  { id: "status-4", name: "Canceled", value: "canceled" },
];

export const PROVIDERS_TABLE_HEADERS = [
  { key: "name", value: "Name" },
  { key: "specialty", value: "Specialty" },
  { key: "rating", value: "Rating" },
  { key: "type", value: "Type" },
  { key: "charge_from", value: "Charge From" },
];

export const TRANSACTION_STATUS_ENUM: Record<string, string> = {
  successful: "1",
  failed: "2",
};

export const TRANSACTION_TYPE_ENUM: Record<string, string> = {
  credit: "1",
  debit: "2",
};

export const BLUR_VARIANTS = {
  initial: { opacity: 0, filter: "blur(4px)" },
  enter: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(4px)" },
};

export const PROVIDER_FILTER_KEY_MATCH: Record<string, string> = {
  appt_date: "Appointment Date",
  time_zone: "Time Zone",
  user_type: "Provider Type",
  service_offer_id: "Specific Service",
  amount: "Price Range",
  gender: "Gender",
  language: "Language",
  religion: "Religion",
  comm_mode: "Communication Preference",
};
