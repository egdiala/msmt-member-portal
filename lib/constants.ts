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
