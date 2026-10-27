import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const initialUsers = [
  {
    matricula: "aluno",
    name: "Illano Ayala",
    passwordPlain: "cefet123",
    role: "aluno",
  },
  {
    matricula: "professor",
    name: "Prof. Dr. Emerson Costa",
    passwordPlain: "cefet123",
    role: "professor",
  },
]

async function main() {
  console.log("Cadastrando/atualizando usuários no banco de dados (Neon)...")

  for (const u of initialUsers) {
    const passwordHash = await bcrypt.hash(u.passwordPlain, 10)
    const saved = await prisma.user.upsert({
      where: { matricula: u.matricula },
      update: {
        name: u.name,
        passwordHash,
        role: u.role,
      },
      create: {
        matricula: u.matricula,
        name: u.name,
        passwordHash,
        role: u.role,
      },
    })
    console.log(`✅ Usuário ativo: ${saved.matricula} (${saved.name} - ${saved.role})`)
  }
}

main()
  .catch((e) => {
    console.error("Erro ao cadastrar usuários:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
