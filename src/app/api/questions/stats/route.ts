import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const total = await prisma.question.count();
    const revisadas = await prisma.question.count({
      where: { revisado_ia: true }
    });
    const pendentes = total - revisadas;

    return NextResponse.json({
      total,
      revisadas,
      pendentes
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 });
  }
}
