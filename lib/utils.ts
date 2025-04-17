import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LoginResponse } from "@/types/auth";
import { UpdateProfileType } from "@/types/profile";
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