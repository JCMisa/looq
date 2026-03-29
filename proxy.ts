import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/api/webhooks(.*)",
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, orgId, redirectToSignIn } = await auth();

  const url = new URL(req.url);
  const isSyncing = url.searchParams.get("sync") === "true"; // Check for our flag

  // 1. If not logged in and trying to access a private route, force sign-in
  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // 2. If logged in, check if they need onboarding
  if (userId && !isPublicRoute(req)) {
    const universityId = sessionClaims?.metadata?.university_id;

    /**
     * BRIDGING THE GAP:
     * If 'universityId' exists in metadata (from your DB), they are good.
     * If 'orgId' exists, they just created/joined a Clerk Org (Admin/Teacher),
     * so we trust they are onboarded even if the webhook metadata hasn't synced to the cookie yet.
     */
    const isUserOnboarded = !!universityId || !!orgId || isSyncing;

    // If they aren't onboarded and aren't already on the onboarding page, send them there
    if (!isUserOnboarded && !isOnboardingRoute(req)) {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }

    // If they ARE onboarded but are trying to go to onboarding, send them to dashboard
    if (isUserOnboarded && isOnboardingRoute(req)) {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
