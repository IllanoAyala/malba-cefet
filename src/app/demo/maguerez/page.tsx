"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Sparkles, 
  User, 
  Lock, 
  ArrowRight, 
  GraduationCap, 
  BookOpen,
  Eye,
  Target,
  Brain,
  Lightbulb,
  CheckCircle2
} from "lucide-react"
import { Logo } from "@/components/ui/Logo"
import { Button } from "@/components/ui/button"

export default function DemoMaguerezPage() {
  const [activeOption, setActiveOption] = useState<"1" | "2" | "3">("1")

  // Estado para ciclo suave do nó ativo (Opções 1, 2 e 3)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 5)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  // 5 Etapas em versão ULTRA CONCISA (apenas uma ou duas palavras cada)
  const stepsShort = [
    { num: 1, name: "Observação", icon: Eye, color: "#2563EB" },
    { num: 2, name: "Pontos-Chave", icon: Target, color: "#4F46E5" },
    { num: 3, name: "Teorização", icon: Brain, color: "#7C3AED" },
    { num: 4, name: "Hipóteses", icon: Lightbulb, color: "#059669" },
    { num: 5, name: "Aplicação", icon: CheckCircle2, color: "#0D9488" }
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-blue-200">
      
      {/* ================= BARRA SUPERIOR DE SELEÇÃO DO SHOWROOM ================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <Link 
              href="/demo" 
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Showroom</span>
            </Link>
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Showroom &bull; Arco de Maguerez Minimalista (Zero Textos Longos)
              </span>
              <span className="text-[11px] text-slate-500">
                Animações puramente visuais, simples e hipnóticas
              </span>
            </div>
          </div>

          {/* Seletor das 3 Opções Minimalistas */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveOption("1")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeOption === "1"
                  ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Opção 1: Traço de Luz Fluido
            </button>

            <button
              onClick={() => setActiveOption("2")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeOption === "2"
                  ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Opção 2: Pulsos de Ressonância
            </button>

            <button
              onClick={() => setActiveOption("3")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeOption === "3"
                  ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Opção 3: Esfera Gravitacional
            </button>
          </div>

        </div>
      </header>

      {/* ================= CORPO DA PÁGINA (SIMULANDO O LOGIN) ================= */}
      <main className="max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-8 px-4 sm:px-8">
        
        {/* COLUNA ESQUERDA (7 COLUNAS): APRESENTAÇÃO + ANIMAÇÃO MINIMALISTA */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Iniciação Científica &bull; BCE 2026</span>
          </div>

          {/* Slogan Histórico */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Ensinando o aluno a pensar, não apenas a calcular.
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light max-w-xl">
              Plataforma pedagógica desenvolvida no CEFET-MG com IA Socrática orientada pelo <strong className="font-semibold text-slate-900">Arco de Maguerez</strong>.
            </p>
          </div>

          {/* ========================================================================= */}
          {/* AS 3 OPÇÕES ULTRA MINIMALISTAS (SEM TEXTOS LONGOS) */}
          {/* ========================================================================= */}

          {/* ======================= OPÇÃO 1: TRAÇO DE LUZ FLUIDO ======================= */}
          {activeOption === "1" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden transition-all">
              
              {/* Header super discreto com apenas o nome da metodologia */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Arco de Maguerez
                </span>
                <span className="text-xs font-bold text-blue-600 transition-all duration-300">
                  {stepsShort[activeStep].num}. {stepsShort[activeStep].name}
                </span>
              </div>

              {/* Animação do Arco em SVG Puro */}
              <div className="relative py-2">
                <svg viewBox="0 0 500 130" className="w-full h-auto overflow-visible select-none">
                  <defs>
                    <linearGradient id="opt1Grad" x1="0%" y1="100%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="50%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>

                    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Linha de Base Minimalista */}
                  <line x1="30" y1="105" x2="470" y2="105" stroke="#F1F5F9" strokeWidth="2" strokeDasharray="3 3" />
                  <text x="35" y="122" className="text-[9px] font-bold fill-slate-300 uppercase tracking-wider">
                    Realidade
                  </text>
                  <text x="465" y="122" textAnchor="end" className="text-[9px] font-bold fill-slate-300 uppercase tracking-wider">
                    Realidade
                  </text>

                  {/* Curva Suave da Parábola */}
                  <path
                    d="M 40 105 Q 250 -10 460 105"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Traço Fluido de Luz com preenchimento contínuo */}
                  <path
                    d="M 40 105 Q 250 -10 460 105"
                    fill="none"
                    stroke="url(#opt1Grad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="520"
                    strokeDashoffset={520 - ((activeStep + 1) / 5) * 520}
                    className="transition-all duration-700 ease-out"
                    filter="url(#softGlow)"
                  />

                  {/* 5 Nós com Anel Pulsante Suave */}
                  {[
                    { cx: 40, cy: 105, idx: 0, label: "Observação", dy: -12 },
                    { cx: 125, cy: 55, idx: 1, label: "Pontos-Chave", dy: -14 },
                    { cx: 250, cy: 18, idx: 2, label: "Teorização", dy: -14 },
                    { cx: 375, cy: 55, idx: 3, label: "Hipóteses", dy: -14 },
                    { cx: 460, cy: 105, idx: 4, label: "Aplicação", dy: -12 },
                  ].map((pt) => {
                    const isCurrent = activeStep === pt.idx
                    const isPassed = activeStep >= pt.idx

                    return (
                      <g 
                        key={pt.idx} 
                        className="cursor-pointer transition-all duration-300"
                        onClick={() => setActiveStep(pt.idx)}
                      >
                        {/* Aura pulsante apenas no ponto ativo */}
                        {isCurrent && (
                          <circle
                            cx={pt.cx}
                            cy={pt.cy}
                            r="15"
                            className="fill-blue-500/20 animate-ping"
                          />
                        )}

                        {/* Ponto externo */}
                        <circle
                          cx={pt.cx}
                          cy={pt.cy}
                          r={isCurrent ? "8" : "5"}
                          className={`transition-all duration-300 ${
                            isCurrent
                              ? "fill-white stroke-blue-600 stroke-[3px] shadow-sm"
                              : isPassed
                              ? "fill-blue-600 stroke-white stroke-1"
                              : "fill-white stroke-slate-300 stroke-2"
                          }`}
                        />

                        {/* Rótulo de 1 palavra só */}
                        <text
                          x={pt.cx}
                          y={pt.cy + pt.dy}
                          textAnchor="middle"
                          className={`text-[10px] font-bold transition-all duration-300 ${
                            isCurrent
                              ? "fill-blue-700 font-extrabold text-[11px]"
                              : "fill-slate-400"
                          }`}
                        >
                          {pt.label}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>

            </div>
          )}

          {/* ======================= OPÇÃO 2: PULSOS DE RESSONÂNCIA ======================= */}
          {activeOption === "2" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden transition-all">
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  O Ciclo em 5 Pulsos
                </span>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeStep === i ? "w-5 bg-blue-600" : "w-1.5 bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* 5 Círculos Conectados Minimalistas */}
              <div className="grid grid-cols-5 gap-2 items-center py-2">
                {stepsShort.map((st, idx) => {
                  const Icon = st.icon
                  const isCur = activeStep === idx

                  return (
                    <div
                      key={st.num}
                      onClick={() => setActiveStep(idx)}
                      className="flex flex-col items-center cursor-pointer group"
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isCur
                          ? "bg-blue-600 text-white shadow-md scale-110 ring-4 ring-blue-100"
                          : "bg-slate-50 text-slate-400 border border-slate-200/70 group-hover:border-slate-300 group-hover:text-slate-600"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold mt-2 text-center transition-colors truncate max-w-[70px] ${
                        isCur ? "text-blue-700 font-extrabold" : "text-slate-400"
                      }`}>
                        {st.name}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>01. Realidade</span>
                <span className="font-semibold text-slate-500">03. Teoria</span>
                <span>05. Aplicação</span>
              </div>

            </div>
          )}

          {/* ======================= OPÇÃO 3: ESFERA GRAVITACIONAL ======================= */}
          {activeOption === "3" && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden transition-all">
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Arco de Maguerez &bull; Movimento Gravitacional
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {stepsShort[activeStep].name}
                </span>
              </div>

              {/* Animação Contínua com Bolinha Gravitacional que Desliza Suavemente */}
              <div className="relative py-2">
                <svg viewBox="0 0 500 110" className="w-full h-auto overflow-visible select-none">
                  <defs>
                    <linearGradient id="opt3Grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>

                  {/* Linha da Parábola Suave */}
                  <path
                    d="M 40 90 Q 250 -10 460 90"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Os 5 Pontos de Passagem */}
                  {[
                    { x: 40, y: 90, label: "Realidade" },
                    { x: 125, y: 50, label: "Pontos-Chave" },
                    { x: 250, y: 15, label: "Teorização" },
                    { x: 375, y: 50, label: "Hipóteses" },
                    { x: 460, y: 90, label: "Aplicação" },
                  ].map((p, i) => (
                    <g key={i}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        className={activeStep === i ? "fill-blue-600 stroke-white stroke-2" : "fill-slate-300"}
                      />
                      <text
                        x={p.x}
                        y={p.y + (p.y > 60 ? 18 : -10)}
                        textAnchor="middle"
                        className={`text-[10px] font-bold ${activeStep === i ? "fill-blue-700" : "fill-slate-400"}`}
                      >
                        {p.label}
                      </text>
                    </g>
                  ))}

                  {/* Esfera Gravitacional Deslizante */}
                  {(() => {
                    const coords = [
                      { x: 40, y: 90 },
                      { x: 125, y: 50 },
                      { x: 250, y: 15 },
                      { x: 375, y: 50 },
                      { x: 460, y: 90 },
                    ]
                    const current = coords[activeStep]

                    return (
                      <g className="transition-all duration-700 ease-out">
                        <circle cx={current.x} cy={current.y} r="10" className="fill-blue-600 shadow-lg" />
                        <circle cx={current.x} cy={current.y} r="4" className="fill-white" />
                      </g>
                    )
                  })()}
                </svg>
              </div>

            </div>
          )}

          {/* FICHA DA EQUIPE */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
            <span><strong>Orientando:</strong> Illano Ayala</span>
            <span className="text-slate-300">&bull;</span>
            <span><strong>Orientador:</strong> Dr. Emerson Costa</span>
            <span className="text-slate-300">&bull;</span>
            <span>CEFET-MG Campus V</span>
          </div>

        </div>

        {/* COLUNA DIREITA (5 COLUNAS): CARD ELEGANTE DE AUTENTICAÇÃO SIGAA */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6 relative">
            
            <div>
              <h2 className="text-xl font-bold text-slate-900">Acesso ao SIGAA</h2>
              <p className="text-xs text-slate-500 mt-1">
                Autenticação de discentes e docentes autorizados
              </p>
            </div>

            {/* SELETOR DE PREENCHIMENTO RÁPIDO DE 1 CLIQUE */}
            <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2 pt-0.5">
                Preenchimento rápido de teste:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  className="py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-white text-blue-700 shadow-xs border border-blue-200"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Como Aluno</span>
                </button>

                <button
                  type="button"
                  className="py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-900"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Como Professor</span>
                </button>
              </div>
            </div>

            {/* FORMULÁRIO DE LOGIN SIMULADO */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Matrícula / CPF</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="text"
                    value="aluno"
                    readOnly
                    className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Senha</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="password"
                    value="••••••••"
                    readOnly
                    className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium"
                  />
                </div>
              </div>

              <Button 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Entrar no Malba</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-center pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Sistema Integrado de Gestão de Atividades Acadêmicas
              </span>
            </div>

          </div>
        </div>

      </main>

    </div>
  )
}
