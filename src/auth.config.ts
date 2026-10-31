import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET || "f655da03b1d3ef9745ddbd5811c03e2c",
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.matricula = (user as any).matricula
        token.serie = (user as any).serie
        token.curso = (user as any).curso
        token.isCefet = (user as any).isCefet
        token.status = (user as any).status
      }

      // Atualização em tempo real quando o cliente chama update({ serie, curso })
      if (trigger === "update" && session) {
        if (session.serie) token.serie = session.serie
        if (session.curso) token.curso = session.curso
        if (session.isCefet !== undefined) token.isCefet = session.isCefet
        if (session.user?.serie) token.serie = session.user.serie
        if (session.user?.curso) token.curso = session.user.curso
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        const u = session.user as any
        u.id = token.id
        u.role = token.role
        u.matricula = token.matricula
        u.serie = token.serie
        u.curso = token.curso
        u.isCefet = token.isCefet
        u.status = token.status
      }
      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig
