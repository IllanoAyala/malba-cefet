import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { SERIES, CURSOS_CEFET } from "@/lib/curriculum"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await req.json()
    const { serie, curso, isCefet = true, consent = true } = body

    if (!serie || !SERIES.includes(serie as any)) {
      return NextResponse.json({ error: "Selecione uma série válida." }, { status: 400 })
    }

    let finalCurso = "Externo / Outro"
    if (isCefet) {
      if (!curso || !CURSOS_CEFET.includes(curso as any)) {
        return NextResponse.json({ error: "Selecione o seu curso do CEFET-MG." }, { status: 400 })
      }
      finalCurso = curso
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        serie,
        curso: finalCurso,
        isCefet: Boolean(isCefet),
        consentAt: consent ? new Date() : undefined,
      }
    })

    return NextResponse.json({ success: true, message: "Perfil atualizado com sucesso!" })
  } catch (error: any) {
    console.error("Erro ao completar perfil:", error)
    return NextResponse.json({ error: "Erro ao atualizar perfil." }, { status: 500 })
  }
}
