import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const logs = await prisma.interactionLog.findMany({
      include: {
        question: true
      }
    });

    const feedbacks = await prisma.studentFeedback.findMany();

    let csv = "ID Sessão,Tópico BNCC,Tempo (s),Dicas Socráticas Pedidas,Acertou?,Modo IA,Feeling,Dificuldade,Data\n";

    logs.forEach(log => {
      const feedback = feedbacks.find(f => f.questionId === log.questionId && f.sessionId === log.sessionId);
      
      const session = log.sessionId;
      const topico = log.question?.topico_bncc || 'Desconhecido';
      const tempo = (log.timeSpentMs / 1000).toFixed(1);
      const dicas = log.hintsRequested;
      const acertou = log.isCorrect ? "Sim" : "Não";
      const modoIA = log.aiModeUsed;
      const feeling = feedback?.feeling || 'N/A';
      const dificuldade = feedback?.difficultyRating || 'N/A';
      const data = log.createdAt.toISOString();

      csv += `${session},"${topico}",${tempo},${dicas},${acertou},${modoIA},${feeling},${dificuldade},${data}\n`;
    });

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="dados_pesquisa_pibic.csv"'
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
