export interface BnccSkill {
  code: 'EF01LP02' | 'EF01LP05' | 'EF01LP08';
  title: string;
  objective: string;
  observableEvidence: string[];
  recommendedMetrics: string[];
}

export const BNCC_SKILLS: BnccSkill[] = [
  {
    code: 'EF01LP02',
    title: 'Consciência fonêmica e discriminação sonora',
    objective: 'Reconhecer e discriminar sons/fonemas em palavras do cotidiano.',
    observableEvidence: [
      'Acerta slots de fonemas com autonomia crescente',
      'Reduz tentativas para montar palavras-alvo',
    ],
    recommendedMetrics: ['accuracyByPhoneme', 'avgAttemptsPerWord'],
  },
  {
    code: 'EF01LP05',
    title: 'Relação fonema-grafema',
    objective: 'Relacionar sons da fala às representações gráficas na formação de palavras.',
    observableEvidence: [
      'Monta sequências fonêmicas válidas na Prancheta',
      'Expande repertório de cartas desbloqueadas',
    ],
    recommendedMetrics: ['createdValidWords', 'unlockedCardsProgress'],
  },
  {
    code: 'EF01LP08',
    title: 'Leitura e escrita inicial mediadas por som',
    objective: 'Avançar em leitura/escrita inicial com apoio de segmentação sonora.',
    observableEvidence: [
      'Resolve palavras criadas por pares no Campeonato',
      'Apresenta melhora em séries de desafios semanais',
    ],
    recommendedMetrics: ['communityMatchSuccessRate', 'weeklyImprovementDelta'],
  },
];
