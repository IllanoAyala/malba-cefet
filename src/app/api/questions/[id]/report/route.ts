import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { description } = body

    if (!description || description.trim() === "") {
      return new NextResponse("Descrição é obrigatória", { status: 400 })
    }

    const report = await prisma.report.create({
      data: {
        questionId: id,
        description
      }
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error("Erro ao salvar report:", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
}
