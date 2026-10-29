import { NextResponse } from "next/server"
import { getNavigationSettings } from "@/lib/navigationSettings"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const tabs = await getNavigationSettings()
    return NextResponse.json({ tabs })
  } catch (error) {
    console.error("[API navigation-settings] Erro:", error)
    return NextResponse.json({ error: "Erro ao buscar configurações de navegação" }, { status: 500 })
  }
}
