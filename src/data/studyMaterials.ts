// ==============================================================================
// BASE CURRICULAR GTMAT CEFET-MG & OBMEP • MATERIAIS DE ESTUDO & VIDEOAULAS
// Baseado na estrutura oficial do GTMAT: https://sites.google.com/site/matematicacefetmg/
// 1ª Série (8 Unidades), 2ª Série (9 Unidades), 3ª Série (7 Unidades) - Total: 24 Unidades
// ==============================================================================

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
  // Mídia Secundária: Revisão Rápida / Complementar
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

export const GTMAT_PORTAL_URL = "https://sites.google.com/site/matematicacefetmg/"
export const OBMEP_PORTAL_URL = "https://portaldaobmep.impa.br/"

export const OBMEP_APOSTILAS: ObmepReference[] = [
  {
    number: "Apostila 1",
    title: "Iniciação à Aritmética",
    authors: "A. Hefez",
    pdfUrl: "https://portaldaobmep.impa.br/index.php/apostilas",
    focus: "Operações elementares, divisibilidade, restos, critérios e notação matemática.",
  },
  {
    number: "Apostila 2",
    title: "Apostila de Combinatória",
    authors: "L. Vertman, P. C. P. Carvalho",
    pdfUrl: "https://portaldaobmep.impa.br/index.php/apostilas",
    focus: "Princípio fundamental da contagem, permutações, combinações e probabilidade clássica.",
  },
  {
    number: "Apostila 3",
    title: "Teorema de Pitágoras e Áreas",
    authors: "E. Wagner",
    pdfUrl: "https://portaldaobmep.impa.br/index.php/apostilas",
    focus: "Geometria plana euclidiana, cálculo de áreas poligonais e relações trigonométricas.",
  },
  {
    number: "Apostila 4",
    title: "Introdução à Geometria Espacial",
    authors: "P. C. P. Carvalho",
    pdfUrl: "https://portaldaobmep.impa.br/index.php/apostilas",
    focus: "Visualização tridimensional, secções planas, prismas, pirâmides e corpos redondos.",
  },
  {
    number: "Apostila 5",
    title: "Geometria Analítica e Vetores",
    authors: "J. P. Carneiro",
    pdfUrl: "https://portaldaobmep.impa.br/index.php/apostilas",
    focus: "Coordenadas cartesianas, equações lineares da reta, circunferências e posições relativas.",
  },
  {
    number: "Apostila 6",
    title: "Cálculo e Álgebra no Ensino Médio",
    authors: "Equipe OBMEP / IMPA",
    pdfUrl: "https://portaldaobmep.impa.br/index.php/apostilas",
    focus: "Funções, sequências, taxas médias e instantâneas de variação, matrizes e sistemas.",
  },
  {
    number: "Apostila 7",
    title: "Introdução à Estatística e Análise de Dados",
    authors: "L. C. de Menezes, Equipe IMPA",
    pdfUrl: "https://portaldaobmep.impa.br/index.php/apostilas",
    focus: "Distribuições de frequência, medidas de posição, dispersão e interpretação de gráficos.",
  },
]

