import { type ChartConfig } from "@/components/ui/chart";
import {
  APPOINTMENTS,
  DASHBOARD,
  FAMILY_AND_FRIENDS,
  NOTIFICATIONS,
  PROFILE,
  WALLET,
} from "./routes";

export const NAV_ITEMS = [
  { id: 1, name: "Dashboard", href: DASHBOARD },
  { id: 2, name: "Appointments", href: APPOINTMENTS },
  { id: 3, name: "Wallet", href: WALLET },
  { id: 4, name: "Family & Friends", href: FAMILY_AND_FRIENDS },
  { id: 5, name: "Notifications", href: NOTIFICATIONS },
  { id: 6, name: "Profile", href: PROFILE },
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
