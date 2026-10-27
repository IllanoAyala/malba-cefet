import React from 'react';
import { Calendar, CheckCircle, Clock, Users, BookOpen, BrainCircuit } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Investigação sobre o ensino-aprendizagem da Matemática a partir do uso de recursos da Inteligência Artificial</h2>
            <p className="text-slate-500 mt-2">CEFET-MG Campus V - Divinópolis</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="bg-slate-50 px-4 py-2 rounded-md border border-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Orientando: Illano Ayala Alves Ferreira</span>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-md border border-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium">Orientador: Prof. Emerson de Sousa Costa</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" /> Resumo Executivo</h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            O projeto propõe superar as limitações pedagógicas de IAs comerciais (como ChatGPT e Bing) no ensino da matemática. Focando no contexto de escolas públicas brasileiras, buscamos propor metodologias ativas e protótipos abertos de Processamento de Linguagem Natural (PLN) que incentivem a reflexão em vez do simples fornecimento de respostas prontas.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-emerald-600" /> Métricas Chave (Simuladas)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-700">85%</div>
              <div className="text-xs text-blue-900 mt-1">Engajamento com IA Pedagógica</div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-emerald-700">+40%</div>
              <div className="text-xs text-emerald-900 mt-1">Retenção de Conteúdo (PBL)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-slate-700" /> Cronograma do Projeto</h3>
        <div className="space-y-4">
          <div className="flex gap-4 items-start relative">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="w-0.5 h-full bg-emerald-200 absolute top-8 bottom-[-16px] left-4"></div>
            </div>
            <div className="pb-4">
              <h4 className="font-medium text-slate-800">Maio a Agosto</h4>
              <p className="text-sm text-slate-500">Revisão Bibliográfica (Concluído)</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start relative">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="w-0.5 h-full bg-slate-200 absolute top-8 bottom-[-16px] left-4"></div>
            </div>
            <div className="pb-4">
              <h4 className="font-medium text-slate-800">Setembro a Outubro</h4>
              <p className="text-sm text-slate-500">Atividades Práticas e Mapeamento Curricular (Em Andamento)</p>
            </div>
          </div>

          <div className="flex gap-4 items-start relative">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              </div>
              <div className="w-0.5 h-full bg-slate-200 absolute top-8 bottom-[-16px] left-4"></div>
            </div>
            <div className="pb-4">
              <h4 className="font-medium text-slate-800">Novembro</h4>
              <p className="text-sm text-slate-500">Preparação de Oficinas Pedagógicas</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Dezembro</h4>
              <p className="text-sm text-slate-500">Escrita de Artigo Científico e Relatório Final</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
