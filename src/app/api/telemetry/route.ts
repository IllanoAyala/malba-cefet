import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await auth();
    const matricula = (session?.user as any)?.matricula;
    const { searchParams } = new URL(req.url);
    const clientSessionId = searchParams.get('sessionId');

    if (!matricula && !clientSessionId) {
      return NextResponse.json({
        solvedQuestionIds: [],
        reviewQuestionIds: [],
        streak: { currentStreak: 0, hasPracticedToday: false, totalDays: 0 },
      });
    }

    const whereConditions: any[] = [];
    if (matricula) {
      // Quando logado, buscar ESTRITAMENTE os logs deste aluno específico (nunca misturar com outros)
      whereConditions.push({ sessionId: matricula });
      whereConditions.push({ sessionId: { startsWith: `${matricula}::` } });
    } else if (clientSessionId) {
      // Visitante anônimo (sem matrícula logada)
      whereConditions.push({ sessionId: clientSessionId });
      whereConditions.push({ sessionId: { endsWith: `::${clientSessionId}` } });
    }

    const logs = await prisma.interactionLog.findMany({
      where: { OR: whereConditions },
      select: {
        questionId: true,
        isCorrect: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const solvedSet = new Set<string>();
    const reviewSet = new Set<string>();

    for (const log of logs) {
      if (log.isCorrect) {
        solvedSet.add(log.questionId);
        reviewSet.delete(log.questionId);
      } else if (!solvedSet.has(log.questionId)) {
        reviewSet.add(log.questionId);
      }
    }

    // Cálculo da Ofensiva (Streak de dias consecutivos com prática no fuso horário do Brasil)
    const dateFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const distinctDatesSet = new Set<string>();
    for (const log of logs) {
      if (log.createdAt) {
        distinctDatesSet.add(dateFormatter.format(new Date(log.createdAt)));
      }
    }

    const todayStr = dateFormatter.format(new Date());

    const getPrevDay = (dStr: string) => {
      const d = new Date(dStr + "T12:00:00Z");
      d.setUTCDate(d.getUTCDate() - 1);
      return d.toISOString().slice(0, 10);
    };

    const hasPracticedToday = distinctDatesSet.has(todayStr);
    const yesterdayStr = getPrevDay(todayStr);

    let currentStreak = 0;
    let checkDate = hasPracticedToday ? todayStr : yesterdayStr;

    while (distinctDatesSet.has(checkDate)) {
      currentStreak++;
      checkDate = getPrevDay(checkDate);
    }

    return NextResponse.json({
      solvedQuestionIds: Array.from(solvedSet),
      reviewQuestionIds: Array.from(reviewSet),
      streak: {
        currentStreak,
        hasPracticedToday,
        totalDays: distinctDatesSet.size,
      },
    });
  } catch (error: any) {
    console.error("Telemetry GET Error:", error);
    return NextResponse.json({
      solvedQuestionIds: [],
      reviewQuestionIds: [],
      streak: { currentStreak: 0, hasPracticedToday: false, totalDays: 0 },
    });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const session = await auth();
    const matricula = (session?.user as any)?.matricula;
    const rawSessionId = data.sessionId || "anonymous_session";
    const cleanSessionId = rawSessionId.includes('::') ? rawSessionId.split('::').pop() : rawSessionId;
    const taggedSessionId = matricula
      ? `${matricula}::${cleanSessionId}`
      : cleanSessionId;

    const log = await prisma.interactionLog.create({
      data: {
        questionId: data.questionId,
        sessionId: taggedSessionId,
        timeSpentMs: data.timeSpentMs,
        hintsRequested: data.hintsRequested,
        isCorrect: data.isCorrect,
        aiModeUsed: data.aiModeUsed,
      }
    });

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    console.error("Telemetry Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
