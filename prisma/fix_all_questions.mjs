import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const fixes = {
  // =========================================================================
  // ENEM 2025
  // =========================================================================

  // 2025 Q159 (User screenshot! Tangent function & cup on table)
  '3253db3c-ca2a-4d65-bbe7-c8ff6a550a48': {
    enunciado: `Um recipiente tem um formato que faz com que, ao ser enchido de água com uma vazão constante, a distância $D$ da lâmina de água ao tampo da mesa, em centímetro, aumente em relação ao tempo $T$, em minuto, de acordo com uma função do tipo

$$D = k + \\text{tg}[p(T + m)],$$

sendo os parâmetros $k$, $p$ e $m$ números reais, para $T$ variando entre 0 e 4 minutos, conforme ilustrado na figura, na qual estão apresentadas assíntotas verticais da função tangente utilizada na definição de $D$.

![Imagem da Questão](/images/2025/question-159.png)

A expressão algébrica que representa a relação entre $D$ e $T$ é`,
    alternativas: [
      { letra: 'A', texto: '$D = 2{,}5 + \\text{tg}\\left[30\\left(T - \\frac{5 - 2\\pi}{2}\\right)\\right]$' },
      { letra: 'B', texto: '$D = 4 + \\text{tg}\\left[30\\left(T + \\frac{5}{2}\\right)\\right]$' },
      { letra: 'C', texto: '$D = 4 + \\text{tg}\\left[2{,}5\\left(T + \\frac{5 + 2\\pi}{2}\\right)\\right]$' },
      { letra: 'D', texto: '$D = 30 + \\text{tg}\\left[\\frac{1}{2}(T - 5)\\right]$' },
      { letra: 'E', texto: '$D = 30 + \\text{tg}\\left[\\frac{1}{2}\\left(T - \\frac{5}{2}\\right)\\right]$' },
    ],
  },

  // 2025 Q144 (3D Cube orthogonal projections)
  'b84698ec-7106-4427-b925-baf7a51c9879': {
    enunciado: `Em um jogo de computador, um cubo se encontra inicialmente posicionado conforme indicado na figura.

![Imagem da Questão](/images/2025/question-144.png)

Cada deslocamento efetuado por esse cubo se dá sempre em uma das direções definidas pelos três eixos coordenados. Ao se movimentar a partir da posição inicial, esse cubo se aproximou 3 unidades do plano $yz$, se afastou 5 unidades do plano $xz$ e se aproximou 4 unidades do plano $xy$.

A figura que apresenta as projeções ortogonais desse cubo sobre os três planos coordenados, após efetuar as movimentações descritas, é`,
    alternativas: [
      { letra: 'A', texto: '![Alternativa A](/images/2025/question-144_1.png)' },
      { letra: 'B', texto: '![Alternativa B](/images/2025/question-144_2.png)' },
      { letra: 'C', texto: '![Alternativa C](/images/2025/question-144_3.png)' },
      { letra: 'D', texto: '![Alternativa D](/images/2025/question-144_4.png)' },
      { letra: 'E', texto: '![Alternativa E](/images/2025/question-144_5.png)' },
    ],
  },

  // 2025 Q167 (Soy productivity line graphs)
  '391a016d-49f2-44b7-ab33-bfcdfb4aa6a1': {
    enunciado: `A produtividade de soja em uma área cultivada é a média da quantidade de sacas de 50 quilogramas que são produzidas por hectare. O quadro apresenta a área cultivada e a produtividade de soja em certa propriedade, ao longo de cinco safras, com períodos de um ano, de 2011 a 2016.

| **Safra** | **11-12** | **12-13** | **13-14** | **14-15** | **15-16** |
|-----------|-----------|-----------|-----------|-----------|-----------|
| **Área cultivada (hectare)** | 200 | 220 | 250 | 250 | 200 |
| **Produtividade (sacas de 50 kg por hectare)** | 40 | 30 | 45 | 45 | 50 |

O gráfico de linhas que representa a produção de soja dessa propriedade, em tonelada, nessas cinco safras é`,
    alternativas: [
      { letra: 'A', texto: '![Alternativa A](/images/2025/question-167.png)' },
      { letra: 'B', texto: '![Alternativa B](/images/2025/question-167_1.png)' },
      { letra: 'C', texto: '![Alternativa C](/images/2025/question-167_2.png)' },
      { letra: 'D', texto: '![Alternativa D](/images/2025/question-167_3.png)' },
      { letra: 'E', texto: '![Alternativa E](/images/2025/question-167_4.png)' },
    ],
  },

  // 2025 Q142 (Meditation respiratory rate)
  'e9b3e1a8-ea7b-4ad7-9336-fd1d89fd8117': {
    alternativas: [
      { letra: 'A', texto: 'mantém-se constante.' },
      { letra: 'B', texto: 'é diretamente proporcional ao tempo.' },
      { letra: 'C', texto: 'é inversamente proporcional ao tempo.' },
      { letra: 'D', texto: 'diminui até o instante $t_2$, a partir do qual se torna constante.' },
      { letra: 'E', texto: 'diminui de forma proporcional ao tempo, tanto entre $t_1$ e $t_2$ quanto após $t_2$.' },
    ],
  },

  // 2025 Q145 (Social networks probability)
  'b70ab2b0-a53b-4392-8968-9402fbc947e7': {
    alternativas: [
      { letra: 'A', texto: '$\\frac{30}{90}$' },
      { letra: 'B', texto: '$\\frac{36}{100}$' },
      { letra: 'C', texto: '$\\frac{40}{100}$' },
      { letra: 'D', texto: '$\\frac{40}{90}$' },
      { letra: 'E', texto: '$\\frac{46}{90}$' },
    ],
  },

  // 2025 Q147 (Hero and two villains trajectory)
  '9c5d546d-f569-4559-8e39-49f61b724473': {
    alternativas: [
      { letra: 'A', texto: '$y = -3x + 20$' },
      { letra: 'B', texto: '$y = -3x + 16$' },
      { letra: 'C', texto: '$y = -3x - 20$' },
      { letra: 'D', texto: '$y = 3x + 16$' },
      { letra: 'E', texto: '$y = 3x - 16$' },
    ],
  },

  // 2025 Q148 (Bookstore stock and demand)
  '2c3b0c99-fce9-4ce8-90be-2ec0419d1120': {
    alternativas: [
      { letra: 'A', texto: 'ficção, pois é o que apresenta maior demanda.' },
      { letra: 'B', texto: 'biografia, pois é o gênero que tem a menor demanda.' },
      { letra: 'C', texto: 'autoajuda, pois a quantidade em estoque é inferior à demanda.' },
      { letra: 'D', texto: 'biografia, pois é o gênero que tem a menor quantidade de livros em estoque.' },
      { letra: 'E', texto: 'romance, pois é o que apresenta o menor estoque de livros de autores brasileiros.' },
    ],
  },

  // 2025 Q154 (Four candidates cellphones in envelopes)
  '3b267ae9-4379-4b9d-8436-31dc38298a6d': {
    alternativas: [
      { letra: 'A', texto: '$\\frac{1}{2}$' },
      { letra: 'B', texto: '$\\frac{1}{10}$' },
      { letra: 'C', texto: '$\\frac{1}{16}$' },
      { letra: 'D', texto: '$\\frac{1}{24}$' },
      { letra: 'E', texto: '$\\frac{1}{256}$' },
    ],
  },

  // 2025 Q162 (Ten couples dance group board)
  '60fbd2c6-493e-4255-9bda-b5f15b2b6842': {
    alternativas: [
      { letra: 'A', texto: '$10 \\times 9 \\times 8$' },
      { letra: 'B', texto: '$20 \\times 18 \\times 16$' },
      { letra: 'C', texto: '$20 \\times 19 \\times 18$' },
      { letra: 'D', texto: '$10 \\times 9 \\times 8 \\times 2$' },
      { letra: 'E', texto: '$20 \\times 18 \\times 16 \\times 2$' },
    ],
  },

  // 2025 Q164 (Salivary cortisol T and F)
  '363508ed-caef-434b-acf8-cebed5f54ffa': {
    alternativas: [
      { letra: 'A', texto: '$T = 1{,}59 + F$' },
      { letra: 'B', texto: '$F = 1{,}59 + T$' },
      { letra: 'C', texto: '$\\frac{T}{F} = 1{,}59$' },
      { letra: 'D', texto: '$\\frac{F}{T} = 1{,}59$' },
      { letra: 'E', texto: '$F \\cdot T = 1{,}59$' },
    ],
  },

  // 2025 Q169 (Three cubic dice Artur and João)
  '35390e72-b343-4aa3-b4b9-8775b06bebeb': {
    alternativas: [
      { letra: 'A', texto: 'Artur, com probabilidade de $\\frac{2}{3}$' },
      { letra: 'B', texto: 'João, com probabilidade de $\\frac{4}{9}$' },
      { letra: 'C', texto: 'Artur, com probabilidade de $\\frac{91}{216}$' },
      { letra: 'D', texto: 'João, com probabilidade de $\\frac{91}{216}$' },
      { letra: 'E', texto: 'Artur, com probabilidade de $\\frac{125}{216}$' },
    ],
  },

  // 2025 Q170 (Luminance unit cd/m^2)
  'ee7ae1a5-7b0c-42ec-9240-57fec6fb5fc8': {
    alternativas: [
      { letra: 'A', texto: '$\\frac{\\text{cd}}{\\text{m}^2}$' },
      { letra: 'B', texto: '$\\frac{\\text{m}^2}{\\text{cd}}$' },
      { letra: 'C', texto: '$\\frac{\\text{cd}}{\\text{m}}$' },
      { letra: 'D', texto: '$\\frac{\\text{m}}{\\text{cd}}$' },
      { letra: 'E', texto: '$\\frac{\\text{m}}{\\text{cd}^2}$' },
    ],
  },

  // 2025 Q171 (Four friends 100 coins game)
  'e63554b7-20a3-4397-8130-d79cfbd3fdbd': {
    alternativas: [
      { letra: 'A', texto: '$103 + 4n$' },
      { letra: 'B', texto: '$103 + 3n$' },
      { letra: 'C', texto: '$100 + 4n$' },
      { letra: 'D', texto: '$100 + 3n$' },
      { letra: 'E', texto: '$99 + 4n$' },
    ],
  },

  // 2025 Q176 (Machine internal pressure P = 4 log[-K(t+1)(t-19)])
  '8864eb17-0d5e-4f66-acb4-3f4e218cc702': {
    alternativas: [
      { letra: 'A', texto: '$10^{0,5}$' },
      { letra: 'B', texto: '$10^8$' },
      { letra: 'C', texto: '$\\frac{10^{2,5}}{84}$' },
      { letra: 'D', texto: '$\\frac{10^{2,5}}{99}$' },
      { letra: 'E', texto: '$25 \\times 10^{-2}$' },
    ],
  },

  // 2025 Q177 (Tunnel projects 1 and 2)
  '28bdeb34-3add-4b9b-b3be-669e8eb8cc4b': {
    alternativas: [
      { letra: 'A', texto: 'o 1, pois apresenta área de seção transversal medindo $67{,}5\\text{ m}^2$.' },
      { letra: 'B', texto: 'o 2, pois apresenta área de seção transversal medindo $121{,}5\\text{ m}^2$.' },
      { letra: 'C', texto: 'o 1, pois apresenta área de seção transversal medindo $135\\text{ m}^2$.' },
      { letra: 'D', texto: 'o 2, pois apresenta área de seção transversal medindo $243\\text{ m}^2$.' },
      { letra: 'E', texto: 'qualquer um dos dois, pois apresentam áreas de suas seções transversais com medidas iguais.' },
    ],
  },

  // =========================================================================
  // ENEM 2024
  // =========================================================================

  // 2024 Q146 (Shock absorber oscillations)
  'fda0f64d-9762-4279-99eb-65b8c79dc2d1': {
    enunciado: `Projetistas de uma fábrica de amortecedores realizaram uma série de experimentos que produziram oscilações semelhantes ao comportamento do gráfico de uma senoide, para qualquer tipo de estrada. Cada experimento teve duração de 20 minutos, sendo os 9 primeiros minutos em superfície que simula uma rodovia asfaltada, e os 11 minutos restantes em superfície que simula uma estrada de chão.

Para os amortecedores serem aprovados no experimento, exige-se que as amplitudes das ondas oscilatórias, em cada tipo de superfície, sejam constantes e, ainda, que a amplitude da oscilação do amortecedor no asfalto seja menor do que sua amplitude da oscilação na estrada de chão.

O tipo de gráfico que descreve o comportamento oscilatório de um amortecedor aprovado nesse experimento é`,
    alternativas: [
      { letra: 'A', texto: '![Alternativa A](/images/2024/question-146_5.png)' },
      { letra: 'B', texto: '![Alternativa B](/images/2024/question-146_6.png)' },
      { letra: 'C', texto: '![Alternativa C](/images/2024/question-146_7.png)' },
      { letra: 'D', texto: '![Alternativa D](/images/2024/question-146_8.png)' },
      { letra: 'E', texto: '![Alternativa E](/images/2024/question-146_9.png)' },
    ],
  },

  // 2024 Q147 (Gardener k linear meters of fence)
  '518dbf09-5dc5-4aff-bd71-514ae18cf9d4': {
    alternativas: [
      { letra: 'A', texto: 'hexágono regular, pois a área do jardim, em metro quadrado, será $\\frac{k^2\\sqrt{3}}{24}$.' },
      { letra: 'B', texto: 'hexágono regular, pois a área do jardim, em metro quadrado, será $\\frac{3k^2\\sqrt{3}}{2}$.' },
      { letra: 'C', texto: 'quadrado, pois a área do jardim, em metro quadrado, será $\\frac{k^2}{16}$.' },
      { letra: 'D', texto: 'triângulo equilátero, pois a área do jardim, em metro quadrado, será $\\frac{k^2\\sqrt{3}}{36}$.' },
      { letra: 'E', texto: 'triângulo equilátero, pois a área do jardim, em metro quadrado, será $\\frac{k^2\\sqrt{3}}{4}$.' },
    ],
  },

  // 2024 Q148 (Airport shuttle 5 cameras)
  '1319bd37-f7fd-4a17-8852-228814b51627': {
    enunciado: `Um aeroporto disponibiliza o serviço de transporte gratuito entre seus dois terminais utilizando os ônibus A e B, que partem simultaneamente, de hora em hora, de terminais diferentes. A distância entre os terminais é de 9 000 metros, e o percurso total dos ônibus, de um terminal ao outro, é monitorado por um sistema de cinco câmeras que cobrem diferentes partes do trecho, conforme o esquema.

![Imagem da questão 148](/images/2024/question-148_1.png)

O alcance de cada uma das cinco câmeras é:

- câmera I: $\\frac{1}{5}$ do percurso;
- câmera II: $\\frac{3}{10}$ do percurso;
- câmera III: $\\frac{1}{10}$ do percurso;
- câmera IV: $\\frac{1}{10}$ do percurso;
- câmera V: $\\frac{3}{10}$ do percurso.

Em determinado horário, o ônibus A parte do terminal 1 e realiza o percurso total com velocidade constante de $250\\text{ m/min}$; enquanto o ônibus B, que parte do terminal 2, realiza o percurso total com velocidade constante de $150\\text{ m/min}$.

Qual câmera registra o momento em que os ônibus A e B se encontram?`,
  },

  // 2024 Q149 (Caesar cipher)
  'd8d67326-111b-49c5-a135-9498576d7070': {
    enunciado: `A criptografia refere-se à construção e análise de protocolos que impedem terceiros de lerem mensagens privadas. Júlio César, imperador romano, utilizava um código para proteger as mensagens enviadas a seus generais. Assim, se a mensagem caísse em mãos inimigas, a informação não poderia ser compreendida. Nesse código, cada letra do alfabeto era substituída pela letra três posições à frente, ou seja, o “A” era substituído pelo “D”, o “B” pelo “E”, o “C” pelo “F”, e assim sucessivamente.

![Cifra de César](/images/2024/question-149.png)

Qualquer código que tenha um padrão de substituição de letras como o descrito é considerado uma Cifra de César ou um Código de César. Note que, para decifrar uma Cifra de César, basta descobrir por qual letra o “A” foi substituído, pois isso define todas as demais substituições a serem feitas.

Uma mensagem, em um alfabeto de 26 letras, foi codificada usando uma Cifra de César. Considere a probabilidade de se descobrir, aleatoriamente, o padrão utilizado nessa codificação, e que uma tentativa frustrada deverá ser eliminada nas tentativas seguintes.

A probabilidade de se descobrir o padrão dessa Cifra de César apenas na terceira tentativa é dada por`,
    alternativas: [
      { letra: 'A', texto: '$\\frac{1}{25} + \\frac{1}{25} + \\frac{1}{25}$' },
      { letra: 'B', texto: '$\\frac{24}{25} + \\frac{23}{24} + \\frac{1}{23}$' },
      { letra: 'C', texto: '$\\frac{1}{25} \\times \\frac{1}{24} \\times \\frac{1}{23}$' },
      { letra: 'D', texto: '$\\frac{24}{25} \\times \\frac{23}{25} \\times \\frac{1}{25}$' },
      { letra: 'E', texto: '$\\frac{24}{25} \\times \\frac{23}{24} \\times \\frac{1}{23}$' },
    ],
  },

  // 2024 Q151 (Juice packaging cylinder volume)
  '74042fd4-2bb9-43d2-bbb3-8bbf3b85e00b': {
    alternativas: [
      { letra: 'A', texto: '$4\\,000\\,\\pi$' },
      { letra: 'B', texto: '$2\\,000\\,\\pi$' },
      { letra: 'C', texto: '$\\frac{4\\,000}{\\pi}$' },
      { letra: 'D', texto: '$\\frac{1\\,000}{\\pi}$' },
      { letra: 'E', texto: '$\\frac{500}{\\pi}$' },
    ],
  },

  // 2024 Q153 (Tank with two vertical partitions)
  '169bef8f-36fe-4dee-b6cd-4a4a7c796806': {
    enunciado: `Um tanque, em formato de paralelepípedo reto retângulo, tem em seu interior dois anteparos verticais, fixados na sua base e em duas paredes opostas, sendo perpendiculares a elas, conforme a figura.

![Imagem da questão 153](/images/2024/question-153_6.png)

Esses anteparos, de espessuras desprezíveis, estão instalados de maneira a dividir a base do tanque em três retângulos congruentes, tendo suas alturas iguais à metade e a um quarto da altura do tanque. O tanque é abastecido por uma entrada situada no teto, através de um duto que despeja água a uma vazão constante, sendo necessárias 12 horas para finalizar o seu enchimento.

O gráfico que descreve, em cada instante, a maior altura de coluna de água, dentre aquelas que vão sendo formadas ao longo do enchimento do tanque, é`,
    alternativas: [
      { letra: 'A', texto: '![Alternativa A](/images/2024/question-153_7.png)' },
      { letra: 'B', texto: '![Alternativa B](/images/2024/question-153_8.png)' },
      { letra: 'C', texto: '![Alternativa C](/images/2024/question-153_9.png)' },
      { letra: 'D', texto: '![Alternativa D](/images/2024/question-153_10.png)' },
      { letra: 'E', texto: '![Alternativa E](/images/2024/question-153_11.png)' },
    ],
  },

  // 2024 Q154 (Internet service contracts reading time)
  'aebaa94a-0165-416e-9786-86ad1b335523': {
    enunciado: `Contratos de vários serviços disponíveis na internet apresentam uma quantidade excessiva de informações. Isso faz com que o tempo necessário para a leitura desses contratos possa ser longo.

O quadro apresenta uma amostra do tempo considerado necessário para a leitura completa do contrato de alguns serviços digitais.

| **Tipo de serviço** | **Tempo necessário para a leitura completa do contrato (em minuto)** |
|---------------------|----------------------------------------------------------------------|
| A | 36 |
| B | 17 |
| C | 27 |
| D | 13 |
| E | 13 |
| F | 13 |

O tempo médio, em minuto, necessário para a leitura completa de um contrato de serviço dentre os listados no quadro é, com uma casa decimal, aproximadamente,`,
    alternativas: [
      { letra: 'A', texto: '13,0.' },
      { letra: 'B', texto: '15,0.' },
      { letra: 'C', texto: '19,8.' },
      { letra: 'D', texto: '20,0.' },
      { letra: 'E', texto: '23,3.' },
    ],
    alternativa_correta: 'C',
  },

  // 2024 Q158 (Water flux phi unit)
  '2d2f7e2b-994a-4ac2-9fc0-40c811752531': {
    alternativas: [
      { letra: 'A', texto: '$\\text{mL} \\cdot \\text{s} \\cdot \\text{cm}^2$' },
      { letra: 'B', texto: '$\\frac{\\text{mL}}{\\text{s}} \\cdot \\text{cm}^2$' },
      { letra: 'C', texto: '$\\frac{\\text{mL}}{\\text{cm}^2 \\cdot \\text{s}}$' },
      { letra: 'D', texto: '$\\frac{\\text{cm}^2 \\cdot \\text{s}}{\\text{mL}}$' },
      { letra: 'E', texto: '$\\frac{\\text{cm}^2}{\\text{mL} \\cdot \\text{s}}$' },
    ],
  },

  // 2024 Q161 (Company with 400 employees in 3 sectors)
  'db333fea-d6a1-449c-beb6-74a572a87742': {
    alternativas: [
      { letra: 'A', texto: 'entre 25 e 45 anos, pois é a faixa etária com maior quantidade de funcionários.' },
      { letra: 'B', texto: 'entre 25 e 45 anos, pois é a única faixa etária cujas porcentagens são maiores do que as porcentagens mínimas de cada setor.' },
      { letra: 'C', texto: 'até 25 anos, pois é a única faixa etária cujos percentuais associados aos setores aumentam com o aumento da quantidade de funcionários por setor.' },
      { letra: 'D', texto: 'até 25 anos, pois é a faixa etária que apresenta maior quantidade de funcionários no setor de produção, que é o setor que emprega metade dos funcionários dessa empresa.' },
      { letra: 'E', texto: 'a partir de 45 anos, pois a soma das porcentagens associadas a essa faixa etária é 110%, que é maior do que as respectivas somas associadas às outras faixas etárias, que são 105% e 85%.' },
    ],
  },

  // 2024 Q162 (Virtual mobile game trajectory ABCDEF)
  '35346e66-cef2-40c9-a825-b10cbc70c0f6': {
    enunciado: `Em um jogo virtual para celular, um personagem pode percorrer trajetórias retilíneas voando ou se deslocando ao longo de paredes. Considere que o personagem descreve a trajetória $ABCDEF$, em que os pontos $A$, $D$ e $E$ estão em um plano paralelo ao que contém os pontos $B$ e $C$, sendo esses dois planos ortogonais ao plano da base que contém o ponto $F$, conforme a figura.

![Imagem da questão 162](/images/2024/question-162_6.png)

A projeção ortogonal, sobre o plano da base, da trajetória $ABCDEF$ descrita pelo personagem é`,
    alternativas: [
      { letra: 'A', texto: '![Alternativa A](/images/2024/question-162_7.png)' },
      { letra: 'B', texto: '![Alternativa B](/images/2024/question-162_8.png)' },
      { letra: 'C', texto: '![Alternativa C](/images/2024/question-162_9.png)' },
      { letra: 'D', texto: '![Alternativa D](/images/2024/question-162_10.png)' },
      { letra: 'E', texto: '![Alternativa E](/images/2024/question-162_11.png)' },
    ],
  },

  // 2024 Q166 (Artisan components X and Y)
  '6de5affa-3eaf-41d6-bcfb-ec7f655dbfd2': {
    enunciado: `Um artesão utiliza dois tipos de componentes, $X$ e $Y$, nos enfeites que produz. Ele sempre compra todos os componentes em uma mesma loja. O quadro apresenta os preços dos dois tipos de componentes nas lojas I e II.

| **Lojas** | **Preço de X (R$)** | **Preço de Y (R$)** |
|-----------|---------------------|---------------------|
| I | 3,00 | 1,00 |
| II | 2,00 | 4,00 |

Ele confeccionará enfeites formados por duas unidades do componente $X$ e uma unidade do componente $Y$ e efetuará a compra na loja que oferecer o menor valor total para a confecção de um enfeite.

O artesão efetuará a compra na loja`,
    alternativas: [
      { letra: 'A', texto: 'I, pois o valor é R$ 7,00.' },
      { letra: 'B', texto: 'I, pois o valor é R$ 4,00.' },
      { letra: 'C', texto: 'II, pois o valor é R$ 6,00.' },
      { letra: 'D', texto: 'I, pois anuncia o componente com o menor preço.' },
      { letra: 'E', texto: 'II, pois o componente X, que é o mais utilizado, tem menor preço.' },
    ],
  },

  // 2024 Q169 (Child copying and pasting 3 smiley figures 20 steps)
  'ca711803-2866-44d6-875e-1d07ac619b5b': {
    enunciado: `Uma criança, utilizando um aplicativo, escreveu uma mensagem para enviar a um amigo. Essa mensagem foi escrita seguindo estas etapas:

![Etapas no Visor de Escrita](/images/2024/question-169.png)

A criança seguiu copiando e colando, em cada etapa, o que tinha no visor na etapa imediatamente anterior, até concluir a 20ª etapa. Em seguida, enviou a mensagem.

Qual foi o total de figuras contidas na mensagem enviada?`,
    alternativas: [
      { letra: 'A', texto: '$3 \\times 2^{19}$' },
      { letra: 'B', texto: '$3 \\times 2^{20}$' },
      { letra: 'C', texto: '$3 \\times 2^{21}$' },
      { letra: 'D', texto: '$3 \\times 2^{20} - 1$' },
      { letra: 'E', texto: '$3 \\times 2^{20} - 3$' },
    ],
  },

  // 2024 Q175 (Brazilian trade balance S1, S2, S3)
  '9558012d-2c00-412c-860e-e21b200efc65': {
    alternativas: [
      { letra: 'A', texto: '$S_1$, $S_3$ e $S_2$.' },
      { letra: 'B', texto: '$S_2$, $S_1$ e $S_3$.' },
      { letra: 'C', texto: '$S_2$, $S_3$ e $S_1$.' },
      { letra: 'D', texto: '$S_3$, $S_1$ e $S_2$.' },
      { letra: 'E', texto: '$S_3$, $S_2$ e $S_1$.' },
    ],
  },

  // 2024 Q179 (Mug with boiling water T(t) = a + 80 b^t)
  '0771eebf-e491-4d04-90bd-c9dd2d2bbfe4': {
    enunciado: `Uma caneca com água fervendo é retirada de um forno de micro-ondas. A temperatura $T$, em grau Celsius, da caneca, em função do tempo $t$, em minuto, pode ser modelada pela função

$$T(t) = a + 80\\,b^t$$

representada no gráfico a seguir.

![Imagem da questão 179](/images/2024/question-179_1.png)

Os valores das constantes $a$ e $b$ são`,
    alternativas: [
      { letra: 'A', texto: '$a = 20$; $b = \\log(0{,}5)$' },
      { letra: 'B', texto: '$a = 100$; $b = 0{,}5$' },
      { letra: 'C', texto: '$a = 20$; $b = (0{,}5)^{\\frac{1}{10}}$' },
      { letra: 'D', texto: '$a = 20$; $b = \\frac{(40)^{\\frac{1}{10}}}{80}$' },
      { letra: 'E', texto: '$a = 20$; $b = 40$' },
    ],
  },

  // 2024 Q180 (Cylinder to cube packaging)
  'aa2923f8-ef40-4ada-817e-f0c9f6dab769': {
    alternativas: [
      { letra: 'A', texto: '$6$' },
      { letra: 'B', texto: '$18$' },
      { letra: 'C', texto: '$6\\sqrt{6}$' },
      { letra: 'D', texto: '$6\\sqrt[3]{6}$' },
      { letra: 'E', texto: '$3\\sqrt[3]{12}$' },
    ],
  },

  // Inline math cleanup for 2024 Q164 & Q137
  'e9bbb897-8aff-4c68-872f-7035e8f1bbac': {
    alternativas: [
      { letra: 'A', texto: '$\\frac{7!}{4!3!} \\times \\frac{6!}{4!2!}$' },
      { letra: 'B', texto: '$\\frac{7!}{4!3!} \\times \\frac{6!}{4!2!} + \\frac{7!}{3!4!} \\times \\frac{6!}{5!1!}$' },
      { letra: 'C', texto: '$\\frac{7!}{4!3!} + \\frac{6!}{4!2!} + \\frac{7!}{3!4!} + \\frac{6!}{5!1!}$' },
      { letra: 'D', texto: '$\\frac{7!}{4!3!} \\times \\frac{6!}{4!2!} + \\frac{7!}{3!4!} \\times \\frac{6!}{5!1!} + \\frac{7!}{2!5!}$' },
      { letra: 'E', texto: '$\\frac{7!}{4!3!} + \\frac{7!}{3!4!} + \\frac{7!}{2!5!}$' },
    ],
  },
  'd0465f37-33f9-479d-9b22-68730ac3c34d': {
    alternativas: [
      { letra: 'A', texto: '$d(Q) = \\frac{1}{4} d(R)$' },
      { letra: 'B', texto: '$d(Q) = \\frac{1}{2} d(R)$' },
      { letra: 'C', texto: '$d(Q) = \\frac{3}{4} d(R)$' },
      { letra: 'D', texto: '$d(Q) = \\frac{3}{2} d(R)$' },
      { letra: 'E', texto: '$d(Q) = \\frac{2}{3} d(R)$' },
    ],
  },
}

