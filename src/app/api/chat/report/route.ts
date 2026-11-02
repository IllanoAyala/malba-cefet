import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const user = session?.user as any

    const body = await req.json()
    const {
      questionId,
      messageContent,
      userPrompt,
      reason,
      details,
      socraticStep,
    } = body

    if (!messageContent || typeof messageContent !== "string") {
      return NextResponse.json(
        { error: "O conteúdo da mensagem da IA é obrigatório." },
        { status: 400 }
      )
    }

    if (!reason || typeof reason !== "string") {
      return NextResponse.json(
        { error: "O motivo do relato é obrigatório." },
        { status: 400 }
      )
    }

    // Criação do relato de resposta da IA
    const report = await prisma.aiMessageReport.create({
      data: {
        questionId: questionId ? String(questionId) : null,
        userId: user?.id || null,
        userMatricula: user?.matricula || null,
        userRole: user?.role || "aluno",
        messageContent: messageContent.trim(),
        userPrompt: userPrompt ? String(userPrompt).trim() : null,
        reason: reason.trim(),
        details: details ? String(details).trim() : null,
        socraticStep: typeof socraticStep === "number" ? socraticStep : null,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Relato enviado com sucesso aos pesquisadores!",
      report,
    })
  } catch (error: any) {
    console.error("Erro ao registrar relato da IA:", error)
    return NextResponse.json(
      { error: error.message || "Erro interno ao processar relato." },
      { status: 500 }
    )
  }
}
