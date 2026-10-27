"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useAppStore } from "@/store/useAppStore"
import { 
  BookOpen, 
  Layers, 
  Target, 
  ArrowRight, 
  Play, 
  Shuffle, 
  Compass, 
  CheckCircle2, 
  GraduationCap, 
  ChevronRight, 
  FileSpreadsheet,
  Bot
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AIAssistantProgress } from "@/components/ui/AIAssistantProgress"

// Etapas pedagógicas do Arco de Maguerez para a timeline interativa
const ARCO_STEPS = [
  {
    step: 1,
    title: "Observação da Realidade",
    desc: "A aprendizagem parte de um problema do cotidiano, notícia, gráfico ou fenômeno concreto da realidade (matriz ENEM/vestibulares).",
    iaRole: "Apresenta o contexto prático sem jargões e estimula a curiosidade do aluno sem dar respostas prévias."
  },
  {
    step: 2,
    title: "Pontos-Chave",
    desc: "O estudante extrai do problema as grandezas matemáticas essenciais, separando dados úteis de ruídos.",
    iaRole: "Lança perguntas socráticas para o aluno discernir o que é fixo e o que varia no problema."
  },
  {
    step: 3,
    title: "Teorização",
    desc: "O aluno conecta o problema concreto às teorias, definições e modelos formais (função afim, geometria, equações).",
    iaRole: "Provoca o aluno a lembrar qual modelo matemático descreve o comportamento observado sem dar fórmulas."
  },
  {
    step: 4,
    title: "Hipóteses de Solução",
    desc: "O aluno elabora suas próprias etapas de resolução algébrica, aplicando os conceitos matemáticos estabelecidos.",
    iaRole: "Valida a hipótese do estudante e encoraja os cálculos sem antecipar o resultado intermediário."
  },
  {
    step: 5,
    title: "Aplicação à Realidade",
    desc: "O resultado é reconectado ao problema prático inicial, consolidando a autonomia e o significado do aprendizado.",
    iaRole: "Ajuda o aluno a conferir o gabarito por reflexão própria e desafia com um desdobramento do cotidiano."
  }
]

