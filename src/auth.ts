import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { authConfig } from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Malba CEFET-MG",
      credentials: {
        matricula: { label: "Matrícula/CPF", type: "text" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        const matricula = (credentials?.matricula as string)?.trim()
        const password = credentials?.password as string

        if (!matricula || !password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { matricula }
        })

        if (!user) {
          return null
        }

        // Suporta tanto hash bcrypt ($2a$, $2b$, $2y$) quanto texto direto
        // (caso um usuário seja adicionado manualmente pelo painel Tables da Neon)
        const isBcryptHash = user.passwordHash.startsWith("$2")
        const isPasswordValid = isBcryptHash
          ? await bcrypt.compare(password, user.passwordHash)
          : password === user.passwordHash

        if (!isPasswordValid) {
          return null
        }

        // Migração automática transparente: se a conta ainda estava em texto puro (legada),
        // atualiza imediatamente para hash Bcrypt com salt no banco de dados.
        if (!isBcryptHash) {
          try {
            const upgradedHash = await bcrypt.hash(password, 10)
            await prisma.user.update({
              where: { id: user.id },
              data: { passwordHash: upgradedHash },
            })
          } catch (upgradeErr) {
            console.error("Falha ao atualizar hash bcrypt de usuário legado:", upgradeErr)
          }
        }

        if (user.status === "pending") {
          throw new Error("PENDING_APPROVAL")
        }

        return {
          id: user.id,
          name: user.name,
          role: user.role,
          matricula: user.matricula,
          serie: user.serie,
          curso: user.curso,
          isCefet: user.isCefet,
          status: user.status,
        }
      }
    })
  ]
})
