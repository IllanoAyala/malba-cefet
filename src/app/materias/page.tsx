"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useAppStore } from "@/store/useAppStore"
import {
  STUDY_MODULES,
  StudyModule,
  OBMEP_APOSTILAS,
  GTMAT_PORTAL_URL,
  OBMEP_PORTAL_URL,
  getModuleForTopic,
} from "@/data/studyMaterials"
import {
  PlayCircle,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Circle,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Shuffle,
  Lightbulb,
  GraduationCap,
  Layers,
  Loader2,
  FileText,
  Award,
  Video,
  Landmark,
  Zap,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { MathSnippet } from "@/components/ui/MathSnippet"
import { TabGuard } from "@/components/layout/TabGuard"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

function MateriasContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const matricula = (session?.user as any)?.matricula
  const topicParam = searchParams.get("topic")
  const moduleParam = searchParams.get("module")

  const { solvedQuestionIds, reviewQuestionIds, syncQuestionProgress } = useAppStore()

  const [questions, setQuestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<"Todos" | "1º Ano" | "2º Ano" | "3º Ano">("Todos")
  const [activeModuleId, setActiveModuleId] = useState<string>(STUDY_MODULES[0].id)
  // Mídia Principal ('gtmat') vs Mídia Secundária ('secondary')
  const [mediaSource, setMediaSource] = useState<"gtmat" | "secondary">("gtmat")
  // Aba ativa no estúdio de aprendizagem: questões, fórmulas ou materiais
  const [activeTab, setActiveTab] = useState<"questoes" | "formulas" | "materiais">("questoes")

  useEffect(() => {
    const sessionId =
      typeof window !== "undefined" ? window.sessionStorage.getItem("malba_session_id") || "" : ""

    Promise.all([
      fetch("/api/questions").then((r) => r.json()),
      fetch(`/api/telemetry?sessionId=${encodeURIComponent(sessionId)}`).then((r) => r.json()),
    ])
      .then(([qData, tData]) => {
        if (Array.isArray(qData)) {
          setQuestions(qData)
        }
        if (tData && Array.isArray(tData.solvedQuestionIds)) {
          syncQuestionProgress(
            tData.solvedQuestionIds,
            tData.reviewQuestionIds || [],
            matricula,
            tData.streak
          )
        }
      })
      .catch((e) => console.error("Erro ao carregar matérias:", e))
      .finally(() => setIsLoading(false))
  }, [matricula])

  useEffect(() => {
    if (moduleParam) {
      const found = STUDY_MODULES.find((m) => m.id === moduleParam)
      if (found) {
        setActiveModuleId(found.id)
        setMediaSource("gtmat")
        return
      }
    }
    if (topicParam) {
      const matched = getModuleForTopic(topicParam)
      if (matched) {
        setActiveModuleId(matched.id)
        setMediaSource("gtmat")
      }
    }
  }, [topicParam, moduleParam])

  const filteredModules = STUDY_MODULES.filter(
    (m) => selectedYear === "Todos" || m.year === selectedYear
  )

  const activeModule: StudyModule =
    STUDY_MODULES.find((m) => m.id === activeModuleId) || filteredModules[0] || STUDY_MODULES[0]

  const currentVideoId =
    mediaSource === "gtmat" ? activeModule.videoId : activeModule.secondaryVideoId
  const currentVideoTitle =
    mediaSource === "gtmat" ? activeModule.videoTitle : activeModule.secondaryVideoTitle
  const currentChannelName =
    mediaSource === "gtmat" ? activeModule.channelName : activeModule.secondaryChannelName

  const getModuleQuestions = (mod: StudyModule) => {
    return questions.filter((q) =>
      mod.relatedTopics.some((t) => t.toLowerCase() === (q.topico_bncc || "").toLowerCase())
    )
  }

  const activeModuleQuestions = getModuleQuestions(activeModule)
  const activeSolvedCount = activeModuleQuestions.filter((q) =>
    solvedQuestionIds.includes(String(q.id))
  ).length

  const totalSolvedOverall = questions.filter((q) =>
    solvedQuestionIds.includes(String(q.id))
  ).length

  const handlePracticeModule = () => {
    if (activeModuleQuestions.length === 0) {
      router.push("/explorador")
      return
    }
    const pending = activeModuleQuestions.filter(
      (q) => !solvedQuestionIds.includes(String(q.id))
    )
    const pool = pending.length > 0 ? pending : activeModuleQuestions
    const chosen = pool[Math.floor(Math.random() * pool.length)]
    router.push(`/workspace/${chosen.id}`)
  }

  const yearBadgeColors: Record<string, string> = {
    "1º Ano": "bg-blue-50 text-blue-700 border-blue-200",
    "2º Ano": "bg-violet-50 text-violet-700 border-violet-200",
    "3º Ano": "bg-emerald-50 text-emerald-700 border-emerald-200",
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-300 font-sans">
      {/* ================= CABEÇALHO DE MATÉRIAS, GTMAT CEFET-MG & OBMEP ================= */}
      {/* ================= CABEÇALHO MODERNO DE MATÉRIAS & VIDEOAULAS ================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs relative overflow-hidden">
        {/* Detalhe de fundo suave (Glow sutil) */}
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-blue-50/50 via-slate-50/20 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Lado Esquerdo: Identidade do Acervo + Título + Descrição Enxuta */}
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-[11px] font-bold tracking-tight">
                <Landmark className="w-3.5 h-3.5 text-blue-600" />
                <span>GTMAT CEFET-MG &bull; 24 Unidades</span>
              </span>

              <a
                href={GTMAT_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 text-[11px] font-semibold transition-colors"
                title="Abrir Portal GTMAT"
              >
                <span>Portal Oficial</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href={OBMEP_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100/80 text-amber-800 border border-amber-200/80 text-[11px] font-semibold transition-colors"
                title="Abrir Apostilas OBMEP"
              >
                <Award className="w-3 h-3 text-amber-600" />
                <span>OBMEP</span>
                <ExternalLink className="w-3 h-3 text-amber-500" />
              </a>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Matérias &amp; Videoaulas
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              Currículo oficial estruturado por séries: videoaulas conceituais do CEFET-MG, revisões complementares e questões contextualizadas do ENEM.
            </p>
          </div>

          {/* Lado Direito: Filtro de Série (Segmented Control) + Mini-Card de Progresso */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2.5 shrink-0">
            {/* Seletor de Série (Segmented Tabs Moderno) */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 text-xs font-bold shadow-2xs">
              {(["Todos", "1º Ano", "2º Ano", "3º Ano"] as const).map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    selectedYear === yr
                      ? "bg-white text-blue-700 shadow-xs font-extrabold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>

            {/* Pill de Progresso Compacto */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                {questions.length > 0 ? `${Math.round((totalSolvedOverall / questions.length) * 100)}%` : "0%"}
              </div>
              <span className="text-[11px] font-semibold text-slate-600">
                <strong className="text-slate-900">{totalSolvedOverall}</strong> de {questions.length || 180} questões dominadas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= GRID PRINCIPAL: LISTA DE MATÉRIAS (ESQ) + ESTÚDIO DE AULA (DIR) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUNA ESQUERDA (4 COLUNAS): TRILHA DE MÓDULOS (COM SCROLLBAR E FIXAÇÃO STICKY) */}
        <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-6 self-start">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Módulos de Matemática ({filteredModules.length})</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">1ª a 3ª Série</span>
          </div>

          <div className="space-y-2.5 max-h-[calc(100vh-140px)] overflow-y-auto pr-1.5 custom-scrollbar">
            {filteredModules.map((mod) => {
              const modQuestions = getModuleQuestions(mod)
              const solvedCount = modQuestions.filter((q) =>
                solvedQuestionIds.includes(String(q.id))
              ).length
              const reviewCount = modQuestions.filter((q) =>
                reviewQuestionIds.includes(String(q.id))
              ).length
              const totalCount = modQuestions.length
              const progressPct = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0
              const isSelected = activeModule.id === mod.id

              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    setActiveModuleId(mod.id)
                    setMediaSource("gtmat")
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? "bg-blue-50/70 border-blue-500 shadow-sm ring-2 ring-blue-500/10"
                      : "bg-white border-slate-200/80 hover:border-blue-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 whitespace-nowrap ${
                        yearBadgeColors[mod.year]
                      }`}
                    >
                      {mod.year}
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/70 flex items-center gap-1 shrink-0 whitespace-nowrap">
                      <Video className="w-3 h-3 text-blue-600" />
                      GTMAT + OBMEP
                    </span>
                  </div>

                  <div>
                    <h3
                      className={`font-bold text-sm leading-snug ${
                        isSelected ? "text-blue-900" : "text-slate-900"
                      }`}
                    >
                      {mod.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {mod.gtmatUnitTitle}
                    </p>
                  </div>

                  {/* Barra de Domínio do Módulo */}
                  {totalCount > 0 ? (
                    <div className="space-y-1 pt-0.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-600">
                          {solvedCount}/{totalCount} problemas dominados
                        </span>
                        {reviewCount > 0 ? (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            {reviewCount} p/ revisar
                          </span>
                        ) : (
                          <span className="font-bold text-blue-600">{progressPct}%</span>
                        )}
                      </div>
                      <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            progressPct === 100 ? "bg-emerald-500" : "bg-blue-600"
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] font-semibold text-violet-700 bg-violet-50/80 px-2.5 py-1 rounded-lg border border-violet-200/60">
                      Módulo Curricular &amp; Aprofundamento CEFET-MG
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* COLUNA DIREITA (8 COLUNAS): PLAYER (PRINCIPAL GTMAT + SECUNDÁRIO) + FONTES GTMAT/OBMEP + FÓRMULAS */}
        <div className="lg:col-span-8 space-y-6">
          {/* CARD 1: PLAYER DE VIDEOAULA COM SELETOR DE MÍDIA PRINCIPAL (GTMAT) E SECUNDÁRIA */}
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            {/* Barra Superior de Escolha de Mídia: Principal (GTMAT CEFET-MG) vs Secundária */}
            <div className="px-4 sm:px-6 py-3 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs">
                <PlayCircle className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-bold tracking-tight truncate">{currentVideoTitle}</span>
              </div>

              <div className="flex items-center bg-slate-950/90 border border-slate-800 p-1 rounded-xl shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => setMediaSource("gtmat")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    mediaSource === "gtmat"
                      ? "bg-blue-600 text-white shadow-xs font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Landmark className={`w-3.5 h-3.5 ${mediaSource === "gtmat" ? "text-blue-200" : "text-slate-400"}`} />
                  <span>GTMAT &bull; Aula Completa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaSource("secondary")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    mediaSource === "secondary"
                      ? "bg-blue-600 text-white shadow-xs font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 ${mediaSource === "secondary" ? "text-amber-300" : "text-slate-400"}`} />
                  <span>Revisão Rápida</span>
                </button>
              </div>
            </div>

            {/* Vídeo Embutido 16:9 */}
            <div className="aspect-video w-full bg-slate-950 relative">
              <iframe
                key={currentVideoId}
                src={`https://www.youtube.com/embed/${currentVideoId}?rel=0`}
                title={currentVideoTitle}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        yearBadgeColors[activeModule.year]
                      }`}
                    >
                      {activeModule.year}
                    </span>
                    <span className="text-xs font-bold text-blue-700">
                      {currentChannelName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      &bull; {mediaSource === "gtmat" ? "Acervo Docente CEFET-MG [VAC]" : `Duração: ${activeModule.secondaryDuration}`}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900">{activeModule.title}</h2>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {activeModuleQuestions.length > 0 && (
                    <Button
                      onClick={handlePracticeModule}
                      className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      <span>Praticar Questões ({activeModuleQuestions.length})</span>
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeModule.summary}
              </p>

              {/* ================= ABAS DO ESTÚDIO: QUESTÕES, FÓRMULAS & MATERIAIS ================= */}
              <div className="pt-2 border-t border-slate-100 space-y-4">
                {/* Seletor de Abas Segmentado */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 text-xs font-bold shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab("questoes")}
                    className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      activeTab === "questoes"
                        ? "bg-white text-blue-700 shadow-xs font-extrabold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Questões ENEM ({activeModuleQuestions.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("formulas")}
                    className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      activeTab === "formulas"
                        ? "bg-white text-blue-700 shadow-xs font-extrabold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Fórmulas &amp; Dicas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("materiais")}
                    className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      activeTab === "materiais"
                        ? "bg-white text-blue-700 shadow-xs font-extrabold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>Acervo GTMAT &amp; OBMEP</span>
                  </button>
                </div>

                {/* CONTEÚDO DA ABA 1: QUESTÕES DO ENEM */}
                {activeTab === "questoes" && (
                  <div className="space-y-3 animate-fade-in-up">
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="font-semibold text-slate-700">
                        Problemas Práticos &bull;{" "}
                        <strong className="text-emerald-700">
                          {activeModuleQuestions.filter((q) => solvedQuestionIds.includes(String(q.id))).length} de{" "}
                          {activeModuleQuestions.length} dominados
                        </strong>
                      </span>
                      {activeModuleQuestions.length > 0 && (
                        <button
                          type="button"
                          onClick={handlePracticeModule}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Shuffle className="w-3 h-3" />
                          <span>Modo Aleatório</span>
                        </button>
                      )}
                    </div>

                    {activeModuleQuestions.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80">
                        <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <h4 className="text-sm font-bold text-slate-800">
                          Tópico de Aprofundamento Teórico
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                          Este módulo cobre a fundamentação do currículo GTMAT CEFET-MG e OBMEP. Acesse as abas <strong>Fórmulas &amp; Dicas</strong> e <strong>Acervo GTMAT &amp; OBMEP</strong> para materiais de apoio.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1.5 custom-scrollbar">
                        {activeModuleQuestions.map((q) => {
                          const isSolved = solvedQuestionIds.includes(String(q.id))
                          const isReview = reviewQuestionIds.includes(String(q.id))
                          const skillCode = q.habilidade_bncc ? `H${q.habilidade_bncc}` : null

                          return (
                            <div
                              key={q.id}
                              onClick={() => router.push(`/workspace/${q.id}`)}
                              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                                isSolved
                                  ? "bg-emerald-50/40 border-emerald-200/70 hover:bg-emerald-50/80"
                                  : isReview
                                  ? "bg-amber-50/40 border-amber-200/70 hover:bg-amber-50/80"
                                  : "bg-white border-slate-200/80 hover:border-blue-300 hover:bg-slate-50/80"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {isSolved ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                ) : isReview ? (
                                  <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-300 group-hover:text-blue-500 shrink-0" />
                                )}

                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-slate-800">
                                      {q.topico_bncc || "Matemática"}
                                    </span>
                                    <span className="text-[10px] font-semibold text-slate-400">
                                      ENEM {q.ano_enem}
                                    </span>
                                    {skillCode && (
                                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200/60">
                                        {skillCode}
                                      </span>
                                    )}
                                  </div>
                                  <MathSnippet
                                    content={q.enunciado}
                                    className="text-xs text-slate-500 line-clamp-1 mt-0.5"
                                  />
                                </div>
                              </div>

                              <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 shrink-0">
                                <span>{isSolved ? "Rever" : "Resolver"}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* CONTEÚDO DA ABA 2: FÓRMULAS & DICAS */}
                {activeTab === "formulas" && (
                  <div className="space-y-3 animate-fade-in-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1.5 custom-scrollbar">
                      {activeModule.formulas.map((f, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-2.5"
                        >
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                              {f.label}
                            </span>
                            <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 text-center overflow-x-auto text-sm font-semibold text-slate-900">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={{ p: ({ node, ...props }) => <span {...props} /> }}
                              >
                                {f.formula}
                              </ReactMarkdown>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                              components={{ p: ({ node, ...props }) => <span {...props} /> }}
                            >
                              {f.tip}
                            </ReactMarkdown>
                          </p>
                        </div>
                      ))}

                      {/* Dica de Ouro ENEM */}
                      <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
                        <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-emerald-950 space-y-1">
                          <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-700 block">
                            Síntese &bull; Dica de Ouro para o ENEM
                          </span>
                          <div className="prose prose-sm max-w-none text-emerald-900 text-[11px] leading-relaxed">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                              components={{ p: ({ node, ...props }) => <span {...props} /> }}
                            >
                              {activeModule.enemTip}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>

                      {/* Guia Pedagógico Docente */}
                      <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-2.5">
                        <GraduationCap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-blue-950 space-y-1">
                          <span className="font-bold uppercase tracking-wider text-[10px] text-blue-700 block">
                            Sugestão Metodológica para Professores
                          </span>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {activeModule.teacherGuide}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CONTEÚDO DA ABA 3: ACERVO GTMAT & OBMEP */}
                {activeTab === "materiais" && (
                  <div className="space-y-4 animate-fade-in-up max-h-[380px] overflow-y-auto pr-1.5 custom-scrollbar">
                    {/* Card Principal: Unidade GTMAT + Apostila Recomendada */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Card GTMAT */}
                      <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200">
                              CEFET-MG &bull; {activeModule.year}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">[CONT] [VAC] [EXE]</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">{activeModule.gtmatUnitTitle}</h4>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Acesse a apostila oficial em PDF, videoaulas conceituais e listas de exercícios elaboradas pelos professores do CEFET-MG.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <a
                            href={activeModule.gtmatUnitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-8 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Abrir Unidade no GTMAT</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <a
                            href={GTMAT_PORTAL_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-8 px-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                          >
                            <span>Sumário Geral</span>
                          </a>
                        </div>
                      </div>

                      {/* Card Apostila OBMEP Recomendada */}
                      <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                              {activeModule.obmepApostila.number}
                            </span>
                            <span className="text-[10px] font-semibold text-amber-700">Prof. {activeModule.obmepApostila.authors}</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">Apostila OBMEP: {activeModule.obmepApostila.title}</h4>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{activeModule.obmepApostila.focus}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <a
                            href={activeModule.obmepApostila.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-8 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Abrir PDF da Apostila</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Acervo Completo de Apostilas OBMEP (PIC) */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-bold text-slate-900">Biblioteca Completa de Apostilas OBMEP (PIC)</span>
                        </div>
                        <a
                          href={OBMEP_PORTAL_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Portal IMPA</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        {OBMEP_APOSTILAS.map((ap, i) => (
                          <a
                            key={i}
                            href={ap.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/40 transition-all flex flex-col justify-between space-y-1.5 group"
                          >
                            <div>
                              <span className="text-[9px] font-extrabold text-amber-700 block uppercase">{ap.number}</span>
                              <p className="text-xs font-bold text-slate-800 group-hover:text-amber-900 truncate">{ap.title}</p>
                              <p className="text-[10px] text-slate-400 truncate">{ap.authors}</p>
                            </div>
                            <span className="text-[10px] font-bold text-amber-600 inline-flex items-center gap-1">
                              <span>Abrir PDF</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MateriasPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-500">Carregando Matérias &amp; Acervo GTMAT/OBMEP...</p>
        </div>
      }
    >
      <TabGuard tabId="materias">
        <MateriasContent />
      </TabGuard>
    </Suspense>
  )
}
