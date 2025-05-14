import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/reset-password",
  "/set-password",
  "/verify-email",
];

const publicSessionRoutes = [
  "/start-session",
  "/verify-booking",
  "/complete-booking",
  "/providers",
]

export function middleware(request: NextRequest) {
  // Clone the request URL for modifications
  const url = request.nextUrl.clone();
  const { pathname, search } = url;

  // Debug info
  console.log(`[Middleware] Path: ${pathname}`);
  console.log(`[Middleware] Cookies:`, request.cookies.getAll());

  // Check authentication status via cookie
  const isAuthenticated = request.cookies.has("authToken");
  // console.log(`[Middleware] isAuthenticated:`, isAuthenticated);

  try {
    // CASE 1: Authenticated user trying to access public routes (sign-in, etc.)
    if (
      isAuthenticated &&
      publicRoutes.some((route) => pathname.startsWith(route) || pathname === "/") && !publicSessionRoutes.some((route) => pathname.startsWith(route))
    ) {
      // console.log(
      //   `[Middleware] Authenticated user trying to access public route`
      // );

      // Get referer (where the user came from)
      const referer = request.headers.get("referer");
      // console.log(`[Middleware] Referer:`, referer);

      // Create response redirecting to home
      const response = NextResponse.redirect(new URL("/home", url.origin));

      // Add referer to a cookie so it can be read on the client side
      if (referer) {
        try {
          const refererUrl = new URL(referer);
          const refererPath = refererUrl.pathname;

          // Only store internal paths that aren't the current path
          if (refererPath !== pathname && refererPath.startsWith("/")) {
            response.cookies.set("refererPath", refererPath, {
              path: "/",
              maxAge: 60, // Short-lived - 60 seconds
              httpOnly: false, // Make accessible to client
              sameSite: "lax",
            });
          }
        } catch (e) {
          console.error("[Middleware] Error parsing referer:", e);
        }
      }

      return response;
    }

    // CASE 2: Unauthenticated user trying to access protected routes
    const isPublicRoute = [...publicRoutes, ...publicSessionRoutes].some((route) =>
      pathname.startsWith(route)
    );
    const isNextInternal =
      pathname.startsWith("/_next") || pathname.includes(".")

    if (!isAuthenticated && !isPublicRoute && !isNextInternal && pathname === "/") {
      // console.log(
      //   `[Middleware] Unauthenticated user trying to access protected route`
      // );
      const redirectUrl = new URL("/sign-in", url.origin);
      // Store the current URL as a query param for possible redirect after login
      redirectUrl.searchParams.set("callbackUrl", `/home${search || ""}`)

      return NextResponse.redirect(redirectUrl);
    }

    // Otherwise, continue with the request
    // console.log(`[Middleware] Continuing with request`);
    return NextResponse.next();
  } catch (error) {
    // console.error(`[Middleware] Error:`, error);
    // In case of error, allow the request to proceed to avoid blocking navigation
    return NextResponse.next();
  }
}

export const config = {
  // Match all routes except for api routes
  matcher: ["/((?!api).*)"],
};
