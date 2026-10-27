"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/useAppStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FileText, BookOpen, GraduationCap, Printer, BarChart3, AlertTriangle, Users, Bot, CheckCircle2, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ProfessorPage() {
  const role = useAppStore(state => state.role)
  const router = useRouter()
  
  const [stats, setStats] = useState({ total: 0, revisadas: 0, pendentes: 0 })
  const [isStatsLoading, setIsStatsLoading] = useState(true)

  // Roteiros liberados para discentes e docentes acompanharem o projeto

  useEffect(() => {
    // Fetch inicial
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

    // Polling a cada 5 segundos se houver pendentes (para atualizar barra em tempo real)
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

  const [selectedAno, setSelectedAno] = useState<string>("Todos")
  const [selectedQuestion, setSelectedQuestion] = useState<string>("")
  const [lessonPlan, setLessonPlan] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])

  const filteredQuestions = enemQuestions.filter(q => selectedAno === "Todos" ? true : q.ano_ensino_medio === selectedAno)

  const handleGeneratePlan = () => {
    if (!selectedQuestion) return
    const q = enemQuestions.find(x => x.id === selectedQuestion)
    if (!q) return

    const newPlan = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('pt-BR'),
      title: `Plano de Aula: ${q.topico_bncc}`,
      objectives: [
        `Trabalhar a habilidade ${q.habilidade_enem}`,
        "Fomentar a autonomia dos alunos através da metodologia do Arco de Maguerez",
        "Utilizar o Malba como ferramenta mediadora de aprendizagem, não como oráculo"
      ],
      time: "2 aulas (100 minutos)",
      steps: [
        { name: "1. Observação da Realidade (15 min)", desc: "Apresentar o enunciado para os alunos. Discutir o contexto prático da questão." },
        { name: "2. Pontos-Chave (15 min)", desc: "Uso do Malba pelos alunos. A IA ajudará a destacar as variáveis principais do problema sem dar as fórmulas." },
        { name: "3. Teorização (30 min)", desc: "Intervenção do professor conectando a discussão ao modelo matemático rigoroso (Fórmulas, Teoremas)." },
        { name: "4. Hipóteses de Solução (20 min)", desc: "Alunos testam cálculos baseados na teoria guiados pelas dicas socráticas da plataforma." },
        { name: "5. Aplicação na Realidade (20 min)", desc: "Resolução final da questão e reflexão: 'Como isso se aplica fora do ENEM?'" }
      ]
    }

    setLessonPlan(newPlan)
    setHistory(prev => [newPlan, ...prev].slice(0, 5)) // Keep last 5
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-12 print:p-0 print:space-y-6">
      {/* HEADER PADRONIZADO */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800 mb-8 print:hidden">
        <div className="relative z-10 flex items-start gap-4">
          <div className="hidden md:flex w-16 h-16 bg-white/10 rounded-2xl items-center justify-center backdrop-blur-md border border-white/20 shadow-xl shrink-0">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
              Gerador de Roteiros de Aula
            </h1>
            <p className="text-blue-100/80 text-lg max-w-2xl font-light">
              Escolha um tópico para gerar um plano de aula invertido estruturado nas 5 etapas do Arco de Maguerez.
            </p>
          </div>
        </div>
      </div>
      
      {/* Fallback simples para quando for imprimir */}
      <header className="hidden print:block border-b-2 border-slate-900 pb-2 mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Planejamento de Aula (PIBIC)</h1>
      </header>

      {/* Analytics Section (Hidden on Print) */}
      <section className="print:hidden">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Desempenho da Turma (Visão Geral)
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
              <p className="text-xs text-slate-500 mt-1">Das requisições tentaram burlar o modo Socrático</p>
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
              <p className="text-xs text-slate-500 mt-1">3.º Passo do Arco (Maior taxa de erros na conversão)</p>
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
              <p className="text-xs text-slate-500 mt-1">Alunos resolveram os problemas sem a resposta final</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gerador de Planos (Hidden form on Print) */}
      <section className="print:hidden">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> 
              Gerador de Planos de Aula
            </CardTitle>
            <CardDescription>Crie uma estrutura de aula utilizando as questões cadastradas na plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ano do Ensino Médio</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  value={selectedAno}
                  onChange={(e) => {
                    setSelectedAno(e.target.value)
                    setSelectedQuestion("")
                  }}
                >
                  <option value="Todos">Todos os Anos</option>
                  <option value="1º Ano">1º Ano</option>
                  <option value="2º Ano">2º Ano</option>
                  <option value="3º Ano">3º Ano</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Selecione a Questão-Problema</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  value={selectedQuestion}
                  onChange={(e) => setSelectedQuestion(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {filteredQuestions.map(q => (
                    <option key={q.id} value={q.id}>{q.topico_bncc} (ENEM {q.ano_enem})</option>
                  ))}
                </select>
              </div>
            </div>

            <Button variant="blue" className="w-full md:w-auto mt-4" onClick={handleGeneratePlan} disabled={!selectedQuestion}>
              Gerar Roteiro de Aula
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Roteiro Gerado (Visible on Print) */}
      {lessonPlan && (
        <section className="print:block">
          <div className="p-6 bg-white border border-slate-200 rounded-xl animate-in fade-in slide-in-from-bottom-4 shadow-sm print:border-none print:shadow-none print:p-0">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{lessonPlan.title}</h3>
                <p className="text-sm text-slate-500">Gerado em {lessonPlan.date}</p>
              </div>
              <Button variant="outline" className="print:hidden" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Imprimir PDF
              </Button>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-slate-800 mb-2 border-b pb-1">Objetivos de Aprendizagem</h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-700 text-sm mt-3">
                {lessonPlan.objectives.map((obj: string, i: number) => <li key={i}>{obj}</li>)}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-4 border-b pb-1 flex items-center justify-between">
                Intervenção Socrática (Arco de Maguerez)
                <Badge variant="outline" className="font-normal bg-slate-50 print:hidden">{lessonPlan.time}</Badge>
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
                      <p className="text-slate-600 mt-1">{step.desc}</p>
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
              <Card key={histPlan.id} className="min-w-[250px] shrink-0 cursor-pointer hover:border-blue-400 transition-colors" onClick={() => setLessonPlan(histPlan)}>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-bold truncate">{histPlan.title}</CardTitle>
                  <CardDescription className="text-xs">{histPlan.date}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      )}

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
              Bassanezi propõe a Modelagem Matemática como método de ensino, no qual os estudantes são instigados a investigar situações complexas. A conversão de um problema real (como as variáveis socioeconômicas do ENEM) para a linguagem matemática requer abstração. A passividade promovida pelas IAs comercias prejudica exatamente a etapa de <i>tradução do problema</i> (modelagem). A IA pedagógica visa intervir exatamente neste hiato cognitivo.
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
            
            {/* Barra de Progresso */}
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
  )
}
