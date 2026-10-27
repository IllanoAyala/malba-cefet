import React, { useState } from 'react';
import { Sparkles, BookOpen, Clock, Target, CheckCircle2 } from 'lucide-react';

export default function LessonPlanner() {
  const [year, setYear] = useState('1');
  const [topic, setTopic] = useState('Função Afim');
  const [methodology, setMethodology] = useState('PBL');
  const [plan, setPlan] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setPlan(null);
    
    // Simulate generation
    setTimeout(() => {
      setPlan({
        title: `Aula de ${topic} utilizando ${methodology}`,
        objective: 'Desenvolver a capacidade de abstração matemática e aplicação em problemas do cotidiano evitando a dependência passiva de respostas prontas.',
        resources: ['Plataforma Adaptativa de Matemática (PAM)', 'Lousa Interativa', 'Smartphones dos Alunos'],
        timeline: [
          { time: '10 min', title: 'Introdução e Problematização', desc: 'Apresentação histórica e cenário-problema inicial.' },
          { time: '30 min', title: 'Resolução Interativa mediada por IA', desc: 'Uso da IA como tutora pedagógica socrática.' },
          { time: '10 min', title: 'Fechamento e Sistematização', desc: 'Debate em grupo e registro das conclusões no caderno.' }
        ],
        evaluation: 'Avaliação formativa baseada na participação do debate e na qualidade das perguntas feitas à IA (engajamento cognitivo).'
      });
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Gerador de Planos de Aula (Roteirizador)</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <form onSubmit={generatePlan} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ano Escolar</label>
              <select 
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="1">1º Ano do Ensino Médio</option>
                <option value="2">2º Ano do Ensino Médio</option>
                <option value="3">3º Ano do Ensino Médio</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tema Matemático</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Metodologia Ativa</label>
              <select 
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="PBL">Aprendizagem Baseada em Problemas (PBL)</option>
                <option value="Flipped Classroom">Sala de Aula Invertida</option>
                <option value="Modelagem">Modelagem Matemática</option>
              </select>
            </div>

            <button 
              type="submit"
              disabled={isGenerating}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              Gerar Estrutura de Aula
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          {plan ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-slate-800 border-b pb-4 mb-4">{plan.title}</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="flex items-center gap-2 font-semibold text-slate-700 mb-2">
                    <Target className="w-5 h-5 text-blue-600" /> Objetivo
                  </h4>
                  <p className="text-slate-600 text-sm">{plan.objective}</p>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 font-semibold text-slate-700 mb-2">
                    <BookOpen className="w-5 h-5 text-purple-600" /> Recursos Tecnológicos
                  </h4>
                  <ul className="flex flex-wrap gap-2">
                    {plan.resources.map((res: string, i: number) => (
                      <li key={i} className="text-xs font-medium bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100">
                        {res}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 font-semibold text-slate-700 mb-3">
                    <Clock className="w-5 h-5 text-amber-600" /> Cronograma da Aula
                  </h4>
                  <div className="space-y-3 pl-2 border-l-2 border-slate-100">
                    {plan.timeline.map((step: any, i: number) => (
                      <div key={i} className="relative pl-6">
                        <div className="absolute -left-[21px] top-1 bg-white p-1 rounded-full border-2 border-slate-200">
                          <div className="w-2 h-2 rounded-full bg-slate-400" />
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{step.time}</span>
                          <span className="font-semibold text-slate-800 text-sm">{step.title}</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 mt-6">
                  <h4 className="flex items-center gap-2 font-semibold text-emerald-900 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Critérios de Avaliação
                  </h4>
                  <p className="text-sm text-emerald-800">{plan.evaluation}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center p-8 text-center min-h-[400px]">
              <div>
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Preencha o formulário e clique em gerar para criar um roteiro de aula estruturado.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
