import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { getAllowedSeries } from '@/lib/curriculum';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    const serie = (session?.user as any)?.serie;

    const allowed = getAllowedSeries(role, serie);

    const whereClause: any = {};

    // Usuários normais (alunos, professores e visitantes) só veem questões ativas
    if (role !== 'admin') {
      whereClause.ativo = true;
    }

    // Alunos são restritos às séries liberadas para o seu nível
    if (role !== 'admin' && role !== 'professor') {
      whereClause.ano_ensino_medio = { in: allowed };
    }

    const questions = await prisma.question.findMany({
      where: whereClause,
      orderBy: { topico_bncc: 'asc' }
    });
    
    const formattedQuestions = questions.map(q => ({
      ...q,
      alternativas: JSON.parse(q.alternativas),
      dicas_socraticas_arco: JSON.parse(q.dicas_socraticas)
    }));

    return NextResponse.json(formattedQuestions);
  } catch (error) {
    console.error("Erro ao buscar questões:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}
