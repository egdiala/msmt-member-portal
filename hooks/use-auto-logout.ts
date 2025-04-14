"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getTokenExpiration } from "@/lib/utils";
import Cookies from "js-cookie";

/**
 * Hook to automatically logout the user when their JWT token expires
 * @param checkInterval Time in milliseconds between token checks (default: 60000 ms = 1 minute)
 */
export function useAutoLogout(checkInterval = 60000) {
  const router = useRouter();

  const logout = useCallback(() => {
    // Clear authentication data
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      Cookies.remove("authToken", { path: "/" });
    }
    
    // Redirect to sign-in
    router.replace("/sign-in");
  }, [router]);

  const checkTokenExpiration = useCallback(() => {
    try {
      // First check token existence and get expiration info
      const tokenInfo = getTokenExpiration();
      
      // If no token info (token doesn't exist or is invalid), logout
      if (!tokenInfo) {
        console.log("No valid token found, logging out");
        logout();
        return;
      }
      
      // Log token expiration info (for debugging)
      if (process.env.NODE_ENV === 'development') {
        console.log(`Token expires: ${tokenInfo.expirationDate.toLocaleString()}`);
        console.log(`Time remaining: ${tokenInfo.timeRemaining} minutes`);
      }
      
      // If token is expired, logout
      if (tokenInfo.isExpired) {
        console.log("Token expired, logging out");
        logout();
      }
    } catch (error) {
      // If there's any error (e.g., malformed token), also logout
      console.error("Error checking token:", error);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    // Run the check only on the client side
    if (typeof window === "undefined") return;
    
    // Check immediately on mount
    checkTokenExpiration();
    
    // Also set up an interval to periodically check
    const intervalId = setInterval(checkTokenExpiration, checkInterval);
    
    return () => clearInterval(intervalId);
  }, [checkTokenExpiration, checkInterval]);
} 