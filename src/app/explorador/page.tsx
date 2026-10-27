"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppStore } from "@/store/useAppStore"
import { getModuleForTopic } from "@/data/studyMaterials"
import {
  Search,
  ArrowRight,
  AlertCircle,
  Loader2,
  LayoutGrid,
  List,
  X,
  SlidersHorizontal,
  CheckCircle2,
  RotateCcw,
  Circle,
  PlayCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface EnemQuestion {
  id: string | number
  ano_ensino_medio: string
  ano_enem: number | string
  topico_bncc: string
  habilidade_enem: string
  enunciado: string
}

function ExploradorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTopicParam = searchParams.get("topic")
  const initialStatusParam = searchParams.get("status")

  const { solvedQuestionIds, reviewQuestionIds, syncQuestionProgress } = useAppStore()

  // Estados de Dados
  const [enemQuestions, setEnemQuestions] = useState<EnemQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Estados de Filtro
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState("Todos")
  const [selectedTopic, setSelectedTopic] = useState(initialTopicParam || "Todos")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "solved" | "review">(
    (initialStatusParam as any) || "all"
  )
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    if (initialTopicParam) {
      setSelectedTopic(initialTopicParam)
    }
  }, [initialTopicParam])

  useEffect(() => {
    const sessionId =
      typeof window !== "undefined" ? window.sessionStorage.getItem("malba_session_id") || "" : ""

    Promise.all([
      fetch("/api/questions").then((res) => res.json()),
      fetch(`/api/telemetry?sessionId=${encodeURIComponent(sessionId)}`).then((res) => res.json()),
    ])
      .then(([data, tData]) => {
        if (Array.isArray(data)) {
          setEnemQuestions(data)
        } else {
          setEnemQuestions([])
        }
        if (tData && Array.isArray(tData.solvedQuestionIds)) {
          syncQuestionProgress(tData.solvedQuestionIds, tData.reviewQuestionIds || [])
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Falha no fetch:", err)
        setEnemQuestions([])
        setIsLoading(false)
      })
  }, [])

  // Filtros Dinâmicos
  const years = ["Todos", "1º Ano", "2º Ano", "3º Ano"]
  const rawTopics = Array.from(new Set(enemQuestions.map((q) => q.topico_bncc))).sort((a, b) =>
    a.localeCompare(b)
  )
  const topics = ["Todos", ...rawTopics]

  // Contagem por ano
  const count1 = enemQuestions.filter((q) => q.ano_ensino_medio === "1º Ano").length
  const count2 = enemQuestions.filter((q) => q.ano_ensino_medio === "2º Ano").length
  const count3 = enemQuestions.filter((q) => q.ano_ensino_medio === "3º Ano").length

  // Cores semânticas por série
  const yearColors: Record<string, { bg: string; text: string; border: string }> = {
    "1º Ano": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200/80" },
    "2º Ano": { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200/80" },
    "3º Ano": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200/80" },
  }

  // Lógica de Filtragem Cruzada (Ano + Tópico + Status + Busca)
  const filteredQuestions = enemQuestions.filter((q) => {
    const qId = String(q.id)
    const isSolved = solvedQuestionIds.includes(qId)
    const isReview = !isSolved && reviewQuestionIds.includes(qId)

    const matchesYear = selectedYear === "Todos" || q.ano_ensino_medio === selectedYear
    const matchesTopic = selectedTopic === "Todos" || q.topico_bncc === selectedTopic

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "solved"
        ? isSolved
        : statusFilter === "review"
        ? isReview
        : !isSolved

    const query = searchQuery.toLowerCase().trim()
    if (!query) return matchesYear && matchesTopic && matchesStatus

    const matchesSearch =
      q.enunciado.toLowerCase().includes(query) ||
      q.topico_bncc.toLowerCase().includes(query) ||
      q.habilidade_enem.toLowerCase().includes(query) ||
      String(q.ano_enem).includes(query)

    return matchesYear && matchesTopic && matchesStatus && matchesSearch
  })

  // Métricas de domínio do recorte atual (Ano + Tópico)
  const topicScopedQuestions = enemQuestions.filter((q) => {
    const matchesYear = selectedYear === "Todos" || q.ano_ensino_medio === selectedYear
    const matchesTopic = selectedTopic === "Todos" || q.topico_bncc === selectedTopic
    return matchesYear && matchesTopic
  })
  const scopedSolvedCount = topicScopedQuestions.filter((q) =>
    solvedQuestionIds.includes(String(q.id))
  ).length
  const scopedReviewCount = topicScopedQuestions.filter(
    (q) =>
      !solvedQuestionIds.includes(String(q.id)) && reviewQuestionIds.includes(String(q.id))
  ).length
  const scopedPercent =
    topicScopedQuestions.length > 0
      ? Math.round((scopedSolvedCount / topicScopedQuestions.length) * 100)
      : 0

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedYear !== "Todos" ||
    selectedTopic !== "Todos" ||
    statusFilter !== "all"

  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedYear("Todos")
    setSelectedTopic("Todos")
    setStatusFilter("all")
  }

  const activeStudyModule =
    selectedTopic !== "Todos" ? getModuleForTopic(selectedTopic) : null

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-h-full space-y-6">
      {/* ================= CONTROLE PRINCIPAL / TOOLBAR ESTILO STUDIO ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
        {/* Cabeçalho do Catálogo */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                Banco Curricular ENEM
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-xs text-slate-500 font-medium">
                {enemQuestions.length > 0
                  ? `${enemQuestions.length} Problemas Mapeados na BNCC`
                  : "Matriz Curricular de Matemática"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Catálogo de Questões
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-light">
              Acompanhe quais problemas você já dominou, filtre os que ainda faltam e estude a teoria vinculada a cada tópico.
            </p>
          </div>

          {/* Alternador de Visualização (Grade vs Lista) */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Visualização em Grade"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Grade</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Visualização em Lista"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Lista</span>
              </button>
            </div>
          </div>
        </div>

        {/* BARRA DE DOMÍNIO DO RECORTE ATUAL + ATALHO DE VIDEOAULA */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                {selectedTopic !== "Todos"
                  ? `Domínio em ${selectedTopic}`
                  : selectedYear !== "Todos"
                  ? `Domínio no ${selectedYear}`
                  : "Seu Progresso Geral no Catálogo ENEM"}
              </span>
              <span className="font-extrabold text-blue-600">
                {scopedSolvedCount} / {topicScopedQuestions.length} dominadas ({scopedPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  scopedPercent === 100 && topicScopedQuestions.length > 0
                    ? "bg-emerald-500"
                    : "bg-blue-600"
                }`}
                style={{ width: `${scopedPercent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {activeStudyModule ? (
              <Button
                variant="outline"
                onClick={() => router.push(`/materias?module=${activeStudyModule.id}`)}
                className="h-9 px-3.5 rounded-xl border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5"
              >
                <PlayCircle className="w-4 h-4 text-red-500" />
                <span>Assistir Aula de {selectedTopic}</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => router.push("/materias")}
                className="h-9 px-3.5 rounded-xl border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5"
              >
                <PlayCircle className="w-4 h-4 text-red-500" />
                <span>Ver Matérias &amp; Videoaulas</span>
              </Button>
            )}
          </div>
        </div>

        {/* Linha 1 de Filtros: Campo de Busca + Abas de Série */}
        <div className="pt-1 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Campo de Busca Textual */}
          <div className="lg:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquise por tópico, enunciado ou habilidade (ex: H19)..."
              className="w-full h-11 pl-10 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-md transition-colors"
                title="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Abas por Série com contadores em tempo real */}
          <div className="lg:col-span-6 flex gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {years.map((yr) => {
              const count =
                yr === "Todos"
                  ? enemQuestions.length
                  : yr === "1º Ano"
                  ? count1
                  : yr === "2º Ano"
                  ? count2
                  : count3

              const isSelected = selectedYear === yr
              return (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{yr}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Linha 2 de Filtros: Tópico BNCC + Filtro de Status (Não resolvidas / Dominadas / Revisar) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Tópico BNCC:</span>
              </span>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-colors cursor-pointer max-w-xs truncate"
              >
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Pílulas de Status de Resolução */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {[
                { id: "all", label: "Todas" },
                { id: "pending", label: "Não Resolvidas" },
                { id: "solved", label: `Dominadas (${scopedSolvedCount})` },
                ...(scopedReviewCount > 0
                  ? [{ id: "review", label: `Revisar (${scopedReviewCount})` }]
                  : []),
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    statusFilter === st.id
                      ? "bg-white text-blue-700 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <span>
              Exibindo <strong className="text-slate-800 font-bold">{filteredQuestions.length}</strong> de{" "}
              {enemQuestions.length} questões
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-blue-600 font-bold hover:underline transition-colors ml-1 cursor-pointer"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= ESTADO DE CARREGAMENTO ================= */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-slate-600 font-semibold text-sm">Carregando catálogo pedagógico...</p>
          <p className="text-slate-400 text-xs mt-1">Sincronizando com a base BNCC e ENEM</p>
        </div>
      ) : filteredQuestions.length > 0 ? (
        /* ================= LISTAGEM / GRADE DE QUESTÕES ================= */
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
            {filteredQuestions.map((q) => {
              const colors = yearColors[q.ano_ensino_medio] || yearColors["1º Ano"]
              const skillCode = q.habilidade_enem.split("-")[0].trim()
              const qId = String(q.id)
              const isSolved = solvedQuestionIds.includes(qId)
              const isReview = !isSolved && reviewQuestionIds.includes(qId)
              const mod = getModuleForTopic(q.topico_bncc)

              return (
                <div
                  key={q.id}
                  onClick={() => router.push(`/workspace/${q.id}`)}
                  className={`group bg-white rounded-2xl border p-5 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all space-y-3 relative ${
                    isSolved
                      ? "border-emerald-200/90 hover:border-emerald-400"
                      : isReview
                      ? "border-amber-200/90 hover:border-amber-400"
                      : "border-slate-200/80 hover:border-blue-400"
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Header do Card: Série + Status + Ano ENEM */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 whitespace-nowrap ${colors.bg} ${colors.text} ${colors.border}`}
                        >
                          {q.ano_ensino_medio}
                        </span>
                        {isSolved ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 whitespace-nowrap">
                            <CheckCircle2 className="w-3 h-3" />
                            Dominada
                          </span>
                        ) : isReview ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0 whitespace-nowrap">
                            <RotateCcw className="w-3 h-3" />
                            Revisar
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 shrink-0 whitespace-nowrap">
                            <Circle className="w-2.5 h-2.5" />
                            Nova
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60 shrink-0 whitespace-nowrap">
                        ENEM {q.ano_enem}
                      </span>
                    </div>

                    {/* Tópico BNCC */}
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-700 transition-colors">
                      {q.topico_bncc}
                    </h3>

                    {/* Código de Habilidade */}
                    <span
                      className="text-[11px] font-semibold text-blue-600 block truncate"
                      title={q.habilidade_enem}
                    >
                      {skillCode} &bull; Matriz de Referência
                    </span>

                    {/* Enunciado Resumido */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-normal">
                      {q.enunciado}
                    </p>
                  </div>

                  {/* Rodapé de Ação + Atalho da Aula */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/materias?module=${mod.id}`)
                      }}
                      className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 inline-flex items-center gap-1 transition-colors cursor-pointer"
                      title={`Ver videoaula de ${q.topico_bncc}`}
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-red-500" />
                      <span>Ver Videoaula</span>
                    </button>

                    <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                      <span>{isSolved ? "Rever" : "Resolver com Malba"}</span>
                      <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* ================= MODO LISTA DE LEITURA ================= */
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs divide-y divide-slate-100 pb-2">
            {filteredQuestions.map((q) => {
              const colors = yearColors[q.ano_ensino_medio] || yearColors["1º Ano"]
              const skillCode = q.habilidade_enem.split("-")[0].trim()
              const qId = String(q.id)
              const isSolved = solvedQuestionIds.includes(qId)
              const isReview = !isSolved && reviewQuestionIds.includes(qId)

              return (
                <div
                  key={q.id}
                  onClick={() => router.push(`/workspace/${q.id}`)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
                      >
                        {q.ano_ensino_medio}
                      </span>
                      {isSolved ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Dominada
                        </span>
                      ) : isReview ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          <RotateCcw className="w-3 h-3" />
                          Revisar
                        </span>
                      ) : null}
                      <span className="text-[11px] font-bold text-slate-400">ENEM {q.ano_enem}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-[11px] font-semibold text-blue-600">{skillCode}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                      {q.topico_bncc}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                      {q.enunciado}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="text-xs font-bold h-9 px-4 rounded-xl border-slate-200 shrink-0 group-hover:border-blue-400 group-hover:text-blue-700 group-hover:bg-blue-50/50 transition-all"
                  >
                    {isSolved ? "Rever →" : "Resolver →"}
                  </Button>
                </div>
              )
            })}
          </div>
        )
      ) : (
        /* ================= ESTADO VAZIO / SEM RESULTADOS ================= */
        <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-slate-200 shadow-xs">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Nenhuma questão encontrada</h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mb-6 leading-relaxed">
            Não encontramos resultados para os filtros selecionados ou termo pesquisado. Tente redefinir a busca ou escolher outro tópico.
          </p>
          <Button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Limpar Filtros e Ver Todas
          </Button>
        </div>
      )}
    </div>
  )
}

export default function ExploradorPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-500">Carregando catálogo de questões...</p>
        </div>
      }
    >
      <ExploradorContent />
    </Suspense>
  )
}
