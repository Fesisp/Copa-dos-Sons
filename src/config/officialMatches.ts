import type { OfficialMatch } from '../types';

export const OFFICIAL_MATCHES: OfficialMatch[] = [
  {
    id: 'serie-c-1',
    leagueTier: 'serie-c',
    title: 'Partida Oficial: B-O-I',
    targetWord: ['b', 'o', 'i'],
    rewardCardId: 'b',
    crowdReward: 100,
  },
  {
    id: 'serie-c-2',
    leagueTier: 'serie-c',
    title: 'Partida Oficial: P-A-T-O',
    targetWord: ['p', 'a', 't', 'o'],
    rewardCardId: 'p',
    crowdReward: 120,
  },
  {
    id: 'serie-b-1',
    leagueTier: 'serie-b',
    title: 'Partida Oficial: F-O-C-A',
    targetWord: ['f', 'o', 'k', 'a'],
    rewardCardId: 'f',
    crowdReward: 150,
  },
  {
    id: 'serie-a-1',
    leagueTier: 'serie-a',
    title: 'Partida Oficial: C-H-A',
    targetWord: ['ch', 'a'],
    rewardCardId: 'ch',
    crowdReward: 200,
  },
];
