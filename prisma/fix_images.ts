import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log("Fixing images...");

  // 1. Copy images from 2024 output to public/images
  const imgDir2024 = path.join(process.cwd(), 'data', 'enem', 'output_2024_PV_impresso_D2_CD5', 'img');
  const publicImagesDir = path.join(process.cwd(), 'public', 'images');
  
  if (fs.existsSync(imgDir2024)) {
    const images = fs.readdirSync(imgDir2024);
    let copied = 0;
    images.forEach(img => {
      fs.copyFileSync(path.join(imgDir2024, img), path.join(publicImagesDir, img));
      copied++;
    });
    console.log(`Copied ${copied} images from 2024 img folder.`);
  }

  // 2. Fix paths in database
  const questions = await prisma.question.findMany();
  let updated = 0;

  for (const q of questions) {
    let newEnunciado = q.enunciado;
    let newAlternativas = q.alternativas;

    // Regex to match markdown images: ![alt](/images/SOME/PATH/filename.png)
    const regex = /!\[([^\]]*)\]\(\/images\/.*\/([^\/]+\.png)\)/g;
    
    if (regex.test(newEnunciado)) {
      newEnunciado = newEnunciado.replace(regex, '![$1](/images/$2)');
    }

    if (regex.test(newAlternativas)) {
      newAlternativas = newAlternativas.replace(regex, '![$1](/images/$2)');
    }

    if (newEnunciado !== q.enunciado || newAlternativas !== q.alternativas) {
      await prisma.question.update({
        where: { id: q.id },
        data: {
          enunciado: newEnunciado,
          alternativas: newAlternativas
        }
      });
      updated++;
    }
  }

  console.log(`Updated paths in ${updated} questions.`);

  // 3. Fix empty enunciados by restoring from 2025/2024 JSON
  const emptyQuestions = questions.filter(q => q.enunciado.trim() === '');
  for (const q of emptyQuestions) {
    console.log(`Empty question found: ${q.ano_enem} - ${q.habilidade_enem}`);
    const numMatch = q.habilidade_enem.match(/Questão (\d+)/);
    if (!numMatch) continue;
    const num = parseInt(numMatch[1], 10);
    
    let folder = q.ano_enem === 2024 ? 'output_2024_PV_impresso_D2_CD5' : 'output_2025_PV_impresso_D2_CD5';
    let jsonPath = path.join(process.cwd(), 'data', 'enem', folder, 'output.json');
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8')).data;
      const rawQ = data.find((x: any) => x.number === num);
      if (rawQ) {
        let text = '';
        rawQ.content.forEach((chunk: any) => {
          if (chunk.type === 'text') text += chunk.content;
          else if (chunk.type === 'image') text += `\n\n![Imagem da Questão](/images/${path.basename(chunk.content)})\n\n`;
        });
        await prisma.question.update({
          where: { id: q.id },
          data: { enunciado: text, revisado_ia: false } // Set to false so the formatter can try again!
        });
        console.log(`Restored raw text for question ${num}`);
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
