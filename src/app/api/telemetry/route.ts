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
      return NextResponse.json({ solvedQuestionIds: [], reviewQuestionIds: [] });
    }

    const whereConditions: any[] = [];
    if (matricula) {
      whereConditions.push({ sessionId: matricula });
      whereConditions.push({ sessionId: { startsWith: `${matricula}::` } });
    }
    if (clientSessionId) {
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

    return NextResponse.json({
      solvedQuestionIds: Array.from(solvedSet),
      reviewQuestionIds: Array.from(reviewSet),
    });
  } catch (error: any) {
    console.error("Telemetry GET Error:", error);
    return NextResponse.json({ solvedQuestionIds: [], reviewQuestionIds: [] });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const session = await auth();
    const matricula = (session?.user as any)?.matricula;
    const rawSessionId = data.sessionId || "anonymous_session";
    const taggedSessionId = matricula && !rawSessionId.startsWith(`${matricula}::`)
      ? `${matricula}::${rawSessionId}`
      : rawSessionId;

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