export const STUDY_MODULES: StudyModule[] = [
  // ==============================================================================
  // 1ª SÉRIE DO ENSINO MÉDIO (8 UNIDADES GTMAT CEFET-MG)
  // ==============================================================================
  {
    id: "gtmat-1-conjuntos",
    title: "Unidade 1: Conjuntos",
    year: "1º Ano",
    category: "Teoria dos Conjuntos & Aritmética",
    relatedTopics: [
      "Conjuntos",
      "Aritmética Básica",
      "Matemática Básica",
      "Notação Científica",
      "Lógica Matemática",
    ],
    videoId: "2fWhj7SwsE4",
    videoTitle: "[VAC] I.1.2 Operações com Conjuntos (Parte 1)",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "7E-rh5heeP8",
    secondaryVideoTitle: "Operações com Conjuntos • União, Interseção e Diferença",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "14 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-1-conjuntos",
    gtmatUnitTitle: "1ª Série • Unidade 1: Conjuntos [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-1-conjuntos",
    obmepApostila: OBMEP_APOSTILAS[0],
    teacherGuide:
      "Utilize os arquivos [CONT] e videoaulas [VAC] da Unidade 1 para formalizar a linguagem de conjuntos, pertinência, inclusão e intervalos reais. Complemente com a Apostila 1 da OBMEP para exercícios de notação científica e propriedades aritméticas.",
    summary:
      "Noções iniciais de conjuntos, pertinência e inclusão, operações de união, interseção e diferença, conjuntos numéricos (N, Z, Q, R) e intervalos reais na reta orientada.",
    enemTip:
      "Em questões de Diagramas de Venn com três conjuntos, preencha primeiro a interseção tripla e deduza as duplas subtraindo o valor central antes de somar as regiões exclusivas.",
    formulas: [
      {
        label: "União de Conjuntos",
        formula: "$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$",
        tip: "Subtraia a interseção para não computar duas vezes os elementos compartilhados.",
      },
      {
        label: "Notação Científica",
        formula: "$N = a \\cdot 10^k \\quad (1 \\le a < 10, \ k \\in \\mathbb{Z})$",
        tip: "Mova a vírgula para a esquerda (expoente positivo) ou para a direita (expoente negativo).",
      },
    ],
  },
  {
    id: "gtmat-1-introducao-funcoes",
    title: "Unidade 2: Introdução às Funções",
    year: "1º Ano",
    category: "Relação entre Variáveis & Proporcionalidade",
    relatedTopics: [
      "Razão e Proporção",
      "Grandezas Proporcionais",
      "Regra de Três",
      "Escalas",
      "Álgebra e Proporção",
      "Funções",
    ],
    videoId: "s7ZeGD6Tz1s",
    videoTitle: "[VAC] I.2.1.a Relação entre Variáveis & Dependência",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "evXrGaI6SVc",
    secondaryVideoTitle: "Razão, Proporção e Escalas • Revisão Prática",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "14 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-2-introdução-às-funções",
    gtmatUnitTitle: "1ª Série • Unidade 2: Introdução às funções [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-2-introdução-às-funções",
    obmepApostila: OBMEP_APOSTILAS[5],
    teacherGuide:
      "A Unidade 2 do GTMAT constrói o conceito moderno de função a partir da dependência entre grandezas e taxas de variação. Explore situações reais de física e economia para conectar domínio, contradomínio e imagem.",
    summary:
      "Relação entre variáveis, pares ordenados, produto cartesiano, definição formal de função, domínio, contradomínio, conjunto imagem, estudo de gráficos, raízes, funções injetoras, sobrejetoras e bijetoras.",
    enemTip:
      "Para reconhecer se um gráfico representa uma função de x em y, trace linhas verticais imaginárias: cada linha só pode interceptar a curva em no máximo um ponto.",
    formulas: [
      {
        label: "Escala Cartográfica",
        formula: "$E = \\frac{d}{D} = \\frac{\\text{distância no mapa}}{\\text{distância real}}$",
        tip: "Converta sempre o numerador e o denominador para a mesma unidade de medida (geralmente cm).",
      },
      {
        label: "Proporção Fundamental",
        formula: "$\\frac{a}{b} = \\frac{c}{d} \\iff a \\cdot d = b \\cdot c$",
        tip: "O produto dos extremos é igual ao produto dos meios.",
      },
    ],
  },
  {
    id: "gtmat-1-funcao-afim",
    title: "Unidade 3: Função Afim",
    year: "1º Ano",
    category: "Funções Polinomiais do 1º Grau",
    relatedTopics: [
      "Funções",
      "Inequações",
    ],
    videoId: "i6NWlY1opFs",
    videoTitle: "[VAC] I.3.1 Situações problema e definição da função afim",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "JgGseIonmYI",
    secondaryVideoTitle: "Função do 1º Grau • Gráficos, Raiz e Coeficientes",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "15 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-3-função-afim",
    gtmatUnitTitle: "1ª Série • Unidade 3: Função Afim [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-3-função-afim",
    obmepApostila: OBMEP_APOSTILAS[5],
    teacherGuide:
      "Foque no significado físico-geométrico do coeficiente angular como taxa constante de variação $\\Delta y / \\Delta x$ e do coeficiente linear como valor inicial. Utilize o material [EXE] para resolução de inequações-produto e quociente.",
    summary:
      "Definição da função afim $f(x) = ax + b$, taxa constante de variação, coeficiente angular e linear, gráficos de retas, raízes, estudo de sinais e inequações do 1º grau.",
    enemTip:
      "No ENEM, problemas de tarifas de táxi, planos de telefonia ou produção com custo fixo e custo variável são sempre modelados por funções afins da forma $y = ax + b$.",
    formulas: [
      {
        label: "Lei da Função Afim",
        formula: "$f(x) = ax + b \\quad (a \\ne 0)$",
        tip: "$a$ representa a inclinação (taxa de variação) e $b$ o intercepto com o eixo $y$.",
      },
      {
        label: "Coeficiente Angular",
        formula: "$a = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{\\Delta y}{\\Delta x}$",
        tip: "Se $a > 0$ a função é estritamente crescente; se $a < 0$ é decrescente.",
      },
      {
        label: "Zero da Função",
        formula: "$x_0 = -\\frac{b}{a}$",
        tip: "Ponto em que a reta intercepta o eixo horizontal das abscissas.",
      },
    ],
  },
  {
    id: "gtmat-1-funcao-quadratica",
    title: "Unidade 4: Função Quadrática",
    year: "1º Ano",
    category: "Funções Polinomiais do 2º Grau",
    relatedTopics: [
      "Funções Quadráticas",
    ],
    videoId: "ae9RvMN_-1Y",
    videoTitle: "[VAC] I.4.1 Situação problema e definição da função quadrática",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "W4u2Y0k5Uv0",
    secondaryVideoTitle: "Função do 2º Grau • Vértice da Parábola e Otimização",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "16 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-4-função-quafrática",
    gtmatUnitTitle: "1ª Série • Unidade 4: Função Quafrática [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-4-função-quafrática",
    obmepApostila: OBMEP_APOSTILAS[5],
    teacherGuide:
      "A Unidade 4 é essencial para problemas de otimização (máximos e mínimos de lucro, altura, área). Explore o gráfico da parábola e a simetria do vértice em relação às raízes reais.",
    summary:
      "Definição de $f(x) = ax^2 + bx + c$, concavidade, raízes via fórmula resolutiva de Bhaskara, discriminante $\\Delta$, coordenadas do vértice $(x_v, y_v)$, estudo de sinais e inequações do 2º grau.",
    enemTip:
      "Quando o enunciado perguntar 'qual o valor de $x$ que maximiza...', calcule $x_v = -b/(2a)$. Quando perguntar 'qual é o valor máximo obtido...', calcule $y_v = -\\Delta/(4a)$.",
    formulas: [
      {
        label: "Fórmula de Bhaskara",
        formula: "$x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}, \\quad \\Delta = b^2 - 4ac$",
        tip: "$\\Delta > 0$ (duas raízes distintas); $\\Delta = 0$ (raiz dupla); $\\Delta < 0$ (sem raízes reais).",
      },
      {
        label: "Coordenadas do Vértice",
        formula: "$x_v = -\\frac{b}{2a}, \\quad y_v = -\\frac{\\Delta}{4a}$",
        tip: "O vértice define o ponto de máximo (quando $a < 0$) ou ponto de mínimo (quando $a > 0$).",
      },
    ],
  },
  {
    id: "gtmat-1-funcao-modular",
    title: "Unidade 5: Função Modular",
    year: "1º Ano",
    category: "Módulo & Funções por Várias Sentenças",
    relatedTopics: [
      "Funções",
      "Inequações",
    ],
    videoId: "PdKDZC7mBYc",
    videoTitle: "Equação Modular e Função Modular • Rápido e Fácil",
    channelName: "Dicasdemat • Sandro Curió",
    duration: "13 min",
    secondaryVideoId: "fujHxW-naIU",
    secondaryVideoTitle: "Resumo Completo de Função Modular e Gráficos",
    secondaryChannelName: "Professor Ferretto",
    secondaryDuration: "18 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-5-função-modular",
    gtmatUnitTitle: "1ª Série • Unidade 5: Função Modular [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-5-função-modular",
    obmepApostila: OBMEP_APOSTILAS[5],
    teacherGuide:
      "Apresente o módulo como distância geométrica à origem na reta numérica real ($|x| = d(x, 0)$). Ensine a decompor expressões modulares em intervalos onde o argumento é positivo ou negativo.",
    summary:
      "Definição de valor absoluto (módulo), propriedades operatórias, equações modulares, função modular $f(x) = |x|$, gráficos com reflexão da parte negativa e inequações modulares.",
    enemTip:
      "O gráfico de $y = |f(x)|$ é obtido pegando o gráfico de $f(x)$ e rebatendo para cima (como em um espelho) toda parte que ficava abaixo do eixo $x$.",
    formulas: [
      {
        label: "Definição de Módulo",
        formula: "$|x| = \\begin{cases} x, & \\text{se } x \\ge 0 \\ -x, & \\text{se } x < 0 \\end{cases}$",
        tip: "O módulo de qualquer número real é sempre maior ou igual a zero.",
      },
      {
        label: "Inequação Modular",
        formula: "$|x| \\le k \\iff -k \\le x \\le k \\quad (k > 0)$",
        tip: "Para $|x| \\ge k$, a solução é a união dos extremos: $x \\le -k$ ou $x \\ge k$.",
      },
    ],
  },
  {
    id: "gtmat-1-funcao-exponencial",
    title: "Unidade 6: Função Exponencial",
    year: "1º Ano",
    category: "Crescimento Exponencial & Potenciação",
    relatedTopics: [
      "Funções Exponenciais",
    ],
    videoId: "sPEaFGC3fjk",
    videoTitle: "[VAC] I.6.2 Situações-problema e Definição da Função Exponencial",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "W1_Q0v24nJ8",
    secondaryVideoTitle: "Função Exponencial • Equações e Gráficos",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "14 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-6-função-exponencial",
    gtmatUnitTitle: "1ª Série • Unidade 6: Função Exponencial [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-6-função-exponencial",
    obmepApostila: OBMEP_APOSTILAS[5],
    teacherGuide:
      "Conecte a função exponencial a fenômenos de crescimento populacional, proliferação bacteriana, contaminação viral e decaimento radioativo com meia-vida.",
    summary:
      "Potenciação com expoentes reais, propriedades operatórias, definição de $f(x) = a^x$ com base $a > 0$ e $a \\ne 1$, assíntota horizontal no eixo $x$, equações e inequações exponenciais.",
    enemTip:
      "Em questões de decaimento com meia-vida $T$, a quantidade restante após um tempo $t$ é dada por $N(t) = N_0 \\cdot (1/2)^{t/T}$.",
    formulas: [
      {
        label: "Lei da Função Exponencial",
        formula: "$f(x) = a^x \\quad (a > 0, \ a \\ne 1)$",
        tip: "Se $a > 1$ a curva é estritamente crescente; se $0 < a < 1$ é decrescente.",
      },
      {
        label: "Equação Exponencial",
        formula: "$a^x = a^y \\iff x = y$",
        tip: "Iguale as bases para comparar diretamente os expoentes.",
      },
    ],
  },
  {
    id: "gtmat-1-funcao-logaritmica",
    title: "Unidade 7: Função Logarítmica",
    year: "1º Ano",
    category: "Logaritmos & Aplicações em Escalas",
    relatedTopics: [
      "Logaritmos",
    ],
    videoId: "EtOozMm9318",
    videoTitle: "[VAC] I.7.1 Logaritmo de um número",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "hA9HecU1p9g",
    secondaryVideoTitle: "Logaritmo em 15 Minutos • Propriedades e Macetes",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "15 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-7-função-logarítmica",
    gtmatUnitTitle: "1ª Série • Unidade 7: Função Logarítmica [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-7-função-logarítmica",
    obmepApostila: OBMEP_APOSTILAS[5],
    teacherGuide:
      "Enfatize o logaritmo como a operação inversa da exponenciação e sua importância para linearizar grandezas de ordens astronômicas (Escala Richter, decibéis sonoros e pH químico).",
    summary:
      "Conceito de logaritmo, condição de existência, propriedades do produto, quociente e potência, mudança de base, função logarítmica e equações logarítmicas.",
    enemTip:
      "Geralmente as provas fornecem aproximações como $\\log 2 \\approx 0{,}30$ e $\\log 3 \\approx 0{,}48$. Para calcular $\\log 5$, use a identidade $\\log 5 = \\log(10/2) = 1 - \\log 2 \\approx 0{,}70$.",
    formulas: [
      {
        label: "Definição de Logaritmo",
        formula: "$\\log_b(a) = c \\iff b^c = a \\quad (a > 0, \ b > 0, \ b \\ne 1)$",
        tip: "A base elevada ao resultado resulta no logaritmando.",
      },
      {
        label: "Propriedades Operatórias",
        formula: "$\\log(x \\cdot y) = \\log x + \\log y, \\quad \\log(x^k) = k \\cdot \\log x$",
        tip: "Transforma multiplicações em somas e expoentes em multiplicadores.",
      },
    ],
  },
  {
    id: "gtmat-1-trigonometria",
    title: "Unidade 8: Trigonometria",
    year: "1º Ano",
    category: "Trigonometria no Triângulo & Ciclo",
    relatedTopics: [
      "Trigonometria",
    ],
    videoId: "af4nCKdTQDU",
    videoTitle: "[VAC] I.8.1.a Razões trigonométricas",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "w47F817uOqU",
    secondaryVideoTitle: "Trigonometria no Triângulo Retângulo e Ciclo Trigonométrico",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "17 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-8trigonometria",
    gtmatUnitTitle: "1ª Série • Unidade 8: Trigonometria [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano/unidade-8trigonometria",
    obmepApostila: OBMEP_APOSTILAS[2],
    teacherGuide:
      "A Unidade 8 cobre desde as razões trigonométricas fundamentais no triângulo retângulo até o ciclo trigonométrico, funções periódicas (seno e cosseno) e as Leis dos Senos e Cossenos.",
    summary:
      "Razões seno, cosseno e tangente no triângulo retângulo, ângulos notáveis ($30^\\circ, 45^\\circ, 60^\\circ$), ciclo trigonométrico em radianos, Lei dos Senos, Lei dos Cossenos e funções periódicas.",
    enemTip:
      "Em triângulos não retângulos, aplique a Lei dos Cossenos quando conhecer dois lados e o ângulo formado entre eles; use a Lei dos Senos quando conhecer pares de lado e ângulo oposto.",
    formulas: [
      {
        label: "Relação Fundamental",
        formula: "$\\operatorname{sen}^2 \\theta + \\cos^2 \\theta = 1$",
        tip: "Válida para qualquer arco real no ciclo trigonométrico.",
      },
      {
        label: "Lei dos Cossenos",
        formula: "$a^2 = b^2 + c^2 - 2bc \\cos(\\hat{A})$",
        tip: "Generalização do Teorema de Pitágoras para qualquer triângulo plano.",
      },
      {
        label: "Lei dos Senos",
        formula: "$\\frac{a}{\\operatorname{sen} \\hat{A}} = \\frac{b}{\\operatorname{sen} \\hat{B}} = \\frac{c}{\\operatorname{sen} \\hat{C}} = 2R$",
        tip: "$R$ é o raio da circunferência circunscrita ao triângulo.",
      },
    ],
  },

  // ==============================================================================
  // 2ª SÉRIE DO ENSINO MÉDIO (9 UNIDADES GTMAT CEFET-MG)
  // ==============================================================================
  {
    id: "gtmat-2-geometria-plana",
    title: "Unidade 1: Geometria Plana",
    year: "2º Ano",
    category: "Polígonos, Triângulos & Áreas Planas",
    relatedTopics: [
      "Geometria Plana",
    ],
    videoId: "EzGf1UEnnsY",
    videoTitle: "Geometria Plana • Revisão Completa ENEM",
    channelName: "Dicasdemat • Sandro Curió",
    duration: "25 min",
    secondaryVideoId: "sMgD7XpgVHY",
    secondaryVideoTitle: "Geometria Plana e Teoremas Fundamentais",
    secondaryChannelName: "Portal da Matemática OBMEP",
    secondaryDuration: "18 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-1-geometria-plana",
    gtmatUnitTitle: "2ª Série • Unidade 1: Geometria Plana [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-1-geometria-plana",
    obmepApostila: OBMEP_APOSTILAS[2],
    teacherGuide:
      "Utilize a Apostila 3 da OBMEP (Teorema de Pitágoras e Áreas) para propor desafios práticos de decomposição de figuras compostas e semelhança de triângulos.",
    summary:
      "Ângulos, paralelismo, triângulos, Teorema de Tales e Pitágoras, polígonos regulares, circunferências, círculos e cálculo de áreas de figuras planas.",
    enemTip:
      "Em figuras planas irregulares ou hachuradas no ENEM, calcule a área total da figura geométrica envolvente e subtraia as áreas vazias ou brancas.",
    formulas: [
      {
        label: "Área do Triângulo Equilátero",
        formula: "$A = \\frac{L^2 \\sqrt{3}}{4}, \\quad h = \\frac{L \\sqrt{3}}{2}$",
        tip: "Fórmula rápida e frequentemente cobrada em figuras hexagonais e prismáticas.",
      },
      {
        label: "Área do Círculo e Comprimento",
        formula: "$A = \\pi r^2, \\quad C = 2 \\pi r$",
        tip: "Atenção se a questão pedir raio ou diâmetro ($d = 2r$).",
      },
    ],
  },
  {
    id: "gtmat-2-geometria-espacial",
    title: "Unidade 2: Geometria Espacial",
    year: "2º Ano",
    category: "Poliedros, Sólidos de Revolução & Volumes",
    relatedTopics: [
      "Geometria Espacial",
    ],
    videoId: "rq3cbfcUKdY",
    videoTitle: "[VAC] II.2.1a Cubo e Poliedros",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "Y_gD7S6OkC4",
    secondaryVideoTitle: "Geometria Espacial • Revisão de Sólidos e Volumes",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "18 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-2-geometria-espacial",
    gtmatUnitTitle: "2ª Série • Unidade 2: Geometria espacial [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-2-geometria-espacial",
    obmepApostila: OBMEP_APOSTILAS[3],
    teacherGuide:
      "A Unidade 2 do GTMAT trabalha prismas, cilindros, pirâmides, cones, troncos e esferas. Use os arquivos [CONT] para conectar o cálculo de volume ao Princípio de Cavalieri.",
    summary:
      "Poliedros convexos, Relação de Euler ($V - A + F = 2$), prismas regulares, cubos, paralelepípedos, cilindros retos, pirâmides, cones, troncos, esferas e secções planas.",
    enemTip:
      "Lembre-se da conversão essencial de unidades de capacidade: $1\\text{ m}^3 = 1000\\text{ litros}$ e $1\\text{ dm}^3 = 1\\text{ litro} = 1000\\text{ cm}^3 = 1000\\text{ mL}$.",
    formulas: [
      {
        label: "Volume de Prismas e Cilindros",
        formula: "$V = A_{\\text{base}} \\cdot h$",
        tip: "Para cilindro: $V = \\pi r^2 h$.",
      },
      {
        label: "Volume de Pirâmides e Cones",
        formula: "$V = \\frac{1}{3} \\cdot A_{\\text{base}} \\cdot h$",
        tip: "Para cone circular reto: $V = \\frac{1}{3} \\pi r^2 h$.",
      },
      {
        label: "Volume e Área da Esfera",
        formula: "$V = \\frac{4}{3} \\pi r^3, \\quad A = 4 \\pi r^2$",
        tip: "Secção a uma distância $d$ do centro obedece a $R^2 = r_{\\text{secção}}^2 + d^2$.",
      },
    ],
  },
  {
    id: "gtmat-2-numeros-complexos",
    title: "Unidade 3: Números Complexos",
    year: "2º Ano",
    category: "Plano de Argand-Gauss & Forma Trigonométrica",
    relatedTopics: [
      "Números Complexos",
    ],
    videoId: "YLLflwjyqto",
    videoTitle: "[VAC] II.3.1.a Representação algébrica e geométrica de um número complexo",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "DfcK7jS24rY",
    secondaryVideoTitle: "Números Complexos • Forma Algébrica e Trigonométrica",
    secondaryChannelName: "Professor Ferretto",
    secondaryDuration: "16 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-3-números-complexos",
    gtmatUnitTitle: "2ª Série • Unidade 3: Números Complexos [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-3-números-complexos",
    obmepApostila: OBMEP_APOSTILAS[4],
    teacherGuide:
      "Apresente os números complexos como a expansão necessária para solucionar equações polinomiais sem raízes reais ($i^2 = -1$). Interprete geometricamente no plano de Argand-Gauss.",
    summary:
      "Unidade imaginária $i$, potências de $i$, forma algébrica $z = a + bi$, conjugado $\\bar{z}$, módulo $|z| = \\rho$, argumento no plano de Argand-Gauss, forma trigonométrica e fórmula de De Moivre.",
    enemTip:
      "Para potências de $i^n$, divida o expoente $n$ por 4: o resto determina a potência equivalente ($i^0=1, i^1=i, i^2=-1, i^3=-i$).",
    formulas: [
      {
        label: "Forma Algébrica e Módulo",
        formula: "$z = a + b i, \\quad |z| = \\rho = \\sqrt{a^2 + b^2}, \\quad \\bar{z} = a - b i$",
        tip: "$a$ é a parte real no eixo horizontal; $b$ é a parte imaginária no vertical.",
      },
      {
        label: "Fórmula de De Moivre",
        formula: "$z^n = \\rho^n [\\cos(n\\theta) + i \\operatorname{sen}(n\\theta)]$",
        tip: "A potência de um complexo eleva o módulo a $n$ e multiplica o argumento por $n$.",
      },
    ],
  },
  {
    id: "gtmat-2-progressoes",
    title: "Unidade 4: Progressões (PA e PG)",
    year: "2º Ano",
    category: "Sequências Numéricas, PA & PG",
    relatedTopics: [
      "Progressão Geométrica",
      "Progressão Aritmética",
    ],
    videoId: "pFtR6JSTc5c",
    videoTitle: "[VAC] II.4.4.a PA e função afim",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "oG1b-P-7g9M",
    secondaryVideoTitle: "PA e PG • Resumo Completo e Macetes",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "16 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-4-progressões-aritmética-e-geométrica",
    gtmatUnitTitle: "2ª Série • Unidade 4: Progressões aritmética e geométrica [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-4-progressões-aritmética-e-geométrica",
    obmepApostila: OBMEP_APOSTILAS[5],
    teacherGuide:
      "O GTMAT estabelece uma conexão pedagógica rica: a PA como discreta da Função Afim (taxa constante de adição) e a PG como discreta da Função Exponencial (taxa constante de multiplicação).",
    summary:
      "Sequências numéricas, termo geral da PA, razão $r$, interpolação aritmética, soma dos termos de uma PA finita, termo geral da PG, razão $q$, soma finita e soma de PG infinita convergente.",
    enemTip:
      "Se um problema envolve crescimento com acréscimo de valor fixo, trata-se de uma PA. Se envolve multiplicação periódica (como reprodução ou juros compostos), trata-se de uma PG.",
    formulas: [
      {
        label: "Termo Geral da PA e Soma",
        formula: "$a_n = a_1 + (n - 1)r, \\quad S_n = \\frac{(a_1 + a_n)n}{2}$",
        tip: "A razão da PA é a diferença entre termos consecutivos: $r = a_{n} - a_{n-1}$.",
      },
      {
        label: "Termo Geral da PG e Soma Infinita",
        formula: "$a_n = a_1 \\cdot q^{n-1}, \\quad S_\\infty = \\frac{a_1}{1 - q} \\quad (|q| < 1)$",
        tip: "A soma infinita só converge quando a razão está entre $-1$ e $1$.",
      },
    ],
  },
  {
    id: "gtmat-2-matematica-financeira",
    title: "Unidade 5: Matemática Financeira",
    year: "2º Ano",
    category: "Porcentagem, Juros & Inflação",
    relatedTopics: [
      "Matemática Financeira",
      "Porcentagem",
    ],
    videoId: "1GuJ4rgE87o",
    videoTitle: "[VAC] II.5.1. a parte 1 Porcentagem",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "9Tbz7rkrm98",
    secondaryVideoTitle: "Juros Simples e Compostos em 15 Minutos",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "15 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-5-matemática-financeira",
    gtmatUnitTitle: "2ª Série • Unidade 5: Matemática financeira [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-5-matemática-financeira",
    obmepApostila: OBMEP_APOSTILAS[0],
    teacherGuide:
      "A Unidade 5 do GTMAT enfatiza a aplicação em finanças reais: taxas percentuais, aumentos e descontos sucessivos através de fatores de multiplicação ($1 \\pm i$), amortizações e juros compostos.",
    summary:
      "Porcentagem, fator de aumento e redução ($1+i$ e $1-i$), aumentos e descontos sucessivos, juros simples (linear), juros compostos (exponencial), montante e valor presente.",
    enemTip:
      "Dois aumentos sucessivos de $10\%$ NÃO equivalem a $20\%$, mas sim a $(1{,}10) \\cdot (1{,}10) = 1{,}21$ (ou seja, $21\%$ de aumento real acumulado).",
    formulas: [
      {
        label: "Fator Multiplicativo",
        formula: "$V_{\\text{final}} = V_0 \\cdot (1 \\pm i)$",
        tip: "Aumento de $25\% \\implies \\times 1{,}25$; desconto de $20\% \\implies \\times 0{,}80$.",
      },
      {
        label: "Juros Simples e Compostos",
        formula: "$J = C \\cdot i \\cdot t, \\quad M = C(1 + i)^t$",
        tip: "Em juros simples o crescimento é linear; em juros compostos é exponencial.",
      },
    ],
  },
  {
    id: "gtmat-2-matrizes",
    title: "Unidade 6: Matrizes",
    year: "2º Ano",
    category: "Tabelas, Operações Matriciais & Inversão",
    relatedTopics: [
      "Matrizes",
    ],
    videoId: "0epBXf3IAYk",
    videoTitle: "[VAC] II.6.1Definição de Matriz",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "ktr4wfXi9xg",
    secondaryVideoTitle: "Matrizes • Aprenda Matriz Rápido",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "14 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-6-matrizes",
    gtmatUnitTitle: "2ª Série • Unidade 6: Matrizes [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-6-matrizes",
    obmepApostila: OBMEP_APOSTILAS[5],
    teacherGuide:
      "Apresente matrizes como representações computacionais de dados tabulares e grafos. Exercite o algoritmo de multiplicação de matrizes ('linha por coluna') e a interpretação de propriedades.",
    summary:
      "Conceito e ordem de matrizes ($m \\times n$), matriz quadrada, identidade, nula, transposta, operações de adição e multiplicação por escalar, multiplicação entre matrizes e matriz inversa.",
    enemTip:
      "A multiplicação $A_{m \\times k} \\cdot B_{k \\times n}$ só é possível se o número de colunas da 1ª matriz for igual ao número de linhas da 2ª matriz. A ordem do resultado é $m \\times n$.",
    formulas: [
      {
        label: "Multiplicação de Matrizes",
        formula: "$c_{ij} = \\sum_{k=1}^n a_{ik} \\cdot b_{kj}$",
        tip: "Cada elemento resulta da multiplicação ordenada da linha $i$ de $A$ pela coluna $j$ de $B$.",
      },
      {
        label: "Matriz Inversa",
        formula: "$A \\cdot A^{-1} = A^{-1} \\cdot A = I_n$",
        tip: "Apenas matrizes quadradas com determinante diferente de zero possuem inversa.",
      },
    ],
  },
  {
    id: "gtmat-2-determinantes",
    title: "Unidade 7: Determinantes",
    year: "2º Ano",
    category: "Sarrus, Laplace & Propriedades",
    relatedTopics: [
      "Matrizes",
      "Determinantes",
    ],
    videoId: "sSouClXZVg4",
    videoTitle: "[VAC] II.7.2 Propriedades dos Determinantes",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "pZ89U-V6Bno",
    secondaryVideoTitle: "Determinantes • Regra de Sarrus e Teorema de Laplace",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "15 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-7-determinantes",
    gtmatUnitTitle: "2ª Série • Unidade 7: Determinantes [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-7-determinantes",
    obmepApostila: OBMEP_APOSTILAS[5],
    teacherGuide:
      "Explore as propriedades que simplificam o cálculo de determinantes (filas nulas, filas proporcionais, multiplicação de linha por constante) e o Teorema de Binet $\\det(AB) = \\det(A)\\det(B)$.",
    summary:
      "Determinantes de ordem 1, 2 e 3 (Regra de Sarrus), Teorema de Laplace para ordens superiores, propriedades dos determinantes, Teorema de Binet e invertibilidade.",
    enemTip:
      "Se uma matriz possui uma linha ou coluna inteira de zeros, ou duas linhas proporcionais/iguais, seu determinante é imediatamente igual a zero.",
    formulas: [
      {
        label: "Determinante 2x2",
        formula: "$\\det \\begin{pmatrix} a & b \\ c & d \\end{pmatrix} = ad - bc$",
        tip: "Produto da diagonal principal menos produto da diagonal secundária.",
      },
      {
        label: "Teorema de Binet",
        formula: "$\\det(A \\cdot B) = \\det(A) \\cdot \\det(B), \\quad \\det(A^{-1}) = \\frac{1}{\\det(A)}$",
        tip: "Permite calcular o determinante do produto sem realizar a multiplicação matricial.",
      },
    ],
  },
  {
    id: "gtmat-2-sistemas-lineares",
    title: "Unidade 8: Sistemas Lineares",
    year: "2º Ano",
    category: "Escalonamento, Cramer & Discussão",
    relatedTopics: [
      "Sistemas Lineares",
    ],
    videoId: "EMPMKsvA2JY",
    videoTitle: "[VAC] II.8.1 Conceitos Iniciais e Classificação de Sistemas",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "W9TrQcGxGuA",
    secondaryVideoTitle: "Sistemas Lineares • Método do Escalonamento Prático",
    secondaryChannelName: "Matemática Rio • Prof. Rafael Procopio",
    secondaryDuration: "16 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-8-sistemas-lineares",
    gtmatUnitTitle: "2ª Série • Unidade 8: Sistemas lineares [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-8-sistemas-lineares",
    obmepApostila: OBMEP_APOSTILAS[5],
    teacherGuide:
      "Priorize o método do escalonamento de Gauss frente à Regra de Cramer para sistemas $3 \\times 3$. Conecte a classificação (SPD, SPI, SI) com a posição geométrica relativa dos planos no espaço.",
    summary:
      "Equações lineares, matriz associada ao sistema, classificação (SPD - Determinado, SPI - Indeterminado, SI - Impossível), método do escalonamento gaussiano, Regra de Cramer e sistemas homogêneos.",
    enemTip:
      "Em sistemas $2 \\times 2$, se as equações forem proporcionais tanto nos coeficientes quanto nos termos independentes, o sistema é SPI (infinitas soluções). Se apenas os coeficientes forem proporcionais, o sistema é SI (impossível).",
    formulas: [
      {
        label: "Regra de Cramer",
        formula: "$x_i = \\frac{D_{x_i}}{D} \\quad (D \\ne 0)$",
        tip: "Se $D \\ne 0$, o sistema é SPD; se $D = 0$ e $D_{x_i} = 0$, é SPI; se $D = 0$ e $D_{x_i} \\ne 0$, é SI.",
      },
      {
        label: "Forma Matricial",
        formula: "$A \\cdot X = B \\iff X = A^{-1} \\cdot B$",
        tip: "A solução existe e é única se e somente se a matriz dos coeficientes $A$ for inversível.",
      },
    ],
  },
  {
    id: "gtmat-2-calculo",
    title: "Unidade 9: Noções de Cálculo para o Ensino Médio",
    year: "2º Ano",
    category: "Limites, Derivadas & Taxas Instantâneas",
    relatedTopics: [
      "Cálculo",
      "Limites",
      "Derivadas",
    ],
    videoId: "q58m0gfBMIo",
    videoTitle: "[VAC] II.9.2.c Derivadas de polinômios e algumas regras de derivação",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "s7ZeGD6Tz1s",
    secondaryVideoTitle: "[VAC] II.9.2.a Taxas de variação instantânea e reta tangente",
    secondaryChannelName: "Matemática CEFET-MG",
    secondaryDuration: "Videoaula GTMAT",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-9-noções-de-cálculo-para-o-ensino-médio",
    gtmatUnitTitle: "2ª Série • Unidade 9: Noções de Cálculo para o Ensino Médio [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/1o-ano-1/unidade-9-noções-de-cálculo-para-o-ensino-médio",
    obmepApostila: OBMEP_APOSTILAS[5],
    teacherGuide:
      "A Unidade 9 é o diferencial do CEFET-MG para formar alunos de base técnica de alto nível. Aborde a intuição de limite como aproximação contínua e a derivada como inclinação da reta tangente à curva.",
    summary:
      "Introdução intuitiva a limites, limites laterais, indeterminações $0/0$, definição de derivada como taxa instantânea de variação, regras de derivação para polinômios (Regra do Tombo), pontos críticos e máximos/mínimos.",
    enemTip:
      "A derivada permite encontrar pontos de máximo e mínimo de qualquer curva derivável: basta derivar a função e igualar a zero ($f'(x) = 0$).",
    formulas: [
      {
        label: "Definição de Derivada",
        formula: "$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$",
        tip: "Representa geometricamente o coeficiente angular da reta tangente à curva no ponto $(x, f(x))$.",
      },
      {
        label: "Regra da Potência (Regra do Tombo)",
        formula: "$\\frac{d}{dx}(x^n) = n \\cdot x^{n-1}$",
        tip: "Exemplo: derivada de $x^3$ é $3x^2$; derivada de uma constante $c$ é $0$.",
      },
    ],
  },

  // ==============================================================================
  // 3ª SÉRIE DO ENSINO MÉDIO (7 UNIDADES GTMAT CEFET-MG)
  // ==============================================================================
  {
    id: "gtmat-3-geometria-analitica",
    title: "Unidade 1: Geometria Analítica",
    year: "3º Ano",
    category: "Ponto, Reta, Circunferência & Cônicas",
    relatedTopics: [
      "Geometria Analítica",
    ],
    videoId: "FpbDDwMWWzs",
    videoTitle: "[VAC] III.1.1 Distância Entre Pontos - Parte 1",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "lHqTFWNBtmQ",
    secondaryVideoTitle: "Geometria Analítica • Ponto, Reta e Circunferência",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "18 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-1-geometria-analítica",
    gtmatUnitTitle: "3ª Série • Unidade 1: Geometria Analítica [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-1-geometria-analítica",
    obmepApostila: OBMEP_APOSTILAS[4],
    teacherGuide:
      "A Unidade 1 da 3ª Série estuda a fusão entre Álgebra e Geometria Euclidiana. Utilize a Apostila 5 da OBMEP para aplicações em alinhamento de pontos, equações reduzidas/gerais da reta e circunferência.",
    summary:
      "Plano cartesiano, distância entre dois pontos, ponto médio, alinhamento de três pontos via determinante, coeficiente angular, equação reduzida e geral da reta, retas paralelas e perpendiculares, distância de ponto a reta e equação da circunferência.",
    enemTip:
      "Duas retas perpendiculares possuem coeficientes angulares opostos e inversos: $m_1 \\cdot m_2 = -1$.",
    formulas: [
      {
        label: "Distância entre Dois Pontos",
        formula: "$d(A, B) = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$",
        tip: "Aplicação direta do Teorema de Pitágoras no plano cartesiano.",
      },
      {
        label: "Equação da Circunferência",
        formula: "$(x - a)^2 + (y - b)^2 = R^2$",
        tip: "$(a, b)$ são as coordenadas do centro e $R$ é o comprimento do raio.",
      },
      {
        label: "Distância de Ponto a Reta",
        formula: "$d(P, r) = \\frac{|A x_0 + B y_0 + C|}{\\sqrt{A^2 + B^2}}$",
        tip: "Para a reta na forma geral $Ax + By + C = 0$ e ponto $P(x_0, y_0)$.",
      },
    ],
  },
  {
    id: "gtmat-3-analise-combinatoria",
    title: "Unidade 2: Análise Combinatória",
    year: "3º Ano",
    category: "PFC, Permutações, Arranjos & Combinações",
    relatedTopics: [
      "Análise Combinatória",
    ],
    videoId: "9tpimag0Zx4",
    videoTitle: "[VAC] III.2.1 Estratégias de organização e Contagem",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "_8mZOSXCRp8",
    secondaryVideoTitle: "Análise Combinatória • Permutação, Arranjo e Combinação",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "18 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-2-análise-combinatória",
    gtmatUnitTitle: "3ª Série • Unidade 2: Análise Combinatória [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-2-análise-combinatória",
    obmepApostila: OBMEP_APOSTILAS[1],
    teacherGuide:
      "Priorize o Princípio Fundamental da Contagem (PFC) como pilar central. A Apostila 2 da OBMEP possui os melhores problemas de olimpíada para ensinar quando a ordem dos elementos importa (arranjo) ou não importa (combinação).",
    summary:
      "Princípio Fundamental da Contagem (PFC), fatorial de um número, permutações simples, permutações com repetição e circulares, arranjos simples e combinações simples.",
    enemTip:
      "Faça o teste da inversão de ordem: se trocar a ordem dos elementos selecionados gerar um agrupamento novo (ex: senhas, pódio), use PFC/Arranjo; se gerar o mesmo grupo (ex: comissões, equipes), use Combinação.",
    formulas: [
      {
        label: "Permutação Simples e com Repetição",
        formula: "$P_n = n!, \\quad P_n^{a, b} = \\frac{n!}{a! \\cdot b!}$",
        tip: "Divida pelos fatoriais das repetições para evitar contagens duplicadas de anagramas.",
      },
      {
        label: "Combinação Simples",
        formula: "$C_{n, p} = \\frac{n!}{p!(n - p)!} = \\binom{n}{p}$",
        tip: "A ordem da escolha dos elementos NÃO importa (ex: times, comissões).",
      },
    ],
  },
  {
    id: "gtmat-3-binomio-newton",
    title: "Unidade 3: Binômio de Newton",
    year: "3º Ano",
    category: "Triângulo de Pascal & Termo Geral",
    relatedTopics: [
      "Binômio de Newton",
      "Análise Combinatória",
    ],
    videoId: "w8tofUVHxNU",
    videoTitle: "Binômio de Newton • Termo Geral e Desenvolvimento",
    channelName: "Vestibulândia • Prof. Nerckie",
    duration: "19 min",
    secondaryVideoId: "bL77q23a4bY",
    secondaryVideoTitle: "Triângulo de Pascal e Teorema Binomial",
    secondaryChannelName: "Professor Ferretto",
    secondaryDuration: "16 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-3-binômio-de-newton",
    gtmatUnitTitle: "3ª Série • Unidade 3: Binômio de Newton [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-3-binômio-de-newton",
    obmepApostila: OBMEP_APOSTILAS[1],
    teacherGuide:
      "A Unidade 3 formaliza a conexão entre coeficientes binomiais e Análise Combinatória. Demonstre o Triângulo de Pascal através da Relação de Stifel $\\binom{n-1}{p-1} + \\binom{n-1}{p} = \\binom{n}{p}$.",
    summary:
      "Números binomiais, propriedades, Triângulo de Pascal, Relação de Stifel, desenvolvimento do binômio $(x + a)^n$ e cálculo do termo geral.",
    enemTip:
      "Para encontrar o termo independente de $x$ no desenvolvimento de um binômio, determine a expressão do termo geral $T_{p+1}$ e iguale o expoente de $x$ a zero.",
    formulas: [
      {
        label: "Termo Geral do Binômio de Newton",
        formula: "$T_{p+1} = \\binom{n}{p} x^{n - p} \\cdot a^p$",
        tip: "$T_{p+1}$ representa a posição do termo na expansão de $(x + a)^n$.",
      },
      {
        label: "Soma dos Coeficientes",
        formula: "$S = (1 + a)^n \\quad (\\text{fazendo } x = 1)$",
        tip: "A soma dos termos de uma linha $n$ do Triângulo de Pascal é sempre igual a $2^n$.",
      },
    ],
  },
  {
    id: "gtmat-3-probabilidade",
    title: "Unidade 4: Probabilidade",
    year: "3º Ano",
    category: "Espaço Amostral, Condicional & Regra do E/OU",
    relatedTopics: [
      "Probabilidade",
    ],
    videoId: "uzRK8QLHBf4",
    videoTitle: "[VAC] III.4.1 Introdução à Probabilidade e Espaço Amostral",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "iNCkGogNtKI",
    secondaryVideoTitle: "Probabilidade em 13 Minutos • Aprenda Rápido",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "13 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-4-probabilidade",
    gtmatUnitTitle: "3ª Série • Unidade 4: Probabilidade [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-4-probabilidade",
    obmepApostila: OBMEP_APOSTILAS[1],
    teacherGuide:
      "Destaque a transição do espaço amostral equiprovável para a Probabilidade Condicional e Teorema da Multiplicação (eventos sucessivos sem reposição).",
    summary:
      "Experimento aleatório, espaço amostral, eventos, probabilidade clássica (Laplace), probabilidade da união de eventos, probabilidade condicional $P(A|B)$, eventos independentes e distribuição binomial.",
    enemTip:
      "Em problemas de 'pelo menos um', calcule a probabilidade do evento complementar (nenhum) e subtraia de 1: $P(\\text{ao menos um}) = 1 - P(\\text{nenhum})$.",
    formulas: [
      {
        label: "Probabilidade Clássica",
        formula: "$P(A) = \\frac{n(A)}{n(\\Omega)} = \\frac{\\text{casos favoráveis}}{\\text{casos possíveis}}$",
        tip: "Válida quando todos os resultados do espaço amostral são equiprováveis.",
      },
      {
        label: "Probabilidade Condicional",
        formula: "$P(A|B) = \\frac{P(A \\cap B)}{P(B)}$",
        tip: "A probabilidade de $A$ ocorrer dado que o evento $B$ já ocorreu (o espaço amostral fica reduzido a $B$).",
      },
      {
        label: "União de Eventos",
        formula: "$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$",
        tip: "Se os eventos forem mutuamente exclusivos ($A \\cap B = \\emptyset$), $P(A \\cup B) = P(A) + P(B)$.",
      },
    ],
  },
  {
    id: "gtmat-3-estatistica",
    title: "Unidade 5: Estatística",
    year: "3º Ano",
    category: "Médias, Moda, Mediana, Variância & Gráficos",
    relatedTopics: [
      "Estatística",
      "Leitura de Gráficos",
      "Análise de Dados",
    ],
    videoId: "3rYqylVO1f8",
    videoTitle: "[VAC] III.5.1 Parte 1 - Introdução e Conceitos",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "IgoKxQK5hGQ",
    secondaryVideoTitle: "Estatística: Média, Moda e Mediana • Rápido e Fácil",
    secondaryChannelName: "Dicasdemat • Sandro Curió",
    secondaryDuration: "14 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-5-estatística",
    gtmatUnitTitle: "3ª Série • Unidade 5: Estatística [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-5-estatística",
    obmepApostila: OBMEP_APOSTILAS[6],
    teacherGuide:
      "Trabalhe com a leitura crítica de dados reais, gráficos de setores, histogramas, boxplots e a diferença crucial entre medidas de tendência central e medidas de dispersão (variância e desvio padrão).",
    summary:
      "Tabelas de distribuição de frequência, gráficos de barras, setores e histogramas, medidas de tendência central (média aritmética simples e ponderada, moda e mediana) e medidas de dispersão (amplitude, variância e desvio padrão).",
    enemTip:
      "Para achar a mediana, NUNCA se esqueça de ordenar os dados em rol (crescente). Se a quantidade de dados $n$ for ímpar, pegue o termo central; se for par, faça a média dos dois termos centrais.",
    formulas: [
      {
        label: "Média Ponderada",
        formula: "$\\bar{x} = \\frac{\\sum (x_i \\cdot p_i)}{\\sum p_i}$",
        tip: "Cada valor $x_i$ é multiplicado pelo seu respectivo peso ou frequência $p_i$.",
      },
      {
        label: "Variância e Desvio Padrão",
        formula: "$s^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n}, \\quad s = \\sqrt{s^2}$",
        tip: "O desvio padrão indica o grau de regularidade ou consistência dos dados em torno da média.",
      },
    ],
  },
  {
    id: "gtmat-3-polinomios",
    title: "Unidade 6: Polinômios",
    year: "3º Ano",
    category: "Operações, Divisão, Resto & Briot-Ruffini",
    relatedTopics: [
      "Polinômios",
    ],
    videoId: "AqUjRFWirDg",
    videoTitle: "[VAC] III.6.1 Parte 01 - Introdução e Conceitos",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "O7B6ocYb5NM",
    secondaryVideoTitle: "[VAC] III.6.5 Briot Ruffini",
    secondaryChannelName: "Matemática CEFET-MG",
    secondaryDuration: "Videoaula GTMAT",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-6-polinômios",
    gtmatUnitTitle: "3ª Série • Unidade 6: Polinômios [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-6-polinômios",
    obmepApostila: OBMEP_APOSTILAS[4],
    teacherGuide:
      "Ensine o Teorema do Resto de D'Alembert como atalho para achar o resto da divisão sem armar o algoritmo das chaves, e o dispositivo de Briot-Ruffini para baixar o grau de polinômios.",
    summary:
      "Definição de polinômio, grau, identidade de polinômios, operações de soma, subtração e multiplicação, algoritmo da divisão euclidiana, Teorema do Resto e dispositivo de Briot-Ruffini.",
    enemTip:
      "Para saber se um polinômio $P(x)$ é divisível por $(x - a)$, calcule $P(a)$: se $P(a) = 0$, $a$ é uma raiz e a divisão é exata com resto zero.",
    formulas: [
      {
        label: "Divisão Euclidiana de Polinômios",
        formula: "$P(x) = D(x) \\cdot Q(x) + R(x) \\quad (\\operatorname{grau}(R) < \\operatorname{grau}(D))$",
        tip: "$P(x)$ é o dividendo, $D(x)$ o divisor, $Q(x)$ o quociente e $R(x)$ o resto.",
      },
      {
        label: "Teorema do Resto",
        formula: "$R = P(a) \\quad \\text{na divisão por } (x - a)$",
        tip: "O resto da divisão de $P(x)$ por $(x - a)$ é simplesmente o valor numérico $P(a)$.",
      },
    ],
  },
  {
    id: "gtmat-3-equacoes-polinomiais",
    title: "Unidade 7: Equações Polinomiais",
    year: "3º Ano",
    category: "Teorema Fundamental da Álgebra & Girard",
    relatedTopics: [
      "Equações Polinomiais",
      "Polinômios",
    ],
    videoId: "O7B6ocYb5NM",
    videoTitle: "[VAC] III.6.5 Briot Ruffini e Teorema das Raízes",
    channelName: "Matemática CEFET-MG",
    duration: "Videoaula GTMAT",
    secondaryVideoId: "DfcK7jS24rY",
    secondaryVideoTitle: "Relações de Girard e Raízes de Equações Algébricas",
    secondaryChannelName: "Professor Ferretto",
    secondaryDuration: "17 min",
    playlistUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-7-equações-polinomiais",
    gtmatUnitTitle: "3ª Série • Unidade 7: Equações polinomiais [CONT / VAC / EXE]",
    gtmatUnitUrl: "https://sites.google.com/site/matematicacefetmg/3o-ano/unidade-7-equações-polinomiais",
    obmepApostila: OBMEP_APOSTILAS[4],
    teacherGuide:
      "A Unidade 7 coroa o Ensino Médio de Matemática integrando o Teorema Fundamental da Álgebra (uma equação de grau $n$ possui exatamente $n$ raízes complexas), multiplicidade de raízes e as Relações de Girard.",
    summary:
      "Definição de equações algébricas, Teorema Fundamental da Álgebra, multiplicidade de uma raiz, teorema das raízes complexas conjugadas, pesquisa de raízes racionais e Relações de Girard.",
    enemTip:
      "Se os coeficientes da equação forem reais e um número complexo $a + bi$ for raiz, seu conjugado $a - bi$ obrigatoriamente também será raiz com a mesma multiplicidade.",
    formulas: [
      {
        label: "Relações de Girard para 3º Grau",
        formula: "$r_1 + r_2 + r_3 = -\\frac{b}{a}, \\quad r_1 r_2 + r_1 r_3 + r_2 r_3 = \\frac{c}{a}, \\quad r_1 r_2 r_3 = -\\frac{d}{a}$",
        tip: "Para a equação geral cúbica $ax^3 + bx^2 + cx + d = 0$.",
      },
      {
        label: "Fatoração pelo Teorema das Raízes",
        formula: "$P(x) = a_n(x - r_1)(x - r_2) \\dots (x - r_n)$",
        tip: "Permite reescrever qualquer polinômio conhecendo suas $n$ raízes e o coeficiente líder.",
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
