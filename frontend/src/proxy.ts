import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "appnix_access_token";

function tokenRole(token: string | undefined): string | undefined {
  if (!token) return undefined;
  try {
    const payload = token.split(".")[1];
    if (!payload) return undefined;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized)).role;
  } catch {
    return undefined;
  }
}

/**
 * UX route gate only. The Nest API remains the authorization authority and
 * verifies the bearer token before every protected operation; the JWT role is
 * decoded here solely to prevent non-admin navigation to the admin UI.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (pathname.startsWith("/super-admin") && tokenRole(token) !== "SUPER_ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/super-admin/:path*", "/dashboard/:path*", "/workspace/:path*"],
};
