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
    label: "Male",
    color: "#DD2418",
  },
  mobile: {
    label: "Femal",
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
