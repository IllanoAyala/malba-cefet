cat << 'PAGE_A_EOF' > src/app/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BrainCircuit, GraduationCap, Target } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
      <header className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold text-[#002B49]">MathAI-CEFET | Dashboard PIBIC BCE 2026</h1>
        <p className="text-slate-500 mt-2">
          Aluno: Illano Ayala Alves Ferreira &bull; Orientador: Prof. Dr. Emerson de Sousa Costa
        </p>
        <p className="text-slate-500">Engenharia Mecatrônica, Campus V - Divinópolis</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Questões</CardTitle>
            <Target className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-slate-500 mt-1">Simulados ENEM (BNCC)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Autonomia do Aluno</CardTitle>
            <GraduationCap className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">75%</div>
            <p className="text-xs text-slate-500 mt-1">Simulada via Intervenção Socrática</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Etapa Cronograma</CardTitle>
            <BrainCircuit className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-[#002B49]">Mapeamento e Práticas</div>
            <p className="text-xs text-slate-500 mt-1">Fase 2 de Desenvolvimento</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border">
          <div className="grid md:grid-cols-2">
            <div className="p-8 bg-slate-100 flex flex-col justify-center">
              <Badge variant="destructive" className="w-fit mb-4">IA Comercial</Badge>
              <h3 className="text-2xl font-bold mb-2 text-slate-800">Resposta Pronta (Passividade)</h3>
              <p className="text-slate-600">O aluno recebe a resposta e os cálculos de forma imediata. O processo de raciocínio é terceirizado para a máquina, prejudicando o desenvolvimento cognitivo e a autonomia na resolução de problemas complexos.</p>
            </div>
            <div className="p-8 bg-[#002B49] text-white flex flex-col justify-center">
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white w-fit mb-4 border-none">IA Pedagógica</Badge>
              <h3 className="text-2xl font-bold mb-2">Tutor Socrático (Autonomia)</h3>
              <p className="text-blue-100">O aluno é guiado pelas 5 etapas do Arco de Maguerez. O tutor não fornece a resposta final, mas formula perguntas estratégicas que ajudam a identificar erros e traçar novas hipóteses. O protagonismo volta para o aluno.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
PAGE_A_EOF

mkdir -p src/app/explorador

cat << 'PAGE_B_EOF' > src/app/explorador/page.tsx
"use client"
import { useState } from "react"
import { enemQuestions } from "@/data/enem-questions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

export default function ExploradorPage() {
  const router = useRouter()
  const [filterYear, setFilterYear] = useState<string>("Todos")

  const filteredQuestions = enemQuestions.filter(q => 
    filterYear === "Todos" ? true : q.ano_ensino_medio === filterYear
  )

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#002B49] mb-2">Explorador de Questões</h1>
          <p className="text-slate-500">Selecione uma questão do ENEM mapeada com a BNCC para resolver com o Tutor.</p>
        </div>
      </div>

      <Tabs defaultValue="Todos" className="mb-8" onValueChange={setFilterYear}>
        <TabsList>
          <TabsTrigger value="Todos">Todos</TabsTrigger>
          <TabsTrigger value="1º Ano">1º Ano</TabsTrigger>
          <TabsTrigger value="2º Ano">2º Ano</TabsTrigger>
          <TabsTrigger value="3º Ano">3º Ano</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuestions.map(q => (
          <Card key={q.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 border-b">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  ENEM {q.ano_enem}
                </Badge>
                <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200">{q.ano_ensino_medio}</Badge>
              </div>
              <CardTitle className="text-lg leading-tight">{q.topico_bncc}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-3 line-clamp-2">
                  {q.habilidade_enem}
                </p>
                <p className="text-sm text-slate-700 line-clamp-3 mb-6">
                  {q.enunciado}
                </p>
              </div>
              <Button 
                variant="blue" 
                className="w-full mt-auto" 
                onClick={() => router.push(`/workspace/${q.id}`)}
              >
                Resolver com Tutor
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
PAGE_B_EOF
