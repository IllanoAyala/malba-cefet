import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendVerificationCodeEmail } from "@/lib/email"

export const dynamic = "force-dynamic"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = String(body.email || "").trim().toLowerCase()
    const matricula = String(body.matricula || "").trim()
    const name = String(body.name || "").trim()
    const purpose = body.purpose === "password_reset" ? "password_reset" : "registration"

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Informe um endereço de e-mail válido." },
        { status: 400 }
      )
    }

    // Se a finalidade for cadastro, valida duplicidade prévia no banco
    if (purpose === "registration") {
      if (matricula) {
        const existingMatricula = await prisma.user.findUnique({
          where: { matricula },
        })
        if (existingMatricula) {
          return NextResponse.json(
            { error: "Esta matrícula já está cadastrada no Malba." },
            { status: 409 }
          )
        }
      }

      const existingEmail = await prisma.user.findUnique({
        where: { email },
      })
      if (existingEmail) {
        return NextResponse.json(
          { error: "Este endereço de e-mail já está em uso por outra conta." },
          { status: 409 }
        )
      }
    } else if (purpose === "password_reset") {
      const user = await prisma.user.findUnique({
        where: { email },
      })
      if (!user) {
        return NextResponse.json(
          { error: "Nenhuma conta encontrada com este endereço de e-mail." },
          { status: 404 }
        )
      }
    }

    // Rate limiting: impede reenvio em menos de 45 segundos
    const recentCode = await prisma.verificationCode.findFirst({
      where: {
        email,
        purpose,
        createdAt: { gte: new Date(Date.now() - 45 * 1000) },
      },
    })

    if (recentCode) {
      return NextResponse.json(
        { error: "Por favor, aguarde alguns segundos antes de solicitar um novo código." },
        { status: 429 }
      )
    }

    // Limpa códigos anteriores expirados ou ativos da mesma finalidade
    await prisma.verificationCode.deleteMany({
      where: { email, purpose },
    })

    // Gera código seguro de 6 dígitos numéricos
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos

    await prisma.verificationCode.create({
      data: {
        email,
        code,
        purpose,
        expiresAt,
      },
    })

    // Dispara o e-mail
    const emailResult = await sendVerificationCodeEmail({
      toEmail: email,
      code,
      name,
      purpose,
    })

    const isDevMode = !process.env.RESEND_API_KEY || (emailResult as any)?.devMode

    return NextResponse.json({
      success: true,
      message: `Código de verificação enviado para ${email}.`,
      devCode: isDevMode ? code : undefined,
    })
  } catch (error: any) {
    console.error("Erro ao enviar código de verificação:", error)
    return NextResponse.json(
      { error: error.message || "Erro ao processar envio de código de verificação." },
      { status: 500 }
    )
  }
}
