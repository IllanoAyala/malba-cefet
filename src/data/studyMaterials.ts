export interface FormulaItem {
  label: string
  formula: string
  tip: string
}

export interface ObmepReference {
  number: string
  title: string
  authors: string
  pdfUrl: string
  focus: string
}

export interface StudyModule {
  id: string
  title: string
  year: "1º Ano" | "2º Ano" | "3º Ano"
  category: string
  relatedTopics: string[]
  // Mídia Principal: GTMAT CEFET-MG [VAC]
  videoId: string
  videoTitle: string
  channelName: string
  duration: string
  // Mídia Secundária: Revisão Complementar (vídeos que estavam anteriormente)
  secondaryVideoId: string
  secondaryVideoTitle: string
  secondaryChannelName: string
  secondaryDuration: string
  playlistUrl: string
  // Links e Materiais Oficiais GTMAT CEFET-MG & OBMEP
  gtmatUnitTitle: string
  gtmatUnitUrl: string
  obmepApostila: ObmepReference
  teacherGuide: string
  summary: string
  enemTip: string
  formulas: FormulaItem[]
}

export const GTMAT_PORTAL_URL = "https://www.gtmat.cefetmg.br/material-didatico-para-o-ensino-medio/"
export const OBMEP_PORTAL_URL = "https://www.obmep.org.br/apostilas.htm"

export const OBMEP_APOSTILAS: ObmepReference[] = [
  {
    number: "Apostila 1 • PIC/OBMEP",
    title: "Iniciação à Aritmética",
    authors: "Abramo Hefez",
    pdfUrl: "https://www.obmep.org.br/docs/apostila1.pdf",
    focus: "Divisibilidade, algoritmo da divisão, MDC, MMC, números primos e aritmética fundamental.",
  },
  {
    number: "Apostila 2 • PIC/OBMEP",
    title: "Métodos de Contagem e Probabilidade",
    authors: "Paulo Cezar Pinto Carvalho",
    pdfUrl: "https://www.obmep.org.br/docs/apostila2.pdf",
    focus: "Princípio aditivo e multiplicativo, permutações, combinações e raciocínio probabilístico.",
  },
  {
    number: "Apostila 3 • PIC/OBMEP",
    title: "Teorema de Pitágoras e Áreas",
    authors: "Eduardo Wagner",
    pdfUrl: "https://www.obmep.org.br/docs/apostila3.pdf",
    focus: "Demonstrações geométricas, cálculo de áreas por decomposição e relações métricas nos triângulos.",
  },
  {
    number: "Apostila 4 • PIC/OBMEP",
    title: "Indução Matemática",
    authors: "Abramo Hefez",
    pdfUrl: "https://www.obmep.org.br/docs/apostila4.pdf",
    focus: "Padrões numéricos, recorrências, somas finitas, progressões e princípio da indução.",
  },
  {
    number: "Apostila 5 • PIC/OBMEP",
    title: "Grafos: Uma Introdução",
    authors: "Jayme Luiz Szwarcfiter",
    pdfUrl: "https://www.obmep.org.br/docs/apostila5.pdf",
    focus: "Modelagem de redes, caminhos eulerianos, árvores e problemas lógicos de conexões.",
  },
  {
    number: "Apostila 6 • PIC/OBMEP",
    title: "A Geometria do Globo Terrestre",
    authors: "PC Carvalho & L. Velho",
    pdfUrl: "https://www.obmep.org.br/docs/apostila6.pdf",
    focus: "Geometria esférica, latitude/longitude, fusos horários, projeções e escalas cartográficas.",
  },
  {
    number: "Apostila 7 • PIC/OBMEP",
    title: "Criptografia",
    authors: "SC Coutinho",
    pdfUrl: "https://www.obmep.org.br/docs/apostila7.pdf",
    focus: "Aritmética modular, funções inversas, codificação e aplicações de números primos.",
  },
  {
    number: "Apostila 8 • PIC/OBMEP",
    title: "Uma Introdução às Construções Geométricas",
    authors: "Eduardo Wagner",
    pdfUrl: "https://www.obmep.org.br/docs/apostila8.pdf",
    focus: "Lugares geométricos, régua e compasso, simetrias e propriedades angulares.",
  },
  {
    number: "Volume Especial • OBMEP",
    title: "Encontros de Aritmética",
    authors: "F. Dutenhefner & L. Cadar",
    pdfUrl: "https://www.obmep.org.br/docs/aritmetica.pdf",
    focus: "Problemas olímpicos graduados de aritmética, paridade, restos e sistemas de numeração.",
  },
  {
    number: "Volume Especial • OBMEP",
    title: "Encontros de Geometria – Parte 1",
    authors: "F. Dutenhefner & L. Cadar",
    pdfUrl: "https://www.obmep.org.br/docs/Geometria.pdf",
    focus: "Ângulos, congruência, semelhança de triângulos e problemas clássicos de geometria plana.",
  },
]

