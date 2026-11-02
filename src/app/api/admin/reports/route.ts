import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

async function ensureAdmin() {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session || role !== "admin") {
    return null
  }
  return session
}

export async function PATCH(req: Request) {
  try {
    const session = await ensureAdmin()
    if (!session) {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }

    const body = await req.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: "ID e status são obrigatórios." }, { status: 400 })
    }

    const updated = await prisma.report.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ success: true, report: updated })
  } catch (error: any) {
    console.error("Admin Report PATCH Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await ensureAdmin()
    if (!session) {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 })
    }

    await prisma.report.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Admin Report DELETE Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
