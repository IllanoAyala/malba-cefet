import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { SERIES, CURSOS_CEFET } from "@/lib/curriculum"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      role, 
      name, 
      email,
      code,
      matricula, 
      password, 
      serie, 
      curso, 
      isCefet = true, 
      consent = true,
      teacherClasses = [] 
    } = body

    if (!name || typeof name !== "string" || name.trim().length < 3) {
      return NextResponse.json({ error: "Nome completo é obrigatório." }, { status: 400 })
    }

    const cleanEmail = String(email || "").trim().toLowerCase()
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: "E-mail válido é obrigatório." }, { status: 400 })
    }

    const cleanCode = String(code || "").trim()
    if (!cleanCode || cleanCode.length !== 6) {
      return NextResponse.json({ error: "Código de confirmação de 6 dígitos é obrigatório." }, { status: 400 })
    }

    const cleanMatricula = String(matricula || "").trim()
    if (!cleanMatricula || cleanMatricula.length < 3) {
      return NextResponse.json({ error: "Matrícula/SIAPE válida é obrigatória." }, { status: 400 })
    }

    if (!password || typeof password !== "string" || password.length < 4) {
      return NextResponse.json({ error: "A senha deve ter no mínimo 4 caracteres." }, { status: 400 })
    }

    if (role !== "aluno" && role !== "professor") {
      return NextResponse.json({ error: "Perfil de usuário inválido." }, { status: 400 })
    }

    // 1. Validar o Código de Verificação do E-mail
    const verification = await prisma.verificationCode.findFirst({
      where: {
        email: cleanEmail,
        code: cleanCode,
        purpose: "registration",
        expiresAt: { gt: new Date() },
      },
    })

    if (!verification) {
      await prisma.verificationCode.updateMany({
        where: { email: cleanEmail, purpose: "registration" },
        data: { attempts: { increment: 1 } },
      })
      return NextResponse.json(
        { error: "Código de verificação incorreto ou expirado. Verifique sua caixa de entrada ou solicite um novo código." },
        { status: 400 }
      )
    }

    if (verification.attempts >= 5) {
      await prisma.verificationCode.deleteMany({
        where: { email: cleanEmail, purpose: "registration" },
      })
      return NextResponse.json(
        { error: "Limite de tentativas excedido para este código. Por favor, solicite um novo código." },
        { status: 400 }
      )
    }

    // 2. Verificar duplicidade de matrícula e e-mail
    const existingMatricula = await prisma.user.findUnique({
      where: { matricula: cleanMatricula },
    })
    if (existingMatricula) {
      return NextResponse.json(
        { error: "Já existe um cadastro com esta matrícula/SIAPE." },
        { status: 409 }
      )
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })
    if (existingEmail) {
      return NextResponse.json(
        { error: "Este endereço de e-mail já está em uso por outra conta." },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    if (role === "aluno") {
      if (!serie || !SERIES.includes(serie as any)) {
        return NextResponse.json(
          { error: "Selecione uma série válida (1º Ano, 2º Ano ou 3º Ano)." },
          { status: 400 }
        )
      }

      let finalCurso = "Externo / Outro"
      if (isCefet) {
        if (!curso || !CURSOS_CEFET.includes(curso as any)) {
          return NextResponse.json(
            { error: "Selecione o seu curso técnico no CEFET-MG." },
            { status: 400 }
          )
        }
        finalCurso = curso
      }

      const newUser = await prisma.user.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          emailVerified: new Date(),
          matricula: cleanMatricula,
          passwordHash,
          role: "aluno",
          serie,
          curso: finalCurso,
          isCefet: Boolean(isCefet),
          status: "active",
          consentAt: consent ? new Date() : null,
        },
      })

      // Invalida o código utilizado
      await prisma.verificationCode.deleteMany({
        where: { email: cleanEmail, purpose: "registration" },
      })

      return NextResponse.json({
        success: true,
        message: "Cadastro de discente realizado com sucesso!",
        user: { id: newUser.id, name: newUser.name, matricula: newUser.matricula, email: newUser.email, role: newUser.role },
      })
    }

    // Perfil Professor / Docente
    if (role === "professor") {
      const newUser = await prisma.user.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          emailVerified: new Date(),
          matricula: cleanMatricula,
          passwordHash,
          role: "professor",
          status: "pending", // Aguarda aprovação do admin
          isCefet: true,
          teacherClasses: Array.isArray(teacherClasses) && teacherClasses.length > 0
            ? {
                create: teacherClasses
                  .filter((tc: any) => tc.serie && tc.curso)
                  .map((tc: any) => ({
                    serie: String(tc.serie),
                    curso: String(tc.curso),
                  })),
              }
            : undefined,
        },
      })

      // Invalida o código utilizado
      await prisma.verificationCode.deleteMany({
        where: { email: cleanEmail, purpose: "registration" },
      })

      return NextResponse.json({
        success: true,
        pendingApproval: true,
        message: "Cadastro docente enviado com sucesso! Sua conta passará pela ativação da coordenação/administração antes do primeiro acesso.",
        user: { id: newUser.id, name: newUser.name, matricula: newUser.matricula, email: newUser.email, role: newUser.role },
      })
    }

    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 })
  } catch (error: any) {
    console.error("Erro no cadastro:", error)
    return NextResponse.json(
      { error: "Erro interno ao processar cadastro. Tente novamente." },
      { status: 500 }
    )
  }
}
