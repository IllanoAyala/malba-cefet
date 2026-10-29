"use client"

import React, { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { 
  User, 
  Lock, 
  Loader2, 
  Info, 
  ArrowRight,
  HelpCircle
} from "lucide-react"
import { SocraticChatPreview } from "@/components/features/SocraticChatPreview"
import { Logo } from "@/components/ui/Logo"
import { Button } from "@/components/ui/button"
import { AboutMalbaModal } from "@/components/features/AboutMalbaModal"
import { useAppStore } from "@/store/useAppStore"

const BLUE = "radial-gradient(circle at 30% 28%, #DBEAFE 0%, #60A5FA 40%, #2563EB 80%, #1E3A8A 100%)"
const SKY = "radial-gradient(circle at 32% 30%, #F0F9FF 0%, #38BDF8 45%, #0284C7 88%, #0369A1 100%)"
const INDIGO = "radial-gradient(circle at 30% 28%, #E0E7FF 0%, #818CF8 42%, #4F46E5 82%, #312E81 100%)"

// Esferas decorativas de fundo: tamanhos, profundidades (blur) e animações variadas.
const BACKGROUND_SPHERES: { className: string; gradient: string }[] = [
  // Canto superior esquerdo, parcialmente fora da tela
  { className: "-top-16 -left-16 w-48 h-48 opacity-25 blur-2xl animate-float-slow", gradient: BLUE },
  // Pequena, ao lado do logo
  { className: "hidden sm:block top-24 left-[4%] w-10 h-10 opacity-70 shadow-md shadow-blue-500/20 animate-float-reverse", gradient: SKY },
  // Topo, entre o cabeçalho e o título
  { className: "hidden md:block top-[22%] left-[48%] w-6 h-6 opacity-60 animate-float-slow", gradient: INDIGO },
  // Borda direita, metade fora da tela
  { className: "hidden lg:block top-[38%] -right-20 w-56 h-56 opacity-30 blur-xl animate-float-reverse", gradient: INDIGO },
  // Margem esquerda, ao lado do chat
  { className: "hidden lg:block top-[62%] left-[3%] w-16 h-16 opacity-60 shadow-lg shadow-blue-500/20 animate-float-slow", gradient: BLUE },
  // Base, perto do rodapé à direita
  { className: "hidden md:block bottom-12 right-[14%] w-12 h-12 opacity-55 animate-float-reverse", gradient: SKY },
  // Canto inferior esquerdo, grande e desfocada
  { className: "-bottom-24 left-[20%] w-64 h-64 opacity-20 blur-3xl animate-float-slow", gradient: SKY },
]

export default function LoginPage() {
  const [matricula, setMatricula] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [showRecoveryHint, setShowRecoveryHint] = useState(false)
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
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("malba_session_id")
      }
      useAppStore.getState().setActiveUser(matricula)
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

      {/* ================= CAMADA DECORATIVA: ESFERAS DE FUNDO ================= */}
      {/* Posicionadas nas margens e espaços vazios para não cobrir textos. As desfocadas dão profundidade. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
        {BACKGROUND_SPHERES.map((s, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${s.className}`}
            style={{ background: s.gradient }}
          />
        ))}
      </div>

      
      {/* ================= 1. CABEÇALHO INSTITUCIONAL SUPERIOR ================= */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200/80">
        <Logo size="md" showBadge={false} />
        <button
          type="button"
          onClick={() => setIsAboutOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 bg-white/70 border border-slate-200 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50/60 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Por que Malba?</span>
        </button>
      </header>

      {/* ================= 2. CORPO PRINCIPAL COM GRID DE 12 COLUNAS ================= */}
      <main className="relative z-10 max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-8">
        
        {/* LADO ESQUERDO (7 COLUNAS): APRESENTAÇÃO INSTITUCIONAL & SLOGAN HISTÓRICO */}
        <div className="lg:col-span-7 space-y-6">

          {/* TÍTULO PRINCIPAL (A FRASE HISTÓRICA DO PROJETO) */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Ensinando o aluno a{" "}
              <span className="whitespace-nowrap">
                <span className="relative inline-block text-blue-600">
                  pensar
                  {/* Sublinhado suave em traço "feito à mão" */}
                  <svg
                    className="pointer-events-none absolute left-0 -bottom-1.5 sm:-bottom-2 w-full h-2.5 sm:h-3 text-blue-300"
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8.5 C 45 3, 95 3.5, 130 6 S 185 9, 197 4"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>,
              </span>{" "}
              não apenas a calcular.
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-light max-w-xl text-pretty">
              Em vez de dar a resposta, o Malba faz as perguntas certas até você chegar lá.
            </p>
          </div>

          {/* PRÉVIA DE DIÁLOGO SOCRÁTICO */}
          <div className="pt-2">
            <SocraticChatPreview />
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
                <label htmlFor="password" className="text-xs font-bold text-slate-700">Senha</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowRecoveryHint((v) => !v)}
                    className="text-[11px] font-semibold text-slate-500 hover:text-blue-700 hover:underline cursor-pointer"
                    aria-expanded={showRecoveryHint}
                  >
                    Esqueci minha senha
                  </button>
                </div>
                {showRecoveryHint && (
                  <p className="text-[11px] text-slate-600 bg-blue-50/70 border border-blue-100 rounded-lg px-3 py-2 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-px text-blue-600" />
                    <span>Para redefinir sua senha, procure seu professor ou a coordenação do curso.</span>
                  </p>
                )}
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
              <span className="text-[11px] text-slate-500">
                Ambiente exclusivo para discentes e docentes do CEFET-MG
              </span>
            </div>

          </div>
        </div>

      </main>

      {/* ================= 3. RODAPÉ INSTITUCIONAL ================= */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full pt-6 border-t border-slate-200/80 flex items-center justify-center text-center text-xs text-slate-500">
        <span>Centro Federal de Educação Tecnológica de Minas Gerais &bull; CEFET-MG</span>
      </footer>

      {/* Modal Institucional "Sobre o Malba" */}
      <AboutMalbaModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

    </div>
  )
}