export const STUDY_MODULES: StudyModule[] = [
  // ==================== 1º ANO ====================
  {
    id: "aritmetica-matematica-basica",
    title: "Conjuntos, Aritmética & Notação Matemática",
    year: "1º Ano",
    category: "Números, Conjuntos & Operações",
    relatedTopics: [
      "Aritmética Básica",
      "Matemática Básica",
      "Conjuntos",
      "Notação Científica",
      "Lógica Matemática",
    ],
    videoId: "2fWhj7SwsE4",
    videoTitle: "Operações com Conjuntos e Linguagem Matemática [VAC]",
    channelName: "GTMAT CEFET-MG • Videoaula Oficial",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "yX85jWp1gcQ",
    secondaryVideoTitle: "Fundamentos de Matemática Básica & Notação",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "16 min",
    playlistUrl: "https://www.youtube.com/results?search_query=conjuntos+numericos+gtmat+cefet+mg",
    gtmatUnitTitle: "1ª Série • Unidade 1: Conjuntos [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-1-conjuntos",
    obmepApostila: OBMEP_APOSTILAS[0],
    teacherGuide:
      "Utilize o arquivo [CONT] e a videoaula [VAC] da Unidade 1 do GTMAT para formalizar conjuntos e intervalos reais. Para aprofundamento em divisibilidade e propriedades dos inteiros, aplique problemas selecionados da Apostila 1 da OBMEP (Iniciação à Aritmética).",
    summary:
      "Base estrutural da Matemática: linguagem de conjuntos, conjuntos numéricos, intervalos reais, operações com racionais/decimais, potências de base 10 e raciocínio lógico.",
    enemTip:
      "Em problemas de contagem com Diagramas de Venn, comece sempre preenchendo pela interseção central antes de calcular os elementos exclusivos de cada conjunto.",
    formulas: [
      {
        label: "União de Dois Conjuntos",
        formula: "$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$",
        tip: "Subtraia a interseção para não contar duas vezes quem pertence aos dois conjuntos.",
      },
      {
        label: "Notação Científica",
        formula: "$N = a \\cdot 10^n \\quad (1 \\le a < 10)$",
        tip: "Desloque a vírgula para a esquerda (expoente $+$) ou direita (expoente $-$).",
      },
      {
        label: "Propriedade de Potências",
        formula: "$a^m \\cdot a^n = a^{m+n} \\quad \\text{e} \\quad \\frac{a^m}{a^n} = a^{m-n}$",
        tip: "Em somas com potências de 10, iguale os expoentes antes de somar os coeficientes.",
      },
    ],
  },
  {
    id: "razao-proporcao-escalas",
    title: "Razão, Proporção, Grandezas & Escalas",
    year: "1º Ano",
    category: "Grandezas Proporcionais",
    relatedTopics: [
      "Razão e Proporção",
      "Grandezas Proporcionais",
      "Regra de Três",
      "Escalas",
      "Álgebra e Proporção",
    ],
    videoId: "SmAVe4Bw26o",
    videoTitle: "Taxa de Variação e Proporcionalidade entre Grandezas [VAC]",
    channelName: "GTMAT CEFET-MG • Videoaula Oficial",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "evXrGaI6SVc",
    secondaryVideoTitle: "Razão, Proporção e Escalas • Revisão Prática",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "14 min",
    playlistUrl: "https://www.youtube.com/results?search_query=proporcao+e+funcoes+gtmat+cefet+mg",
    gtmatUnitTitle: "1ª Série • Unidade 2 e 3: Relação entre Variáveis & Proporcionalidade",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-2-introdu%C3%A7%C3%A3o-%C3%A0s-fun%C3%A7%C3%B5es",
    obmepApostila: OBMEP_APOSTILAS[8],
    teacherGuide:
      "Conduza os estudantes a analisar a variação conjunta entre grandezas (Unidade 2 do GTMAT) antes de mecanizar a regra de três. Combine com problemas dos 'Encontros de Aritmética' e da 'Geometria do Globo Terrestre' (escalas) da OBMEP.",
    summary:
      "Comparação entre grandezas direta ou inversamente proporcionais, constante de proporcionalidade, escalas lineares/superficiais/volumétricas e modelagem algébrica.",
    enemTip:
      "Antes de montar a proporção, classifique as grandezas: se uma dobra, a outra dobra (direta: razão constante) ou cai pela metade (inversa: produto constante)?",
    formulas: [
      {
        label: "Grandezas Diretamente Proporcionais",
        formula: "$\\frac{y}{x} = k \\implies y = k \\cdot x$",
        tip: "O gráfico de grandezas diretas é uma reta que passa pela origem $(0,0)$.",
      },
      {
        label: "Grandezas Inversamente Proporcionais",
        formula: "$x \\cdot y = k \\implies y = \\frac{k}{x}$",
        tip: "Quando o produto é constante, o gráfico descreve um ramo de hipérbole.",
      },
      {
        label: "Escala Linear, Superficial e Volumétrica",
        formula: "$E = \\frac{d}{D}, \\quad E_{\\text{área}} = E^2, \\quad E_{\\text{vol}} = E^3$",
        tip: "Em áreas, eleve a escala ao quadrado; em volumes (maquetes), eleve ao cubo!",
      },
    ],
  },
  {
    id: "matematica-financeira-porcentagem",
    title: "Porcentagem, Juros & Matemática Financeira",
    year: "1º Ano",
    category: "Matemática Comercial & Financeira",
    relatedTopics: ["Matemática Financeira", "Porcentagem"],
    videoId: "1GuJ4rgE87o",
    videoTitle: "Matemática Comercial e Financeira: Porcentagem e Juros [VAC]",
    channelName: "GTMAT CEFET-MG • Videoaula Oficial",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "9Tbz7rkrm98",
    secondaryVideoTitle: "Juros Simples, Compostos e Porcentagem",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "15 min",
    playlistUrl: "https://www.youtube.com/results?search_query=matematica+financeira+gtmat+cefet+mg",
    gtmatUnitTitle: "Unidade 5 GTMAT: Matemática Comercial e Financeira [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-5-matem%C3%A1tica-financeira",
    obmepApostila: OBMEP_APOSTILAS[0],
    teacherGuide:
      "O módulo de Matemática Financeira do GTMAT divide o estudo em Porcentagem, Reajustes/Descontos, Sistemas de Juros e Pagamentos Parcelados. Recomende o texto [CONT] para leitura prévia e aplique a lista [EXE] com mediação do Malba.",
    summary:
      "Taxas percentuais, fatores multiplicativos de acréscimo e desconto sucessivo, regimes de capitalização simples e composta e tomada de decisão financeira.",
    enemTip:
      "Dois aumentos sucessivos de $10\\%$ não somam $20\\%$! Multiplique os fatores de atualização: $1,10 \\times 1,10 = 1,21$ ($21\\%$).",
    formulas: [
      {
        label: "Fator de Atualização (Aumento/Desconto)",
        formula: "$V_f = V_i \\cdot (1 \\pm i)$",
        tip: "Aumento de $15\\%$ equivale a multiplicar por $1,15$; desconto de $15\\%$ por $0,85$.",
      },
      {
        label: "Capitalização Simples (Linear)",
        formula: "$J = C \\cdot i \\cdot t \\quad \\text{e} \\quad M = C(1 + i \\cdot t)$",
        tip: "Os juros incidem apenas sobre o capital inicial (progride como uma PA).",
      },
      {
        label: "Capitalização Composta (Exponencial)",
        formula: "$M = C \\cdot (1 + i)^t$",
        tip: "Juros sobre juros: o montante cresce segundo uma Progressão Geométrica.",
      },
    ],
  },
  {
    id: "funcoes-afim-quadratica",
    title: "Função Afim (1º Grau), Quadrática (2º Grau) & Inequações",
    year: "1º Ano",
    category: "Álgebra & Funções",
    relatedTopics: ["Funções", "Funções Quadráticas", "Inequações"],
    videoId: "i6NWlY1opFs",
    videoTitle: "Função Afim e Função Quadrática: Definição, Gráficos e Otimização [VAC]",
    channelName: "GTMAT CEFET-MG • Videoaula Oficial",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "JgGseIonmYI",
    secondaryVideoTitle: "Função de 1º e 2º Grau • Gráficos e Máximos/Mínimos",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "14 min",
    playlistUrl: "https://www.youtube.com/results?search_query=funcao+afim+quadratica+gtmat+cefet+mg",
    gtmatUnitTitle: "1ª Série • Unidades 3 e 4: Função Afim e Função Quadrática [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-3-fun%C3%A7%C3%A3o-afim",
    obmepApostila: OBMEP_APOSTILAS[7],
    teacherGuide:
      "Use as Unidades 3 e 4 do GTMAT para trabalhar taxa de variação, estudo de sinais e problemas de otimização (máximos e mínimos da parábola). Excelente para projetos de Modelagem Matemática no 1º Ano.",
    summary:
      "Estudo completo do domínio, imagem, coeficientes angular/linear da reta, concavidade, raízes, vértice da parábola (otimização) e estudo de sinais em inequações.",
    enemTip:
      "Problemas que pedem lucro máximo, área máxima ou custo mínimo em um modelo quadrático são resolvidos pelas coordenadas do Vértice ($x_V$ e $y_V$).",
    formulas: [
      {
        label: "Função Afim e Taxa de Variação",
        formula: "$f(x) = ax + b, \\quad a = \\frac{\\Delta y}{\\Delta x}$",
        tip: "$b$ é o valor inicial ($x=0$) e $a$ determina a inclinação da reta.",
      },
      {
        label: "Função Quadrática (2º Grau)",
        formula: "$f(x) = ax^2 + bx + c, \\quad \\Delta = b^2 - 4ac$",
        tip: "Se $a > 0$, concavidade para cima (ponto de mínimo); se $a < 0$, para baixo (máximo).",
      },
      {
        label: "Coordenadas do Vértice",
        formula: "$x_V = -\\frac{b}{2a} \\quad \\text{e} \\quad y_V = -\\frac{\\Delta}{4a}$",
        tip: "Pela simetria da parábola, $x_V$ é a média aritmética das raízes: $x_V = \\frac{x_1 + x_2}{2}$.",
      },
    ],
  },
  {
    id: "exponencial-logaritmos-pg",
    title: "Função Exponencial, Logarítmica & Sequências (PA/PG)",
    year: "1º Ano",
    category: "Crescimento & Sequências",
    relatedTopics: ["Funções Exponenciais", "Logaritmos", "Progressão Geométrica"],
    videoId: "EtOozMm9318",
    videoTitle: "Função Logarítmica, Propriedades Operatórias e Progressões [VAC]",
    channelName: "GTMAT CEFET-MG • Videoaula Oficial",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "hA9HecU1p9g",
    secondaryVideoTitle: "Logaritmo, Exponencial e PG • Revisão Geral",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "15 min",
    playlistUrl: "https://www.youtube.com/results?search_query=logaritmo+progressao+gtmat+cefet+mg",
    gtmatUnitTitle: "1ª Série • Unidades 6 e 7 (Exponencial/Logaritmo) & Unidade 4 (PA/PG)",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-7-fun%C3%A7%C3%A3o-logar%C3%ADtmica",
    obmepApostila: OBMEP_APOSTILAS[3],
    teacherGuide:
      "Integre a Unidade 7 (Logaritmos) e a Unidade de PA/PG do GTMAT com a Apostila 4 da OBMEP (Indução Matemática) para explorar padrões recursivos, somas finitas e crescimento exponencial.",
    summary:
      "Equações e funções exponenciais, definição e propriedades operatórias dos logaritmos, mudança de base, progressões aritméticas (PA), geométricas (PG) e recorrências.",
    enemTip:
      "Quando a incógnita está no expoente ($a^t = k$), aplicamos logaritmo em ambos os lados usando $\\log(a^t) = t \\cdot \\log a$.",
    formulas: [
      {
        label: "Definição e Propriedades do Logaritmo",
        formula: "$\\log_b a = x \\iff b^x = a, \\quad \\log(A \\cdot B) = \\log A + \\log B$",
        tip: "Condição de existência: logaritmando $a > 0$ e base $0 < b \\ne 1$.",
      },
      {
        label: "Termo Geral da PA e da PG",
        formula: "$a_n = a_1 + (n-1)r \\quad \\text{e} \\quad a_n = a_1 \\cdot q^{n-1}$",
        tip: "Na PA a diferença é constante ($r$); na PG a razão entre termos consecutivos é constante ($q$).",
      },
      {
        label: "Soma dos Termos (PA e PG Finita)",
        formula: "$S_n^{\\text{PA}} = \\frac{(a_1+a_n)n}{2}, \\quad S_n^{\\text{PG}} = \\frac{a_1(q^n - 1)}{q - 1}$",
        tip: "Para PG infinita com $|q| < 1$, a série converge para $S_\\infty = \\frac{a_1}{1 - q}$.",
      },
    ],
  },

  // ==================== 2º ANO ====================
  {
    id: "geometria-plana-trigonometria",
    title: "Geometria Plana & Trigonometria (Triângulos e Ciclo)",
    year: "2º Ano",
    category: "Geometria & Trigonometria",
    relatedTopics: ["Geometria Plana", "Trigonometria"],
    videoId: "af4nCKdTQDU",
    videoTitle: "Trigonometria no Triângulo Retângulo e Circunferência Trigonométrica [VAC]",
    channelName: "GTMAT CEFET-MG • Videoaula Oficial",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "EzGf1UEnnsY",
    secondaryVideoTitle: "Geometria Plana e Trigonometria • Resumo Prático",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "18 min",
    playlistUrl: "https://www.youtube.com/results?search_query=trigonometria+gtmat+cefet+mg",
    gtmatUnitTitle: "Unidade 8 (Trigonometria) & Unidade 1 (Geometria Plana) [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-8trigonometria",
    obmepApostila: OBMEP_APOSTILAS[2],
    teacherGuide:
      "Combine as videoaulas [VAC] de Trigonometria do GTMAT (Lei dos Senos, Lei dos Cossenos e Funções Trigonométricas) com a Apostila 3 da OBMEP ('Teorema de Pitágoras e Áreas', de Eduardo Wagner) e 'Encontros de Geometria'.",
    summary:
      "Semelhança de triângulos, relações métricas, áreas de figuras planas, razões trigonométricas no triângulo retângulo, ciclo trigonométrico, Lei dos Senos, Lei dos Cossenos e funções periódicas.",
    enemTip:
      "Em triângulos quaisquer (não retângulos), use a Lei dos Senos quando conhecer pares de ângulo e lado oposto, ou a Lei dos Cossenos quando conhecer dois lados e o ângulo entre eles.",
    formulas: [
      {
        label: "Teorema de Pitágoras & Razões",
        formula: "$a^2 = b^2 + c^2, \\quad \\text{sen}^2\\theta + \\cos^2\\theta = 1$",
        tip: "No triângulo retângulo: $\\text{sen}\\,\\theta = \\frac{\\text{CO}}{\\text{HIP}}$, $\\cos\\theta = \\frac{\\text{CA}}{\\text{HIP}}$ e $\\text{tg}\\,\\theta = \\frac{\\text{CO}}{\\text{CA}}$.",
      },
      {
        label: "Lei dos Senos e Lei dos Cossenos",
        formula: "$\\frac{a}{\\text{sen}\\,\\hat{A}} = 2R \\quad \\text{e} \\quad a^2 = b^2 + c^2 - 2bc\\cos\\hat{A}$",
        tip: "Valem para qualquer triângulo, permitindo resolver problemas de topografia e navegação.",
      },
      {
        label: "Áreas de Figuras Planas e Círculo",
        formula: "$A_{\\triangle} = \\frac{b \\cdot h}{2}, \\quad A_{\\text{eq}} = \\frac{L^2\\sqrt{3}}{4}, \\quad A_{\\odot} = \\pi r^2$",
        tip: "Se dois lados $b, c$ e o ângulo $\\theta$ entre eles são dados, $A_{\\triangle} = \\frac{1}{2}bc\\,\\text{sen}\\,\\theta$.",
      },
    ],
  },
  {
    id: "matrizes-sistemas-lineares",
    title: "Matrizes, Determinantes & Sistemas Lineares",
    year: "2º Ano",
    category: "Álgebra Linear",
    relatedTopics: ["Matrizes", "Sistemas Lineares"],
    videoId: "0epBXf3IAYk",
    videoTitle: "Matrizes, Determinantes e Resolução de Sistemas Lineares [VAC]",
    channelName: "GTMAT CEFET-MG • Videoaula Oficial",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "ktr4wfXi9xg",
    secondaryVideoTitle: "Matrizes e Sistemas Lineares • Revisão Rápida",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "12 min",
    playlistUrl: "https://www.youtube.com/results?search_query=matrizes+sistemas+lineares+gtmat+cefet+mg",
    gtmatUnitTitle: "2ª Série • Unidades 6, 7 e 8: Matrizes, Determinantes e Sistemas [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-6-matrizes",
    obmepApostila: OBMEP_APOSTILAS[4],
    teacherGuide:
      "As Unidades 6, 7 e 8 do GTMAT oferecem apostilas [CONT] e listas [EXE] completas sobre operações matriciais, escalonamento e discussão de sistemas lineares. Para conectar com redes e matrizes de adjacência, utilize a Apostila 5 da OBMEP (Grafos).",
    summary:
      "Operações com matrizes, matriz inversa, cálculo e propriedades de determinantes, escalonamento de Gauss e discussão de sistemas lineares ($SPD, SPI, SI$).",
    enemTip:
      "Para localizar $a_{ij}$ em uma matriz, lembre-se sempre da convenção: $i$ indica a **Linha** (horizontal) e $j$ indica a **Coluna** (vertical).",
    formulas: [
      {
        label: "Lei de Formação e Produto Matricial",
        formula: "$A = (a_{ij})_{m \\times n}, \\quad c_{ik} = \\sum_{j=1}^{n} a_{ij} \\cdot b_{jk}$",
        tip: "O produto $A_{m \\times n} \\cdot B_{n \\times p}$ só existe quando o nº de colunas de $A$ é igual ao nº de linhas de $B$.",
      },
      {
        label: "Determinante $2 \\times 2$ e $3 \\times 3$",
        formula: "$\\det\\begin{pmatrix}a & b \\\\ c & d\\end{pmatrix} = ad - bc$",
        tip: "Uma matriz quadrada $A$ possui inversa $A^{-1}$ se, e somente se, $\\det(A) \\ne 0$.",
      },
      {
        label: "Classificação de Sistemas Lineares",
        formula: "$\\text{SPD (1 solução)}, \\quad \\text{SPI (infinitas)}, \\quad \\text{SI (nenhuma)}$",
        tip: "O escalonamento transforma o sistema em formato triangular equivalente de fácil resolução.",
      },
    ],
  },
  {
    id: "numeros-complexos-calculo",
    title: "Números Complexos & Noções de Cálculo (Limites e Derivadas)",
    year: "2º Ano",
    category: "Matemática Avançada CEFET-MG",
    relatedTopics: ["Números Complexos", "Cálculo", "Derivadas", "Limites"],
    videoId: "YLLflwjyqto",
    videoTitle: "Conjunto dos Números Complexos, Forma Trigonométrica e Derivadas [VAC]",
    channelName: "GTMAT CEFET-MG • Videoaula Oficial",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "q58m0gfBMIo",
    secondaryVideoTitle: "Noções de Cálculo no Ensino Médio: Limites e Derivadas [VAC GTMAT]",
    secondaryChannelName: "GTMAT CEFET-MG • Unidade 9",
    secondaryDuration: "Videoaula GTMAT",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-9-no%C3%A7%C3%B5es-de-c%C3%A1lculo-para-o-ensino-m%C3%A9dio",
    gtmatUnitTitle: "2ª Série • Unidade 3 (Números Complexos) & Unidade 9 (Noções de Cálculo)",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-9-no%C3%A7%C3%B5es-de-c%C3%A1lculo-para-o-ensino-m%C3%A9dio",
    obmepApostila: OBMEP_APOSTILAS[6],
    teacherGuide:
      "Diferencial da formação técnica e científica do CEFET-MG! A Unidade 3 trabalha a forma algébrica e trigonométrica dos Complexos (Fórmulas de De Moivre) e a Unidade 9 introduz Limites, Derivadas (taxa instantânea e otimização) e Integrais no Ensino Médio.",
    summary:
      "Unidade imaginária $i$, plano de Argand-Gauss, módulo, argumento e forma trigonométrica dos complexos, além de introdução intuitiva a Limites, Derivadas de polinômios e problemas de taxa de variação.",
    enemTip:
      "A derivada $f'(x)$ fornece a inclinação da reta tangente ao gráfico em qualquer ponto. Nos pontos de máximo ou mínimo local de uma função diferenciável, temos $f'(x) = 0$!",
    formulas: [
      {
        label: "Forma Algébrica e Trigonométrica em $\\mathbb{C}$",
        formula: "$z = a + bi = |z|(\\cos\\theta + i\\,\\text{sen}\\,\\theta), \\quad i^2 = -1$",
        tip: "As potências de $i$ repetem-se em ciclos de 4: $i^0=1,\\; i^1=i,\\; i^2=-1,\\; i^3=-i$.",
      },
      {
        label: "Derivada de Função Polinomial",
        formula: "$f(x) = x^n \\implies f'(x) = n \\cdot x^{n-1}$",
        tip: "Na parábola $f(x)=ax^2+bx+c$, fazer $f'(x)=2ax+b=0$ leva diretamente ao vértice $x_V = -\\frac{b}{2a}$!",
      },
      {
        label: "1ª Fórmula de De Moivre",
        formula: "$z^n = |z|^n \\cdot (\\cos(n\\theta) + i\\,\\text{sen}(n\\theta))$",
        tip: "Conecta a Álgebra dos Números Complexos diretamente à Trigonometria.",
      },
    ],
  },
  {
    id: "analise-combinatoria",
    title: "Análise Combinatória & Princípios de Contagem",
    year: "2º Ano",
    category: "Contagem & Matemática Discreta",
    relatedTopics: ["Análise Combinatória"],
    videoId: "9tpimag0Zx4",
    videoTitle: "Análise Combinatória: Estratégias de Organização e Contagem [VAC]",
    channelName: "GTMAT CEFET-MG • Videoaula Oficial",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "_8mZOSXCRp8",
    secondaryVideoTitle: "Permutação, Arranjo e Combinação • Revisão Rápida",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "16 min",
    playlistUrl: "https://www.youtube.com/results?search_query=analise+combinatoria+gtmat+cefet+mg",
    gtmatUnitTitle: "Unidade 2 GTMAT: Análise Combinatória & Binômio de Newton [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-2-an%C3%A1lise-combinat%C3%B3ria",
    obmepApostila: OBMEP_APOSTILAS[1],
    teacherGuide:
      "A Apostila 2 da OBMEP ('Métodos de Contagem e Probabilidade', de Paulo Cezar Pinto Carvalho) e a Unidade de Análise Combinatória do GTMAT priorizam o raciocínio construtivo (Princípio Multiplicativo) antes da aplicação mecânica de fórmulas.",
    summary:
      "Princípios aditivo e multiplicativo, árvores de possibilidades, permutações simples e com repetição, arranjos, combinações simples e números binomiais.",
    enemTip:
      "Evite decorar se é 'Arranjo ou Combinação' sem pensar: construa a decisão etapa por etapa pelo Princípio Multiplicativo e divida pelas repetições caso a ordem não importe!",
    formulas: [
      {
        label: "Princípio Fundamental da Contagem (PFC)",
        formula: "$Total = n_1 \\times n_2 \\times \\dots \\times n_k$",
        tip: "Decisões sucessivas ('E') multiplicam-se; casos disjuntos ('OU') somam-se.",
      },
      {
        label: "Permutação Simples e com Repetição",
        formula: "$P_n = n! \\quad \\text{e} \\quad P_n^{\\alpha,\\beta} = \\frac{n!}{\\alpha!\\,\\beta!}$",
        tip: "Usada na contagem de anagramas e ordenações completas de uma sequência.",
      },
      {
        label: "Combinação Simples (Subconjuntos)",
        formula: "$C_{n,p} = \\binom{n}{p} = \\frac{n!}{p!\\,(n-p)!}$",
        tip: "Escolhas em que a ordem dos elementos selecionados não altera o grupo formado.",
      },
    ],
  },
  {
    id: "probabilidade-enem",
    title: "Probabilidade, Condicional & Eventos Independentes",
    year: "2º Ano",
    category: "Contagem & Probabilidade",
    relatedTopics: ["Probabilidade"],
    videoId: "uzRK8QLHBf4",
    videoTitle: "Probabilidade: Espaço Amostral, Eventos e Probabilidade Condicional [VAC]",
    channelName: "GTMAT CEFET-MG • Videoaula Oficial",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "iNCkGogNtKI",
    secondaryVideoTitle: "Probabilidade Prática • Resolução de Problemas",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "13 min",
    playlistUrl: "https://www.youtube.com/results?search_query=probabilidade+gtmat+cefet+mg",
    gtmatUnitTitle: "Unidade 4 GTMAT: Probabilidade [CONT / VAC / EXE / EXRES]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-4-probabilidade",
    obmepApostila: OBMEP_APOSTILAS[1],
    teacherGuide:
      "Trabalhe a Unidade 4 do GTMAT em conjunto com a segunda metade da Apostila 2 da OBMEP. Explore tabelas de dupla entrada para tornar a probabilidade condicional visual e intuitiva.",
    summary:
      "Espaço amostral equiprovável, probabilidade da união de dois eventos, probabilidade condicional, independência estatística e distribuição binomial.",
    enemTip:
      "Quando o problema pedir a probabilidade de ocorrer 'pelo menos um' evento, calcule $1 - P(\\text{nenhum})$ (probabilidade complementar).",
    formulas: [
      {
        label: "Definição Clássica de Laplace",
        formula: "$P(A) = \\frac{n(A)}{n(\\Omega)}, \\quad 0 \\le P(A) \\le 1$",
        tip: "Razão entre o número de casos favoráveis $n(A)$ e o total de casos possíveis $n(\\Omega)$.",
      },
      {
        label: "Probabilidade Condicional",
        formula: "$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$",
        tip: "A informação de que $B$ ocorreu reduz o espaço amostral ao conjunto $B$.",
      },
      {
        label: "União e Eventos Independentes",
        formula: "$P(A \\cup B) = P(A)+P(B)-P(A \\cap B), \\quad P(A \\cap B)_{\\text{ind}} = P(A)\\cdot P(B)$",
        tip: "Em retiradas sucessivas sem reposição, atualize o denominador a cada etapa.",
      },
    ],
  },

  // ==================== 3º ANO ====================
  {
    id: "geometria-espacial",
    title: "Geometria Espacial (Poliedros, Prismas, Cilindros, Cones & Esferas)",
    year: "3º Ano",
    category: "Geometria & Medidas",
    relatedTopics: ["Geometria Espacial"],
    videoId: "rq3cbfcUKdY",
    videoTitle: "Geometria Espacial: Prismas, Cilindros, Pirâmides, Cones e Esferas [VAC]",
    channelName: "GTMAT CEFET-MG • Videoaula Oficial",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "Y_gD7S6OkC4",
    secondaryVideoTitle: "Geometria Espacial • Revisão de Sólidos e Volumes",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "19 min",
    playlistUrl: "https://www.youtube.com/results?search_query=geometria+espacial+gtmat+cefet+mg",
    gtmatUnitTitle: "Unidade 2 GTMAT: Geometria Espacial [CONT / VAC / EXE / VRES]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-2-geometria-espacial",
    obmepApostila: OBMEP_APOSTILAS[5],
    teacherGuide:
      "A Unidade de Geometria Espacial do GTMAT possui subpáginas detalhadas para Cubo, Paralelepípedo, Prismas, Cilindro, Pirâmide, Cone e Esfera. Conecte com a Apostila 6 da OBMEP ('A Geometria do Globo Terrestre') para trabalhar visão tridimensional e projeções.",
    summary:
      "Relação de Euler nos poliedros, áreas laterais, áreas totais, volumes de prismas, pirâmides, cilindros, cones, troncos e esferas, além de projeções ortogonais.",
    enemTip:
      "Sólidos prismáticos/cilíndricos têm volume $V = A_b \\cdot h$. Sólidos piramidais/cônicos têm volume igual a um terço: $V = \\frac{A_b \\cdot h}{3}$.",
    formulas: [
      {
        label: "Volume de Prisma e Cilindro",
        formula: "$V_{\\text{prisma}} = A_b \\cdot h \\quad \\text{e} \\quad V_{\\text{cilindro}} = \\pi r^2 \\cdot h$",
        tip: "Pelo Princípio de Cavalieri, o volume depende da área da base e da altura.",
      },
      {
        label: "Volume de Pirâmide e Cone",
        formula: "$V_{\\text{pirâmide}} = \\frac{A_b \\cdot h}{3} \\quad \\text{e} \\quad V_{\\text{cone}} = \\frac{\\pi r^2 \\cdot h}{3}$",
        tip: "A geratriz $g$, a altura $h$ e o raio $r$ do cone reto satisfazem $g^2 = h^2 + r^2$.",
      },
      {
        label: "Volume e Superfície da Esfera",
        formula: "$V_{\\text{esfera}} = \\frac{4}{3}\\pi r^3 \\quad \\text{e} \\quad A_{\\text{esfera}} = 4\\pi r^2$",
        tip: "Qualquer seção plana da esfera à distância $d$ do centro é um círculo de raio $r_s = \\sqrt{R^2 - d^2}$.",
      },
    ],
  },
  {
    id: "estatistica-graficos-dados",
    title: "Estatística ( Posição, Dispersão) & Análise de Gráficos",
    year: "3º Ano",
    category: "Estatística & Ciência de Dados",
    relatedTopics: ["Estatística", "Leitura de Gráficos", "Análise de Dados"],
    videoId: "3rYqylVO1f8",
    videoTitle: "Estatística: Tabelas de Frequência, Média, Moda, Mediana e Dispersão [VAC]",
    channelName: "GTMAT CEFET-MG • Videoaula Oficial",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "IgoKxQK5hGQ",
    secondaryVideoTitle: "Estatística: Média, Moda e Mediana • Revisão Prática",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "14 min",
    playlistUrl: "https://www.youtube.com/results?search_query=estatistica+gtmat+cefet+mg",
    gtmatUnitTitle: "3ª Série • Unidade 5: Estatística [CONT / VAC / EXE / EXRES]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-5-estat%C3%ADstica",
    obmepApostila: OBMEP_APOSTILAS[1],
    teacherGuide:
      "Utilize a Unidade 5 do 3º Ano do GTMAT para trabalhar distribuição de frequências, histogramas, medidas de tendência central e medidas de dispersão (variância e desvio padrão) a partir de dados reais.",
    summary:
      "Coleta e organização de dados, séries estatísticas, média aritmética simples e ponderada, mediana, moda, variância, desvio padrão e leitura crítica de gráficos.",
    enemTip:
      "Para encontrar a **Mediana**, coloque obrigatoriamente o rol de dados em ordem crescente (ou decrescente) antes de localizar o termo central!",
    formulas: [
      {
        label: "Média Aritmética Simples e Ponderada",
        formula: "$\\bar{x} = \\frac{\\sum_{i=1}^{n} x_i}{n} \\quad \\text{e} \\quad \\bar{x}_p = \\frac{\\sum x_i \\cdot f_i}{\\sum f_i}$",
        tip: "Em tabelas de frequências ou notas com pesos distintos, utilize a média ponderada.",
      },
      {
        label: "Mediana (Posição Central do Rol)",
        formula: "$\\text{Ímpar: } x_{\\frac{n+1}{2}} \\quad | \\quad \\text{Par: } \\frac{x_{n/2} + x_{n/2 + 1}}{2}$",
        tip: "A mediana não é afetada por valores extremos discrepantes (outliers).",
      },
      {
        label: "Variância e Desvio Padrão",
        formula: "$\\sigma^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n} \\quad \\text{e} \\quad \\sigma = \\sqrt{\\sigma^2}$",
        tip: "Quanto menor o desvio padrão $\\sigma$, mais homogêneo e regular é o conjunto de dados.",
      },
    ],
  },
  {
    id: "geometria-analitica",
    title: "Geometria Analítica (Ponto, Reta, Circunferência & Cônicas)",
    year: "3º Ano",
    category: "Geometria & Álgebra",
    relatedTopics: ["Geometria Analítica"],
    videoId: "FpbDDwMWWzs",
    videoTitle: "Geometria Analítica: Distância entre Pontos, Reta e Circunferência [VAC]",
    channelName: "GTMAT CEFET-MG • Videoaula Oficial",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "lHqTFWNBtmQ",
    secondaryVideoTitle: "Geometria Analítica • Ponto, Reta e Circunferência",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "15 min",
    playlistUrl: "https://www.youtube.com/results?search_query=geometria+analitica+gtmat+cefet+mg",
    gtmatUnitTitle: "3ª Série • Unidade 1: Geometria Analítica [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-1-geometria-anal%C3%ADtica",
    obmepApostila: OBMEP_APOSTILAS[2],
    teacherGuide:
      "A Unidade 1 do 3º Ano do GTMAT aborda coordenadas no plano, estudo analítico da reta (paralelismo, perpendicularidade, distância ponto-reta), circunferência e cônicas. Combine com construções geométricas da Apostila 8 da OBMEP.",
    summary:
      "Sistema cartesiano ortogonal, distância entre dois pontos, ponto médio, condição de alinhamento, equações da reta, posições relativas, circunferência e seções cônicas.",
    enemTip:
      "Duas retas não verticais são paralelas quando têm o mesmo coeficiente angular ($m_1 = m_2$) e perpendiculares quando $m_1 \\cdot m_2 = -1$.",
    formulas: [
      {
        label: "Distância entre Dois Pontos e Ponto Médio",
        formula: "$d_{AB} = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}, \\quad M = \\left(\\frac{x_A+x_B}{2},\\frac{y_A+y_B}{2}\\right)$",
        tip: "Aplicação direta do Teorema de Pitágoras sobre os incrementos $\\Delta x$ e $\\Delta y$.",
      },
      {
        label: "Equação Reduzida e Geral da Reta",
        formula: "$y - y_0 = m(x - x_0) \\implies ax + by + c = 0$",
        tip: "O coeficiente angular é $m = \\text{tg}\\,\\theta = \\frac{y_B - y_A}{x_B - x_A}$.",
      },
      {
        label: "Equação Reduzida da Circunferência",
        formula: "$(x - x_C)^2 + (y - y_C)^2 = R^2$",
        tip: "Complete quadrados na equação geral $x^2+y^2+Ax+By+F=0$ para achar o centro e o raio.",
      },
    ],
  },
  {
    id: "polinomios-equacoes-algebricas",
    title: "Polinômios & Equações Polinomiais (Briot-Ruffini e Girard)",
    year: "3º Ano",
    category: "Álgebra Superior do Ensino Médio",
    relatedTopics: ["Polinômios", "Equações Polinomiais", "Álgebra"],
    videoId: "AqUjRFWirDg",
    videoTitle: "Polinômios: Conceitos, Divisão, Teorema do Resto e Briot-Ruffini [VAC]",
    channelName: "GTMAT CEFET-MG • Videoaula Oficial",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "O7B6ocYb5NM",
    secondaryVideoTitle: "Dispositivo Prático de Briot-Ruffini e Teorema do Resto [VAC GTMAT]",
    secondaryChannelName: "GTMAT CEFET-MG • Unidade 6",
    secondaryDuration: "Videoaula GTMAT",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-6-polin%C3%B4mios",
    gtmatUnitTitle: "3ª Série • Unidades 6 e 7: Polinômios e Equações Polinomiais [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-6-polin%C3%B4mios",
    obmepApostila: OBMEP_APOSTILAS[3],
    teacherGuide:
      "Conteúdo clássico do 3º Ano no CEFET-MG (Unidades 6 e 7 do GTMAT). Trabalhe a analogia entre divisão de inteiros e divisão de polinômios, usando o Teorema do Resto, o dispositivo de Briot-Ruffini e as Relações de Girard.",
    summary:
      "Valor numérico e raiz de um polinômio, identidade polinomial, divisão euclidiana, Teorema do Resto, dispositivo de Briot-Ruffini, Teorema Fundamental da Álgebra e Relações de Girard.",
    enemTip:
      "Pelo Teorema de D'Alembert, um polinômio $P(x)$ é divisível por $(x - a)$ se, e somente se, $a$ for raiz de $P(x)$, isto é, $P(a) = 0$.",
    formulas: [
      {
        label: "Divisão Euclidiana e Teorema do Resto",
        formula: "$P(x) = D(x) \\cdot Q(x) + R(x), \\quad R = P(a) \\text{ para } D(x)=x-a$",
        tip: "O grau do resto $R(x)$ é sempre estritamente menor que o grau do divisor $D(x)$.",
      },
      {
        label: "Fatoração pelas Raízes",
        formula: "$P(x) = a_n(x - r_1)(x - r_2)\\dots(x - r_n)$",
        tip: "Conhecendo uma raiz $r_1$, aplique Briot-Ruffini para reduzir o grau do polinômio.",
      },
      {
        label: "Relações de Girard (Grau 3)",
        formula: "$r_1+r_2+r_3 = -\\frac{b}{a}, \\quad r_1 r_2 r_3 = -\\frac{d}{a}$",
        tip: "Relacionam diretamente a soma e o produto das raízes aos coeficientes do polinômio.",
      },
    ],
  },
]

export function getModuleForTopic(topicoBncc?: string): StudyModule {
  if (!topicoBncc) return STUDY_MODULES[0]
  const exact = STUDY_MODULES.find((m) =>
    m.relatedTopics.some((t) => t.toLowerCase() === topicoBncc.toLowerCase())
  )
  if (exact) return exact

  const partial = STUDY_MODULES.find(
    (m) =>
      m.title.toLowerCase().includes(topicoBncc.toLowerCase()) ||
      m.relatedTopics.some((t) => topicoBncc.toLowerCase().includes(t.toLowerCase()))
  )
  return partial || STUDY_MODULES[0]
}
