"use client"

import React from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { EyeOff, ArrowLeft, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/store/useAppStore"
import { DEFAULT_NAV_TABS } from "@/data/navigationConfig"

interface TabGuardProps {
  tabId: string
  children: React.ReactNode
}

/**
 * TabGuard verifica se a aba atual está ativada para o usuário logado.
 * - Se o usuário for Admin: sempre renderiza a página (com um aviso discreto se estiver oculta).
 * - Se o usuário for Aluno ou Professor e a aba estiver desativada: exibe uma tela amigável informando a suspensão temporária.
 */
export function TabGuard({ tabId, children }: TabGuardProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const navigationTabs = useAppStore((state) => state.navigationTabs)

  const role = (session?.user as any)?.role || "aluno"
  const tabsList = navigationTabs && navigationTabs.length > 0 ? navigationTabs : DEFAULT_NAV_TABS
  const tabConfig = tabsList.find((t) => t.id === tabId)

  // Se a aba não tiver restrições ou não for encontrada, renderiza normal
  if (!tabConfig) return <>{children}</>

  // Admins têm acesso irrestrito
  if (role === "admin") {
    return (
      <>
        {!tabConfig.enabled && (
          <div className="bg-amber-500/10 border-b border-amber-300/40 text-amber-800 px-4 py-2 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Modo Administrador:</strong> Esta aba está atualmente <u>desativada</u> para os usuários comuns.
              </span>
            </div>
            <button
              onClick={() => router.push("/admin")}
              className="text-[11px] underline font-bold hover:text-amber-900 cursor-pointer"
            >
              Configurar no Painel Admin →
            </button>
          </div>
        )}
        {children}
      </>
    )
  }

  // Verifica se a aba está desativada globalmente ou para o papel do usuário
  const isAccessible = tabConfig.enabled && tabConfig.allowedRoles.includes(role as any)

  if (!isAccessible) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
          <EyeOff className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900">Seção Temporariamente Desativada</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            O acesso a <strong>{tabConfig.label}</strong> foi desativado temporariamente pela coordenação pedagógica ou administração do sistema.
          </p>
        </div>

        <div className="pt-2">
          <Button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-4 rounded-xl flex items-center gap-2 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Início</span>
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
