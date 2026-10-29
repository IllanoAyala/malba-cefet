"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/useAppStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  FileText,
  BookOpen,
  GraduationCap,
  Printer,
  BarChart3,
  AlertTriangle,
  Users,
  Bot,
  CheckCircle2,
  Loader2,
  Landmark,
  Award,
  PlayCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TabGuard } from "@/components/layout/TabGuard"
import {
  STUDY_MODULES,
  OBMEP_APOSTILAS,
  GTMAT_PORTAL_URL,
  OBMEP_PORTAL_URL,
  getModuleForTopic,
  StudyModule,
} from "@/data/studyMaterials"

export default function ProfessorPage() {
  const role = useAppStore(state => state.role)
  const router = useRouter()

  const [stats, setStats] = useState({ total: 0, revisadas: 0, pendentes: 0 })
  const [isStatsLoading, setIsStatsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/questions/stats')
        const data = await res.json()
        setStats(data)
        setIsStatsLoading(false)
      } catch (e) {
        console.error(e)
        setIsStatsLoading(false)
      }
    }

    fetchStats()

    const interval = setInterval(() => {
      if (stats.pendentes > 0 || isStatsLoading) {
        fetchStats()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [stats.pendentes, isStatsLoading])

  const [enemQuestions, setEnemQuestions] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/questions')
      .then(r => r.json())
      .then(data => setEnemQuestions(data))
  }, [])

  const [planMode, setPlanMode] = useState<"module" | "question">("module")
  const [selectedAno, setSelectedAno] = useState<string>("Todos")
  const [selectedModuleId, setSelectedModuleId] = useState<string>(STUDY_MODULES[0].id)
  const [selectedQuestion, setSelectedQuestion] = useState<string>("")
  const [catalogYearFilter, setCatalogYearFilter] = useState<string>("Todos")
  const [lessonPlan, setLessonPlan] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])

  const filteredQuestions = enemQuestions.filter(q =>
    selectedAno === "Todos" ? true : q.ano_ensino_medio === selectedAno
  )

  const filteredModulesForSelect = STUDY_MODULES.filter(m =>
    selectedAno === "Todos" ? true : m.year === selectedAno
  )

  const filteredCatalogModules = STUDY_MODULES.filter(m =>
    catalogYearFilter === "Todos" ? true : m.year === catalogYearFilter
  )

  const buildPlanFromModule = (mod: StudyModule, questionObj?: any) => {
    const isFromQuestion = Boolean(questionObj)
    const newPlan = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString('pt-BR'),
      year: mod.year,
      category: mod.category,
      title: isFromQuestion
        ? `Plano de Aula: ${questionObj.topico_bncc} (${mod.title})`
        : `Plano de Aula: ${mod.title} (${mod.year})`,
      subtitle: isFromQuestion
        ? `Questão-Problema Contextualizada (${questionObj.ano_enem}) + Unidade GTMAT CEFET-MG & Apostila OBMEP`
        : `Currículo de Matemática do Ensino Médio • GTMAT CEFET-MG & PIC/OBMEP`,
      objectives: [
        isFromQuestion
          ? `Desenvolver o eixo ${mod.category} e trabalhar a habilidade ${questionObj.habilidade_enem}`
          : `Desenvolver o eixo ${mod.category} em ${mod.title} (${mod.year} do Ensino Médio)`,
        `Utilizar a videoaula principal do GTMAT CEFET-MG (${mod.videoTitle}) e o texto teórico [CONT] como base conceitual`,
        `Aprofundar a argumentação e demonstração matemática com a ${mod.obmepApostila.number} (${mod.obmepApostila.title})`,
        "Promover a autonomia discente por meio da Metodologia da Problematização (Arco de Maguerez)",
      ],
      time: "2 aulas geminadas (100 minutos)",
      teacherGuide: mod.teacherGuide,
      media: {
        primaryVideoTitle: mod.videoTitle,
        primaryChannel: mod.channelName,
        primaryDuration: mod.duration,
        primaryVideoUrl: `https://www.youtube.com/watch?v=${mod.videoId}`,
        secondaryVideoTitle: mod.secondaryVideoTitle,
        secondaryChannel: mod.secondaryChannelName,
        secondaryDuration: mod.secondaryDuration,
        secondaryVideoUrl: `https://www.youtube.com/watch?v=${mod.secondaryVideoId}`,
        gtmatUnitTitle: mod.gtmatUnitTitle,
        gtmatUnitUrl: mod.gtmatUnitUrl,
        obmepVolume: mod.obmepApostila.number,
        obmepTitle: mod.obmepApostila.title,
        obmepAuthors: mod.obmepApostila.authors,
        obmepChapter: mod.obmepApostila.focus,
        obmepPdfUrl: mod.obmepApostila.pdfUrl,
      },
      steps: [
        {
          name: "1. Observação da Realidade (15 min)",
          desc: isFromQuestion
            ? `Apresentar a situação-problema contextualizada (${questionObj.topico_bncc}) aos estudantes, discutindo o fenômeno real antes de introduzir o formalismo algébrico.`
            : `Introduzir uma situação-problema desencadeadora sobre ${mod.title} a partir do material didático [CONT] do GTMAT CEFET-MG (${mod.gtmatUnitTitle}).`,
        },
        {
          name: "2. Pontos-Chave (15 min)",
          desc: "Levantamento coletivo das variáveis, hipóteses e grandezas envolvidas no problema. Uso mediado do Tutor Socrático Malba para identificar o que é essencial medir ou relacionar.",
        },
        {
          name: "3. Teorização (30 min)",
          desc: `Exibição/discussão da Mídia Principal do GTMAT CEFET-MG ("${mod.videoTitle}") combinada à formalização das definições e propriedades. Como apoio de revisão rápida, indicar a Mídia Secundária ("${mod.secondaryVideoTitle}").`,
        },
        {
          name: "4. Hipóteses de Solução (20 min)",
          desc: `Resolução colaborativa dos exercícios propostos [EXE] e discussão dos exercícios resolvidos [EXRES] da unidade GTMAT CEFET-MG, utilizando as dicas socráticas da plataforma.`,
        },
        {
          name: "5. Aplicação à Realidade & Aprofundamento OBMEP (20 min)",
          desc: `Fechamento do problema inicial e proposição de desafio de aprofundamento retirado da ${mod.obmepApostila.number} da OBMEP (${mod.obmepApostila.focus}).`,
        },
      ],
    }

    setLessonPlan(newPlan)
    setHistory(prev => [newPlan, ...prev].slice(0, 5))
  }

  const handleGeneratePlan = () => {
    if (planMode === "module") {
      const mod = STUDY_MODULES.find(m => m.id === selectedModuleId) || STUDY_MODULES[0]
      buildPlanFromModule(mod)
    } else {
      if (!selectedQuestion) return
      const q = enemQuestions.find(x => x.id === selectedQuestion)
      if (!q) return
      const mod = getModuleForTopic(q.topico_bncc)
      buildPlanFromModule(mod, q)
    }
  }

  const handleQuickPlanFromCatalog = (mod: StudyModule) => {
    setPlanMode("module")
    setSelectedAno("Todos")
    setSelectedModuleId(mod.id)
    buildPlanFromModule(mod)
    window.scrollTo({ top: 380, behavior: "smooth" })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <TabGuard tabId="professor">
      <div className="p-8 max-w-6xl mx-auto w-full space-y-12 print:p-0 print:space-y-6">
      {/* HEADER PADRONIZADO */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800 mb-8 print:hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="hidden md:flex w-16 h-16 bg-white/10 rounded-2xl items-center justify-center backdrop-blur-md border border-white/20 shadow-xl shrink-0">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  Matemática no Ensino Médio &bull; Geral &amp; Olímpica
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-200 border border-amber-400/30">
                  GTMAT CEFET-MG + PIC/OBMEP
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                Portal Docente &amp; Roteiros de Aula
              </h1>
              <p className="text-blue-100/80 text-base md:text-lg max-w-2xl font-light leading-relaxed">
                Planeje sequências didáticas para toda a Matemática do Ensino Médio (1º, 2º e 3º Ano) integrando o <strong>Arco de Maguerez</strong>, as videoaulas e unidades do <strong>GTMAT CEFET-MG</strong> e as apostilas do <strong>PIC/OBMEP</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
            <a
              href={GTMAT_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-xs font-bold text-blue-100 transition-colors"
            >
              <Landmark className="w-4 h-4 text-blue-300" />
              <span>Portal Docente GTMAT CEFET-MG</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
            <a
              href={OBMEP_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-xs font-bold text-amber-100 transition-colors"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Acervo de Apostilas PIC / OBMEP</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>
      </div>

      {/* Fallback simples para quando for imprimir */}
      <header className="hidden print:block border-b-2 border-slate-900 pb-2 mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Planejamento Docente de Matemática (Malba CEFET-MG)</h1>
        <p className="text-xs text-slate-600">Fontes Integradas: GTMAT CEFET-MG + Apostilas do PIC/OBMEP + Metodologia do Arco de Maguerez</p>
      </header>

      {/* Analytics Section (Hidden on Print) */}
      <section className="print:hidden">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Indicadores Pedagógicos da Turma (Visão Geral)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
                Uso de IA Comercial
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">12%</div>
              <p className="text-xs text-slate-500 mt-1">Das requisições tentaram pedir a resposta pronta ao Tutor Socrático</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
                Etapa Mais Crítica
                <BookOpen className="w-4 h-4 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">Teorização</div>
              <p className="text-xs text-slate-500 mt-1">3.º Passo do Arco (Apoiada pelas Videoaulas GTMAT + OBMEP)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
                Autonomia Concluída
                <Users className="w-4 h-4 text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">85%</div>
              <p className="text-xs text-slate-500 mt-1">Alunos resolveram os problemas sem receber o gabarito pronto</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gerador de Planos (Hidden form on Print) */}
      <section className="print:hidden">
        <Card className="border-slate-200 shadow-xs">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Gerador de Planos de Aula (Matemática Geral &amp; Contextualizada)
                </CardTitle>
                <CardDescription className="mt-1">
                  Gere um roteiro estruturado no Arco de Maguerez a partir de qualquer <strong>Unidade Curricular do Ensino Médio (GTMAT + OBMEP)</strong> ou de uma <strong>Questão Contextualizada</strong>.
                </CardDescription>
              </div>

              {/* Seletor de Modo */}
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 self-start">
                <button
                  type="button"
                  onClick={() => setPlanMode("module")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    planMode === "module"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Por Tema da Matemática (GTMAT/OBMEP)
                </button>
                <button
                  type="button"
                  onClick={() => setPlanMode("question")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    planMode === "question"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Por Questão do Banco
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Série do Ensino Médio</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  value={selectedAno}
                  onChange={(e) => {
                    const newAno = e.target.value
                    setSelectedAno(newAno)
                    setSelectedQuestion("")
                    const firstMod = STUDY_MODULES.find(m => newAno === "Todos" ? true : m.year === newAno)
                    if (firstMod) setSelectedModuleId(firstMod.id)
                  }}
                >
                  <option value="Todos">Todos os Anos (1º ao 3º Ano)</option>
                  <option value="1º Ano">1º Ano do Ensino Médio</option>
                  <option value="2º Ano">2º Ano do Ensino Médio</option>
                  <option value="3º Ano">3º Ano do Ensino Médio</option>
                </select>
              </div>

              {planMode === "module" ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Unidade Curricular (GTMAT CEFET-MG + OBMEP)
                  </label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
                    value={selectedModuleId}
                    onChange={(e) => setSelectedModuleId(e.target.value)}
                  >
                    {filteredModulesForSelect.map(mod => (
                      <option key={mod.id} value={mod.id}>
                        [{mod.year}] {mod.title} — {mod.gtmatUnitTitle}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Selecione a Questão-Problema</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
                    value={selectedQuestion}
                    onChange={(e) => setSelectedQuestion(e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {filteredQuestions.map(q => (
                      <option key={q.id} value={q.id}>
                        [{q.ano_ensino_medio}] {q.topico_bncc} (Questão {q.id})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <Button
              variant="blue"
              className="w-full md:w-auto mt-2"
              onClick={handleGeneratePlan}
              disabled={planMode === "question" && !selectedQuestion}
            >
              Gerar Roteiro de Aula Completo
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Roteiro Gerado (Visible on Print) */}
      {lessonPlan && (
        <section className="print:block">
          <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl animate-in fade-in slide-in-from-bottom-4 shadow-sm print:border-none print:shadow-none print:p-0 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className="bg-blue-50 text-blue-700 border border-blue-200">{lessonPlan.year}</Badge>
                  <Badge variant="outline">{lessonPlan.category}</Badge>
                  <span className="text-xs text-slate-400">Gerado em {lessonPlan.date}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{lessonPlan.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{lessonPlan.subtitle}</p>
              </div>
              <Button variant="outline" className="print:hidden shrink-0" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Imprimir / Salvar PDF
              </Button>
            </div>

            {/* Orientação Metodológica ao Professor */}
            {lessonPlan.teacherGuide && (
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 print:bg-white print:border-slate-300">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                  Sugestão Metodológica para o Professor
                </span>
                <p className="text-sm text-slate-700 leading-relaxed">{lessonPlan.teacherGuide}</p>
              </div>
            )}

            {/* Fontes & Mídias Integradas ao Plano */}
            {lessonPlan.media && (
              <div>
                <h4 className="font-semibold text-slate-800 mb-3 border-b pb-1">
                  Mídias e Materiais Didáticos Integrados (GTMAT CEFET-MG &amp; OBMEP)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 print:bg-white print:border-slate-300 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                      <Landmark className="w-3.5 h-3.5" /> Mídia Principal (GTMAT CEFET-MG)
                    </span>
                    <p className="text-xs font-bold text-slate-900">{lessonPlan.media.primaryVideoTitle}</p>
                    <p className="text-[11px] text-slate-600">
                      Unidade: <strong>{lessonPlan.media.gtmatUnitTitle}</strong> ([CONT] [VAC] [EXE] [EXRES])
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 print:hidden">
                      <a
                        href={lessonPlan.media.primaryVideoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
                      >
                        <PlayCircle className="w-3 h-3" /> Videoaula [VAC]
                      </a>
                      <a
                        href={lessonPlan.media.gtmatUnitUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-slate-700 hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Abrir Unidade
                      </a>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 print:bg-white print:border-slate-300 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5 text-red-600" /> Mídia Secundária (Revisão Rápida)
                    </span>
                    <p className="text-xs font-bold text-slate-900">{lessonPlan.media.secondaryVideoTitle}</p>
                    <p className="text-[11px] text-slate-600">
                      {lessonPlan.media.secondaryChannel} &bull; {lessonPlan.media.secondaryDuration}
                    </p>
                    <div className="pt-1 print:hidden">
                      <a
                        href={lessonPlan.media.secondaryVideoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-slate-700 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Assistir Mídia Secundária
                      </a>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 print:bg-white print:border-slate-300 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Aprofundamento PIC / OBMEP
                    </span>
                    <p className="text-xs font-bold text-slate-900">
                      {lessonPlan.media.obmepVolume}: {lessonPlan.media.obmepTitle}
                    </p>
                    <p className="text-[11px] text-slate-600">{lessonPlan.media.obmepChapter}</p>
                    <div className="pt-1 print:hidden">
                      <a
                        href={lessonPlan.media.obmepPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-amber-800 hover:underline inline-flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> Baixar Apostila em PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-slate-800 mb-2 border-b pb-1">Objetivos de Aprendizagem</h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-700 text-sm mt-3">
                {lessonPlan.objectives.map((obj: string, i: number) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-4 border-b pb-1 flex items-center justify-between">
                <span>Sequência Didática no Arco de Maguerez</span>
                <Badge variant="outline" className="font-normal bg-slate-50 print:hidden">
                  {lessonPlan.time}
                </Badge>
                <span className="hidden print:inline text-sm text-slate-500">{lessonPlan.time}</span>
              </h4>
              <div className="space-y-4">
                {lessonPlan.steps.map((step: any, i: number) => (
                  <div key={i} className="flex gap-4 text-sm print:break-inside-avoid print:items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold print:border print:border-blue-700 print:bg-white print:text-black">
                      {i + 1}
                    </div>
                    <div className="bg-slate-50 border p-4 rounded-lg flex-1 print:bg-white print:border-slate-300 print:p-3">
                      <p className="font-bold text-slate-800">{step.name.substring(3)}</p>
                      <p className="text-slate-600 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Histórico Recente (Hidden on Print) */}
      {history.length > 0 && (
        <section className="print:hidden">
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            Roteiros Gerados Recentemente
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
            {history.map((histPlan) => (
              <Card
                key={histPlan.id}
                className="min-w-[260px] shrink-0 cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => setLessonPlan(histPlan)}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-bold truncate">{histPlan.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {histPlan.year} &bull; {histPlan.date}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ACERVO DIDÁTICO PARA PROFESSORES: UNIDADES GTMAT CEFET-MG + APOSTILAS OBMEP */}
      <section className="print:hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-blue-600" />
              Acervo Curricular para Professores (GTMAT CEFET-MG &amp; OBMEP)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Material de apoio docente para o Ensino Médio em geral: acesse textos teóricos <strong>[CONT]</strong>, videoaulas principais <strong>[VAC]</strong>, listas de exercícios <strong>[EXE]</strong> e apostilas <strong>PIC/OBMEP</strong>.
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-white p-1 border border-slate-200 shadow-2xs self-start">
            {["Todos", "1º Ano", "2º Ano", "3º Ano"].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setCatalogYearFilter(yr)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  catalogYearFilter === yr
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCatalogModules.map((mod) => (
            <div
              key={mod.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px]">
                      {mod.year}
                    </Badge>
                    <Badge variant="outline" className="text-[11px]">
                      {mod.category}
                    </Badge>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push(`/materias?module=${mod.id}`)}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Ver na aba Matérias &rarr;
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900">{mod.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{mod.teacherGuide}</p>

                <div className="pt-1 space-y-1.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase text-blue-700 block">
                        Mídia Principal &bull; GTMAT CEFET-MG
                      </span>
                      <p className="font-semibold text-slate-800 truncate">{mod.videoTitle}</p>
                    </div>
                    <a
                      href={mod.gtmatUnitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shrink-0 inline-flex items-center gap-1"
                    >
                      <span>Unidade GTMAT</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/70 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase text-amber-800 block">
                        Apostila PIC / OBMEP ({mod.obmepApostila.number})
                      </span>
                      <p className="font-semibold text-slate-800 truncate">
                        {mod.obmepApostila.title} — {mod.obmepApostila.focus}
                      </p>
                    </div>
                    <a
                      href={mod.obmepApostila.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shrink-0 inline-flex items-center gap-1"
                    >
                      <span>PDF</span>
                      <FileText className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 truncate">
                  Mídia Secundária: {mod.secondaryChannelName} ({mod.secondaryDuration})
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs font-bold border-blue-200 text-blue-700 hover:bg-blue-50 shrink-0"
                  onClick={() => handleQuickPlanFromCatalog(mod)}
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Gerar Roteiro deste Tema
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Biblioteca Rápida das 10 Apostilas OBMEP */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 border border-amber-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                Coleção Completa para Professores &amp; Clubes de Matemática
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Apostilas Oficiais do PIC / OBMEP (Download Direto em PDF)
              </h3>
            </div>
            <a
              href={OBMEP_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-amber-800 hover:underline inline-flex items-center gap-1"
            >
              <span>Ver todas as publicações no site da OBMEP</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {OBMEP_APOSTILAS.map((ap) => (
              <a
                key={ap.number}
                href={ap.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white hover:bg-amber-50/80 border border-amber-200/80 transition-all flex flex-col justify-between gap-2 group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-700 block">
                    {ap.number}
                  </span>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-amber-900 line-clamp-2 mt-0.5">
                    {ap.title}
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-amber-700 inline-flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Abrir PDF
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="print:hidden">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Referencial Teórico (PIBIC)
        </h2>
        <Accordion type="single" collapsible className="w-full bg-white rounded-xl border px-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>José Carlos Libâneo (Didática e Prática Educativa)</AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed">
              Segundo Libâneo, o processo de ensino e aprendizagem exige uma postura ativa do sujeito cognoscente. A tecnologia, no contexto de sala de aula, não deve atuar como um "resolvedor" de problemas (que reforça a pedagogia tradicional de transmissão), mas sim como um instrumento mediador (ferramenta) que auxilia o estudante na apropriação do conhecimento. A IA deve assumir o papel de estimular o desenvolvimento das capacidades intelectuais dos alunos.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Neusi Berbel (Metodologia da Problematização e Arco de Maguerez)</AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed">
              O Arco de Maguerez, amplamente divulgado por Bordenave e Pereira e explorado por Berbel no Brasil, propõe 5 etapas de aprendizagem a partir de um problema da realidade: 1) Observação da Realidade; 2) Pontos-Chave; 3) Teorização; 4) Hipóteses de Solução; 5) Aplicação à Realidade. O <strong>Malba-CEFET</strong> foi construído utilizando essa heurística em seu sistema de prompt Socrático. A IA não fornece as respostas, mas conduz o aluno por essas cinco etapas quando ele erra uma questão.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Rodney Bassanezi (Modelagem Matemática)</AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed">
              Bassanezi propõe a Modelagem Matemática como método de ensino, no qual os estudantes são instigados a investigar situações complexas. A conversão de um problema real para a linguagem matemática requer abstração. A passividade promovida pelas IAs comerciais prejudica exatamente a etapa de <i>tradução do problema</i> (modelagem). A IA pedagógica visa intervir exatamente neste hiato cognitivo.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Floating Progress Bar for AI Revision */}
      {!isStatsLoading && stats.total > 0 && (
        <div className="fixed bottom-6 right-6 w-80 bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden z-50 print:hidden animate-in fade-in slide-in-from-bottom-8">
          <div className="bg-slate-900 p-3 flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-400" />
            <h4 className="text-sm font-bold text-white">Revisão por IA (Markdown)</h4>
          </div>
          <div className="p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600 font-medium">Questões Formatadas</span>
              <span className="font-bold text-slate-900">{stats.revisadas} / {stats.total}</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(stats.revisadas / stats.total) * 100}%` }}
              ></div>
            </div>

            {stats.pendentes > 0 ? (
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{stats.pendentes} questões aguardando formatação...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Banco 100% revisado e formatado!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </TabGuard>
  )
}
