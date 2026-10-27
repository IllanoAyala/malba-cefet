import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Acesso restrito a administradores.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'telemetry';

    if (type === 'users') {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      });
      const logs = await prisma.interactionLog.findMany();

      let csv = "Matrícula,Nome,Perfil (Role),Questões Resolvidas,Acertos,Taxa de Acerto (%),Dicas Socráticas Pedidas,Data de Cadastro\n";

      users.forEach(u => {
        const userLogs = logs.filter(l => l.sessionId === u.matricula || l.sessionId.startsWith(`${u.matricula}::`));
        const solved = userLogs.length;
        const correct = userLogs.filter(l => l.isCorrect).length;
        const accuracy = solved > 0 ? ((correct / solved) * 100).toFixed(1) : "0.0";
        const hints = userLogs.reduce((acc, l) => acc + l.hintsRequested, 0);
        const createdAt = u.createdAt.toISOString();

        csv += `"${u.matricula}","${u.name}",${u.role},${solved},${correct},${accuracy},${hints},${createdAt}\n`;
      });

      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="contas_monitoradas_malba.csv"'
        }
      });
    }

    const logs = await prisma.interactionLog.findMany({
      include: {
        question: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const feedbacks = await prisma.studentFeedback.findMany();

    let csv = "Matrícula / Conta,ID Sessão,Tópico BNCC,Tempo (s),Dicas Socráticas Pedidas,Acertou?,Modo IA,Feeling,Dificuldade,Data\n";

    logs.forEach(log => {
      const feedback = feedbacks.find(f => f.questionId === log.questionId && f.sessionId === log.sessionId);
      
      const parts = log.sessionId.split("::");
      const conta = parts.length > 1 ? parts[0] : "Anônimo / Legado";
      const sessionStr = parts.length > 1 ? parts[1] : log.sessionId;
      const topico = log.question?.topico_bncc || 'Desconhecido';
      const tempo = (log.timeSpentMs / 1000).toFixed(1);
      const dicas = log.hintsRequested;
      const acertou = log.isCorrect ? "Sim" : "Não";
      const modoIA = log.aiModeUsed;
      const feeling = feedback?.feeling || 'N/A';
      const dificuldade = feedback?.difficultyRating || 'N/A';
      const data = log.createdAt.toISOString();

      csv += `"${conta}","${sessionStr}","${topico}",${tempo},${dicas},${acertou},${modoIA},${feeling},${dificuldade},${data}\n`;
    });

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="dados_pesquisa_pibic.csv"'
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
