"use client"

import React, { useEffect, useState, useCallback } from "react"
import {
  Flag,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calculator,
  Target,
  Code,
  Sparkles,
  FileText,
  Search,
  RefreshCw,
  Trash2,
  ExternalLink,
  Save,
  MessageSquare,
  Bot,
  User,
  HelpCircle,
  Filter,
  Check,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

function normalizeMathContent(text?: string | null): string {
  if (!text) return ""
  return text
    .replace(/\\hexagon\b/g, "\\text{⬡}")
    .replace(/\\varhexagon\b/g, "\\text{⬢}")
    .replace(/\\pentagon\b/g, "\\text{⬠}")
    .replace(/\\\((.*?)\\\)/g, "$$$1$$")
    .replace(/\\\[([\s\S]*?)\\\]/g, "$$$$$$1$$$$$$")
}

const REASONS: Record<string, { label: string; icon: React.ElementType; color: string; badge: string }> = {
  math_error: {
    label: "Erro Matemático / Cálculo",
    icon: Calculator,
    color: "text-amber-600",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  gave_direct_answer: {
    label: "Deu a Resposta Direta",
    icon: Target,
    color: "text-rose-600",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
  },
  katex_formatting: {
    label: "KaTeX / Formatação Quebrada",
    icon: Code,
    color: "text-blue-600",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  hallucination: {
    label: "Alucinação / Confuso",
    icon: Sparkles,
    color: "text-purple-600",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
  other: {
    label: "Outro Motivo",
    icon: FileText,
    color: "text-slate-600",
    badge: "bg-slate-50 text-slate-700 border-slate-200",
  },
}

const STATUS_CONFIG: Record<string, { label: string; badge: string; color: string }> = {
  pending: {
    label: "Pendente",
    badge: "bg-amber-50 text-amber-700 border-amber-300",
    color: "text-amber-600",
  },
  reviewed: {
    label: "Em Análise",
    badge: "bg-blue-50 text-blue-700 border-blue-300",
    color: "text-blue-600",
  },
  resolved: {
    label: "Resolvido",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-300",
    color: "text-emerald-600",
  },
}

const SOCRATIC_STEPS = [
  "",
  "1. Observação da Realidade",
  "2. Pontos-Chave",
  "3. Teorização",
  "4. Hipóteses de Solução",
  "5. Aplicação à Realidade",
]

interface AiReportItem {
  id: string
  questionId: string | null
  userMatricula: string | null
  socraticStep: number | null
  userPrompt: string | null
  messageContent: string
  reason: string
  details: string | null
  status: "pending" | "reviewed" | "resolved"
  adminNotes: string | null
  createdAt: string
  updatedAt: string
  question?: {
    id: string
    ano_enem: number | null
    topico_bncc: string | null
    ano_ensino_medio: string | null
    enunciado: string | null
  } | null
  user?: {
    name: string
    matricula: string
    role: string
  } | null
}

interface Stats {
  total: number
  pending: number
  reviewed: number
  resolved: number
  byReason: Record<string, number>
}

export function AiReportsTab() {
  const [reports, setReports] = useState<AiReportItem[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    reviewed: 0,
    resolved: 0,
    byReason: {},
  })
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [reasonFilter, setReasonFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({})
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [successSavedId, setSuccessSavedId] = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.set("status", statusFilter)
      if (reasonFilter !== "all") params.set("reason", reasonFilter)
      if (searchQuery.trim()) params.set("q", searchQuery.trim())

      const res = await fetch(`/api/admin/ai-reports?${params.toString()}`)
      if (!res.ok) throw new Error("Erro ao buscar relatos.")
      const data = await res.json()
      setReports(data.reports || [])
      setStats(data.stats || { total: 0, pending: 0, reviewed: 0, resolved: 0, byReason: {} })

      // Inicializa cache local de anotações
      const notesMap: Record<string, string> = {}
      ;(data.reports || []).forEach((r: AiReportItem) => {
        notesMap[r.id] = r.adminNotes || ""
      })
      setEditingNotes(notesMap)
    } catch (err) {
      console.error("Falha ao carregar relatos:", err)
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter, reasonFilter, searchQuery])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const handleUpdateReport = async (id: string, newStatus?: string, customNotes?: string) => {
    setUpdatingId(id)
    try {
      const payload: any = { id }
      if (newStatus) payload.status = newStatus
      const notesToSave = customNotes !== undefined ? customNotes : editingNotes[id]
      if (notesToSave !== undefined) payload.adminNotes = notesToSave

      const res = await fetch("/api/admin/ai-reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Erro ao atualizar relato.")
      
      setSuccessSavedId(id)
      setTimeout(() => setSuccessSavedId(null), 2000)
      
      // Atualiza na lista local
      setReports((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                ...(newStatus ? { status: newStatus as any } : {}),
                adminNotes: notesToSave,
              }
            : r
        )
      )
    } catch (err) {
      console.error(err)
      alert("Não foi possível salvar a alteração.")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDeleteReport = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir permanentemente este relato?")) {
      return
    }

    try {
      const res = await fetch(`/api/admin/ai-reports?id=${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Erro ao excluir relato.")
      setReports((prev) => prev.filter((r) => r.id !== id))
      setStats((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }))
    } catch (err) {
      console.error(err)
      alert("Falha ao excluir o relato.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Contexto */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Flag className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-black text-slate-900">
              Auditoria de Respostas &amp; Falhas da IA
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Inspeção detalhada de respostas reportadas por alunos durante os atendimentos socráticos. Use os relatos para ajustar o prompt de sistema, evitar alucinações e aprimorar a precisão pedagógica do Malba.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchReports()}
          disabled={isLoading}
          className="gap-2 text-xs font-semibold rounded-xl bg-white shadow-2xs hover:bg-slate-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Atualizar Dados</span>
        </Button>
      </div>

      {/* 1. KPIs & Contadores Rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total de Relatos
          </span>
          <p className="text-2xl font-black text-slate-900">{stats.total}</p>
          <p className="text-[11px] text-slate-500">Histórico acumulado</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              Pendentes
            </span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-900">{stats.pending}</p>
          <p className="text-[11px] text-amber-700 font-medium">Aguardando auditoria</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200/80 bg-blue-50/20 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
              Em Análise
            </span>
            <AlertTriangle className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-blue-900">{stats.reviewed}</p>
          <p className="text-[11px] text-blue-700 font-medium">Em investigação docente</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              Resolvidos
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-900">{stats.resolved}</p>
          <p className="text-[11px] text-emerald-700 font-medium">Prompt ajustado/tratado</p>
        </div>
      </div>

      {/* Distribuição por Motivo */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Distribuição por Categoria do Problema
        </span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(REASONS).map(([key, item]) => {
            const count = stats.byReason[key] || 0
            const Icon = item.icon
            const isSelected = reasonFilter === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setReasonFilter(isSelected ? "all" : key)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : `${item.badge} hover:opacity-80`
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isSelected ? "bg-white/20 text-white" : "bg-black/5"}`}>
                  {count}
                </span>
              </button>
            )
          })}
          {reasonFilter !== "all" && (
            <button
              type="button"
              onClick={() => setReasonFilter("all")}
              className="text-xs text-blue-600 hover:underline px-2 py-1 cursor-pointer font-medium"
            >
              Limpar filtro de categoria
            </button>
          )}
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por conteúdo da resposta, dúvida do aluno, matrícula ou tópico..."
            className="pl-9 text-xs sm:text-sm h-10 rounded-xl bg-slate-50/50 border-slate-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Todos ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "pending"
                  ? "bg-amber-500 text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Pendentes ({stats.pending})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("reviewed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "reviewed"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Em Análise ({stats.reviewed})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("resolved")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "resolved"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Resolvidos ({stats.resolved})
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Relatos de IA */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Carregando relatos da IA...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Nenhum relato encontrado
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "all" || reasonFilter !== "all"
              ? "Nenhum relato corresponde aos filtros selecionados. Tente limpar a busca."
              : "Excelente! Nenhum problema pedagógico ou cálculo foi reportado nas respostas do Tutor Malba."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const reasonMeta = REASONS[report.reason] || REASONS.other
            const statusMeta = STATUS_CONFIG[report.status] || STATUS_CONFIG.pending
            const Icon = reasonMeta.icon
            const isSaving = updatingId === report.id
            const isSaved = successSavedId === report.id

            return (
              <div
                key={report.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all overflow-hidden"
              >
                {/* Header do Card */}
                <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Categoria do Problema */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold ${reasonMeta.badge}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{reasonMeta.label}</span>
                    </span>

                    {/* Status do Relato */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[11px] font-bold ${statusMeta.badge}`}
                    >
                      <span>{statusMeta.label}</span>
                    </span>

                    {/* Passo de Maguerez */}
                    {report.socraticStep && report.socraticStep > 0 && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-200 text-slate-700 text-[11px] font-medium">
                        {SOCRATIC_STEPS[report.socraticStep] || `Passo ${report.socraticStep}`}
                      </span>
                    )}

                    {/* Data de envio */}
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(report.createdAt).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Usuário e Link do Workspace */}
                  <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">
                        {report.user?.name || "Usuário não identificado"}
                      </span>
                      {report.user?.matricula && (
                        <span className="text-slate-400 font-mono text-[11px]">
                          ({report.user.matricula})
                        </span>
                      )}
                      {report.user?.role && (
                        <span className="capitalize text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-bold">
                          {report.user.role}
                        </span>
                      )}
                    </div>

                    {report.questionId && (
                      <a
                        href={`/workspace/${report.questionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline shrink-0"
                      >
                        <span>Ver no Workspace</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Corpo do Card */}
                <div className="p-4 sm:p-5 space-y-4">
                  {/* Contexto da Questão */}
                  {report.question && (
                    <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                      <span className="font-bold text-slate-700">Questão associada:</span>
                      {report.question.ano_enem && (
                        <span className="font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px]">
                          ENEM {report.question.ano_enem}
                        </span>
                      )}
                      {report.question.topico_bncc && (
                        <span className="font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px]">
                          {report.question.topico_bncc}
                        </span>
                      )}
                      {report.question.ano_ensino_medio && (
                        <span className="text-[11px] text-slate-500 font-medium">
                          {report.question.ano_ensino_medio}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 1. Pergunta do Aluno (se capturada) */}
                  {report.userPrompt && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>Pergunta / Mensagem enviada pelo Aluno:</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-blue-950 leading-relaxed font-medium">
                        {report.userPrompt}
                      </div>
                    </div>
                  )}

                  {/* 2. Resposta do Malba Reportada */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <Bot className="w-3.5 h-3.5 text-amber-600" />
                        <span>Resposta do Tutor Malba (Auditada):</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-headings:my-1.5 overflow-x-auto">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[[rehypeKatex, { strict: false }]]}
                        components={{
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                        }}
                      >
                        {normalizeMathContent(report.messageContent)}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* 3. Comentário do Aluno (se preenchido) */}
                  {report.details && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Comentário / Detalhes relatados pelo Aluno:</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 font-medium leading-relaxed italic">
                        &ldquo;{report.details}&rdquo;
                      </div>
                    </div>
                  )}

                  {/* 4. Painel de Gestão Docente / Ajuste de Prompt */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      {/* Seletor de Status */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600">Status do Relato:</span>
                        <select
                          value={report.status}
                          onChange={(e) => handleUpdateReport(report.id, e.target.value)}
                          disabled={isSaving}
                          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="pending">🟡 Pendente</option>
                          <option value="reviewed">🔵 Em Análise</option>
                          <option value="resolved">🟢 Resolvido</option>
                        </select>
                      </div>

                      {/* Botão de Excluir */}
                      <button
                        type="button"
                        onClick={() => handleDeleteReport(report.id)}
                        className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 hover:underline cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir Relato</span>
                      </button>
                    </div>

                    {/* Anotações Técnicas / Solução do Prompt */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Anotações Pedagógicas &amp; Ajustes no Prompt (Visível apenas aos Admins):
                      </label>
                      <textarea
                        rows={2}
                        value={editingNotes[report.id] ?? ""}
                        onChange={(e) =>
                          setEditingNotes((prev) => ({
                            ...prev,
                            [report.id]: e.target.value,
                          }))
                        }
                        placeholder="Ex: Instruir o sistema no passo 2 a não simplificar direto a equação de 2º grau. Adicionar regra de KaTeX para frações com raiz."
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                      />
                      <div className="flex justify-end">
                        <Button
                          variant="blue"
                          size="sm"
                          onClick={() => handleUpdateReport(report.id, undefined, editingNotes[report.id])}
                          disabled={isSaving}
                          className="gap-1.5 text-xs font-bold h-8 rounded-xl cursor-pointer"
                        >
                          {isSaving ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Salvando...</span>
                            </>
                          ) : isSaved ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-200" />
                              <span>Salvo com Sucesso!</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3 h-3" />
                              <span>Salvar Anotações</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
