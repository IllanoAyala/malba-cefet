import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando categorização das questões...");

  // Ler o dicionário
  const tagsPath = path.join(__dirname, 'enem2025_tags.json');
  const tagsData = JSON.parse(fs.readFileSync(tagsPath, 'utf8'));

  // Buscar todas as questões do banco
  const questions = await prisma.question.findMany();

  let updatedCount = 0;

  for (const q of questions) {
    // Nós precisamos descobrir qual é o número da questão lendo o texto ou usando a ordem?
    // Como os enunciados não começam com o número exato de forma limpa,
    // podemos achar o número cruzando com o arquivo output.json original
    const jsonPath = path.join(process.cwd(), 'data', 'enem', 'output_2025_PV_impresso_D2_CD5', 'output.json');
    const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')).data;
    
    // Vamos localizar a questão original no JSON que gerou esse texto
    // Uma forma fácil é bater as primeiras 30 letras do enunciado
    const qTextoLivre = q.enunciado.replace(/[\n\r_*]+/g, ' ').trim().substring(0, 30);
    
    const originalMatch = rawData.find((rawItem: any) => {
      if (rawItem.number < 136 || rawItem.number > 180) return false;
      const rawText = rawItem.content
        .filter((c: any) => c.type === 'text')
        .map((c: any) => c.content)
        .join('')
        .replace(/[\n\r_*]+/g, ' ')
        .trim();
      return rawText.startsWith(qTextoLivre);
    });

    if (originalMatch) {
      const qNumber = String(originalMatch.number);
      const tagInfo = tagsData[qNumber];

      if (tagInfo) {
        await prisma.question.update({
          where: { id: q.id },
          data: {
            topico_bncc: tagInfo.topico,
            ano_ensino_medio: tagInfo.ano
          }
        });
        updatedCount++;
        console.log(`Questão ${qNumber} mapeada -> [${tagInfo.ano}] ${tagInfo.topico}`);
      }
    } else {
      console.log(`Não encontrei match para: ${qTextoLivre}`);
    }
  }

  console.log(`Sucesso! ${updatedCount} questões categorizadas.`);
}

main()
  .catch(e => {
    console.error("Erro na categorização:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
