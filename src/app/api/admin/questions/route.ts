import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

async function ensureAdmin() {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session || role !== "admin") {
    return null
  }
  return session
}

export async function GET(req: Request) {
  try {
    const session = await ensureAdmin()
    if (!session) {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const yearParam = searchParams.get("ano")
    const topicParam = searchParams.get("topico")
    const reportStatusParam = searchParams.get("reportStatus") || "pending"
    const search = (searchParams.get("q") || "").trim().toLowerCase()

    const where: any = {}
    if (yearParam && yearParam !== "all") {
      where.ano_enem = parseInt(yearParam, 10)
    }
    if (topicParam && topicParam !== "all") {
      where.topico_bncc = topicParam
    }

    const reportWhere: any = {}
    if (reportStatusParam !== "all") {
      reportWhere.status = reportStatusParam
    }

    const questions = await prisma.question.findMany({
      where,
      orderBy: [{ ano_enem: "desc" }, { id: "asc" }],
      include: {
        reports: {
          where: reportWhere,
          select: {
            id: true,
            description: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            interactionLogs: true,
            reports: true,
          },
        },
      },
    })

    // Parse alternativas if stored as string and filter by search if requested
    const formatted = questions
      .map((q) => {
        let parsedAlts: any = q.alternativas
        if (typeof parsedAlts === "string") {
          try {
            parsedAlts = JSON.parse(parsedAlts)
          } catch {
            parsedAlts = []
          }
        }
        return {
          ...q,
          alternativas: parsedAlts,
        }
      })
      .filter((q) => {
        if (!search) return true
        const textToSearch = `${q.id} ${q.enunciado} ${q.topico_bncc} ${q.habilidade_enem}`.toLowerCase()
        return textToSearch.includes(search)
      })

    // Coleta todos os tópicos existentes para facilitar o filtro na UI
    const allTopics = await prisma.question.findMany({
      select: { topico_bncc: true },
      distinct: ["topico_bncc"],
    })

    return NextResponse.json({
      questions: formatted,
      topics: allTopics.map((t) => t.topico_bncc).filter(Boolean).sort(),
      total: formatted.length,
    })
  } catch (error: any) {
    console.error("Admin Questions GET Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await ensureAdmin()
    if (!session) {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }

    const body = await req.json()
    const { id, enunciado, alternativas, alternativa_correta, topico_bncc, habilidade_enem, ano_ensino_medio, ano_enem, ativo } = body

    if (!id) {
      return NextResponse.json({ error: "ID da questão é obrigatório." }, { status: 400 })
    }

    const dataToUpdate: any = {}
    if (typeof ativo === "boolean") {
      dataToUpdate.ativo = ativo
    }
    if (typeof enunciado === "string") dataToUpdate.enunciado = enunciado.trim()
    if (alternativas != null) {
      dataToUpdate.alternativas = typeof alternativas === "string" ? alternativas : JSON.stringify(alternativas)
    }
    if (typeof alternativa_correta === "string") {
      dataToUpdate.alternativa_correta = alternativa_correta.trim().toUpperCase()
    }
    if (typeof topico_bncc === "string") dataToUpdate.topico_bncc = topico_bncc.trim()
    if (typeof habilidade_enem === "string") dataToUpdate.habilidade_enem = habilidade_enem.trim()
    if (typeof ano_ensino_medio === "string") dataToUpdate.ano_ensino_medio = ano_ensino_medio.trim()
    if (typeof ano_enem === "number" || (typeof ano_enem === "string" && !isNaN(Number(ano_enem)))) {
      dataToUpdate.ano_enem = Number(ano_enem)
    }

    const updated = await prisma.question.update({
      where: { id },
      data: dataToUpdate,
      include: {
        reports: true,
      },
    })

    let parsedAlts: any = updated.alternativas
    if (typeof parsedAlts === "string") {
      try {
        parsedAlts = JSON.parse(parsedAlts)
      } catch {
        parsedAlts = []
      }
    }

    return NextResponse.json({
      success: true,
      question: {
        ...updated,
        alternativas: parsedAlts,
      },
    })
  } catch (error: any) {
    console.error("Admin Questions PATCH Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
