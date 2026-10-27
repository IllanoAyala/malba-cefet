"use client"

import React, { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { 
  User, 
  Lock, 
  Loader2, 
  Info, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Sparkles,
  Layers
} from "lucide-react"
import { Logo } from "@/components/ui/Logo"
import { Button } from "@/components/ui/button"
import { AboutMalbaModal } from "@/components/features/AboutMalbaModal"

export default function LoginPage() {
  const [matricula, setMatricula] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const res = await signIn("credentials", {
      matricula,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Credenciais inválidas. Verifique sua matrícula e senha.")
      setIsLoading(false)
    } else {
      setIsSuccess(true)
      router.push("/")
      router.refresh()
    }
  }

  // TELA DE TRANSIÇÃO APÓS LOGIN
  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-[#F8FAFC] flex flex-col justify-center items-center z-50">
        <div className="flex items-center gap-3 text-slate-900 animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-xl font-bold tracking-tight">Iniciando sessão no Malba...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-8 lg:p-12 font-sans selection:bg-blue-200">
      
      {/* ================= CAMADA DECORATIVA: ESFERAS EM GRADIENTE AZUL ================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
        {/* Esfera 3D suave no canto superior esquerdo */}
        <div
          className="hidden sm:block absolute top-20 left-[6%] w-16 h-16 rounded-full shadow-lg shadow-blue-500/15 opacity-75 animate-float-slow"
          style={{
            background: "radial-gradient(circle at 30% 28%, #E0F2FE 0%, #60A5FA 42%, #2563EB 82%, #1E3A8A 100%)",
          }}
        />

        {/* Pequena esfera luminosa próxima ao centro-inferior */}
        <div
          className="hidden md:block absolute bottom-20 left-[42%] w-10 h-10 rounded-full shadow-md shadow-sky-500/20 opacity-70 animate-float-reverse"
          style={{
            background: "radial-gradient(circle at 32% 30%, #F0F9FF 0%, #38BDF8 45%, #0284C7 90%, #0369A1 100%)",
          }}
        />
      </div>

      {/* ================= 1. CABEÇALHO INSTITUCIONAL SUPERIOR ================= */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200/80">
        <Logo size="md" showBadge={false} subtitle="CEFET-MG • Campus V Divinópolis" />
      </header>

      {/* ================= 2. CORPO PRINCIPAL COM GRID DE 12 COLUNAS ================= */}
      <main className="relative z-10 max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-8">
        
        {/* LADO ESQUERDO (7 COLUNAS): APRESENTAÇÃO INSTITUCIONAL & SLOGAN HISTÓRICO */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/90 backdrop-blur-xs border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Iniciação Científica &bull; BCE 2026</span>
          </div>

          {/* TÍTULO PRINCIPAL (A FRASE HISTÓRICA DO PROJETO) */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Ensinando o aluno a pensar, não apenas a calcular.
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-light max-w-xl">
              Plataforma pedagógica desenvolvida no CEFET-MG com IA Socrática. Utilizamos as 5 etapas do <strong className="font-semibold text-slate-900">Arco de Maguerez</strong> para erradicar a passividade cognitiva e conduzir o estudante a construir a solução com autonomia.
            </p>
          </div>

          {/* INDICADORES ACADÊMICOS EM CARDS LEVES */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/85 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Incidência ENEM</span>
              <p className="text-xl font-black text-slate-900 mt-1">90 Questões</p>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Mapeadas na BNCC
              </span>
            </div>

            <div className="bg-white/85 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Áreas Temáticas</span>
              <p className="text-xl font-black text-slate-900 mt-1">29 Tópicos</p>
              <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-0.5">
                <Layers className="w-3 h-3" /> Álgebra a Geometria
              </span>
            </div>

            <div className="hidden sm:block bg-white/85 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mediação</span>
              <p className="text-xl font-black text-slate-900 mt-1">5 Etapas</p>
              <span className="text-[11px] text-violet-600 font-semibold flex items-center gap-1 mt-0.5">
                <BookOpen className="w-3 h-3" /> Arco de Maguerez
              </span>
            </div>
          </div>

          {/* FICHA DA EQUIPE & LINK SOBRE O MALBA */}
          <div className="flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-500 pt-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span><strong>Orientando:</strong> Illano Ayala</span>
              <span className="text-slate-300">&bull;</span>
              <span><strong>Orientador:</strong> Dr. Emerson Costa</span>
              <span className="text-slate-300">&bull;</span>
              <span>CEFET-MG</span>
            </div>
            <button
              type="button"
              onClick={() => setIsAboutOpen(true)}
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Por que Malba?</span>
            </button>
          </div>

        </div>

        {/* LADO DIREITO (5 COLUNAS): CARD ELEGANTE DE AUTENTICAÇÃO SIGAA */}
        <div className="lg:col-span-5 relative">
          {/* Esfera Grande em Gradiente Azul (Topo Direito do Card) */}
          <div
            className="pointer-events-none absolute -top-12 -right-10 w-36 h-36 sm:w-44 sm:h-44 rounded-full shadow-2xl shadow-blue-600/25 opacity-90 animate-float-slow"
            style={{
              background: "radial-gradient(circle at 28% 28%, #93C5FD 0%, #3B82F6 38%, #1D4ED8 75%, #172554 100%)",
            }}
            aria-hidden="true"
          />

          {/* Esfera Média em Gradiente Azul/Ciano (Base Esquerda do Card) */}
          <div
            className="pointer-events-none absolute -bottom-10 -left-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-xl shadow-blue-500/20 opacity-85 animate-float-reverse"
            style={{
              background: "radial-gradient(circle at 32% 30%, #BAE6FD 0%, #38BDF8 35%, #2563EB 74%, #1E3A8A 100%)",
            }}
            aria-hidden="true"
          />

          <div className="bg-white/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/90 ring-1 ring-slate-200/75 shadow-2xl shadow-blue-950/10 space-y-6 relative z-10">
            
            <div>
              <h2 className="text-xl font-bold text-slate-900">Acesso à Plataforma</h2>
              <p className="text-xs text-slate-500 mt-1">
                Informe sua matrícula e senha para continuar
              </p>
            </div>

            {/* FORMULÁRIO DE LOGIN */}
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-200 flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Matrícula</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="text"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    placeholder="Digite sua matrícula"
                    className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Senha</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar no Malba</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Ambiente exclusivo para discentes e docentes do CEFET-MG
              </span>
            </div>

          </div>
        </div>

      </main>

      {/* ================= 3. RODAPÉ INSTITUCIONAL ================= */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <span>Centro Federal de Educação Tecnológica de Minas Gerais &bull; CEFET-MG</span>
        <span>Projeto de Pesquisa Científica BCE &bull; 2026</span>
      </footer>

      {/* Modal Institucional "Sobre o Malba" */}
      <AboutMalbaModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

    </div>
  )
}
