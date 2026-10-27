import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const genericHints = [
  "Que tal observarmos a realidade do problema? Quais são os dados principais fornecidos no enunciado?",
  "Qual o ponto-chave (hipótese) para resolver esse problema matemático?",
  "Vamos teorizar: qual fórmula, operação ou conceito usamos para esse tipo de situação?",
  "Como podemos aplicar esse conceito na prática aos dados que temos?",
  "Agora resolva a operação e veja a qual resultado você chega."
];

async function main() {
  console.log("Limpando questões existentes...");
  await prisma.question.deleteMany();
  
  console.log("Lendo arquivo JSON do enem-extractor...");
  const jsonPath = path.join(process.cwd(), 'data', 'enem', 'output_2025_PV_impresso_D2_CD5', 'output.json');
  const fileContent = fs.readFileSync(jsonPath, 'utf-8');
  const parsedData = JSON.parse(fileContent);
  const questionsData = parsedData.data;

  console.log("Filtrando e processando questões de Matemática (136 a 180)...");
  const mathQuestions = questionsData.filter((q: any) => q.number >= 136 && q.number <= 180);

  const questionsToCreate = [];

  for (const q of mathQuestions) {
    // 1. Process Enunciado (Formatação Limpa com Espaçamento e Quebras)
    let enunciadoMd = "";
    if (q.content && Array.isArray(q.content)) {
      for (const chunk of q.content) {
        if (chunk.type === 'text') {
          let text = chunk.content.trim();
          
          // Se for texto pequeno e longo o suficiente, é referência (Ex: "Disponível em...")
          if (text.startsWith("Disponível em:") || (chunk.font_size < 8 && text.length > 15)) {
            enunciadoMd += `\n\n_${text}_\n\n`;
          } else {
            if (chunk.font_style === 'bold') {
              text = `**${text}**`;
            }
            enunciadoMd += text + " ";
          }
        } else if (chunk.type === 'image') {
          const urlParts = chunk.content.split('/');
          const filename = urlParts[urlParts.length - 1];
          enunciadoMd += `\n\n![Imagem da Questão](/images/${filename})\n\n`;
        }
      }
    }

    // 2. Process Alternativas e Alternativa Correta
    const alternativasObj = q.alternatives;
    const alternativasArray = [];
    let correta = "A";

    for (let i = 0; i < 5; i++) {
      const altData = alternativasObj[String(i)];
      if (!altData) continue;
      
      let altText = "";
      if (altData.content && Array.isArray(altData.content)) {
        for (const chunk of altData.content) {
          if (chunk.type === 'text') {
            altText += chunk.content.trim() + " ";
          }
        }
      }

      alternativasArray.push({
        letra: altData.alternative,
        texto: altText.trim()
      });

      if (altData.correct) {
        correta = altData.alternative;
      }
    }

    const tagsPath = path.join(__dirname, 'enem2025_tags.json');
    let topico = "Matemática e suas Tecnologias";
    let ano = "3º Ano";
    if (fs.existsSync(tagsPath)) {
      const tagsData = JSON.parse(fs.readFileSync(tagsPath, 'utf8'));
      if (tagsData[String(q.number)]) {
        topico = tagsData[String(q.number)].topico;
        ano = tagsData[String(q.number)].ano;
      }
    }

    // 3. Adicionar na lista de criação
    questionsToCreate.push({
      ano_enem: 2025,
      ano_ensino_medio: ano,
      topico_bncc: topico,
      habilidade_enem: "ENEM 2025 - Matemática",
      enunciado: enunciadoMd.trim(),
      alternativas: JSON.stringify(alternativasArray),
      alternativa_correta: correta,
      dicas_socraticas: JSON.stringify(genericHints)
    });
  }

  console.log(`Inserindo ${questionsToCreate.length} questões reais no banco de dados...`);
  
  for (const q of questionsToCreate) {
    await prisma.question.create({ data: q });
  }

  console.log("Seed completado com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
