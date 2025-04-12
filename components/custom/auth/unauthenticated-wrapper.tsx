"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

interface UnauthenticatedWrapperProps {
  children: ReactNode;
}

export function UnauthenticatedWrapper({ children }: UnauthenticatedWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = typeof window !== "undefined" && 
      (!!localStorage.getItem("token") || document.cookie.includes("authToken="));
    
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting away from unauthenticated area");
      
      // Priority 1: Check for callbackUrl in query params
      const callbackUrl = searchParams.get("callbackUrl");
      
      // Priority 2: Check for referer cookie set by middleware
      const refererCookie = Cookies.get("refererPath");
      
      // Priority 3: Check for referer in localStorage (from previous navigation)
      const storedReferer = localStorage.getItem("referer");
      
      // Remove the referer cookie as we're about to use it
      if (refererCookie) {
        Cookies.remove("refererPath", { path: "/" });
      }
      
      console.log("Available redirect destinations:", {
        callbackUrl,
        refererCookie,
        storedReferer
      });
      
      // Determine where to redirect based on available information
      if (callbackUrl && callbackUrl !== window.location.pathname) {
        console.log("Redirecting to callback URL:", callbackUrl);
        router.replace(callbackUrl);
      } else if (refererCookie && refererCookie !== window.location.pathname) {
        console.log("Redirecting to referer from cookie:", refererCookie);
        router.replace(refererCookie);
      } else if (storedReferer && storedReferer !== window.location.pathname) {
        console.log("Redirecting to stored referer:", storedReferer);
        localStorage.removeItem("referer"); // Clear after use
        router.replace(storedReferer);
      } else {
        // Default to home if no other destination is known
        console.log("No specific redirect destination, going to home");
        router.replace("/home");
      }
    }
  }, [router, searchParams]);
  
  return (
    <>{children}</>
  );
} 