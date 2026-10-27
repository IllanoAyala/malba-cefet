import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const log = await prisma.interactionLog.create({
      data: {
        questionId: data.questionId,
        sessionId: data.sessionId || "anonymous_session",
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
