export interface NavTabItem {
  id: string
  href: string
  label: string
  description: string
  iconName: "Compass" | "PlayCircle" | "BookOpen" | "BarChart2" | "BookMarked" | "GraduationCap" | "ShieldCheck" | "QrCode"
  enabled: boolean
  allowedRoles: ("aluno" | "professor")[]
  isCore?: boolean
  badge?: string
}

export const DEFAULT_NAV_TABS: NavTabItem[] = [
  {
    id: "dashboard",
    href: "/",
    label: "Dashboard",
    description: "Visão geral, Desafio Guiado de 3 Questões, ofensiva diária e progresso do aluno.",
    iconName: "Compass",
    enabled: true,
    allowedRoles: ["aluno", "professor"],
    isCore: true,
  },
  {
    id: "materias",
    href: "/materias",
    label: "Matérias & Videoaulas",
    description: "Módulos curriculares do GTMAT CEFET-MG e apostilas OBMEP com videoaulas integradas.",
    iconName: "PlayCircle",
    enabled: true,
    allowedRoles: ["aluno", "professor"],
  },
  {
    id: "explorador",
    href: "/explorador",
    label: "Catálogo BNCC",
    description: "Banco completo de questões do ENEM classificadas por habilidade e tópicos da BNCC.",
    iconName: "BookOpen",
    enabled: true,
    allowedRoles: ["aluno", "professor"],
  },
  {
    id: "desempenho",
    href: "/aluno/desempenho",
    label: "Desempenho",
    description: "Métricas analíticas de acertos, taxa de precisão e histórico de aprendizagem do aluno.",
    iconName: "BarChart2",
    enabled: true,
    allowedRoles: ["aluno"],
  },
  {
    id: "caderno",
    href: "/aluno/caderno",
    label: "Caderno de Revisão",
    description: "Questões marcadas para revisão, materiais de apoio recomendados e links diretos da OBMEP.",
    iconName: "BookMarked",
    enabled: true,
    allowedRoles: ["aluno"],
  },
  {
    id: "professor",
    href: "/professor",
    label: "Roteiros de Aula",
    description: "Gerador e repositório de roteiros socráticos baseados no Arco de Maguerez para docentes.",
    iconName: "GraduationCap",
    enabled: true,
    allowedRoles: ["professor"],
  },
  {
    id: "tutorial",
    href: "/professor/tutorial",
    label: "Tutorial Ético IA",
    description: "Diretrizes metodológicas sobre o uso ético da IA na educação e prevenção de respostas prontas.",
    iconName: "ShieldCheck",
    enabled: true,
    allowedRoles: ["professor"],
  },
  {
    id: "qrcode",
    href: "/qrcode",
    label: "Acesso Mobile (QR)",
    description: "Geração de QR Code para escaneamento rápido e acesso pelo celular.",
    iconName: "QrCode",
    enabled: true,
    allowedRoles: ["aluno", "professor"],
  },
]
