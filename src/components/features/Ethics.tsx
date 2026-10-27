import React from 'react';
import { AlertTriangle, Lock, FileText, Scale } from 'lucide-react';

export default function Ethics() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Ética e Limitações em IA Educacional</h2>
        <p className="text-slate-500 mt-2">Diretrizes críticas mapeadas no projeto BCE 2026 para implementação responsável.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 p-6 rounded-xl border border-red-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-red-900">Alucinação Matemática</h3>
          </div>
          <p className="text-sm text-red-800 leading-relaxed">
            IAs baseadas em LLM (Large Language Models) são otimizadas para fluência linguística, não para lógica formal. Elas frequentemente cometem erros em cálculos intermediários e inventam provas matemáticas plausíveis, porém falsas. O uso sem mediação do professor pode consolidar erros conceituais graves.
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-blue-900">Privacidade (LGPD)</h3>
          </div>
          <p className="text-sm text-blue-800 leading-relaxed">
            O uso de plataformas comerciais por menores de idade em ambiente escolar requer atenção estrita à Lei Geral de Proteção de Dados. Dados de desempenho, dúvidas recorrentes e interações com o chat não devem ser usados por big techs para treinamento de modelos sem anonimização rigorosa e consentimento.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5 text-slate-600" /> Transparência e Código Aberto
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          A pesquisa defende o fomento de tecnologias educacionais transparentes (Open Source). Algoritmos "caixa-preta" comerciais impedem que educadores auditem como o viés algorítmico pode estar afetando a avaliação formativa dos alunos em vulnerabilidade social.
        </p>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl shadow-md text-white">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-300" /> Referências Científicas Base
        </h3>
        <ul className="space-y-4">
          <li className="flex gap-4 items-start">
            <span className="text-emerald-400 font-bold">1</span>
            <div>
              <h4 className="font-semibold">Bassanezi, R. C. (2002)</h4>
              <p className="text-sm text-slate-400">Ensino-aprendizagem com modelagem matemática: uma nova estratégia.</p>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <span className="text-emerald-400 font-bold">2</span>
            <div>
              <h4 className="font-semibold">Libâneo, J. C. (2010)</h4>
              <p className="text-sm text-slate-400">Pedagogia e pedagogos, para quê?</p>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <span className="text-emerald-400 font-bold">3</span>
            <div>
              <h4 className="font-semibold">Berbel, N. A. N. (2011)</h4>
              <p className="text-sm text-slate-400">As metodologias ativas e a promoção da autonomia de estudantes.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
