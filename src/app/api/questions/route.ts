import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { topico_bncc: 'asc' }
    });
    
    // We parse the JSON strings back into objects before sending to frontend
    const formattedQuestions = questions.map(q => ({
      ...q,
      alternativas: JSON.parse(q.alternativas),
      dicas_socraticas_arco: JSON.parse(q.dicas_socraticas)
    }));

    return NextResponse.json(formattedQuestions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}
