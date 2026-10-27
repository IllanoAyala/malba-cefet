import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando importação do ENEM 2024 (apenas append)...");

  // 1. Caminho do output de 2024
  const jsonPath = path.join(process.cwd(), 'data', 'enem', 'output_2024_PV_impresso_D2_CD5', 'output.json');
  if (!fs.existsSync(jsonPath)) {
    console.error("Arquivo 2024 não encontrado em", jsonPath);
    return;
  }
  
  const fileContent = fs.readFileSync(jsonPath, 'utf-8');
  const parsedData = JSON.parse(fileContent);
  const questionsData = parsedData.data;

  const mathQuestions = questionsData.filter((q: any) => q.number >= 136 && q.number <= 180);

  // Lógica de tags dinâmicas
  const tagsPath = path.join(__dirname, 'enem2024_tags.json');
  let tagsData: any = {};
  if (fs.existsSync(tagsPath)) {
    tagsData = JSON.parse(fs.readFileSync(tagsPath, 'utf8'));
  }

  // Copiar imagens
  const sourceImagesDir = path.join(process.cwd(), 'data', 'enem', 'output_2024_PV_impresso_D2_CD5', 'images');
  const publicImagesDir = path.join(process.cwd(), 'public', 'images');
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }

  if (fs.existsSync(sourceImagesDir)) {
    const images = fs.readdirSync(sourceImagesDir);
    images.forEach(img => {
      fs.copyFileSync(path.join(sourceImagesDir, img), path.join(publicImagesDir, img));
    });
    console.log(`Copiadas ${images.length} imagens para public/images/`);
  }

  const questionsToCreate: any[] = [];

  for (const q of mathQuestions) {
    let enunciadoMd = "";
    
    // Processamento de conteúdo (texto e imagens)
    if (q.content && Array.isArray(q.content)) {
      q.content.forEach((chunk: any) => {
        if (chunk.type === 'text') {
          // Fix para subscritos da prova:
          if (chunk.font_size < 8 && chunk.content.length > 15) {
            enunciadoMd += `\n\n[Referência: ${chunk.content.trim()}]\n\n`;
          } else {
            enunciadoMd += chunk.content;
          }
        } else if (chunk.type === 'image') {
          enunciadoMd += `\n\n![Imagem da questão ${q.number}](/images/${chunk.content})\n\n`;
        }
      });
    }

    const alternativasArray: any[] = [];
    let correta = "A";

    if (q.alternatives) {
      Object.keys(q.alternatives).forEach((key) => {
        const altData = q.alternatives[key];
        let altText = "";
        
        if (altData.content && Array.isArray(altData.content)) {
          altData.content.forEach((chunk: any) => {
            if (chunk.type === 'text') altText += chunk.content;
            else if (chunk.type === 'image') altText += ` ![Imagem alternativa](/images/${chunk.content}) `;
          });
        }
        
        alternativasArray.push({
          letra: altData.alternative,
          texto: altText.trim()
        });

        if (altData.correct) {
          correta = altData.alternative;
        }
      });
    }

    let topico = "Matemática e suas Tecnologias";
    let ano = "3º Ano";
    if (tagsData[String(q.number)]) {
      topico = tagsData[String(q.number)].topico;
      ano = tagsData[String(q.number)].ano;
    }

    // Default socratic hints (same as 2025)
    const hints = [
      "Quais dados o problema fornece e o que ele pede exatamente?",
      "Existe alguma fórmula ou conceito matemático que relaciona esses dados?",
      "Tente organizar as informações em um esquema ou tabela. Isso ajuda?",
      "Vamos fazer um rascunho: qual seria o primeiro passo para resolver?",
      "Revise seu cálculo: o resultado faz sentido no contexto do problema?"
    ];

    questionsToCreate.push({
      ano_enem: 2024,
      ano_ensino_medio: ano,
      topico_bncc: topico,
      habilidade_enem: `ENEM 2024 - Matemática - Questão ${q.number}`,
      enunciado: enunciadoMd.trim(),
      alternativas: JSON.stringify(alternativasArray),
      alternativa_correta: correta,
      dicas_socraticas: JSON.stringify(hints),
      revisado_ia: false // Importante: para que o script format_enunciados possa processá-la!
    });
  }

  // Verifica se já existem questões de 2024 para não duplicar
  const existing2024 = await prisma.question.count({ where: { ano_enem: 2024 } });
  if (existing2024 > 0) {
    console.log(`Já existem ${existing2024} questões de 2024 no banco. Deleto as antigas de 2024...`);
    await prisma.question.deleteMany({ where: { ano_enem: 2024 } });
  }

  const result = await prisma.question.createMany({
    data: questionsToCreate
  });

  console.log(`Importação concluída! ${result.count} questões de 2024 inseridas.`);
}

main()
  .catch(e => {
    console.error("Erro no script de importação:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
