import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/sign-in", "/register", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the token from the cookie
  const token = request.cookies.get("authToken")?.value;
  const isAuthenticated = !!token;
  
  // If user is authenticated and tries to access an unauthenticated route,
  // rewrite to home page instead of redirecting to preserve browser history
  if (isAuthenticated && publicRoutes.some(route => pathname.startsWith(route))) {
    // Create a new URL for the /home path
    const homeUrl = new URL("/home", request.url);
    
    // Add a response header to instruct the client to replace the history entry
    const response = NextResponse.redirect(homeUrl);
    response.headers.set("X-Middleware-Rewrite", "true");
    response.headers.set("X-History-Replace", "true");
    
    // Return the response with headers indicating this should replace history
    return response;
  }
  
  // If user is not authenticated and tries to access a protected route, redirect to sign-in
  if (!isAuthenticated && 
      !publicRoutes.some(route => pathname.startsWith(route)) && 
      !pathname.startsWith("/_next") && 
      !pathname.includes(".")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // Match all routes except for static files, api routes, and _next (Next.js internal)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}; 