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
    const statusParam = searchParams.get("status") || "all"
    const reasonParam = searchParams.get("reason") || "all"
    const search = (searchParams.get("q") || "").trim().toLowerCase()

    const where: any = {}
    if (statusParam !== "all") {
      where.status = statusParam
    }
    if (reasonParam !== "all") {
      where.reason = reasonParam
    }

    const [reports, allReportsForStats] = await Promise.all([
      prisma.aiMessageReport.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          question: {
            select: {
              id: true,
              ano_enem: true,
              topico_bncc: true,
              ano_ensino_medio: true,
              enunciado: true,
            },
          },
          user: {
            select: {
              name: true,
              matricula: true,
              role: true,
            },
          },
        },
      }),
      prisma.aiMessageReport.findMany({
        select: {
          status: true,
          reason: true,
        },
      }),
    ])

    const filtered = search
      ? reports.filter((r) => {
          const text = `${r.messageContent} ${r.userPrompt || ""} ${r.details || ""} ${r.userMatricula || ""} ${r.question?.topico_bncc || ""}`.toLowerCase()
          return text.includes(search)
        })
      : reports

    // Estatísticas para os cards e filtros
    const pendingCount = allReportsForStats.filter((r) => r.status === "pending").length
    const reviewedCount = allReportsForStats.filter((r) => r.status === "reviewed").length
    const resolvedCount = allReportsForStats.filter((r) => r.status === "resolved").length

    const reasonCounts: Record<string, number> = {}
    allReportsForStats.forEach((r) => {
      reasonCounts[r.reason] = (reasonCounts[r.reason] || 0) + 1
    })

    return NextResponse.json({
      reports: filtered,
      stats: {
        total: allReportsForStats.length,
        pending: pendingCount,
        reviewed: reviewedCount,
        resolved: resolvedCount,
        byReason: reasonCounts,
      },
    })
  } catch (error: any) {
    console.error("Admin AI Reports GET Error:", error)
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
    const { id, status, adminNotes } = body

    if (!id) {
      return NextResponse.json({ error: "ID do relato é obrigatório." }, { status: 400 })
    }

    const dataToUpdate: any = {}
    if (typeof status === "string" && ["pending", "reviewed", "resolved"].includes(status)) {
      dataToUpdate.status = status
    }
    if (adminNotes !== undefined) {
      dataToUpdate.adminNotes = typeof adminNotes === "string" ? adminNotes.trim() : null
    }

    const updated = await prisma.aiMessageReport.update({
      where: { id },
      data: dataToUpdate,
      include: {
        question: {
          select: {
            id: true,
            ano_enem: true,
            topico_bncc: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, report: updated })
  } catch (error: any) {
    console.error("Admin AI Reports PATCH Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await ensureAdmin()
    if (!session) {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID do relato é obrigatório." }, { status: 400 })
    }

    await prisma.aiMessageReport.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Admin AI Reports DELETE Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
