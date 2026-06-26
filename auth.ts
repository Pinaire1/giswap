import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { getAuthEnv, logAuthConfigIssues } from "@/lib/auth-config";

const authEnv = getAuthEnv();
logAuthConfigIssues();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: authEnv.googleClientId ?? "",
      clientSecret: authEnv.googleClientSecret ?? "",
      checks: ["state"],
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
});
