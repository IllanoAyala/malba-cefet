import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Bot, Lightbulb } from 'lucide-react';

const years = [
  {
    id: 1,
    title: '1º Ano do Ensino Médio',
    topics: 'Função Afim e Conjuntos Numéricos',
    ai: 'PAM (Plataforma Adaptativa de Matemática) ou bettermarks',
    methodology: 'Modelagem Matemática e Produção Colaborativa de Vídeos',
    checklist: [
      'Escolha de um problema cotidiano envolvendo tarifas (ex: Uber vs Taxi)',
      'Levantamento de dados e equacionamento (Função Afim)',
      'Validação dos dados utilizando a plataforma adaptativa (IA)',
      'Produção do roteiro e gravação de um vídeo curto explicativo',
      'Apresentação e debate em sala'
    ]
  },
  {
    id: 2,
    title: '2º Ano do Ensino Médio',
    topics: 'Logaritmos e Matemática Financeira',
    ai: 'Sinergia Bing + ChatGPT para Tutoria Individual',
    methodology: 'Aprendizagem Baseada em Problemas (PBL)',
    checklist: [
      'Apresentação de cenário-problema: Planejamento financeiro para compra de veículo',
      'Pesquisa de taxas de juros reais no mercado usando Bing',
      'Uso de prompts no ChatGPT para destrinchar o passo a passo dos juros compostos e logaritmos',
      'Resolução reflexiva comparando os resultados obtidos com as metas',
      'Elaboração de um parecer financeiro'
    ]
  },
  {
    id: 3,
    title: '3º Ano do Ensino Médio',
    topics: 'Geometria Analítica/Parábolas e Polinômios',
    ai: 'Cognitive Tutor',
    methodology: 'Modelagem Computacional',
    checklist: [
      'Análise de dados de lucro de uma empresa fictícia ao longo do tempo',
      'Uso do Cognitive Tutor para guiar a modelagem da curva (Polinômio de grau n)',
      'Identificação de pontos de máximo/mínimo (vértice da parábola)',
      'Discussão guiada sobre as limitações do modelo matemático',
      'Apresentação dos resultados de otimização de lucro'
    ]
  }
];

export default function CurriculumGuide() {
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Mapeamento Curricular Ano a Ano</h2>
      
      <div className="flex flex-wrap gap-4">
        {years.map((year) => (
          <button
            key={year.id}
            onClick={() => { setSelectedYear(year); setExpanded(true); }}
            className={`px-6 py-3 rounded-full font-medium transition-colors ${
              selectedYear.id === year.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {year.title}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 border-b border-slate-200 hover:bg-slate-100 transition-colors"
        >
          <div className="text-left">
            <h3 className="text-lg font-bold text-slate-800">{selectedYear.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{selectedYear.topics}</p>
          </div>
          {expanded ? <ChevronUp className="text-slate-500" /> : <ChevronDown className="text-slate-500" />}
        </button>

        {expanded && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50/50 p-5 rounded-lg border border-blue-100">
                <h4 className="flex items-center gap-2 font-semibold text-blue-900 mb-3">
                  <Bot className="w-5 h-5 text-blue-600" /> IA Recomendada
                </h4>
                <p className="text-slate-700 text-sm">{selectedYear.ai}</p>
              </div>
              <div className="bg-emerald-50/50 p-5 rounded-lg border border-emerald-100">
                <h4 className="flex items-center gap-2 font-semibold text-emerald-900 mb-3">
                  <Lightbulb className="w-5 h-5 text-emerald-600" /> Metodologia Ativa
                </h4>
                <p className="text-slate-700 text-sm">{selectedYear.methodology}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-4">Checklist de Aplicação em Sala:</h4>
              <ul className="space-y-3">
                {selectedYear.checklist.map((item, index) => (
                  <li key={index} className="flex gap-3 text-sm text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
