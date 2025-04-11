import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LoginResponse } from "@/types/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
