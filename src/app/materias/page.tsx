"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

function MateriasContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const topicParam = searchParams.get("topic")
  const moduleParam = searchParams.get("module")

  const { solvedQuestionIds, reviewQuestionIds, syncQuestionProgress } = useAppStore()

  const [questions, setQuestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<"Todos" | "1º Ano" | "2º Ano" | "3º Ano">("Todos")
  const [activeModuleId, setActiveModuleId] = useState<string>(STUDY_MODULES[0].id)
  // Mídia Principal ('gtmat') vs Mídia Secundária ('secondary')
  const [mediaSource, setMediaSource] = useState<"gtmat" | "secondary">("gtmat")

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
          syncQuestionProgress(tData.solvedQuestionIds, tData.reviewQuestionIds || [])
        }
      })
      .catch((e) => console.error("Erro ao carregar matérias:", e))
      .finally(() => setIsLoading(false))
  }, [])

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
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold uppercase tracking-wider">
              <PlayCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Etapa 3 do Arco de Maguerez &bull; Teorização &amp; Aprofundamento</span>
            </span>
            <a
              href={GTMAT_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors"
            >
              <span>Portal GTMAT CEFET-MG</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={OBMEP_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold transition-colors"
            >
              <span>Apostilas OBMEP</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Matérias de Matemática &bull; GTMAT CEFET-MG &amp; OBMEP
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Estude a Matemática do Ensino Médio de forma ampla: videoaulas oficiais do <strong>GTMAT CEFET-MG</strong> como mídia principal, vídeos complementares de revisão, apostilas de aprofundamento da <strong>OBMEP (PIC)</strong> e orientações para docentes.
          </p>
        </div>

        {/* Progresso Global do Estudante + Seletor de Série */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">
              {questions.length > 0 ? `${Math.round((totalSolvedOverall / questions.length) * 100)}%` : "0%"}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Progresso em Problemas Práticos
              </span>
              <span className="text-xs font-extrabold text-slate-900">
                {totalSolvedOverall} de {questions.length || 90} questões dominadas
              </span>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            {(["Todos", "1º Ano", "2º Ano", "3º Ano"] as const).map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedYear === yr
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= GRID PRINCIPAL: LISTA DE MATÉRIAS (ESQ) + ESTÚDIO DE AULA (DIR) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUNA ESQUERDA (4 COLUNAS): TRILHA DE MÓDULOS */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Módulos de Matemática ({filteredModules.length})</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">1ª a 3ª Série</span>
          </div>

          <div className="space-y-2.5">
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

              <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setMediaSource("gtmat")}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    mediaSource === "gtmat"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <span>🏛️ Mídia Principal: GTMAT CEFET-MG</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaSource("secondary")}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    mediaSource === "secondary"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <span>▶️ Mídia Secundária: Revisão Rápida</span>
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

              {/* ================= BLOCO DUPLO: GTMAT CEFET-MG + APOSTILA OBMEP ================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Card GTMAT CEFET-MG */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200">
                        Fonte Institucional • CEFET-MG
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        [CONT] [VAC] [EXE] [EXRES]
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {activeModule.gtmatUnitTitle}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Acesse a apostila teórica em PDF (<code>[CONT]</code>), videoaulas (<code>[VAC]</code>), listas de exercícios (<code>[EXE]</code>) e resoluções comentadas (<code>[EXRES]</code>) elaboradas pelos professores do GTMAT/CEFET-MG.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href={activeModule.gtmatUnitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
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
                      <span>Sumário Geral GTMAT</span>
                    </a>
                  </div>
                </div>

                {/* Card Apostila OBMEP / PIC */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                        {activeModule.obmepApostila.number}
                      </span>
                      <span className="text-[10px] font-semibold text-amber-700">
                        Prof. {activeModule.obmepApostila.authors}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Apostila OBMEP: {activeModule.obmepApostila.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {activeModule.obmepApostila.focus}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href={activeModule.obmepApostila.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Abrir PDF da Apostila</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={OBMEP_PORTAL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 px-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Todas as Apostilas</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Guia de Aplicação para Professores + Dica Conceitual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700 space-y-1">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-blue-700 block">
                      Sugestão Metodológica para Professores
                    </span>
                    <p className="leading-relaxed">{activeModule.teacherGuide}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-950 space-y-1">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-700 block">
                      Síntese Conceitual &bull; Ponto-Chave
                    </span>
                    <div className="prose prose-sm max-w-none text-emerald-900 leading-relaxed">
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
              </div>
            </div>
          </div>

          {/* CARD 2: COLA DE BOLSO (FÓRMULAS & RELAÇÕES ESSENCIAIS) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Resumo Formal &bull; Fórmulas, Teoremas e Relações
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Base para a Etapa 3 (Teorização)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {activeModule.formulas.map((f, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
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
            </div>
          </div>

          {/* CARD 3: PROBLEMAS CONTEXTUALIZADOS DESTE TEMA */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Problemas Contextualizados deste Módulo ({activeSolvedCount}/{activeModuleQuestions.length} dominados)
                </h3>
                <p className="text-xs text-slate-500">
                  Clique em qualquer problema para praticar a resolução mediada pelo Tutor Socrático Malba
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  router.push(
                    `/explorador?topic=${encodeURIComponent(activeModule.relatedTopics[0])}`
                  )
                }
                className="h-8 px-3 text-xs font-bold rounded-xl border-slate-200 self-start sm:self-auto"
              >
                <span>Abrir no Catálogo</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>

            {isLoading ? (
              <div className="py-10 flex items-center justify-center text-slate-400 text-xs gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Carregando questões vinculadas...</span>
              </div>
            ) : activeModuleQuestions.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span>
                  Este é um módulo de aprofundamento curricular do Ensino Médio (GTMAT CEFET-MG). Utilize a apostila <code>[CONT]</code> e a lista de exercícios <code>[EXE]</code> diretamente no portal do GTMAT!
                </span>
                <a
                  href={activeModule.gtmatUnitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs shrink-0 inline-flex items-center gap-1"
                >
                  <span>Acessar Lista [EXE] GTMAT</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activeModuleQuestions.map((q) => {
                  const qId = String(q.id)
                  const isSolved = solvedQuestionIds.includes(qId)
                  const isReview = !isSolved && reviewQuestionIds.includes(qId)
                  const skillCode = (q.habilidade_enem || "").split("-")[0].trim()

                  return (
                    <div
                      key={q.id}
                      onClick={() => router.push(`/workspace/${q.id}`)}
                      className="py-3.5 px-3 -mx-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isSolved ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Dominada
                            </span>
                          ) : isReview ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <RotateCcw className="w-3 h-3" />
                              Revisar
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                              <Circle className="w-2.5 h-2.5" />
                              Não tentada
                            </span>
                          )}

                          <span className="text-[11px] font-bold text-slate-700">
                            {q.topico_bncc}
                          </span>
                          <span className="text-slate-300">&bull;</span>
                          <span className="text-[11px] font-semibold text-slate-400">
                            ENEM {q.ano_enem}
                          </span>
                          {skillCode && (
                            <>
                              <span className="text-slate-300">&bull;</span>
                              <span className="text-[11px] font-semibold text-blue-600">
                                {skillCode}
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {q.enunciado}
                        </p>
                      </div>

                      <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 shrink-0">
                        <span>{isSolved ? "Rever Problema" : "Resolver Agora"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= BIBLIOTECA COMPLETA DE APOSTILAS OBMEP (PIC) ================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              Aprofundamento Olímpico &amp; Iniciação Científica Jr.
            </span>
            <h2 className="text-xl font-black text-slate-900">
              Acervo Completo de Apostilas da OBMEP (PIC)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Publicações gratuitas da OBMEP/IMPA recomendadas para aprofundamento teórico de estudantes e oficinas docentes
            </p>
          </div>
          <a
            href={OBMEP_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <span>Portal Oficial OBMEP</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {OBMEP_APOSTILAS.map((ap, i) => (
            <a
              key={i}
              href={ap.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-2xl bg-slate-50/80 hover:bg-amber-50/50 border border-slate-200/80 hover:border-amber-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                  {ap.number}
                </span>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-900 leading-snug">
                  {ap.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                  {ap.focus}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-amber-700">
                <span>Abrir PDF</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          ))}
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
      <MateriasContent />
    </Suspense>
  )
}
