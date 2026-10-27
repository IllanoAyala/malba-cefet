import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || "f655da03b1d3ef9745ddbd5811c03e2c",
  providers: [
    CredentialsProvider({
      name: "SIGAA CEFET-MG",
      credentials: {
        matricula: { label: "Matrícula/CPF", type: "text" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.matricula || !credentials?.password) {
          return null
        }

        // Simulação do Banco do SIGAA
        // Em um cenário real, aqui seria a validação contra o LDAP/banco usando Prisma
        // Para o protótipo: testaremos com dois usuários fictícios
        if (credentials.matricula === "professor" && credentials.password === "cefet123") {
          return { id: "1", name: "Prof. Dr. Emerson Costa", role: "professor", matricula: "professor" }
        }

        if (credentials.matricula === "aluno" && credentials.password === "cefet123") {
          return { id: "2", name: "Illano Ayala", role: "aluno", matricula: "aluno" }
        }

        return null
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.matricula = (user as any).matricula
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).role = token.role;
        (session.user as any).matricula = token.matricula;
      }
      return session
    }
  }
})
