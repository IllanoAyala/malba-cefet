import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const TOPIC_KEYWORDS = [
  { topic: 'Probabilidade', year: '2º Ano', words: ['probabilidade', 'aleatoriamente', 'sorteio', 'espaço amostral', 'chance'] },
  { topic: 'Análise Combinatória', year: '2º Ano', words: ['anagramas', 'combinações', 'agrupamentos', 'escolher', 'maneiras distintas', 'possibilidades de formar'] },
  { topic: 'Estatística', year: '3º Ano', words: ['média', 'mediana', 'moda', 'desvio padrão', 'variância', 'frequência'] },
  { topic: 'Matemática Financeira', year: '1º Ano', words: ['juros', 'capital', 'montante', 'rendimento', 'empréstimo', 'desconto', 'prestação', 'parcela'] },
  { topic: 'Geometria Espacial', year: '3º Ano', words: ['cilindro', 'cone', 'esfera', 'prisma', 'pirâmide', 'volume', 'capacidade em litros', 'm³', 'cm³', 'área da base'] },
  { topic: 'Geometria Plana', year: '2º Ano', words: ['triângulo', 'quadrado', 'retângulo', 'área', 'perímetro', 'circunferência', 'círculo', 'raio', 'polígono'] },
  { topic: 'Geometria Analítica', year: '3º Ano', words: ['coordenadas', 'plano cartesiano', 'reta', 'ponto', 'equação da reta', 'distância entre pontos'] },
  { topic: 'Trigonometria', year: '2º Ano', words: ['seno', 'cosseno', 'tangente', 'ângulo', 'radianos', 'graus', 'círculo trigonométrico'] },
  { topic: 'Logaritmos', year: '1º Ano', words: ['logaritmo', 'log', 'escala richter', 'ph', 'decibéis'] },
  { topic: 'Funções Exponenciais', year: '1º Ano', words: ['crescimento exponencial', 'decaimento', 'população de bactérias', 'meia-vida'] },
  { topic: 'Funções Quadráticas', year: '1º Ano', words: ['parábola', 'vértice', 'ponto máximo', 'ponto mínimo', 'trajetória'] },
  { topic: 'Função Afim', year: '1º Ano', words: ['taxa fixa', 'custo fixo', 'por quilômetro', 'função linear', 'f(x) = ax + b'] },
  { topic: 'Matrizes e Sistemas', year: '2º Ano', words: ['matriz', 'linhas e colunas', 'sistema linear', 'determinante'] },
  { topic: 'Escalas e Proporção', year: '1º Ano', words: ['escala', 'mapa', 'maquete', 'proporcional', 'razão', 'divisão proporcional'] },
  { topic: 'Aritmética Básica', year: '1º Ano', words: ['porcentagem', '%', 'quilos', 'litros', 'consumo', 'velocidade média', 'tempo'] }
];

function classifyTopic(text) {
  const lower = text.toLowerCase();
  for (const item of TOPIC_KEYWORDS) {
    if (item.words.some(w => lower.includes(w))) {
      return { topic: item.topic, year: item.year };
    }
  }
  return { topic: 'Matemática Básica', year: '1º Ano' };
}

