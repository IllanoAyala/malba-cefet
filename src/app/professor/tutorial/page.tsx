"use client"
import { BookOpen, ShieldCheck, BarChart3, ChevronRight, CheckCircle2, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TabGuard } from "@/components/layout/TabGuard"

export default function TutorialIAPage() {
  return (
    <TabGuard tabId="tutorial">
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 md:p-10 hide-scrollbar pb-24 md:pb-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
      {/* HEADER PADRONIZADO */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-5 sm:p-8 lg:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800 mb-8 sm:mb-10">
        <div className="relative z-10 flex items-start gap-4">
          <div className="hidden md:flex w-16 h-16 bg-white/10 rounded-2xl items-center justify-center backdrop-blur-md border border-white/20 shadow-xl shrink-0">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <Badge className="bg-white/10 text-blue-200 border-white/10 hover:bg-white/20 mb-3 px-3 py-1 text-xs">
              Módulo de Capacitação
            </Badge>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
              Uso Ético e Metodológico da IA
            </h1>
            <p className="text-blue-100/80 text-lg max-w-3xl font-light">
              Bem-vindo ao tutorial para docentes do projeto Malba. Aqui você entenderá como nossa plataforma utiliza Inteligência Artificial aliada ao Arco de Maguerez para evitar a passividade cognitiva dos alunos.
            </p>
          </div>
        </div>
      </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-default overflow-hidden group">
            <div className="h-2 w-full bg-blue-500"></div>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl text-slate-800">IA Ética e Passividade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                IAs comerciais fornecem o gabarito instantaneamente, automatizando a cognição e atrofiando o pensamento crítico do aluno na modelagem matemática.
              </p>
              <div className="space-y-2 mt-4">
                <div className="flex gap-2 text-sm text-slate-700 items-start">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>IAs Genéricas: Terceirizam o cálculo.</span>
                </div>
                <div className="flex gap-2 text-sm text-slate-700 items-start">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Malba: Faz o aluno pensar e agir.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-default overflow-hidden group">
            <div className="h-2 w-full bg-indigo-500"></div>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl text-slate-800">Arco de Maguerez</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                A IA é programada utilizando um prompt heurístico de 5 fases. O Tutor Socrático nunca dá a resposta, mas sim conduz o raciocínio.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600">1. Observação</Badge>
                <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600">2. Pontos-chave</Badge>
                <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600">3. Teorização</Badge>
                <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600">4. Hipóteses</Badge>
                <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600">5. Aplicação</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-default overflow-hidden group">
            <div className="h-2 w-full bg-emerald-500"></div>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl text-slate-800">Telemetria Docente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Como professor, você não precisa ler todos os chats de todos os alunos. O Dashboard interpreta o esforço cognitivo automaticamente.
              </p>
              <div className="space-y-2 mt-4">
                <div className="flex gap-2 text-sm text-slate-700 items-start">
                  <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Dicas Solicitadas = Dificuldade no tópico.</span>
                </div>
                <div className="flex gap-2 text-sm text-slate-700 items-start">
                  <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Tempo Gasto = Engajamento na atividade.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Guia de Interpretação do Dashboard</h2>
          <div className="space-y-8">
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0">1</div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Identificando Lacunas de Aprendizagem</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Na tela de Dashboard, observe a taxa de "Acertos após intervenção Socrática". Se esse número for muito baixo em uma turma, significa que a IA não foi suficiente para fechar a lacuna cognitiva, e uma <strong>intervenção humana em sala de aula (exposição dialogada)</strong> é urgentemente necessária para aquele tema da BNCC.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0">2</div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Geração de Roteiros (Planejamento de Aula)</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Na aba "Área do Professor", você pode selecionar um assunto em que a turma apresentou mau desempenho e pedir para a IA gerar um plano de aula invertido. Ele já virá estruturado no Arco de Maguerez, para que sua aula presencial seja um reflexo da tutoria socrática.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0">3</div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Exportação de Dados para a Pesquisa</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Para os relatórios do PIBIC e elaboração do artigo científico final, a plataforma centraliza todas as interações e avaliações de feedback. Acesse a rota <code>/api/telemetry/export</code> para baixar a planilha CSV estruturada com as métricas quantitativas de uso do Malba.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
    </TabGuard>
  )
}
