"use client"

import React, { useEffect } from "react"
import { 
  X, 
  BookOpen, 
  Sparkles, 
  Compass, 
  GraduationCap, 
  Users, 
  Layers, 
  Video,
  ExternalLink 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { GTMAT_PORTAL_URL } from "@/data/studyMaterials"

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
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" 
        onClick={onClose}
      />

      {/* Conteúdo do Modal com scroll interno suave */}
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 my-auto z-10 animate-in fade-in zoom-in-95 duration-200 font-sans">
        
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-20"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="space-y-2 pr-8 shrink-0 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              História &bull; Metodologia &bull; Pesquisa CEFET-MG
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Por que &ldquo;Malba&rdquo;?
          </h2>
          <p className="text-slate-600 text-sm font-light leading-relaxed">
            A união entre o legado da literatura matemática brasileira, a pedagogia crítica e a inteligência artificial socrática desenvolvida no CEFET-MG.
          </p>
        </div>

        {/* Blocos de Conteúdo com rolagem suave */}
        <div className="space-y-4 py-4 overflow-y-auto pr-1">
          
          {/* Bloco 1: Malba Tahan */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/60 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                1. O Homem que Ensinou o Brasil a Pensar (Malba Tahan)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                O nome homenageia <strong>Júlio César de Mello e Souza</strong> (1895–1974), professor e escritor brasileiro sob o pseudônimo de <strong>Malba Tahan</strong>. Autor da obra-prima <em>O Homem que Calculava</em>, ele defendeu que a matemática não deve ser decoreba mecânica ou intimidação, mas uma instigante aventura alimentada por narrativas, desafios do cotidiano e curiosidade investigativa.
              </p>
            </div>
          </div>

          {/* Bloco 2: O que é IA Socrática */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/60 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                2. O que é uma Inteligência Artificial Socrática?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Diferente de IAs comerciais generalistas (como ChatGPT) que entregam a resposta e as contas prontas — alimentando a <em>passividade cognitiva</em> e a ilusão de aprendizado —, o <strong>Malba</strong> opera pelo <strong>método socrático (maiêutica)</strong>. Ele atua como um mediador reflexivo: <strong>nunca entrega o gabarito nem as respostas prontas</strong>. Ele acolhe as dúvidas do discente, faz perguntas orientadoras, destaca conexões e constrói andaimes cognitivos para que o próprio aluno descubra o caminho e desenvolva raciocínio autônomo.
              </p>
            </div>
          </div>

          {/* Bloco 3: O Arco de Maguerez */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/60 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                3. O que é o Arco de Maguerez?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                É uma metodologia pedagógica da <strong>Problematização</strong> baseada nas teorias de Charles Maguerez (sistematizada por Bordenave e Pereira), que organiza o ciclo de aprendizagem a partir de um problema real em <strong>5 etapas sequenciais</strong>:
              </p>
              <ol className="text-xs text-slate-700 font-medium space-y-1 pt-1 pl-4 list-decimal">
                <li><strong className="text-slate-900">Observação da Realidade:</strong> leitura atenta da situação-problema e identificação dos dados fornecidos.</li>
                <li><strong className="text-slate-900">Pontos-Chave:</strong> definição do cerne do problema (o que é essencial versus o que é acessório).</li>
                <li><strong className="text-slate-900">Teorização:</strong> investigação dos conceitos, definições e fórmulas matemáticas necessárias (apoiada por videoaulas e apostilas).</li>
                <li><strong className="text-slate-900">Hipóteses de Solução:</strong> formulação das equações e resolução passo a passo pelo próprio estudante.</li>
                <li><strong className="text-slate-900">Aplicação à Realidade:</strong> validação se a resposta faz sentido prático no contexto original do enunciado.</li>
              </ol>
            </div>
          </div>

          {/* Bloco 4: Público-Alvo */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/60 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                4. Quem é o Público-Alvo do Sistema?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                O sistema é desenhado especialmente para:
              </p>
              <ul className="text-xs text-slate-700 font-light space-y-1 pt-1 list-disc pl-4">
                <li><strong>Discentes do Ensino Médio:</strong> em especial da Educação Profissional Técnica Integrada do <strong>CEFET-MG</strong> (1º, 2º e 3º anos) e candidatos ao <strong>ENEM / Vestibulares</strong> que buscam domínio conceitual sólido.</li>
                <li><strong>Docentes de Matemática:</strong> professores que podem planejar sequências didáticas baseadas no Arco de Maguerez, acompanhar o engajamento e as métricas reais de aprendizagem das suas turmas.</li>
              </ul>
            </div>
          </div>

          {/* Bloco 5: O que é o GTMAT */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/60 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  5. O que é o GTMAT (CEFET-MG)?
                </h3>
                <a 
                  href={GTMAT_PORTAL_URL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-800 font-semibold"
                >
                  Visitar portal <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                O <strong>GTMAT (Grupo de Trabalho de Matemática do CEFET-MG)</strong> é uma iniciativa institucional pioneira de professores de matemática do CEFET-MG. O grupo estruturou todo o currículo do Ensino Médio e Técnico em <strong>24 unidades temáticas completas</strong>, disponibilizando videoaulas públicas no YouTube, apostilas teóricas conceituais e listas de exercícios resolvidos e propostos. No Malba, o acervo do GTMAT é a <strong>mídia principal de teorização</strong> (3ª etapa do Arco).
              </p>
            </div>
          </div>

          {/* Bloco 6: Pesquisa PIBIC */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/60 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                6. Pesquisa Científica &bull; PIBIC / CEFET-MG
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Plataforma fruto de projeto de Iniciação Científica desenvolvido no <strong>CEFET-MG Campus V Divinópolis</strong> pelo orientando <strong>Illano Ayala</strong> sob orientação do <strong>Prof. Dr. Emerson Costa</strong>, articulado com as competências e habilidades da <strong>BNCC</strong> e matriz do ENEM.
              </p>
            </div>
          </div>

        </div>

        {/* Rodapé com Citação e Botão */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
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
