"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  BookOpen, 
  Layers, 
  Target, 
  ArrowRight, 
  Play, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  ChevronRight, 
  BarChart2,
  FileSpreadsheet,
  Zap,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  Shuffle,
  Eye,
  Bot
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function DashboardDemoPage() {
  const router = useRouter()
  const [activeIdea, setActiveIdea] = useState<"a" | "b" | "c">("a")

  // Estados interativos comuns
  const [selectedYearTab, setSelectedYearTab] = useState<"1º Ano" | "2º Ano" | "3º Ano">("1º Ano")
  const [isMetodologiaExpanded, setIsMetodologiaExpanded] = useState(false)
  const [activeTabOptionC, setActiveTabOptionC] = useState<"estudante" | "pesquisa">("estudante")
  const [selectedStepOptionB, setSelectedStepOptionB] = useState(0)

  const stepsMaguerez = [
    { num: 1, name: "Observação da Realidade", desc: "Problema prático cotidiano ou gráfico do ENEM sem jargões prévios." },
    { num: 2, name: "Pontos-Chave", desc: "Discernimento entre o que é constante e o que varia no problema." },
    { num: 3, name: "Teorização", desc: "Conexão com o modelo formal (ex: função afim, geometria)." },
    { num: 4, name: "Hipóteses de Solução", desc: "Cálculo algébrico autônomo sem gabarito antecipado." },
    { num: 5, name: "Aplicação à Realidade", desc: "Sentido prático e validação do resultado pelo próprio estudante." }
  ]

  const topicsByYear = {
    "1º Ano": [
      { name: "Função Afim e Gráficos do 1º Grau", count: 12, percent: 85 },
      { name: "Razões, Proporções e Escalas Numéricas", count: 9, percent: 65 },
      { name: "Equações e Sistemas Lineares Básicos", count: 6, percent: 45 },
      { name: "Conjuntos Numéricos e Intervalos", count: 3, percent: 25 },
    ],
    "2º Ano": [
      { name: "Geometria Espacial (Prismas e Cilindros)", count: 11, percent: 80 },
      { name: "Trigonometria no Triângulo Retângulo", count: 9, percent: 65 },
      { name: "Análise Combinatória e Contagem", count: 7, percent: 50 },
      { name: "Matrizes e Determinantes", count: 3, percent: 20 },
    ],
    "3º Ano": [
      { name: "Estatística (Média, Moda e Mediana)", count: 13, percent: 90 },
      { name: "Probabilidade Simples e Condicional", count: 9, percent: 65 },
      { name: "Geometria Analítica (Retas e Circunferências)", count: 5, percent: 40 },
      { name: "Matemática Financeira (Juros Simples e Compostos)", count: 3, percent: 25 },
    ]
  }

  return (
    <div className="min-h-full bg-slate-50 text-slate-900 pb-16 font-sans">
      
      {/* ================= BARRA DE CONTROLE FLUTUANTE DO SHOWROOM ================= */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Showroom de Redesign</span>
                <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                  Nordic Calm
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Alterne entre as 3 propostas para ver a Dashboard em tempo real</p>
            </div>
          </div>

          {/* Botões das 3 Ideias e Link para Demos de Login */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveIdea("a")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeIdea === "a"
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>🎒</span>
                <span>Opção A: Foco em Prática</span>
              </button>

              <button
                onClick={() => setActiveIdea("b")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeIdea === "b"
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>📐</span>
                <span>Opção B: Panorâmica 2 Colunas</span>
              </button>

              <button
                onClick={() => setActiveIdea("c")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeIdea === "c"
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>🗂️</span>
                <span>Opção C: Modular em Abas</span>
              </button>
            </div>

            <Link 
              href="/demo/catalogo" 
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>Catálogo BNCC &rarr;</span>
            </Link>

            <Link 
              href="/demo/maguerez" 
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>Arco de Maguerez &rarr;</span>
            </Link>
          </div>

        </div>
      </div>

      {/* ================= ÁREA DE CONTEÚDO PRINCIPAL ================= */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">

        {/* ========================================================================= */}
        {/* OPÇÃO A: FOCO EM PRÁTICA & APRENDIZAGEM (KHAN ACADEMY STYLE) */}
        {/* ========================================================================= */}
        {activeIdea === "a" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* 1. Header Leve & Acolhedor (Fundo Claro Integrado) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">PIBIC CEFET-MG &bull; BCE 2026</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Tutor Socrático Ativo
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Olá, Illano! 👋
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed font-light">
                  Pronto para exercitar o raciocínio matemático hoje? O Malba está pronto para te guiar passo a passo, sem te dar a resposta pronta.
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                <Button 
                  onClick={() => router.push('/explorador')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-5 rounded-xl shadow-xs gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Praticar Questão Rápida
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/explorador')}
                  className="border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold h-11 px-4 rounded-xl"
                >
                  <Compass className="w-4 h-4 mr-2 text-slate-500" />
                  Catálogo Completo
                </Button>
              </div>
            </div>

            {/* 2. Card Principal: "Desafio Recomendado do Dia" */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 relative overflow-hidden group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 border border-blue-200/60 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      1º Ano &bull; Álgebra
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      ENEM &bull; Habilidade H19 (Modelagem Matemática)
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    Função Afim e Tarifas de Consumo Elétrico
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    Um problema prático com cobrança fixa e variável onde você deduzirá o modelo algébrico com a mediação socrática do Malba.
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> ~8 min de resolução
                    </span>
                    <span>&bull;</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Nível Médio
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
                  <Link href="/explorador">
                    <Button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 px-6 rounded-xl shadow-xs gap-2">
                      <span>Iniciar Resolução Socrática</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <p className="text-[11px] text-center text-slate-400">Sem fórmulas prontas &bull; Raciocínio próprio</p>
                </div>
              </div>
            </div>

            {/* 3. Trilha por Série (Cards Arejados 1º, 2º e 3º Ano) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Trilha Curricular do Ensino Médio</h3>
                  <p className="text-xs text-slate-500">180 problemas catalogados na BNCC e Matriz ENEM</p>
                </div>
                <Link href="/explorador" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                  Ver todo o banco <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1º Ano */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 font-black text-sm flex items-center justify-center">
                        1º
                      </span>
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 text-xs">
                        30 questões
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">Funções e Proporções</h4>
                      <p className="text-xs text-slate-500 mt-1">Modelagem do 1º grau, razões, proporções e escalas numéricas.</p>
                    </div>
                  </div>
                  <Link href="/explorador" className="mt-5">
                    <Button variant="outline" className="w-full text-xs font-semibold h-9 rounded-xl border-slate-200 hover:bg-blue-50 hover:text-blue-700">
                      Explorar 1º Ano &rarr;
                    </Button>
                  </Link>
                </div>

                {/* 2º Ano */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-violet-400 hover:shadow-sm transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-9 h-9 rounded-xl bg-violet-50 text-violet-700 font-black text-sm flex items-center justify-center">
                        2º
                      </span>
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 text-xs">
                        30 questões
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">Geometria e Análise</h4>
                      <p className="text-xs text-slate-500 mt-1">Geometria espacial, trigonometria e análise combinatória.</p>
                    </div>
                  </div>
                  <Link href="/explorador" className="mt-5">
                    <Button variant="outline" className="w-full text-xs font-semibold h-9 rounded-xl border-slate-200 hover:bg-violet-50 hover:text-violet-700">
                      Explorar 2º Ano &rarr;
                    </Button>
                  </Link>
                </div>

                {/* 3º Ano */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-emerald-400 hover:shadow-sm transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 font-black text-sm flex items-center justify-center">
                        3º
                      </span>
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 text-xs">
                        30 questões
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">Estatística e Revisão</h4>
                      <p className="text-xs text-slate-500 mt-1">Tratamento da informação, médias, desvios e probabilidades.</p>
                    </div>
                  </div>
                  <Link href="/explorador" className="mt-5">
                    <Button variant="outline" className="w-full text-xs font-semibold h-9 rounded-xl border-slate-200 hover:bg-emerald-50 hover:text-emerald-700">
                      Explorar 3º Ano &rarr;
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* 4. Metodologia em Banner Compacto Expansível */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all">
              <button 
                onClick={() => setIsMetodologiaExpanded(!isMetodologiaExpanded)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Como funciona o Tutor Socrático (Arco de Maguerez)?</h4>
                    <p className="text-xs text-slate-500">Conheça as 5 etapas pedagógicas que conduzem o raciocínio sem entregar respostas prontas.</p>
                  </div>
                </div>
                <div className="text-xs font-bold text-blue-600 flex items-center gap-1 shrink-0 ml-2">
                  <span>{isMetodologiaExpanded ? "Recolher" : "Ver Etapas"}</span>
                  {isMetodologiaExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isMetodologiaExpanded && (
                <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-5 gap-3 animate-in fade-in duration-200">
                  {stepsMaguerez.map(s => (
                    <div key={s.num} className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Etapa {s.num}</span>
                      <h5 className="text-xs font-bold text-slate-900 leading-tight">{s.name}</h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed pt-0.5">{s.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* OPÇÃO B: VISÃO PANORÂMICA EM 2 COLUNAS (EQUILÍBRIO ANALÍTICO) */}
        {/* ========================================================================= */}
        {activeIdea === "b" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* 1. Header em Linha com KPIs Compactos */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Painel Curricular &bull; Visão Geral</h1>
                <p className="text-xs text-slate-500">Mapeamento estruturado das 180 questões e telemetria socrática</p>
              </div>

              {/* 3 KPIs em Linha */}
              <div className="flex items-center gap-5 text-xs">
                <div>
                  <span className="block text-slate-400 font-medium text-[11px]">Banco ENEM</span>
                  <span className="text-base font-extrabold text-slate-900">180 Questões</span>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div>
                  <span className="block text-slate-400 font-medium text-[11px]">Matriz BNCC</span>
                  <span className="text-base font-extrabold text-emerald-600">29 Tópicos</span>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div>
                  <span className="block text-slate-400 font-medium text-[11px]">Motor Socrático</span>
                  <span className="text-base font-extrabold text-blue-600">Llama 3.3</span>
                </div>
              </div>
            </div>

            {/* 2. Grid de 2 Colunas */}
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
                    onClick={() => router.push('/explorador')}
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
                    {topicsByYear[selectedYearTab].map(t => (
                      <div key={t.name} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-slate-700">{t.name}</span>
                          <span className="font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {t.count} questões
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${t.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs border-t border-slate-100">
                    <span className="text-slate-400">Total de 30 questões nesta série</span>
                    <Link href="/explorador" className="font-bold text-blue-600 hover:underline">
                      Abrir no Catálogo BNCC &rarr;
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
                    Clique nas 5 etapas para entender o fluxo cognitivo:
                  </p>

                  <div className="space-y-1.5 pt-1">
                    {stepsMaguerez.map((st, idx) => (
                      <button
                        key={st.num}
                        onClick={() => setSelectedStepOptionB(idx)}
                        className={`w-full text-left p-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                          selectedStepOptionB === idx
                            ? "bg-blue-50 text-blue-800 font-bold border border-blue-200/80"
                            : "bg-slate-50/70 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                            selectedStepOptionB === idx ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                          }`}>
                            {st.num}
                          </span>
                          <span className="truncate">{st.name}</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                      </button>
                    ))}
                  </div>

                  {/* Descrição da Etapa Selecionada */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-800 block mb-1">
                      {stepsMaguerez[selectedStepOptionB].num}. {stepsMaguerez[selectedStepOptionB].name}
                    </strong>
                    {stepsMaguerez[selectedStepOptionB].desc}
                  </div>
                </div>

                {/* Ficha Institucional PIBIC Discreta */}
                <div className="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-1.5 text-slate-600">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Projeto de Pesquisa Científica</span>
                  <p><strong>Orientando:</strong> Illano Ayala</p>
                  <p><strong>Orientador:</strong> Dr. Emerson Costa</p>
                  <p className="text-[11px] text-slate-500 pt-1">CEFET-MG &bull; Campus V Divinópolis</p>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* OPÇÃO C: MODULAR EM ABAS (ESTUDANTE vs PESQUISA/DOCÊNCIA) */}
        {/* ========================================================================= */}
        {activeIdea === "c" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Topo com Alternador de Perfil */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard Modular</h1>
                <p className="text-xs text-slate-500">Selecione o modo de visualização ideal para o seu objetivo</p>
              </div>

              {/* Seletor de Aba */}
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setActiveTabOptionC("estudante")}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTabOptionC === "estudante"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>🎒</span>
                  <span>Modo Estudante (Prática)</span>
                </button>

                <button
                  onClick={() => setActiveTabOptionC("pesquisa")}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTabOptionC === "pesquisa"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>🔬</span>
                  <span>Modo Pesquisa & Docência</span>
                </button>
              </div>
            </div>

            {/* ABA 1: ESTUDANTE */}
            {activeTabOptionC === "estudante" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Ação Imediata</span>
                  <h3 className="text-lg font-bold text-slate-900">Treinar Questões por Critério</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Escolha como prefere praticar a modelagem matemática hoje:
                  </p>

                  <div className="space-y-2.5 pt-1">
                    <button 
                      onClick={() => router.push('/explorador')}
                      className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                          🎲
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700">Questão Aleatória Rápida</h4>
                          <p className="text-[11px] text-slate-400">Sorteio de qualquer ano do ENEM no banco</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button 
                      onClick={() => router.push('/explorador')}
                      className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                          🔍
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700">Filtrar por Tópico da BNCC</h4>
                          <p className="text-[11px] text-slate-400">Abra o catálogo com filtros por habilidades e séries</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Princípio Socrático</span>
                  <h3 className="text-lg font-bold text-slate-900">Como o Malba te ajuda a pensar</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Aqui você não recebe respostas prontas. Se errar uma alternativa, a IA fará perguntas orientadoras para que você identifique as variáveis e elabore a hipótese algébrica por conta própria.
                  </p>
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 font-medium leading-relaxed">
                    💡 <strong>Objetivo Pedagógico:</strong> Desenvolver a autonomia intelectual e erradicar a passividade cognitiva no ensino médio.
                  </div>
                </div>

              </div>
            )}

            {/* ABA 2: PESQUISA & DOCÊNCIA */}
            {activeTabOptionC === "pesquisa" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* 4 KPIs Acadêmicos */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] text-slate-500 font-medium">Questões Mapeadas</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">180</p>
                    <span className="text-[10px] text-emerald-600 font-bold">100% Curadas</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] text-slate-500 font-medium">Tópicos BNCC</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">29</p>
                    <span className="text-[10px] text-blue-600 font-bold">Álgebra a Geometria</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] text-slate-500 font-medium">Habilidades ENEM</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">46</p>
                    <span className="text-[10px] text-violet-600 font-bold">Matriz Oficial</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] text-slate-500 font-medium">Modelo da IA</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">Llama 3.3</p>
                    <span className="text-[10px] text-amber-600 font-bold">Groq LPUs</span>
                  </div>
                </div>

                {/* Acesso a Roteiros e Exportação */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Relatórios & Planejamento Docente</h3>
                    <p className="text-xs text-slate-500">Baixe os dados quantitativos ou crie roteiros de aula invertida.</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/professor">
                      <Button variant="outline" className="text-xs font-semibold h-10 px-4 rounded-xl border-slate-200">
                        <GraduationCap className="w-4 h-4 mr-1.5" />
                        Roteiros de Aula
                      </Button>
                    </Link>
                    <a href="/api/telemetry/export" download>
                      <Button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold h-10 px-4 rounded-xl">
                        <FileSpreadsheet className="w-4 h-4 mr-1.5" />
                        Exportar CSV
                      </Button>
                    </a>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}
