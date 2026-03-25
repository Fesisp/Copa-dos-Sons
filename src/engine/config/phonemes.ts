/**
 * Phoneme Configuration for Copa dos Sons
 * Defines all phonemes and levels with 3 difficulty tiers
 */

import type { Phoneme, Level } from '../../types';

// LEVEL 1: EASY - Simple CV (Consonant-Vowel) syllables
const easyPhonemes: Phoneme[] = [
  {
    id: 'p1',
    phoneme: 'p',
    difficulty: 'easy',
    imageUrl: '/images/easy/p.png',
    audioIndex: 0,
    examples: ['pato', 'pé', 'pipa'],
  },
  {
    id: 'b1',
    phoneme: 'b',
    difficulty: 'easy',
    imageUrl: '/images/easy/b.png',
    audioIndex: 1,
    examples: ['bola', 'boca', 'bota'],
  },
  {
    id: 'm1',
    phoneme: 'm',
    difficulty: 'easy',
    imageUrl: '/images/easy/m.png',
    audioIndex: 2,
    examples: ['mãe', 'maçã', 'mala'],
  },
  {
    id: 't1',
    phoneme: 't',
    difficulty: 'easy',
    imageUrl: '/images/easy/t.png',
    audioIndex: 3,
    examples: ['tato', 'teia', 'toca'],
  },
  {
    id: 'd1',
    phoneme: 'd',
    difficulty: 'easy',
    imageUrl: '/images/easy/d.png',
    audioIndex: 4,
    examples: ['dado', 'dedo', 'dente'],
  },
  {
    id: 'n1',
    phoneme: 'n',
    difficulty: 'easy',
    imageUrl: '/images/easy/n.png',
    audioIndex: 5,
    examples: ['ninho', 'nota', 'nado'],
  },
  {
    id: 'k1',
    phoneme: 'k',
    difficulty: 'easy',
    imageUrl: '/images/easy/k.png',
    audioIndex: 6,
    examples: ['casa', 'carne', 'cama'],
  },
  {
    id: 'g1',
    phoneme: 'g',
    difficulty: 'easy',
    imageUrl: '/images/easy/g.png',
    audioIndex: 7,
    examples: ['gato', 'gelo', 'gola'],
  },
];

// LEVEL 2: MEDIUM - CVC words and fricatives
const mediumPhonemes: Phoneme[] = [
  {
    id: 'f1',
    phoneme: 'f',
    difficulty: 'medium',
    imageUrl: '/images/medium/f.png',
    audioIndex: 8,
    examples: ['fogo', 'foco', 'flor'],
  },
  {
    id: 'v1',
    phoneme: 'v',
    difficulty: 'medium',
    imageUrl: '/images/medium/v.png',
    audioIndex: 9,
    examples: ['vaca', 'vela', 'vento'],
  },
  {
    id: 's1',
    phoneme: 's',
    difficulty: 'medium',
    imageUrl: '/images/medium/s.png',
    audioIndex: 10,
    examples: ['sol', 'saco', 'sofá'],
  },
  {
    id: 'z1',
    phoneme: 'z',
    difficulty: 'medium',
    imageUrl: '/images/medium/z.png',
    audioIndex: 11,
    examples: ['zona', 'zero', 'zíper'],
  },
  {
    id: 'r1',
    phoneme: 'r',
    difficulty: 'medium',
    imageUrl: '/images/medium/r.png',
    audioIndex: 12,
    examples: ['rato', 'caro', 'rede'],
  },
  {
    id: 'l1',
    phoneme: 'l',
    difficulty: 'medium',
    imageUrl: '/images/medium/l.png',
    audioIndex: 13,
    examples: ['lua', 'lata', 'leão'],
  },
  {
    id: 'e1',
    phoneme: 'ɛ',
    difficulty: 'medium',
    imageUrl: '/images/medium/e.png',
    audioIndex: 14,
    examples: ['ele', 'erva', 'época'],
  },
  {
    id: 'o1',
    phoneme: 'ɔ',
    difficulty: 'medium',
    imageUrl: '/images/medium/o.png',
    audioIndex: 15,
    examples: ['ovo', 'olho', 'ombro'],
  },
];

// LEVEL 3: HARD - Digraphs and complex sounds
const hardPhonemes: Phoneme[] = [
  {
    id: 'ch1',
    phoneme: 'ch',
    difficulty: 'hard',
    imageUrl: '/images/hard/ch.png',
    audioIndex: 16,
    examples: ['chave', 'chuva', 'chocolate'],
  },
  {
    id: 'j1',
    phoneme: 'j',
    difficulty: 'hard',
    imageUrl: '/images/hard/j.png',
    audioIndex: 17,
    examples: ['jogo', 'jarra', 'janela'],
  },
  {
    id: 'x1',
    phoneme: 'x',
    difficulty: 'hard',
    imageUrl: '/images/hard/x.png',
    audioIndex: 18,
    examples: ['xícara', 'xadrez', 'xarope'],
  },
  {
    id: 'nh1',
    phoneme: 'nh',
    difficulty: 'hard',
    imageUrl: '/images/hard/nh.png',
    audioIndex: 19,
    examples: ['ninho', 'banha', 'colhinha'],
  },
  {
    id: 'lh1',
    phoneme: 'lh',
    difficulty: 'hard',
    imageUrl: '/images/hard/lh.png',
    audioIndex: 20,
    examples: ['lhama', 'folha', 'filhote'],
  },
  {
    id: 'rr1',
    phoneme: 'rr',
    difficulty: 'hard',
    imageUrl: '/images/hard/rr.png',
    audioIndex: 21,
    examples: ['carro', 'barro', 'jarra'],
  },
  {
    id: 'an1',
    phoneme: 'ã',
    difficulty: 'hard',
    imageUrl: '/images/hard/an.png',
    audioIndex: 22,
    examples: ['irmã', 'pão', 'mão'],
  },
  {
    id: 'on1',
    phoneme: 'õ',
    difficulty: 'hard',
    imageUrl: '/images/hard/on.png',
    audioIndex: 23,
    examples: ['pão', 'sombra', 'pombo'],
  },
];

// Define the three levels
export const LEVELS: Record<string, Level> = {
  easy: {
    id: 'level-easy',
    difficulty: 'easy',
    phonemes: easyPhonemes,
    totalQuestions: 16, // 2 questions per phoneme
    timeLimit: 300, // 5 minutes
    description: 'Aprenda sons simples: p, b, m, t, d, n, k, g',
  },
  medium: {
    id: 'level-medium',
    difficulty: 'medium',
    phonemes: mediumPhonemes,
    totalQuestions: 24, // 3 questions per phoneme
    timeLimit: 600, // 10 minutes
    description: 'Sons intermediários: fricativas, líquidas e variações de vogais',
  },
  hard: {
    id: 'level-hard',
    difficulty: 'hard',
    phonemes: hardPhonemes,
    totalQuestions: 32, // 4 questions per phoneme
    timeLimit: 900, // 15 minutes
    description: 'Sons complexos: dígrafos, nasalizações e combinações',
  },
};

// Export all phonemes flattened for reference
export const ALL_PHONEMES = [...easyPhonemes, ...mediumPhonemes, ...hardPhonemes];

// Export phonemes indexed by ID for quick lookup
export const PHONEME_MAP = ALL_PHONEMES.reduce(
  (acc, phoneme) => ({ ...acc, [phoneme.id]: phoneme }),
  {} as Record<string, Phoneme>
);

// Export default level (easy) for onboarding
export const DEFAULT_LEVEL = LEVELS.easy;
