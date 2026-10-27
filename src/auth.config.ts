import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET || "f655da03b1d3ef9745ddbd5811c03e2c",
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.matricula = (user as any).matricula
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).matricula = token.matricula;
      }
      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig
