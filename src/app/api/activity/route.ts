import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ ok: false, error: "Não autenticado" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await req.json()
    const { action, type, target, meta } = body

    const now = new Date()

    // 1. AÇÃO HEARTBEAT: Atualiza o tempo de sessão ativa ou inicia uma nova
    if (action === "heartbeat") {
      // Procura a sessão de acesso mais recente do usuário nos últimos 15 minutos
      const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000)

      const recentSession = await prisma.accessSession.findFirst({
        where: {
          userId,
          lastSeenAt: { gte: fifteenMinutesAgo }
        },
        orderBy: { lastSeenAt: "desc" }
      })

      if (recentSession) {
        // Atualiza o lastSeenAt estendendo o tempo logado
        await prisma.accessSession.update({
          where: { id: recentSession.id },
          data: { lastSeenAt: now }
        })
      } else {
        // Cria uma nova sessão de acesso
        await prisma.accessSession.create({
          data: {
            userId,
            startedAt: now,
            lastSeenAt: now,
          }
        })
      }

      return NextResponse.json({ ok: true })
    }

    // 2. AÇÃO EVENTO DE ATIVIDADE: Registra navegação, visualização de módulos, vídeos ou questões
    if (action === "event" && type) {
      await prisma.activityEvent.create({
        data: {
          userId,
          type,
          target: target ? String(target) : null,
          meta: meta ? (typeof meta === "string" ? meta : JSON.stringify(meta)) : null,
        }
      })

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: false, error: "Ação não reconhecida" }, { status: 400 })
  } catch (error: any) {
    console.error("Erro no rastreador de atividade:", error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}
