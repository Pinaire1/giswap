import type { NextAuthConfig } from "next-auth";

// Lightweight auth config for proxy/middleware — no Prisma or database imports.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  providers: [],
} satisfies NextAuthConfig;
