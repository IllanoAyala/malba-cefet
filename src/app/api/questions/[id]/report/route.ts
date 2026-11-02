import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Faça login para relatar um erro na questão." }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { description } = body

    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Descrição do erro é obrigatória." }, { status: 400 })
    }

    const cleanDesc = description.trim()
    if (cleanDesc.length < 3) {
      return NextResponse.json(
        { error: "Por favor, forneça mais detalhes sobre o erro (mínimo 3 caracteres)." },
        { status: 400 }
      )
    }

    if (cleanDesc.length > 600) {
      return NextResponse.json(
        { error: "A descrição deve conter no máximo 600 caracteres." },
        { status: 400 }
      )
    }

    const questionExists = await prisma.question.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!questionExists) {
      return NextResponse.json({ error: "Questão não encontrada." }, { status: 404 })
    }

    // Prevenção de duplicidade em massa (rate limiting por questão)
    const recentDuplicate = await prisma.report.findFirst({
      where: {
        questionId: id,
        description: cleanDesc,
        createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
      },
    })

    if (recentDuplicate) {
      return NextResponse.json(
        { error: "Um chamado idêntico para esta questão já foi registrado recentemente e está sob análise." },
        { status: 429 }
      )
    }

    const report = await prisma.report.create({
      data: {
        questionId: id,
        description: cleanDesc,
      },
    })

    return NextResponse.json(report)
  } catch (error: any) {
    console.error("Erro ao salvar report:", error)
    return NextResponse.json({ error: error.message || "Erro interno ao registrar relato." }, { status: 500 })
  }
}
