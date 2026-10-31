import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { SERIES, CURSOS_CEFET } from "@/lib/curriculum"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const user = session.user as any
    const isProfessor = user.role === "professor"
    const isAdmin = user.role === "admin"

    if (!isProfessor && !isAdmin) {
      return NextResponse.json({ error: "Acesso exclusivo para docentes" }, { status: 403 })
    }

    // 1. Obter turmas do professor (ou todas se for admin)
    let teacherClasses = await prisma.teacherClass.findMany({
      where: isProfessor ? { teacherId: user.id } : {},
      select: { serie: true, curso: true }
    })

    // Fallback: se professor ainda não tem turmas vinculadas, atribuir as turmas padrão para visualização
    if (teacherClasses.length === 0 && (isAdmin || isProfessor)) {
      teacherClasses = [
        { serie: "1º Ano", curso: "Informática" },
        { serie: "2º Ano", curso: "Informática" },
        { serie: "3º Ano", curso: "Informática" },
      ]
    }

    // Filtros de série e curso passados por query param opcional
    const { searchParams } = new URL(req.url)
    const filterSerie = searchParams.get("serie")
    const filterCurso = searchParams.get("curso")

    // Montar condições para buscar alunos das turmas permitidas
    const classConditions = teacherClasses.map((tc) => ({
      serie: tc.serie,
      curso: tc.curso,
    }))

    const whereUser: any = {
      role: "aluno",
      status: "active",
      OR: classConditions.length > 0 ? classConditions : undefined,
    }

    if (filterSerie && filterSerie !== "Todas") {
      whereUser.serie = filterSerie
    }
    if (filterCurso && filterCurso !== "Todos") {
      whereUser.curso = filterCurso
    }

    const students = await prisma.user.findMany({
      where: whereUser,
      select: {
        id: true,
        name: true,
        matricula: true,
        serie: true,
        curso: true,
        isCefet: true,
        createdAt: true,
        accessSessions: {
          orderBy: { startedAt: "desc" },
          take: 50,
        },
        activityEvents: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
      orderBy: { name: "asc" }
    })

    // Obter logs de questões para cada aluno
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const studentsReport = await Promise.all(
      students.map(async (st) => {
        // Logs de interação (questões feitas) pelo aluno
        const logs = await prisma.interactionLog.findMany({
          where: {
            OR: [
              { sessionId: st.matricula },
              { sessionId: { startsWith: `${st.matricula}::` } }
            ]
          },
          include: {
            question: {
              select: {
                id: true,
                ano_enem: true,
                topico_bncc: true,
                ano_ensino_medio: true,
              }
            }
          },
          orderBy: { createdAt: "desc" }
        })

        // Acessos: hoje, semana, mês
        const sessions = st.accessSessions || []
        const accessesToday = sessions.filter((s) => s.startedAt >= startOfToday).length
        const accessesWeek = sessions.filter((s) => s.startedAt >= sevenDaysAgo).length
        const accessesMonth = sessions.filter((s) => s.startedAt >= thirtyDaysAgo).length

        // Tempo total logado (soma da duração das sessões em milissegundos)
        let totalTimeLoggedMs = 0
        for (const s of sessions) {
          const duration = Math.max(0, s.lastSeenAt.getTime() - s.startedAt.getTime())
          // Sessão mínima de 1 minuto se conectou
          totalTimeLoggedMs += Math.max(60 * 1000, duration)
        }

        const lastSession = sessions[0]
        const lastAccessAt = lastSession?.lastSeenAt || st.createdAt

        // Métricas de exercícios resolvidos
        const solvedQuestions = new Set<string>()
        let correctAttempts = 0
        let totalHintsRequested = 0

        const exercisesHistory = logs.map((l) => {
          if (l.isCorrect) {
            solvedQuestions.add(l.questionId)
            correctAttempts++
          }
          totalHintsRequested += l.hintsRequested
          return {
            id: l.id,
            questionId: l.questionId,
            topico: l.question?.topico_bncc || "Matemática",
            anoEnem: l.question?.ano_enem || 2024,
            anoEnsinoMedio: l.question?.ano_ensino_medio || "1º Ano",
            isCorrect: l.isCorrect,
            hintsRequested: l.hintsRequested,
            timeSpentMs: l.timeSpentMs,
            date: l.createdAt,
          }
        })

        // Conteúdos/módulos visualizados pelo aluno
        const modulesViewed = Array.from(
          new Set(
            st.activityEvents
              .filter((e) => e.type === "page_view" || e.type === "module_view" || e.type === "video_open")
              .map((e) => e.target)
              .filter(Boolean)
          )
        )

        return {
          id: st.id,
          name: st.name,
          matricula: st.matricula,
          serie: st.serie || "Não definida",
          curso: st.curso || "Não informado",
          isCefet: st.isCefet,
          metrics: {
            accessesToday,
            accessesWeek,
            accessesMonth,
            totalTimeLoggedMinutes: Math.round(totalTimeLoggedMs / (60 * 1000)),
            lastAccessAt,
            totalExercises: logs.length,
            uniqueQuestionsSolved: solvedQuestions.size,
            accuracyRate: logs.length > 0 ? Math.round((correctAttempts / logs.length) * 100) : 0,
            totalHintsRequested,
            modulesViewedCount: modulesViewed.length,
          },
          history: {
            recentExercises: exercisesHistory.slice(0, 15),
            recentEvents: st.activityEvents.slice(0, 15).map((e) => ({
              type: e.type,
              target: e.target,
              meta: e.meta,
              date: e.createdAt,
            })),
          }
        }
      })
    )

    return NextResponse.json({
      teacherClasses,
      students: studentsReport,
      summary: {
        totalStudents: studentsReport.length,
        activeToday: studentsReport.filter((s) => s.metrics.accessesToday > 0).length,
        activeWeek: studentsReport.filter((s) => s.metrics.accessesWeek > 0).length,
        totalQuestionsSolved: studentsReport.reduce((acc, s) => acc + s.metrics.uniqueQuestionsSolved, 0),
      }
    })
  } catch (error: any) {
    console.error("Erro na API de turmas docentes:", error)
    return NextResponse.json({ error: "Erro ao carregar dados das turmas." }, { status: 500 })
  }
}
