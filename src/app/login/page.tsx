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
  Layers,
  GraduationCap
} from "lucide-react"
import { Logo } from "@/components/ui/Logo"
import { Button } from "@/components/ui/button"
import { AboutMalbaModal } from "@/components/features/AboutMalbaModal"

export default function LoginSigaaPage() {
  const [matricula, setMatricula] = useState("aluno")
  const [password, setPassword] = useState("cefet123")
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
      setError("Credenciais inválidas. Utilize as contas de teste abaixo.")
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
          <span className="text-xl font-bold tracking-tight">Autenticando no SIGAA...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-8 lg:p-12 font-sans selection:bg-blue-200">
      
      {/* ================= 1. CABEÇALHO INSTITUCIONAL SUPERIOR ================= */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200/80">
        <Logo size="md" showBadge={false} subtitle="CEFET-MG • Campus V Divinópolis" />
      </header>

      {/* ================= 2. CORPO PRINCIPAL COM GRID DE 12 COLUNAS ================= */}
      <main className="max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-8">
        
        {/* LADO ESQUERDO (7 COLUNAS): APRESENTAÇÃO INSTITUCIONAL & SLOGAN HISTÓRICO */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
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
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Incidência ENEM</span>
              <p className="text-xl font-black text-slate-900 mt-1">90 Questões</p>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Mapeadas na BNCC
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Áreas Temáticas</span>
              <p className="text-xl font-black text-slate-900 mt-1">29 Tópicos</p>
              <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-0.5">
                <Layers className="w-3 h-3" /> Álgebra a Geometria
              </span>
            </div>

            <div className="hidden sm:block bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
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
        <div className="lg:col-span-5">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6 relative">
            
            <div>
              <h2 className="text-xl font-bold text-slate-900">Acesso ao SIGAA</h2>
              <p className="text-xs text-slate-500 mt-1">
                Autenticação de discentes e docentes autorizados
              </p>
            </div>

            {/* SELETOR RÁPIDO DE PERFIL PARA DEMONSTRAÇÃO */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setMatricula("aluno")
                  setPassword("cefet123")
                  setError("")
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  matricula === "aluno"
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Perfil Discente</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMatricula("professor")
                  setPassword("cefet123")
                  setError("")
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  matricula === "professor"
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Perfil Docente</span>
              </button>
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
                <label className="text-xs font-bold text-slate-700">Matrícula / CPF</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="text"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    placeholder="Ex: aluno ou 2023123456"
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
                Credenciais válidas cadastradas no banco de testes do CEFET
              </span>
            </div>

          </div>
        </div>

      </main>

      {/* ================= 3. RODAPÉ INSTITUCIONAL ================= */}
      <footer className="max-w-6xl mx-auto w-full pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <span>Centro Federal de Educação Tecnológica de Minas Gerais &bull; CEFET-MG</span>
        <span>Projeto de Pesquisa Científica BCE &bull; 2026</span>
      </footer>

      {/* Modal Institucional "Sobre o Malba" */}
      <AboutMalbaModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

    </div>
  )
}
