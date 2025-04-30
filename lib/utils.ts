import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LoginResponse } from "@/types/auth";
import { UpdateProfileType } from "@/types/profile";
import { format, isToday, parseISO } from "date-fns";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gets token expiration information
 * @returns Object with expirationDate, isExpired, and timeRemaining in minutes, or null if no token
 */
export const getTokenExpiration = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const decryptedToken = JSON.parse(atob(token.split(".")[1]));
    const expirationDate = new Date(decryptedToken?.exp * 1000);
    const now = new Date();
    const isExpired = expirationDate < now;

    // Calculate time remaining in minutes
    const timeRemaining = isExpired
      ? 0
      : Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 60));

    return {
      expirationDate,
      isExpired,
      timeRemaining,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getAdminData = () => {
  const user = JSON.parse(
    localStorage.getItem("user") as string
  ) as LoginResponse;

  return user;
};

export const createQueryString = (queryObject: Record<string, any>): string => {
  const queryString = Object.entries(queryObject)
    .filter(
      // eslint-disable-next-line
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");
  return queryString ? `?${queryString}` : "";
};

export function hasCompletedBasicProfile(data?: UpdateProfileType): boolean {
  if (!data) return false;

  const {
    phone_number,
    gender,
    marital_status,
    origin_country,
    preferred_lan,
  } = data;

  return (
    Boolean(phone_number?.trim()) &&
    Boolean(gender?.trim()) &&
    Boolean(marital_status?.trim()) &&
    Boolean(origin_country?.trim()) &&
    Boolean(preferred_lan?.trim())
  );
}

export const formatTableDate = (date: string) => {
  const parsedDate = parseISO(date);

  if (isToday(parsedDate)) {
    return `Today • ${format(parsedDate, "h:mmaaa")}`;
  }

  return format(parsedDate, "MMM d • h:mmaaa");
};

// 1. getQualityScore
interface Stats {
  packetsLost: number;
  totalPackets: number;
  jitter: number;
  rtt: number;
}

export function getQualityScore(stats: Stats): number {
  const packetLossPercent = stats.totalPackets
    ? stats.packetsLost / stats.totalPackets
    : 0;
  const jitter = stats.jitter;
  const rtt = stats.rtt;
  let score = 100;
  score -= packetLossPercent * 50 > 50 ? 50 : packetLossPercent * 50;
  score -= ((jitter / 30) * 25 > 25 ? 25 : (jitter / 30) * 25) || 0;
  score -= ((rtt / 300) * 25 > 25 ? 25 : (rtt / 300) * 25) || 0;
  return score / 10;
}

export function formatAMPM(date: Date): string {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? "0" + minutes : minutes.toString();
  const strTime = `${hours}:${minutesStr} ${ampm}`;
  return strTime;
}

export const trimSnackBarText = (text: string = ""): string => {
  const maxLength = 52;
  return text.length > maxLength ? `${text.substr(0, maxLength - 5)}...` : text;
};

export const json_verify = (s: string): boolean => {
  try {
    JSON.parse(s);
    return true;
  } catch (e) {
    return false;
  }
};

export const nameTructed = (name: string, tructedLength: number): string => {
  if (name?.length > tructedLength) {
    if (tructedLength === 15) {
      return `${name.substr(0, 12)}...`;
    } else {
      return `${name.substr(0, tructedLength)}...`;
    }
  } else {
    return name;
  }
};

export const sideBarModes = {
  PARTICIPANTS: "PARTICIPANTS",
  CHAT: "CHAT",
} as const; // 'as const' for strict typing

export type SideBarMode = keyof typeof sideBarModes;

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null;

  return function executedFunction(this: unknown, ...args: Parameters<T>) {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}
