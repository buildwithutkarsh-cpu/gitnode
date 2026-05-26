// lib/auth/config.ts

import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

function generateUsername(name: string | null | undefined, email: string | null | undefined): string {
  const base =
    name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") ||
    email?.split("@")[0] ||
    "user";
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

export const authConfig: NextAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" && profile) {
        return true;
      }
      return false;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.username && session.user) {
        session.user.username = token.username as string;
      }
      return session;
    },

    async jwt({ token, user, account, profile }) {
      if (account?.provider === "github" && profile) {
        const githubProfile = profile as {
          login?: string;
          name?: string;
          email?: string;
        };
        token.username =
          githubProfile.login ??
          generateUsername(githubProfile.name, githubProfile.email);
      }
      return token;
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/repositories") ||
        nextUrl.pathname.startsWith("/profile") ||
        nextUrl.pathname.startsWith("/settings");

      if (isProtectedRoute && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }
      return true;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET!,
  trustHost: true,
};
