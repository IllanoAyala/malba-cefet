import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function formatQuestionEnunciado(rawText) {
  if (!rawText) return rawText;

  // Preserva imagens já existentes para recolocá-las intactas
  const images = [];
  let workingText = rawText.replace(/!\[.*?\]\(.*?\)/g, (match) => {
    images.push(match);
    return `__IMG_TOKEN_${images.length - 1}__`;
  });

  // 1. Converter porcentagens por extenso: "10 por cento" -> "10%"
  workingText = workingText.replace(/(\d+(?:,\d+)?)\s*por\s*cento/gi, '$1%');

  // 2. Inequações de acessibilidade
  // Ex: "60% menor que Q menor ou igual a 100%" -> "$60\% < Q \le 100\%$"
  workingText = workingText.replace(/(\d+(?:,\d+)?%?)\s+menor\s+que\s+([A-Za-z])\s+menor\s+ou\s+igual\s+a\s+(\d+(?:,\d+)?%?)/gi, (_, a, b, c) => {
    const escA = a.replace(/%/g, '\\%');
    const escC = c.replace(/%/g, '\\%');
    return `$${escA} < ${b} \\le ${escC}$`;
  });
  workingText = workingText.replace(/([A-Za-z])\s+menor\s+ou\s+igual\s+a\s+(\d+(?:,\d+)?%?)/gi, (_, a, b) => {
    const escB = b.replace(/%/g, '\\%');
    return `$${a} \\le ${escB}$`;
  });
  workingText = workingText.replace(/([A-Za-z])\s+maior\s+que\s+(\d+(?:,\d+)?%?)/gi, (_, a, b) => {
    const escB = b.replace(/%/g, '\\%');
    return `$${a} > ${escB}$`;
  });
  workingText = workingText.replace(/(\d+(?:,\d+)?%?)\s+menor\s+que\s+([A-Za-z])/gi, (_, a, b) => {
    const escA = a.replace(/%/g, '\\%');
    return `$${escA} < ${b}$`;
  });

  // 3. Moedas: "100 reais" -> "R$ 100,00", "200 reais" -> "R$ 200,00"
  workingText = workingText.replace(/(\d+)\s+reais/gi, 'R$ $1,00');

  // 4. Milhares com espaço: "3 000" -> "3.000", "90 000" -> "90.000", "1 000" -> "1.000"
  workingText = workingText.replace(/(\d+)\s+(\d{3})(?=\s|,|\.|\)|;|$)/g, '$1.$2');

  // 5. Normalizar quebras de linha e bullets
  const lines = workingText.split('\n');
  const formattedLines = [];

  for (let rawLine of lines) {
    let line = rawLine.trim();
    if (!line) continue;

    // Converte bullets "•" para "- "
    if (line.startsWith('•')) {
      line = '- ' + line.substring(1).trim();
    } else if (line.includes('•')) {
      // Se tiver múltiplos bullets colados na mesma linha
      const subParts = line.split('•');
      if (subParts[0].trim()) {
        formattedLines.push(subParts[0].trim());
      }
      for (let s = 1; s < subParts.length; s++) {
        const item = subParts[s].trim();
        if (item) formattedLines.push('- ' + item);
      }
      continue;
    }

    // Se houver frases de comando separadas na mesma linha
    if (line.includes('. Para classificar')) {
      const parts = line.split('. Para classificar');
      formattedLines.push(parts[0].trim() + '.');
      formattedLines.push('Para classificar ' + parts[1].trim());
      continue;
    }

    formattedLines.push(line);
  }

  // 6. Junta as linhas garantindo que listas fiquem agrupadas e parágrafos respirem
  let result = '';
  for (let i = 0; i < formattedLines.length; i++) {
    const cur = formattedLines[i];
    const prev = formattedLines[i - 1];

    if (i === 0) {
      result += cur;
    } else if (cur.startsWith('- ') && prev && prev.startsWith('- ')) {
      result += '\n' + cur;
    } else {
      result += '\n\n' + cur;
    }
  }

  // 7. Restaura as imagens nos seus devidos lugares
  for (let idx = 0; idx < images.length; idx++) {
    result = result.replace(`__IMG_TOKEN_${idx}__`, '\n\n' + images[idx] + '\n\n');
  }

  // 8. Limpeza final de quebras excessivas
  result = result.replace(/\n{3,}/g, '\n\n').trim();

  return result;
}

async function main() {
  console.log("Iniciando formatação e limpeza visual dos enunciados no banco Neon...");

  const questions = await prisma.question.findMany({
    where: {
      ano_enem: { in: [2022, 2023] }
    }
  });

  console.log(`Carregadas ${questions.length} questões para verificação e formatação.`);

  let updatedCount = 0;

  for (const q of questions) {
    const formatted = formatQuestionEnunciado(q.enunciado);
    if (formatted !== q.enunciado) {
      await prisma.question.update({
        where: { id: q.id },
        data: { enunciado: formatted }
      });
      updatedCount++;
      console.log(`✔ [${q.ano_enem}] ${q.habilidade_enem} formatada com sucesso.`);
    }
  }

  console.log(`\n🎉 Concluído! ${updatedCount} questões foram aprimoradas visualmente no Neon.`);
  await prisma.$disconnect();
}

main().catch(err => {
  console.error("Erro:", err);
  process.exit(1);
});
