import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = createRouteMatcher([
  // Public routes that don't require authentication
  "/",
  "/legal",
  // Static files and Next.js internals
  "/_next(.*)",
  "/favicon.ico",
  "/api(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!publicRoutes(request)) {
    const signedIn = await auth.protect();
    if (!signedIn) {
      return NextResponse.redirect(new URL("", request.url));
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
