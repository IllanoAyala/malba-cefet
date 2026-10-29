"use client"

import React, { useState, useEffect } from "react"
import {
  Compass,
  PlayCircle,
  BookOpen,
  BarChart2,
  BookMarked,
  GraduationCap,
  ShieldCheck,
  QrCode,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Users,
  UserCheck,
  Sparkles,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { NavTabItem, DEFAULT_NAV_TABS } from "@/data/navigationConfig"
import { useAppStore } from "@/store/useAppStore"

// Mapa de componentes de ícone para renderização dinâmica
const ICON_MAP: Record<string, React.ElementType> = {
  Compass,
  PlayCircle,
  BookOpen,
  BarChart2,
  BookMarked,
  GraduationCap,
  ShieldCheck,
  QrCode,
}

export function TabManagementTab() {
  const [tabs, setTabs] = useState<NavTabItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [activeFilter, setActiveFilter] = useState<"all" | "aluno" | "professor" | "disabled">("all")
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const setStoreNavTabs = useAppStore((state) => state.setNavigationTabs)

  // Carrega as configurações atuais do servidor
  const loadSettings = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/navigation-settings")
      if (!res.ok) throw new Error("Falha ao carregar configurações.")
      const data = await res.json()
      if (Array.isArray(data.tabs)) {
        setTabs(data.tabs)
        setStoreNavTabs(data.tabs)
      }
    } catch (err: any) {
      console.error(err)
      setFeedback({ type: "error", text: "Erro ao conectar com o servidor para obter as abas." })
      setTabs(DEFAULT_NAV_TABS)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  // Auto-dispensa de notificações após 4 segundos
  useEffect(() => {
    if (!feedback) return
    const timer = setTimeout(() => setFeedback(null), 4000)
    return () => clearTimeout(timer)
  }, [feedback])

  // Salva no servidor
  const saveToServer = async (newTabs: NavTabItem[], customSuccessMsg?: string) => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/navigation-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tabs: newTabs }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao salvar alterações.")
      }

      setTabs(data.tabs)
      setStoreNavTabs(data.tabs)

      // Emite evento para que a Sidebar local atualize imediatamente
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("navigation-updated", { detail: data.tabs }))
        try {
          const bc = new BroadcastChannel("malba-navigation-channel")
          bc.postMessage({ tabs: data.tabs })
          bc.close()
        } catch {}
      }

      setFeedback({
        type: "success",
        text: customSuccessMsg || "Configurações de visibilidade atualizadas com sucesso!",
      })
    } catch (err: any) {
      console.error(err)
      setFeedback({ type: "error", text: err.message || "Erro ao salvar no banco." })
    } finally {
      setIsSaving(false)
    }
  }

  // Alterna o status mestre da aba (Ativa / Desativada)
  const handleToggleTab = (tabId: string) => {
    const updated = tabs.map((tab) => {
      if (tab.id === tabId) {
        return { ...tab, enabled: !tab.enabled }
      }
      return tab
    })
    setTabs(updated)
    const target = updated.find((t) => t.id === tabId)
    const statusText = target?.enabled ? "ativada" : "oculta"
    saveToServer(updated, `Aba "${target?.label}" foi ${statusText} para os usuários.`)
  }

  // Alterna a permissão de um papel específico (aluno ou professor)
  const handleToggleRole = (tabId: string, roleToToggle: "aluno" | "professor") => {
    const updated = tabs.map((tab) => {
      if (tab.id === tabId) {
        const hasRole = tab.allowedRoles.includes(roleToToggle)
        const newRoles = hasRole
          ? tab.allowedRoles.filter((r) => r !== roleToToggle)
          : [...tab.allowedRoles, roleToToggle]
        return { ...tab, allowedRoles: newRoles }
      }
      return tab
    })
    setTabs(updated)
    const target = updated.find((t) => t.id === tabId)
    saveToServer(updated, `Permissões de "${target?.label}" atualizadas com sucesso.`)
  }

  // Restaura configurações de fábrica
  const handleResetSettings = async () => {
    setIsSaving(true)
    setShowResetConfirm(false)
    try {
      const res = await fetch("/api/admin/navigation-settings?action=reset", {
        method: "POST",
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error("Erro ao restaurar.")

      setTabs(data.tabs)
      setStoreNavTabs(data.tabs)

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("navigation-updated", { detail: data.tabs }))
        try {
          const bc = new BroadcastChannel("malba-navigation-channel")
          bc.postMessage({ tabs: data.tabs })
          bc.close()
        } catch {}
      }

      setFeedback({
        type: "success",
        text: "Padrões de navegação restaurados com sucesso!",
      })
    } catch (err: any) {
      console.error(err)
      setFeedback({ type: "error", text: "Erro ao restaurar configurações padrão." })
    } finally {
      setIsSaving(false)
    }
  }

  // Métricas calculadas
  const totalTabs = tabs.length
  const alunoActiveCount = tabs.filter((t) => t.enabled && t.allowedRoles.includes("aluno")).length
  const professorActiveCount = tabs.filter((t) => t.enabled && t.allowedRoles.includes("professor")).length
  const disabledCount = tabs.filter((t) => !t.enabled).length

  // Filtragem para visualização
  const filteredTabs = tabs.filter((tab) => {
    if (activeFilter === "aluno") return tab.enabled && tab.allowedRoles.includes("aluno")
    if (activeFilter === "professor") return tab.enabled && tab.allowedRoles.includes("professor")
    if (activeFilter === "disabled") return !tab.enabled
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* ================= CABEÇALHO DO MÓDULO DE GESTÃO DE ABAS ================= */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60">
              <SlidersHorizontal className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Controle de Visibilidade das Abas
              </h2>
              <p className="text-xs text-slate-500">
                Gerencie em tempo real quais seções ficam visíveis na barra lateral de Alunos e Professores.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResetConfirm(true)}
            disabled={isSaving || isLoading}
            className="text-xs font-semibold text-slate-600 border-slate-200 hover:bg-slate-50"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1 text-slate-500" />
            <span>Restaurar Padrão</span>
          </Button>

          <Button
            size="sm"
            onClick={() => saveToServer(tabs)}
            disabled={isSaving || isLoading}
            className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                <span>Gravando...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                <span>Salvar Tudo</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ================= FEEDBACK BANNER ================= */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs underline cursor-pointer opacity-70 hover:opacity-100"
          >
            Fechar
          </button>
        </div>
      )}

      {/* ================= MODAL DE CONFIRMAÇÃO DE RESTAURAÇÃO ================= */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Restaurar Padrão?</h3>
                <p className="text-xs text-slate-500">Todas as 8 abas voltarão a ficar ativas.</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Isso redefinirá as permissões padrão para discentes e docentes. Deseja continuar?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResetConfirm(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleResetSettings}
                className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white"
              >
                Confirmar Restauração
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CARDS DE STATUS / KPIS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total de Abas
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900">{totalTabs}</span>
            <span className="text-[11px] font-semibold text-slate-400">Navegação</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200/60 shadow-xs space-y-1 bg-gradient-to-br from-white to-blue-50/20">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
            Ativas p/ Alunos
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-blue-700">{alunoActiveCount}</span>
            <span className="text-[11px] font-semibold text-blue-600">Discentes</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-200/60 shadow-xs space-y-1 bg-gradient-to-br from-white to-indigo-50/20">
          <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
            Ativas p/ Docentes
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-indigo-700">{professorActiveCount}</span>
            <span className="text-[11px] font-semibold text-indigo-600">Professores</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Ocultas / Desativadas
          </span>
          <div className="flex items-baseline justify-between">
            <span className={`text-xl font-black ${disabledCount > 0 ? "text-amber-600" : "text-slate-900"}`}>
              {disabledCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Globais</span>
          </div>
        </div>
      </div>

      {/* ================= BARRA DE FILTRO DE AUDIÊNCIA + SIMULADOR ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna Principal: Lista de Abas Configuráveis (8 Colunas) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap pb-1">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-white text-blue-700 font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Todas ({tabs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("aluno")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeFilter === "aluno"
                    ? "bg-white text-blue-700 font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Visíveis para Alunos ({alunoActiveCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("professor")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeFilter === "professor"
                    ? "bg-white text-blue-700 font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Visíveis para Docentes ({professorActiveCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("disabled")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeFilter === "disabled"
                    ? "bg-white text-amber-700 font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Desativadas ({disabledCount})
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-blue-500" />
              <span>O menu lateral atualiza em tempo real</span>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Carregando painel de controle de abas...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTabs.map((tab) => {
                const IconComponent = ICON_MAP[tab.iconName] || Compass
                const isAlunoChecked = tab.allowedRoles.includes("aluno")
                const isProfessorChecked = tab.allowedRoles.includes("professor")

                return (
                  <div
                    key={tab.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      tab.enabled
                        ? "bg-white border-slate-200/90 shadow-2xs hover:border-slate-300"
                        : "bg-slate-50/70 border-slate-200/60 opacity-80"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Lado Esquerdo: Ícone + Info */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                            tab.enabled
                              ? "bg-blue-50 border-blue-200 text-blue-600"
                              : "bg-slate-100 border-slate-200 text-slate-400"
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-slate-900 text-sm">{tab.label}</h3>
                            <code className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80">
                              {tab.href}
                            </code>
                            {tab.isCore && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                Aba Principal
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                            {tab.description}
                          </p>

                          {/* Seletor de Papéis que podem ver esta aba */}
                          <div className="pt-2 flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-bold text-slate-400 mr-1">
                              Público Alvo:
                            </span>

                            <button
                              type="button"
                              onClick={() => handleToggleRole(tab.id, "aluno")}
                              disabled={!tab.enabled}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                                !tab.enabled
                                  ? "opacity-50 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400"
                                  : isAlunoChecked
                                  ? "bg-blue-50 border-blue-300 text-blue-700"
                                  : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              <UserCheck
                                className={`w-3 h-3 ${isAlunoChecked ? "text-blue-600" : "text-slate-300"}`}
                              />
                              <span>Alunos (Discentes)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleRole(tab.id, "professor")}
                              disabled={!tab.enabled}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                                !tab.enabled
                                  ? "opacity-50 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400"
                                  : isProfessorChecked
                                  ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                                  : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              <GraduationCap
                                className={`w-3 h-3 ${isProfessorChecked ? "text-indigo-600" : "text-slate-300"}`}
                              />
                              <span>Professores (Docentes)</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Lado Direito: Chave Toggle Mestre */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold ${
                              tab.enabled ? "text-emerald-700" : "text-slate-400"
                            }`}
                          >
                            {tab.enabled ? "Ativa" : "Oculta"}
                          </span>
                          <Toggle
                            checked={tab.enabled}
                            onCheckedChange={() => handleToggleTab(tab.id)}
                            className={tab.enabled ? "bg-emerald-600" : "bg-slate-300"}
                          />
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                            tab.enabled
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {tab.enabled ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Visível na Barra Lateral</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Oculta para Usuários</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}

              {filteredTabs.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                  <Info className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Nenhuma aba corresponde ao filtro selecionado.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Coluna da Direita (4 Colunas): Simulador da Barra Lateral dos Usuários */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md space-y-4 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="font-bold text-sm">Simulador em Tempo Real</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Live Preview</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Visualize exatamente quais abas aparecem no menu para os usuários com as configurações atuais:
            </p>

            {/* Simulação: Aluno */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Menu do Aluno (Discente)</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {tabs.filter((t) => t.enabled && t.allowedRoles.includes("aluno")).length} itens
                </span>
              </div>
              <div className="space-y-1 pt-1">
                {tabs
                  .filter((t) => t.enabled && t.allowedRoles.includes("aluno"))
                  .map((t) => {
                    const Icon = ICON_MAP[t.iconName] || Compass
                    return (
                      <div
                        key={t.id}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/60 text-slate-200 text-xs font-medium border border-slate-800"
                      >
                        <Icon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{t.label}</span>
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* Simulação: Professor */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Menu do Professor (Docente)</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {tabs.filter((t) => t.enabled && t.allowedRoles.includes("professor")).length} itens
                </span>
              </div>
              <div className="space-y-1 pt-1">
                {tabs
                  .filter((t) => t.enabled && t.allowedRoles.includes("professor"))
                  .map((t) => {
                    const Icon = ICON_MAP[t.iconName] || Compass
                    return (
                      <div
                        key={t.id}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/60 text-slate-200 text-xs font-medium border border-slate-800"
                      >
                        <Icon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{t.label}</span>
                      </div>
                    )
                  })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Administradores sempre visualizam todas as páginas.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
