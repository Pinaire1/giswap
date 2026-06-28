import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { getAuthEnv, logAuthConfigIssues } from "@/lib/auth-config";

const authEnv = getAuthEnv();
logAuthConfigIssues();

const isProduction = process.env.NODE_ENV === "production";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: authEnv.googleClientId ?? "",
      clientSecret: authEnv.googleClientSecret ?? "",
      // Use Auth.js defaults for Google OIDC (PKCE). Do not override with
      // checks: ["state"] — both PKCE and state cookies fail the same way when
      // the OAuth callback domain does not match the sign-in domain.
    }),
  ],

  secret: authEnv.secret,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  trustHost: true,
  useSecureCookies: isProduction,
  debug: process.env.AUTH_DEBUG === "true",
});
