import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const session = await auth();
    const matricula = (session?.user as any)?.matricula;
    const rawSessionId = data.sessionId || "anonymous_session";
    const taggedSessionId = matricula && !rawSessionId.startsWith(`${matricula}::`)
      ? `${matricula}::${rawSessionId}`
      : rawSessionId;

    const feedback = await prisma.studentFeedback.create({
      data: {
        questionId: data.questionId,
        sessionId: taggedSessionId,
        feeling: data.feeling,
        difficultyRating: data.difficultyRating,
      }
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error: any) {
    console.error("Feedback Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
