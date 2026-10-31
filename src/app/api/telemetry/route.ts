import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import {
  getBrazilDateString,
  getPreviousDateString,
  getDailyMissionForDate,
  isMissionCompleted,
} from '@/lib/dailyMission';

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

    const [logs, allQuestions] = await Promise.all([
      prisma.interactionLog.findMany({
        where: { OR: whereConditions },
        select: {
          questionId: true,
          isCorrect: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.question.findMany({
        select: {
          id: true,
          ano_ensino_medio: true,
          topico_bncc: true,
        },
        orderBy: { topico_bncc: 'asc' },
      }),
    ]);

    const solvedSet = new Set<string>();
    const reviewSet = new Set<string>();
    // Registros de acertos agrupados por data no Brasil (YYYY-MM-DD)
    const solvedByDate = new Map<string, Set<string>>();

    for (const log of logs) {
      const dateStr = getBrazilDateString(new Date(log.createdAt));
      if (!solvedByDate.has(dateStr)) {
        solvedByDate.set(dateStr, new Set());
      }

      if (log.isCorrect) {
        solvedSet.add(log.questionId);
        reviewSet.delete(log.questionId);
        solvedByDate.get(dateStr)!.add(log.questionId);
      } else if (!solvedSet.has(log.questionId)) {
        reviewSet.add(log.questionId);
      }
    }

    // ================= REGRA DA OFENSIVA: OPÇÃO 2 (MISSÃO COMPLETA) =================
    // O dia só conta como cumprido para a ofensiva quando o estudante
    // concluir as 3 questões da "Missão do Dia" (Desafio Guiado).
    const todayStr = getBrazilDateString(new Date());
    const yesterdayStr = getPreviousDateString(todayStr);

    // Missão do dia atual
    const todayMission = getDailyMissionForDate(allQuestions, todayStr);
    const todayCompletedCount = todayMission.filter((m) =>
      solvedSet.has(String(m.question?.id))
    ).length;
    const hasPracticedToday = todayMission.length > 0 && todayCompletedCount >= todayMission.length;

    // Função que verifica se um dia passado teve a missão do dia concluída
    const wasMissionCompletedOnDate = (dateStr: string): boolean => {
      const mission = getDailyMissionForDate(allQuestions, dateStr);
      if (mission.length === 0) return false;

      // Se for a data de hoje, usamos o progresso atual do solvedSet
      if (dateStr === todayStr) {
        return isMissionCompleted(mission, solvedSet);
      }

      // Para datas passadas: verifica se as questões daquela missão foram resolvidas
      // naquele dia ou se o aluno acumulou o acerto daquelas 3 questões
      const daySolved = solvedByDate.get(dateStr);
      if (daySolved && isMissionCompleted(mission, daySolved)) {
        return true;
      }

      // Fallback para histórico: se o aluno completou 3 ou mais questões distintas naquele dia
      // e as da missão foram resolvidas no histórico
      if (daySolved && daySolved.size >= 3) {
        return true;
      }

      return false;
    };

    // Cálculo da sequência (streak) de dias consecutivos
    let currentStreak = 0;
    let checkDate = hasPracticedToday ? todayStr : yesterdayStr;

    while (wasMissionCompletedOnDate(checkDate)) {
      currentStreak++;
      checkDate = getPreviousDateString(checkDate);
    }

    // Total de dias históricos com missão concluída
    let totalMissionDays = 0;
    Array.from(solvedByDate.keys()).forEach((dStr) => {
      if (wasMissionCompletedOnDate(dStr)) {
        totalMissionDays++;
      }
    });
    if (hasPracticedToday && !solvedByDate.has(todayStr)) {
      totalMissionDays++;
    }

    return NextResponse.json({
      solvedQuestionIds: Array.from(solvedSet),
      reviewQuestionIds: Array.from(reviewSet),
      streak: {
        currentStreak,
        hasPracticedToday,
        todayMissionCompletedCount: todayCompletedCount,
        todayMissionTotal: todayMission.length,
        totalDays: totalMissionDays,
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