async function main() {
  const allQuestions = await prisma.question.findMany()
  let updatedCount = 0

  for (const q of allQuestions) {
    const yearFolder = q.ano_enem === 2024 ? '2024' : '2025'
    const fix = fixes[q.id] || {}

    let newEnunciado = fix.enunciado ?? q.enunciado
    // Rewrite any /images/question-... to /images/<yearFolder>/question-...
    newEnunciado = newEnunciado.replace(/\/images\/(?!2024\/|2025\/)(question-[^)\s]+)/g, `/images/${yearFolder}/$1`)

    const dataToUpdate = {}
    if (newEnunciado !== q.enunciado) {
      dataToUpdate.enunciado = newEnunciado
    }
    if (fix.alternativas) {
      dataToUpdate.alternativas = JSON.stringify(fix.alternativas)
    }
    if (fix.alternativa_correta) {
      dataToUpdate.alternativa_correta = fix.alternativa_correta
    }

    if (Object.keys(dataToUpdate).length > 0) {
      await prisma.question.update({
        where: { id: q.id },
        data: dataToUpdate,
      })
      updatedCount++
      console.log(`Updated [${q.ano_enem}] ${q.id}`)
    }
  }

  console.log(`Done! Updated ${updatedCount} questions out of ${allQuestions.length}.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
