"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useAppStore } from "@/store/useAppStore"
import { getModuleForTopic } from "@/data/studyMaterials"
import {
  Target,
  ArrowRight,
  Shuffle,
  CheckCircle2,
  ChevronRight,
  PlayCircle,
  Flame,
  Sparkles,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AIAssistantProgress } from "@/components/ui/AIAssistantProgress"

// Etapas pedagógicas do Arco de Maguerez para a timeline interativa
const ARCO_STEPS = [
  {
    step: 1,
    title: "Observação da Realidade",
    desc: "A aprendizagem parte de um problema do cotidiano, notícia, gráfico ou fenômeno concreto da realidade (matriz ENEM/vestibulares).",
    iaRole: "Apresenta o contexto prático sem jargões e estimula a curiosidade do aluno sem dar respostas prévias.",
  },
  {
    step: 2,
    title: "Pontos-Chave",
    desc: "O estudante extrai do problema as grandezas matemáticas essenciais, separando dados úteis de ruídos.",
    iaRole: "Lança perguntas socráticas para o aluno discernir o que é fixo e o que varia no problema.",
  },
  {
    step: 3,
    title: "Teorização",
    desc: "O aluno conecta o problema concreto às teorias, definições e modelos formais (função afim, geometria, equações).",
    iaRole: "Provoca o aluno a lembrar qual modelo matemático descreve o comportamento observado e sugere videoaula de apoio.",
  },
  {
    step: 4,
    title: "Hipóteses de Solução",
    desc: "O aluno elabora suas próprias etapas de resolução algébrica, aplicando os conceitos matemáticos estabelecidos.",
    iaRole: "Valida a hipótese do estudante e encoraja os cálculos sem antecipar o resultado intermediário.",
  },
  {
    step: 5,
    title: "Aplicação à Realidade",
    desc: "O resultado é reconectado ao problema prático inicial, consolidando a autonomia e o significado do aprendizado.",
    iaRole: "Ajuda o aluno a conferir o gabarito por reflexão própria e desafia com um desdobramento do cotidiano.",
  },
]

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { solvedQuestionIds, reviewQuestionIds, syncQuestionProgress } = useAppStore()

  const [enemQuestions, setEnemQuestions] = useState<any[]>([])
  const [selectedYearTab, setSelectedYearTab] = useState<"1º Ano" | "2º Ano" | "3º Ano">("1º Ano")
  const [selectedStep, setSelectedStep] = useState(0)

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
        }
        if (tData && Array.isArray(tData.solvedQuestionIds)) {
          syncQuestionProgress(tData.solvedQuestionIds, tData.reviewQuestionIds || [])
        }
      })
      .catch((err) => console.error("Erro ao carregar dados do dashboard:", err))
  }, [])

  // Métricas agregadas
  function getQuestionsByYear(ano: string) {
    return enemQuestions.filter((q) => q.ano_ensino_medio === ano)
  }

  const ano1 = getQuestionsByYear("1º Ano")
  const ano2 = getQuestionsByYear("2º Ano")
  const ano3 = getQuestionsByYear("3º Ano")
  const totalQuestions = enemQuestions.length || 90
  const totalSolved = enemQuestions.filter((q) => solvedQuestionIds.includes(String(q.id))).length

  const uniqueTopics = new Set(enemQuestions.map((q) => q.topico_bncc)).size || 29

  // Seleção determinística da "Missão do Dia" (3 questões: 1 Aquecimento, 1 Exploração, 1 Desafio/Revisão)
  const dailyMission = useMemo(() => {
    if (enemQuestions.length === 0) return []
    const todayKey = new Date().toISOString().slice(0, 10)
    let seed = 0
    for (let i = 0; i < todayKey.length; i++) {
      seed = (seed * 31 + todayKey.charCodeAt(i)) % 100000
    }

    const pickDeterministic = (pool: any[], offset: number) => {
      if (pool.length === 0) return enemQuestions[offset % enemQuestions.length]
      return pool[(seed + offset) % pool.length]
    }

    const q1 = pickDeterministic(ano1.length > 0 ? ano1 : enemQuestions, 1)
    const q2Pool = (ano2.length > 0 ? ano2 : enemQuestions).filter((q) => q.id !== q1?.id)
    const q2 = pickDeterministic(q2Pool, 7)

    // Se o aluno tiver alguma questão marcada para revisão, colocamos como 3ª missão; senão, 3º Ano
    const reviewPool = enemQuestions.filter(
      (q) => reviewQuestionIds.includes(String(q.id)) && q.id !== q1?.id && q.id !== q2?.id
    )
    const q3Pool =
      reviewPool.length > 0
        ? reviewPool
        : (ano3.length > 0 ? ano3 : enemQuestions).filter((q) => q.id !== q1?.id && q.id !== q2?.id)
    const q3 = pickDeterministic(q3Pool, 13)

    return [
      {
        label: "1. Aquecimento",
        badge: "1º Ano",
        question: q1,
      },
      {
        label: "2. Exploração",
        badge: "2º Ano",
        question: q2,
      },
      {
        label: reviewPool.length > 0 ? "3. Resgate" : "3. Desafio",
        badge: reviewPool.length > 0 ? "Revisar" : "3º Ano",
        question: q3,
      },
    ].filter((item) => item.question)
  }, [enemQuestions, reviewQuestionIds.length])

  const missionCompletedCount = dailyMission.filter((m) =>
    solvedQuestionIds.includes(String(m.question?.id))
  ).length

  // Iniciar próxima questão pendente da missão ou sortear uma não resolvida
  function handlePraticarAleatoria() {
    if (enemQuestions.length > 0) {
      const pendingMission = dailyMission.find(
        (m) => !solvedQuestionIds.includes(String(m.question?.id))
      )
      if (pendingMission?.question) {
        router.push(`/workspace/${pendingMission.question.id}`)
        return
      }
      const unsolved = enemQuestions.filter((q) => !solvedQuestionIds.includes(String(q.id)))
      const pool = unsolved.length > 0 ? unsolved : enemQuestions
      const randomIndex = Math.floor(Math.random() * pool.length)
      router.push(`/workspace/${pool[randomIndex].id}`)
    } else {
      router.push("/explorador")
    }
  }

  // Agrupador de tópicos por ano
  function getTopicDistribution(items: any[]) {
    const topicCounts: Record<string, { total: number; solved: number }> = {}
    items.forEach((q) => {
      if (q.topico_bncc) {
        if (!topicCounts[q.topico_bncc]) {
          topicCounts[q.topico_bncc] = { total: 0, solved: 0 }
        }
        topicCounts[q.topico_bncc].total += 1
        if (solvedQuestionIds.includes(String(q.id))) {
          topicCounts[q.topico_bncc].solved += 1
        }
      }
    })
    return Object.entries(topicCounts).sort((a, b) => b[1].total - a[1].total)
  }

  const currentYearQuestions =
    selectedYearTab === "1º Ano" ? ano1 : selectedYearTab === "2º Ano" ? ano2 : ano3
  const currentTopics = getTopicDistribution(currentYearQuestions)
  const maxTopicCount = currentTopics[0]?.[1]?.total || 1
  const activeStepData = ARCO_STEPS[selectedStep]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-300 font-sans">
      {/* ================= 1. CABEÇALHO COMPACTO COM KPIS EM LINHA ================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              PIBIC CEFET-MG &bull; BCE 2026
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Tutor Socrático Ativo
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Olá, {session?.user?.name?.split(" ")[0] || "Estudante"}! 👋
          </h1>
          <p className="text-xs text-slate-500">
            Trilha de Matemática do Ensino Médio guiada pelo Arco de Maguerez, GTMAT CEFET-MG, Apostilas OBMEP e questões contextualizadas
          </p>
        </div>

        {/* 4 KPIs em Linha */}
        <div className="flex flex-wrap items-center gap-5 text-xs">
          <div>
            <span className="block text-slate-400 font-medium text-[11px]">Seu Domínio</span>
            <span className="text-base font-extrabold text-emerald-600">
              {totalSolved} / {totalQuestions}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div>
            <span className="block text-slate-400 font-medium text-[11px]">Matriz BNCC</span>
            <span className="text-base font-extrabold text-slate-900">{uniqueTopics} Tópicos</span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div>
            <span className="block text-slate-400 font-medium text-[11px]">Motor Socrático</span>
            <span className="text-base font-extrabold text-blue-600">GPT-OSS 120B</span>
          </div>
        </div>
      </div>

      {/* ================= 2. GRID DE 2 COLUNAS (EQUILÍBRIO ANALÍTICO) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna da Esquerda (8 Colunas - 65%) */}
        <div className="lg:col-span-8 space-y-6">
          {/* MISSÃO DO DIA: DESAFIO RÁPIDO DE 3 QUESTÕES */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    <Flame className="w-3 h-3 text-amber-300" />
                    <span>Missão do Dia &bull; {missionCompletedCount}/3 Concluídas</span>
                  </span>
                </div>
                <h2 className="text-lg font-bold">Desafio Guiado de 3 Questões (~15 min)</h2>
                <p className="text-blue-100 text-xs leading-relaxed max-w-xl">
                  Uma trilha diária curta com 1 questão de aquecimento, 1 de exploração intermediária e 1 desafio para consolidar seu raciocínio com o Malba.
                </p>
              </div>

              <Button
                onClick={handlePraticarAleatoria}
                className="bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs h-10 px-4 rounded-xl shrink-0 shadow-xs flex items-center gap-2"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>
                  {missionCompletedCount < 3 ? "Iniciar Próxima da Missão" : "Sortear Nova Questão"}
                </span>
              </Button>
            </div>

            {/* Os 3 Cards da Missão Diária */}
            {dailyMission.length > 0 && (
              <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/60">
                {dailyMission.map((m, idx) => {
                  const q = m.question
                  const isDone = solvedQuestionIds.includes(String(q.id))
                  const isReview = !isDone && reviewQuestionIds.includes(String(q.id))
                  const mod = getModuleForTopic(q.topico_bncc)

                  return (
                    <div
                      key={q.id || idx}
                      onClick={() => router.push(`/workspace/${q.id}`)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 group ${
                        isDone
                          ? "bg-emerald-50/50 border-emerald-200 hover:border-emerald-400"
                          : "bg-white border-slate-200/80 hover:border-blue-400 hover:shadow-xs"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                            {m.label}
                          </span>
                          {isDone ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                              <CheckCircle2 className="w-3 h-3" /> Feita
                            </span>
                          ) : isReview ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                              <RotateCcw className="w-3 h-3" /> Revisar
                            </span>
                          ) : (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 whitespace-nowrap ${
                                m.badge === "2º Ano"
                                  ? "text-violet-700 bg-violet-50 border-violet-200/80"
                                  : m.badge === "3º Ano"
                                  ? "text-emerald-700 bg-emerald-50 border-emerald-200/80"
                                  : "text-blue-700 bg-blue-50 border-blue-200/80"
                              }`}
                            >
                              {m.badge}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                          {q.topico_bncc}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                          {q.enunciado}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/materias?module=${mod.id}`)
                          }}
                          className="text-slate-500 hover:text-blue-600 font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <PlayCircle className="w-3.5 h-3.5 text-red-500" />
                          <span>Aula</span>
                        </button>
                        <span className="font-bold text-blue-600 inline-flex items-center gap-0.5">
                          <span>{isDone ? "Rever" : "Resolver"}</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Abas por Série (1º, 2º e 3º Ano) com Domínio e Link para Videoaula */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Matérias &amp; Domínio por Série
                </h3>
                <p className="text-xs text-slate-500">
                  Clique em &ldquo;Aula&rdquo; para assistir à revisão no YouTube ou em &ldquo;Praticar&rdquo; para resolver questões do tema
                </p>
              </div>

              {/* Alternador de Série */}
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
                {(["1º Ano", "2º Ano", "3º Ano"] as const).map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYearTab(yr)}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      selectedYearTab === yr
                        ? "bg-white text-blue-700 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista com Barras de Progresso e Botões de Aula / Prática */}
            <div className="space-y-3 pt-1">
              {currentTopics.slice(0, 6).map(([topic, stats]) => {
                const percentWidth = Math.round((stats.total / maxTopicCount) * 100)
                const masteryPct =
                  stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0
                const mod = getModuleForTopic(topic)

                return (
                  <div
                    key={topic}
                    className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 hover:border-blue-200 transition-colors space-y-2"
                  >
                    <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-slate-800 truncate">{topic}</span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {stats.solved}/{stats.total} dominadas
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/materias?module=${mod.id}`}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                        >
                          <PlayCircle className="w-3.5 h-3.5 text-red-500" />
                          <span>Videoaula</span>
                        </Link>
                        <Link
                          href={`/explorador?topic=${encodeURIComponent(topic)}`}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/80 hover:bg-blue-100 text-blue-700 font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Praticar ({stats.total})</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-500"
                        style={{ width: `${(percentWidth * masteryPct) / 100}%` }}
                        title={`${stats.solved} dominadas`}
                      />
                      <div
                        className="bg-blue-600/40 h-full transition-all duration-500"
                        style={{ width: `${percentWidth - (percentWidth * masteryPct) / 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pt-2 flex flex-wrap justify-between items-center gap-2 text-xs border-t border-slate-100">
              <Link
                href="/materias"
                className="font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1"
              >
                <PlayCircle className="w-3.5 h-3.5 text-red-500" />
                <span>Ver todas as Matérias &amp; Playlists YouTube</span>
              </Link>
              <Link
                href="/explorador"
                className="font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                Abrir Catálogo BNCC Completo <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Coluna da Direita (4 Colunas - 35%) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card de Atalho para Matérias & Videoaulas */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 space-y-3 shadow-xs border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                <PlayCircle className="w-3.5 h-3.5 text-red-400" />
                <span>GTMAT CEFET-MG &amp; OBMEP</span>
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">12 Módulos EM</span>
            </div>
            <h3 className="font-bold text-base leading-snug">
              Estude a teoria com o GTMAT CEFET-MG e aprofunde com a OBMEP!
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Assista às videoaulas do GTMAT CEFET-MG (mídia principal) e de revisão rápida (mídia secundária), consulte as apostilas em PDF da OBMEP e a cola de fórmulas.
            </p>
            <Button
              onClick={() => router.push("/materias")}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-9 rounded-xl flex items-center justify-center gap-1.5"
            >
              <span>Explorar Matérias, GTMAT &amp; OBMEP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Card Metodológico: Arco de Maguerez Interativo */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h3 className="font-bold text-slate-900 text-sm">Metodologia Socrática</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              O fluxo de 5 etapas para evitar que a IA dê respostas prontas:
            </p>

            <div className="space-y-1.5 pt-1">
              {ARCO_STEPS.map((st, idx) => (
                <button
                  key={st.step}
                  onClick={() => setSelectedStep(idx)}
                  className={`w-full text-left p-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                    selectedStep === idx
                      ? "bg-blue-50 text-blue-800 font-bold border border-blue-200/80"
                      : "bg-slate-50/70 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                        selectedStep === idx
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {st.step}
                    </span>
                    <span className="truncate">{st.title}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                </button>
              ))}
            </div>

            {/* Descrição da Etapa Selecionada */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-2">
              <div>
                <strong className="text-slate-900 block mb-0.5">
                  Etapa {activeStepData.step}: {activeStepData.title}
                </strong>
                <p className="leading-relaxed text-slate-600">{activeStepData.desc}</p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 text-[11px] text-blue-700 font-medium">
                <span className="font-bold">Intervenção da IA:</span> {activeStepData.iaRole}
              </div>
            </div>

            <Link href="/professor/tutorial" className="block pt-1 text-center">
              <span className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 justify-center">
                <span>Ler Tutorial Docente</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Widget flutuante de progresso de formatação de questões */}
      <AIAssistantProgress />
    </div>
  )
}
