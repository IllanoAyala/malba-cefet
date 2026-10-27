"use client"

import React, { useEffect } from "react"
import { 
  X, 
  BookOpen, 
  Sparkles, 
  Compass, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react"
import { Logo } from "@/components/ui/Logo"
import { Button } from "@/components/ui/button"

interface AboutMalbaModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AboutMalbaModal({ isOpen, onClose }: AboutMalbaModalProps) {
  // Fechar com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop com desfoque suave */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" 
        onClick={onClose}
      />

      {/* Conteúdo do Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 my-auto z-10 animate-in fade-in zoom-in-95 duration-200 space-y-6 font-sans">
        
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="space-y-2 pr-8">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              História &bull; Metodologia &bull; Propósito
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Por que &ldquo;Malba&rdquo;?
          </h2>
          <p className="text-slate-600 text-sm font-light leading-relaxed">
            A união entre o legado literário da matemática brasileira e a inteligência artificial socrática desenvolvida no CEFET-MG.
          </p>
        </div>

        {/* 3 Blocos de Conteúdo */}
        <div className="space-y-4 pt-1">
          
          {/* Bloco 1: Malba Tahan */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/60 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                O Homem que Ensinou o Brasil a Pensar
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                O nome homenageia <strong>Júlio César de Mello e Souza</strong> (1895–1974), professor e escritor brasileiro sob o pseudônimo de <strong>Malba Tahan</strong>. Autor do clássico <em>O Homem que Calculava</em>, ele provou que a matemática não deve ser decoreba mecânica, mas uma aventura guiada por desafios reais, histórias e curiosidade.
              </p>
            </div>
          </div>

          {/* Bloco 2: O Tutor Socrático */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/60 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                IA Socrática contra a Passividade Cognitiva
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                IAs genéricas entregam a resposta pronta, atrofiando o raciocínio do aluno. O <strong>Malba</strong> atua de forma oposta: utilizando a metodologia do <strong>Arco de Maguerez</strong>, o tutor <em>nunca dá a resposta nem os cálculos acabados</em>, conduzindo o estudante por perguntas reflexivas para que ele próprio construa a solução com autonomia.
              </p>
            </div>
          </div>

          {/* Bloco 3: Pesquisa CEFET-MG */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/60 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                Iniciação Científica (PIBIC &bull; CEFET-MG)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Projeto desenvolvido no <strong>CEFET-MG Campus V Divinópolis</strong> pelo orientando <strong>Illano Ayala</strong> sob a orientação do <strong>Dr. Emerson Costa</strong>, articulado com as competências e habilidades da <strong>BNCC</strong> para o Ensino Médio.
              </p>
            </div>
          </div>

        </div>

        {/* Rodapé com Citação e Botão */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-500 italic">
            &ldquo;Ensinando o aluno a pensar, não apenas a calcular.&rdquo;
          </p>
          <Button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-xs transition-colors shrink-0"
          >
            Entendido, fechar
          </Button>
        </div>

      </div>
    </div>
  )
}
