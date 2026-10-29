import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getNavigationSettings, saveNavigationSettings, resetNavigationSettings } from "@/lib/navigationSettings"
import { NavTabItem } from "@/data/navigationConfig"

export const dynamic = "force-dynamic"

async function ensureAdmin() {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session || role !== "admin") {
    return null
  }
  return session
}

export async function GET() {
  try {
    const session = await ensureAdmin()
    if (!session) {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }

    const tabs = await getNavigationSettings()
    return NextResponse.json({ tabs })
  } catch (error) {
    console.error("[Admin API navigation-settings] GET error:", error)
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await ensureAdmin()
    if (!session) {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }

    const url = new URL(req.url)
    const isReset = url.searchParams.get("action") === "reset"

    if (isReset) {
      const defaultTabs = await resetNavigationSettings()
      return NextResponse.json({
        success: true,
        message: "Configurações de navegação restauradas com sucesso!",
        tabs: defaultTabs,
      })
    }

    const body = await req.json()
    const { tabs } = body

    if (!Array.isArray(tabs)) {
      return NextResponse.json({ error: "Formato inválido. 'tabs' deve ser um array." }, { status: 400 })
    }

    // Validação básica dos itens
    const validatedTabs: NavTabItem[] = tabs.map((t: any) => ({
      id: String(t.id),
      href: String(t.href),
      label: String(t.label),
      description: String(t.description || ""),
      iconName: t.iconName || "Compass",
      enabled: Boolean(t.enabled),
      allowedRoles: Array.isArray(t.allowedRoles) ? t.allowedRoles : ["aluno", "professor"],
      isCore: Boolean(t.isCore),
      badge: t.badge,
    }))

    const saved = await saveNavigationSettings(validatedTabs)
    if (!saved) {
      return NextResponse.json({ error: "Falha ao gravar arquivo de configurações." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Configurações de visibilidade das abas salvas com sucesso!",
      tabs: validatedTabs,
    })
  } catch (error) {
    console.error("[Admin API navigation-settings] POST error:", error)
    return NextResponse.json({ error: "Erro interno no servidor ao salvar configurações." }, { status: 500 })
  }
}
