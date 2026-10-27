import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2].trim();
  });
}

const prisma = new PrismaClient();
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function formatWithGroq(text: string): Promise<string> {
  const prompt = `Você é um assistente de formatação. O texto a seguir é o enunciado de uma questão do ENEM extraído via OCR. Ele perdeu quebras de linha e qualquer formatação de tabela/quadro foi achatada numa linha só.
Sua única tarefa é:
1. Reconstruir tabelas em formato Markdown se houver dados tabulares aglutinados.
2. Organizar as quebras de parágrafo.
3. Formatar textos que devem ser destacados (negrito, itálico).
IMPORTANTE: Retorne APENAS o enunciado formatado em Markdown, sem NENHUM texto adicional como "Aqui está o texto formatado", e não responda a questão. Não mude, remova ou altere NENHUMA palavra, apenas arrume a formatação. Se não houver tabela, apenas ajeite as quebras de linha.

TEXTO BRUTO ORIGINAL:
${text}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          console.log(`Rate limit atingido (Tentativa ${attempt}). Esperando 5 segundos...`);
          await sleep(5000);
          continue;
        }
        throw new Error(`Erro na API: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (err: any) {
      console.log(`Falha na tentativa ${attempt}: ${err.message}`);
      if (attempt === 3) throw err;
      await sleep(2000);
    }
  }
  return text; // fallback
}

async function main() {
  console.log("Iniciando revisão de enunciados com IA...");
  
  const questions = await prisma.question.findMany({
    where: { revisado_ia: false }
  });

  console.log(`Encontrei ${questions.length} questões pendentes de revisão.`);

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    console.log(`\nProcessando questão ${i + 1}/${questions.length} (ID: ${q.id.substring(0, 8)}...)`);
    
    try {
      const formattedText = await formatWithGroq(q.enunciado);
      
      if (!formattedText || formattedText.trim() === "") {
        console.warn(`Aviso: IA retornou texto vazio para questão ${q.id}. Ignorando atualização.`);
        await prisma.question.update({
          where: { id: q.id },
          data: { revisado_ia: true } // Marca como revisado para não travar num loop eterno, mas não sobreescreve
        });
      } else {
        await prisma.question.update({
          where: { id: q.id },
          data: { 
            enunciado: formattedText,
            revisado_ia: true
          }
        });
        console.log(`✅ Questão atualizada e marcada como revisada.`);
      }
      await sleep(2500); // Backoff limit
    } catch (error) {
      console.error(`❌ Erro ao formatar questão ${q.id}:`, error);
    }
  }
  
  console.log("\nRevisão concluída!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
