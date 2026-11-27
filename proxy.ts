import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const sessionCookie = getSessionCookie(req);
  const pathname = req.nextUrl.pathname;

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isProtectedRoute = pathname.startsWith("/dashboard");

  // Only redirect away from auth pages if the user has a session cookie AND
  // isn't coming from a signed-out state. Even better: check / verify if needed,
  // or avoid trapping users with stale cookies in a redirect loop.
  if (!sessionCookie && isProtectedRoute) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
