import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Name of the admin session cookie set by the Go backend.
const SESSION_COOKIE = "neetimun_admin_session";

// Routing guard for the admin area. This is a UX convenience only — it checks
// the cookie's *presence* to avoid flashing a protected page. The backend is
// the real authority: it verifies the JWT and returns 401, at which point the
// dashboard redirects to the login page.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (pathname === "/admin/login") {
    if (hasSession) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Any other /admin route requires a session cookie.
  if (!hasSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
