export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/profile/:path*", "/dashboard/:path*", "/listings/new"],
};
