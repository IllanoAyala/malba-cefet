import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  console.log("Iniciando correção dos placeholders de imagem no banco Neon...");

  const questions = await prisma.question.findMany({
    where: {
      enunciado: { contains: 'placeholder' }
    }
  });

  console.log(`Encontradas ${questions.length} questões com [[placeholder]].`);

  let updated = 0;

  for (const q of questions) {
    const images = q.enunciado.match(/!\[.*?\]\(.*?\)/g) || [];
    let text = q.enunciado.trim();
    
    // Remove as imagens originais que estavam anexadas no final
    text = text.replace(/!\[.*?\]\(.*?\)/g, '').trim();

    // Substitui cada [[placeholder]] pela imagem correspondente na ordem exata
    let imgIndex = 0;
    text = text.replace(/\[\[placeholder\]\]/gi, () => {
      if (imgIndex < images.length) {
        return '\n\n' + images[imgIndex++] + '\n\n';
      }
      return '';
    });

    // Se ainda restarem imagens (ex: subfiguras), anexa logo após o ponto onde foram referenciadas
    while (imgIndex < images.length) {
      text += '\n\n' + images[imgIndex++];
    }

    // Limpa quebras de linha excessivas
    text = text.replace(/\n{3,}/g, '\n\n').trim();

    await prisma.question.update({
      where: { id: q.id },
      data: { enunciado: text }
    });

    updated++;
    console.log(`✔ [${q.ano_enem}] ${q.habilidade_enem} corrigida com sucesso.`);
  }

  console.log(`\n🎉 Todas as ${updated} questões foram corrigidas no banco de dados Neon!`);
  await prisma.$disconnect();
}

run().catch(err => {
  console.error("Erro na correção:", err);
  process.exit(1);
});
