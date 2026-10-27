import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const feedback = await prisma.studentFeedback.create({
      data: {
        questionId: data.questionId,
        sessionId: data.sessionId || "anonymous_session",
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
