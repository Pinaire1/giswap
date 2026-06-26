import { auth } from "@/auth";
import { isAdmin } from "@/lib/admin";
import { requireAuthSecret } from "@/lib/auth-secret";
import { NextResponse } from "next/server";

export default auth((req) => {
  requireAuthSecret();

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!req.auth?.user?.email || !isAdmin(req.auth.user.email)) {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
    return;
  }

  if (!req.auth) {
    const login = new URL("/login", req.nextUrl.origin);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile",
    "/profile/:path*",
    "/listings/new",
    "/listings/:id/edit",
    "/admin/:path*",
  ],
};
