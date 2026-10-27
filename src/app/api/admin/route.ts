import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
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

export async function GET() {
  try {
    const session = await ensureAdmin()
    if (!session) {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }

    const [users, logs, feedbacks, reports, tokenLogs] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          matricula: true,
          name: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.interactionLog.findMany({
        include: {
          question: {
            select: {
              id: true,
              ano_enem: true,
              ano_ensino_medio: true,
              topico_bncc: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.studentFeedback.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.report.findMany({
        include: {
          question: {
            select: {
              id: true,
              ano_enem: true,
              topico_bncc: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.tokenUsageLog.findMany({
        orderBy: { createdAt: "desc" },
      }),
    ])

    // Cálculo de uso de tokens com reset automático por janela de tempo (24h para TPD/RPD e 60s para TPM)
    const nowMs = Date.now()
    const window24hMs = 24 * 60 * 60 * 1000
    const window1mMs = 60 * 1000

    const logsLast24h = tokenLogs.filter(
      (t) => nowMs - new Date(t.createdAt).getTime() < window24hMs
    )
    const logsLast1m = tokenLogs.filter(
      (t) => nowMs - new Date(t.createdAt).getTime() < window1mMs
    )

    const latestTokenLog = tokenLogs[0] || null
    const dailyTokenLimit = 100000 // Cota diária TPD da Groq Free
    const minuteTokenLimit = latestTokenLog?.limitTokensTPM || 8000 // 8.000 TPM da Groq Free
    const dailyRequestLimit = latestTokenLog?.limitRequestsRPD || 1000 // 1.000 RPD da Groq Free

    const tokensUsed24h = logsLast24h.reduce((sum, t) => sum + t.totalTokens, 0)
    const promptTokens24h = logsLast24h.reduce((sum, t) => sum + t.promptTokens, 0)
    const completionTokens24h = logsLast24h.reduce((sum, t) => sum + t.completionTokens, 0)
    const tokensRemaining24h = Math.max(dailyTokenLimit - tokensUsed24h, 0)

    const tokensUsed1m = logsLast1m.reduce((sum, t) => sum + t.totalTokens, 0)
    // Se houve requisição no último minuto e a Groq retornou remainingTokensTPM, consideramos o mais restritivo;
    // se já passou 1 minuto desde a última requisição, o saldo por minuto já resetou para 100% (8.000 TPM).
    const tokensRemaining1m =
      logsLast1m.length > 0
        ? latestTokenLog?.remainingTokensTPM != null
          ? Math.min(latestTokenLog.remainingTokensTPM, Math.max(minuteTokenLimit - tokensUsed1m, 0))
          : Math.max(minuteTokenLimit - tokensUsed1m, 0)
        : minuteTokenLimit

    const requestsUsed24h = logsLast24h.length
    const requestsRemaining24h = Math.max(dailyRequestLimit - requestsUsed24h, 0)

    // Cálculo de quando os tokens usados começam a resetar / quando o ciclo de 24h zera
    const oldestIn24h = logsLast24h.length > 0 ? logsLast24h[logsLast24h.length - 1] : null
    const nextTokenReleaseAt = oldestIn24h
      ? new Date(new Date(oldestIn24h.createdAt).getTime() + window24hMs).toISOString()
      : null
    const fullDailyResetAt = latestTokenLog && logsLast24h.length > 0
      ? new Date(new Date(latestTokenLog.createdAt).getTime() + window24hMs).toISOString()
      : null
    const secondsUntilMinuteReset =
      logsLast1m.length > 0 && latestTokenLog
        ? Math.max(0, Math.ceil((new Date(latestTokenLog.createdAt).getTime() + window1mMs - nowMs) / 1000))
        : 0

    const totalTokensAllTime = tokenLogs.reduce((sum, t) => sum + t.totalTokens, 0)
    const totalRequestsAllTime = tokenLogs.length
    const avgTokensPerCall =
      totalRequestsAllTime > 0 ? Math.round(totalTokensAllTime / totalRequestsAllTime) : 0

    const tokenMetrics = {
      activeModel: latestTokenLog?.model || "openai/gpt-oss-120b",
      fallbackModels: ["qwen/qwen3.8-27b", "gemini-3.5-flash"],
      dailyTokenLimit,
      tokensUsed24h,
      promptTokens24h,
      completionTokens24h,
      tokensRemaining24h,
      minuteTokenLimit,
      tokensUsed1m,
      tokensRemaining1m,
      secondsUntilMinuteReset,
      dailyRequestLimit,
      requestsUsed24h,
      requestsRemaining24h,
      nextTokenReleaseAt,
      fullDailyResetAt,
      totalTokensAllTime,
      totalRequestsAllTime,
      avgTokensPerCall,
      lastCallAt: latestTokenLog?.createdAt || null,
      recentCalls: tokenLogs.slice(0, 10),
    }

    const enrichedUsers = users.map((u) => {
      const userLogs = logs.filter(
        (l) => l.sessionId === u.matricula || l.sessionId.startsWith(`${u.matricula}::`)
      )
      const questionsSolved = userLogs.length
      const correctAnswers = userLogs.filter((l) => l.isCorrect).length
      const accuracyRate = questionsSolved > 0 ? Math.round((correctAnswers / questionsSolved) * 100) : 0
      const totalHints = userLogs.reduce((acc, l) => acc + l.hintsRequested, 0)
      const avgTimeSeconds =
        questionsSolved > 0
          ? Math.round(userLogs.reduce((acc, l) => acc + l.timeSpentMs, 0) / questionsSolved / 1000)
          : 0
      const lastActiveAt = userLogs.length > 0 ? userLogs[0].createdAt : null

      return {
        ...u,
        questionsSolved,
        correctAnswers,
        accuracyRate,
        totalHints,
        avgTimeSeconds,
        lastActiveAt,
      }
    })

    const totalLogs = logs.length
    const totalCorrect = logs.filter((l) => l.isCorrect).length
    const overallAccuracy = totalLogs > 0 ? Math.round((totalCorrect / totalLogs) * 100) : 0
    const avgHints =
      totalLogs > 0 ? Number((logs.reduce((acc, l) => acc + l.hintsRequested, 0) / totalLogs).toFixed(1)) : 0

    const recentLogs = logs.slice(0, 30).map((l) => {
      const parts = l.sessionId.split("::")
      const matricula = parts.length > 1 ? parts[0] : null
      const matchedUser = matricula ? users.find((u) => u.matricula === matricula) : null

      return {
        id: l.id,
        matricula: matricula || "Sessão Anônima",
        userName: matchedUser?.name || "Visitante / Sem vínculo",
        sessionId: parts.length > 1 ? parts[1] : l.sessionId,
        topico: l.question?.topico_bncc || "Tópico Geral",
        anoEnem: l.question?.ano_enem || null,
        timeSeconds: Number((l.timeSpentMs / 1000).toFixed(1)),
        hintsRequested: l.hintsRequested,
        isCorrect: l.isCorrect,
        aiModeUsed: l.aiModeUsed,
        createdAt: l.createdAt,
      }
    })

    return NextResponse.json({
      summary: {
        totalUsers: users.length,
        totalAdmins: users.filter((u) => u.role === "admin").length,
        totalProfessors: users.filter((u) => u.role === "professor").length,
        totalStudents: users.filter((u) => u.role === "aluno").length,
        totalLogs,
        totalFeedbacks: feedbacks.length,
        totalReports: reports.length,
        overallAccuracy,
        avgHints,
      },
      users: enrichedUsers,
      recentLogs,
      reports: reports.slice(0, 20),
      tokenMetrics,
    })
  } catch (error: any) {
    console.error("Admin GET Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await ensureAdmin()
    if (!session) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 })
    }

    const body = await req.json()
    const matricula = (body.matricula || "").trim()
    const name = (body.name || "").trim()
    const password = body.password || ""
    const role = ["aluno", "professor", "admin"].includes(body.role) ? body.role : "aluno"

    if (!matricula || !name || !password) {
      return NextResponse.json(
        { error: "Preencha matrícula, nome e senha para criar a conta." },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { matricula } })
    if (existing) {
      return NextResponse.json({ error: "Já existe uma conta com esta matrícula." }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const created = await prisma.user.create({
      data: {
        matricula,
        name,
        passwordHash,
        role,
      },
      select: {
        id: true,
        matricula: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ success: true, user: created })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await ensureAdmin()
    if (!session) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 })
    }

    const body = await req.json()
    const { id, role, name, newPassword } = body

    if (!id) {
      return NextResponse.json({ error: "ID do usuário é obrigatório." }, { status: 400 })
    }

    const updateData: Record<string, any> = {}
    if (role && ["aluno", "professor", "admin"].includes(role)) {
      updateData.role = role
    }
    if (typeof name === "string" && name.trim().length > 0) {
      updateData.name = name.trim()
    }
    if (typeof newPassword === "string" && newPassword.trim().length > 0) {
      updateData.passwordHash = await bcrypt.hash(newPassword.trim(), 10)
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        matricula: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ success: true, user: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await ensureAdmin()
    if (!session) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID do usuário é obrigatório." }, { status: 400 })
    }

    const currentUserId = (session.user as any)?.id
    if (id === currentUserId) {
      return NextResponse.json({ error: "Você não pode excluir sua própria conta ativa." }, { status: 400 })
    }

    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
