import fs from "fs"
import path from "path"
import { DEFAULT_NAV_TABS, NavTabItem } from "@/data/navigationConfig"

const SETTINGS_FILE_PATH = path.join(process.cwd(), "src", "data", "navigationSettings.json")

/**
 * Carrega a configuração atual das abas de navegação.
 * Se o arquivo não existir ou estiver corrompido, retorna os valores padrão.
 */
export async function getNavigationSettings(): Promise<NavTabItem[]> {
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const data = await fs.promises.readFile(SETTINGS_FILE_PATH, "utf-8")
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Faz merge com os padrões para garantir que novas abas adicionadas no código existam
        return DEFAULT_NAV_TABS.map((defaultTab) => {
          const found = parsed.find((p: any) => p && p.id === defaultTab.id)
          if (!found) return defaultTab
          return {
            ...defaultTab,
            enabled: typeof found.enabled === "boolean" ? found.enabled : defaultTab.enabled,
            allowedRoles: Array.isArray(found.allowedRoles) ? found.allowedRoles : defaultTab.allowedRoles,
            label: found.label || defaultTab.label,
          }
        })
      }
    }
  } catch (error) {
    console.error("[NavigationSettings] Erro ao ler configurações de navegação:", error)
  }
  return DEFAULT_NAV_TABS
}

/**
 * Salva a nova configuração de visibilidade das abas no arquivo JSON persistente.
 */
export async function saveNavigationSettings(settings: NavTabItem[]): Promise<boolean> {
  try {
    const dir = path.dirname(SETTINGS_FILE_PATH)
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true })
    }
    await fs.promises.writeFile(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2), "utf-8")
    return true
  } catch (error) {
    console.error("[NavigationSettings] Erro ao salvar configurações de navegação:", error)
    return false
  }
}

/**
 * Restaura as configurações de fábrica (todas as abas ativas com seus papéis originais).
 */
export async function resetNavigationSettings(): Promise<NavTabItem[]> {
  await saveNavigationSettings(DEFAULT_NAV_TABS)
  return DEFAULT_NAV_TABS
}