function buildSocraticHints(topic) {
  return [
    `1. Observação da Realidade: Quais são os dados e informações essenciais fornecidos no enunciado sobre ${topic}?`,
    `2. Pontos-Chave: O que a pergunta final está pedindo exatamente para descobrir? O que é fixo e o que varia?`,
    `3. Teorização: Qual conceito, modelo matemático ou fórmula de ${topic} melhor descreve essa situação?`,
    `4. Hipóteses de Solução: Como você pode montar a expressão ou proporção usando os valores do problema?`,
    `5. Aplicação: Faça os cálculos com atenção às unidades de medida e analise se o resultado faz sentido no mundo real.`
  ];
}

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Falha ao baixar imagem: ${url} (status ${res.status})`);
      return false;
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    console.warn(`Erro no download da imagem ${url}:`, err.message);
    return false;
  }
}

async function importExamYear(year) {
  console.log(`\n==================================================`);
  console.log(`Iniciando download das questões de Matemática do ENEM ${year}...`);
  console.log(`==================================================`);

  // Diretório de imagens do ano
  const imgDir = path.join(process.cwd(), 'public', 'images', String(year));
  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
  }

  // URL do Maritaca AI para Matemática (offset 135, length 45 -> questões 136 a 180)
  const url = `https://datasets-server.huggingface.co/rows?dataset=maritaca-ai%2Fenem&config=${year}&split=train&offset=135&length=45`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Erro ao buscar dados do ENEM ${year}: ${res.statusText}`);
  }

  const data = await res.json();
  const rows = data.rows || [];
  console.log(`Carregadas ${rows.length} questões brutas do ENEM ${year}.`);

  let addedCount = 0;

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx].row;
    const questionNumber = 136 + idx;
    
    // Verifica se já existe no banco
    const habilidade = `ENEM ${year} - Matemática - Questão ${questionNumber}`;
    const existing = await prisma.question.findFirst({
      where: {
        ano_enem: year,
        habilidade_enem: habilidade
      }
    });

    if (existing) {
      console.log(`[${year}] Questão ${questionNumber} já existe no banco. Pulando.`);
      continue;
    }

    let enunciadoText = row.question ? row.question.trim() : '';

    // Se houver figuras, baixar e substituir no lugar exato do [[placeholder]]
    if (row.figures && Array.isArray(row.figures) && row.figures.length > 0) {
      const imgTags = [];
      for (let fIdx = 0; fIdx < row.figures.length; fIdx++) {
        const figUrl = row.figures[fIdx];
        const fileName = `question-${questionNumber}${fIdx > 0 ? `_${fIdx}` : ''}.png`;
        const localFilePath = path.join(imgDir, fileName);

        const success = await downloadImage(figUrl, localFilePath);
        if (success) {
          imgTags.push(`![Imagem da Questão ${questionNumber}](/images/${year}/${fileName})`);
        }
      }

      if (imgTags.length > 0) {
        let tagIndex = 0;
        if (enunciadoText.includes('[[placeholder]]')) {
          enunciadoText = enunciadoText.replace(/\[\[placeholder\]\]/gi, () => {
            if (tagIndex < imgTags.length) {
              return '\n\n' + imgTags[tagIndex++] + '\n\n';
            }
            return '';
          });
        }
        while (tagIndex < imgTags.length) {
          enunciadoText += `\n\n${imgTags[tagIndex++]}\n\n`;
        }
      }
    }

    // Remove qualquer placeholder residual
    enunciadoText = enunciadoText.replace(/\[\[placeholder\]\]/gi, '').replace(/\n{3,}/g, '\n\n').trim();

    // Se a questão foi anulada oficialmente
    let correta = (row.label || 'A').toUpperCase().trim();
    if (correta === 'ANULADO' || correta.length !== 1) {
      correta = 'A';
      enunciadoText = `> ⚠️ **Nota Histórica:** Questão anulada oficialmente pelo INEP no gabarito final.\n\n` + enunciadoText;
    }

    // Formatar alternativas
    const letras = ['A', 'B', 'C', 'D', 'E'];
    const altsRaw = Array.isArray(row.alternatives) ? row.alternatives : [];
    const alternativasFormatadas = letras.map((letra, i) => ({
      letra,
      texto: altsRaw[i] ? String(altsRaw[i]).trim() : ''
    }));

    // Classificação de Tópico e Série
    const { topic, year: anoEM } = classifyTopic(enunciadoText);
    const dicas = buildSocraticHints(topic);

    // Inserir no banco Neon
    await prisma.question.create({
      data: {
        ano_enem: year,
        ano_ensino_medio: anoEM,
        topico_bncc: topic,
        habilidade_enem: habilidade,
        enunciado: enunciadoText,
        alternativas: JSON.stringify(alternativasFormatadas),
        alternativa_correta: correta,
        dicas_socraticas: JSON.stringify(dicas),
        revisado_ia: true
      }
    });

    addedCount++;
    process.stdout.write(`✔ Cadastrada Questão ${questionNumber} (${topic} - ${anoEM})\n`);
  }

  console.log(`\nConcluído ENEM ${year}: ${addedCount} novas questões inseridas com sucesso.`);
}

async function run() {
  try {
    await importExamYear(2022);
    await importExamYear(2023);

    const total = await prisma.question.count();
    console.log(`\n🎉 SUCESSO TOTAL! Banco de dados atualizado.`);
    console.log(`Total geral de questões no banco de dados agora: ${total} questões!`);
  } catch (err) {
    console.error("Erro durante a importação:", err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