export default function DashboardPage() {
  const { data: session } = useSession()
  const tokenUsage = useAppStore(state => state.tokenUsage)
  const router = useRouter()
  
  const [enemQuestions, setEnemQuestions] = useState<any[]>([])
  const [selectedYearTab, setSelectedYearTab] = useState<"1º Ano" | "2º Ano" | "3º Ano">("1º Ano")
  const [selectedStep, setSelectedStep] = useState(0)

  useEffect(() => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEnemQuestions(data)
        }
      })
      .catch(err => console.error("Erro ao carregar questões:", err))
  }, [])

  // Métricas agregadas
  function getQuestionsByYear(ano: string) {
    return enemQuestions.filter(q => q.ano_ensino_medio === ano)
  }

  const ano1 = getQuestionsByYear("1º Ano")
  const ano2 = getQuestionsByYear("2º Ano")
  const ano3 = getQuestionsByYear("3º Ano")
  const totalQuestions = enemQuestions.length || 90

  const uniqueTopics = new Set(enemQuestions.map(q => q.topico_bncc)).size || 29

  // Iniciar questão aleatória para experiência imediata de estudo
  function handlePraticarAleatoria() {
    if (enemQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * enemQuestions.length)
      router.push(`/workspace/${enemQuestions[randomIndex].id}`)
    } else {
      router.push('/explorador')
    }
  }

  // Agrupador de tópicos por ano
  function getTopicDistribution(items: any[]) {
    const topicCounts: Record<string, number> = {}
    items.forEach(q => {
      if (q.topico_bncc) {
        topicCounts[q.topico_bncc] = (topicCounts[q.topico_bncc] || 0) + 1
      }
    })
    return Object.entries(topicCounts).sort((a, b) => b[1] - a[1])
  }

  const currentYearQuestions = selectedYearTab === "1º Ano" ? ano1 : selectedYearTab === "2º Ano" ? ano2 : ano3
  const currentTopics = getTopicDistribution(currentYearQuestions)
  const maxTopicCount = currentTopics[0]?.[1] || 1
  const activeStepData = ARCO_STEPS[selectedStep]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-300 font-sans">
      
      {/* ================= 1. CABEÇALHO COMPACTO COM KPIS EM LINHA ================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">PIBIC CEFET-MG &bull; BCE 2026</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Tutor Socrático Ativo
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Olá, {session?.user?.name?.split(" ")[0] || "Pesquisador"}! 👋
          </h1>
          <p className="text-xs text-slate-500">Mapeamento estruturado das {totalQuestions} questões e telemetria socrática</p>
        </div>

        {/* 3 KPIs em Linha */}
        <div className="flex items-center gap-5 text-xs">
          <div>
            <span className="block text-slate-400 font-medium text-[11px]">Banco ENEM</span>
            <span className="text-base font-extrabold text-slate-900">{totalQuestions} Questões</span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div>
            <span className="block text-slate-400 font-medium text-[11px]">Matriz BNCC</span>
            <span className="text-base font-extrabold text-emerald-600">{uniqueTopics} Tópicos</span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div>
            <span className="block text-slate-400 font-medium text-[11px]">Motor Socrático</span>
            <span className="text-base font-extrabold text-blue-600">Llama 3.3</span>
          </div>
        </div>
      </div>

      {/* ================= 2. GRID DE 2 COLUNAS (EQUILÍBRIO ANALÍTICO) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Coluna da Esquerda (8 Colunas - 65%) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Banner de Ação Rápida */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-md">
              <span className="inline-block bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Prática Imediata
              </span>
              <h2 className="text-lg font-bold">Experimente o Arco de Maguerez</h2>
              <p className="text-blue-100 text-xs leading-relaxed">
                Sorteie um problema e teste as perguntas reflexivas da IA pedagógica em tempo real.
              </p>
            </div>
            <Button 
              onClick={handlePraticarAleatoria}
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs h-10 px-5 rounded-xl shrink-0 shadow-xs flex items-center gap-2"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Sortear Questão</span>
            </Button>
          </div>

          {/* Abas por Série (1º, 2º e 3º Ano) em Tabela Compacta */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Distribuição Temática por Série</h3>
                <p className="text-xs text-slate-500">Tópicos curriculares mais incidentes no ENEM</p>
              </div>

              {/* Alternador de Série */}
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
                {(["1º Ano", "2º Ano", "3º Ano"] as const).map(yr => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYearTab(yr)}
                    className={`px-3 py-1 rounded-lg transition-all ${
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

            {/* Lista com Barras Proporcionais */}
            <div className="space-y-3 pt-1">
              {currentTopics.slice(0, 5).map(([topic, count]) => {
                const percent = Math.round((count / maxTopicCount) * 100)
                return (
                  <div key={topic} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-700 truncate pr-2">{topic}</span>
                      <span className="font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px] shrink-0">
                        {count} {count === 1 ? 'questão' : 'questões'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pt-2 flex justify-between items-center text-xs border-t border-slate-100">
              <span className="text-slate-400">Total de {currentYearQuestions.length} questões mapeadas nesta série</span>
              <Link href="/explorador" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
                Abrir no Catálogo BNCC <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Coluna da Direita (4 Colunas - 35%) */}
        <div className="lg:col-span-4 space-y-6">
          
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
                  className={`w-full text-left p-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    selectedStep === idx
                      ? "bg-blue-50 text-blue-800 font-bold border border-blue-200/80"
                      : "bg-slate-50/70 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      selectedStep === idx ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}>
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

          {/* Ficha Institucional PIBIC Discreta */}
          <div className="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-2 text-slate-600">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Projeto de Pesquisa Científica</span>
            <div className="space-y-1">
              <p><strong>Orientando:</strong> Illano Ayala</p>
              <p><strong>Orientador:</strong> Dr. Emerson Costa</p>
              <p className="text-[11px] text-slate-500 pt-0.5">CEFET-MG &bull; Campus V Divinópolis</p>
            </div>

            <div className="pt-2 border-t border-slate-200/80">
              <a 
                href="/api/telemetry/export" 
                download 
                className="flex items-center justify-between text-[11px] font-semibold text-slate-700 hover:text-blue-600 p-2 rounded-lg bg-white border border-slate-200 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  Exportar Telemetria CSV
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* Widget flutuante de progresso de formatação de questões */}
      <AIAssistantProgress />

    </div>
  )
}
