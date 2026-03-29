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
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // 1. If not logged in and trying to access a private route, force sign-in
  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // 2. If logged in, check if they need onboarding
  if (userId && !isPublicRoute(req)) {
    const universityId = sessionClaims?.metadata?.university_id;

    // If they have no university and aren't already on the onboarding page, send them there
    if (!universityId && !isOnboardingRoute(req)) {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }

    // If they HAVE a university but are trying to go to onboarding, send them to dashboard
    if (universityId && isOnboardingRoute(req)) {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
