mkdir -p src/app/professor

cat << 'PAGE_D_EOF' > src/app/professor/page.tsx
"use client"
import { useState } from "react"
import { enemQuestions } from "@/data/enem-questions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FileText, BookOpen } from "lucide-react"

export default function ProfessorPage() {
  const [selectedAno, setSelectedAno] = useState<string>("Todos")
  const [selectedQuestion, setSelectedQuestion] = useState<string>("")
  const [lessonPlan, setLessonPlan] = useState<any>(null)

  const filteredQuestions = enemQuestions.filter(q => selectedAno === "Todos" ? true : q.ano_ensino_medio === selectedAno)

  const handleGeneratePlan = () => {
    if (!selectedQuestion) return
    const q = enemQuestions.find(x => x.id === selectedQuestion)
    if (!q) return

    setLessonPlan({
      title: \`Plano de Aula: \${q.topico_bncc}\`,
      objectives: [
        \`Trabalhar a habilidade \${q.habilidade_enem}\`,
        "Fomentar a autonomia dos alunos através da metodologia do Arco de Maguerez",
        "Utilizar o MathAI como ferramenta mediadora de aprendizagem, não como oráculo"
      ],
      time: "2 aulas (100 minutos)",
      steps: [
        { name: "1. Observação da Realidade (15 min)", desc: "Apresentar o enunciado para os alunos. Discutir o contexto prático da questão." },
        { name: "2. Pontos-Chave (15 min)", desc: "Uso do MathAI pelos alunos. A IA ajudará a destacar as variáveis principais do problema sem dar as fórmulas." },
        { name: "3. Teorização (30 min)", desc: "Intervenção do professor conectando a discussão ao modelo matemático rigoroso (Fórmulas, Teoremas)." },
        { name: "4. Hipóteses de Solução (20 min)", desc: "Alunos testam cálculos baseados na teoria guiados pelas dicas socráticas da plataforma." },
        { name: "5. Aplicação na Realidade (20 min)", desc: "Resolução final da questão e reflexão: 'Como isso se aplica fora do ENEM?'" }
      ]
    })
  }

  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-12">
      <header className="border-b pb-6">
        <h1 className="text-3xl font-bold text-[#002B49] mb-2 flex items-center gap-2">
          <GraduationCapIcon className="w-8 h-8" />
          Área do Professor & Planejamento
        </h1>
        <p className="text-slate-500">Gere roteiros de aula baseados em Metodologias Ativas (Arco de Maguerez) e acesse o referencial teórico do PIBIC.</p>
      </header>

      <section>
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B49]"
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B49]"
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

            {lessonPlan && (
              <div className="mt-8 p-6 bg-slate-50 border rounded-xl animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-xl font-bold text-[#002B49] mb-4">{lessonPlan.title}</h3>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-800 mb-2">Objetivos de Aprendizagem</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                    {lessonPlan.objectives.map((obj: string, i: number) => <li key={i}>{obj}</li>)}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center justify-between">
                    Intervenção com IA e Arco de Maguerez
                    <span className="text-xs font-normal text-slate-500 bg-white px-2 py-1 border rounded-full">{lessonPlan.time}</span>
                  </h4>
                  <div className="space-y-3">
                    {lessonPlan.steps.map((step: any, i: number) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                          {i + 1}
                        </div>
                        <div className="bg-white border p-3 rounded-lg flex-1">
                          <p className="font-semibold text-slate-800">{step.name.substring(3)}</p>
                          <p className="text-slate-600 mt-1">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-bold text-[#002B49] mb-4 flex items-center gap-2">
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
              O Arco de Maguerez, amplamente divulgado por Bordenave e Pereira e explorado por Berbel no Brasil, propõe 5 etapas de aprendizagem a partir de um problema da realidade: 1) Observação da Realidade; 2) Pontos-Chave; 3) Teorização; 4) Hipóteses de Solução; 5) Aplicação à Realidade. O <strong>MathAI-CEFET</strong> foi construído utilizando essa heurística em seu sistema de prompt Socrático. A IA não fornece as respostas, mas conduz o aluno por essas cinco etapas quando ele erra uma questão.
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
    </div>
  )
}

function GraduationCapIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.42 10.922a2 2 0 0 1-.019 3.138l-8.5 7.107a2 2 0 0 1-2.541.001l-8.5-7.107a2 2 0 0 1-.019-3.138l9-7.5a2 2 0 0 1 2.541-.001l9 7.5z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  )
}
PAGE_D_EOF
