import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LoginResponse } from "@/types/auth";

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

export const isAuthenticated = (): boolean => {
  let isExpired = true;

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (!token) {
      return false;
    }

    const decryptedToken = JSON.parse(atob(token.split(".")[1]));
    const expirationDate = new Date(decryptedToken?.exp * 1000);
    isExpired = expirationDate < new Date();
    return !isExpired;
  }

  return isExpired;
};

export const getAdminData = () => {
  const user = JSON.parse(
    localStorage.getItem("user") as string
  ) as LoginResponse;

  return user;
};

/* =====================
 * FORMAT QUERY OBJECTS TO STRING FOR URL
 * ===================== */

function objectToQuery(obj: Record<string, any>) {
  if (!obj) {
    throw Error("objectToQuery expects an object");
  }
  return Object.entries(obj).reduce((query, cur) => {
    const [key, value] = cur;
    if (Array.isArray(value)) {
      query.append(key, `[${value}]`);
    } else if (value !== "") {
      query.set(key, value);
    }
    return query;
  }, new URLSearchParams());
}

export function getQueryToString(query: Record<string, any>) {
  if (!query) {
    return objectToQuery({}).toString();
  }
  return objectToQuery(query).toString();
}
