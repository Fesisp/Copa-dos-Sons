/**
 * Global TypeScript Types for Copa dos Sons
 * Clean-slate Card Game architecture (Craque Fônico)
 */

export type LeagueTier = 'serie-c' | 'serie-b' | 'serie-a';

export type MatchSource = 'official' | 'community';

export type MatchStatus = 'idle' | 'playing' | 'victory' | 'review';

export type AppScreen =
  | 'vestiario'
  | 'album'
  | 'prancheta'
  | 'campo'
  | 'match'
  | 'campeonato'
  | 'boletim';

export interface Card {
  id: string; // canonical id (usually the same as phoneme key)
  phoneme: string; // visual label on card, ex: "b", "ch", "ã"
  audioKey: string; // key used in audio sprite index
  leagueTier: LeagueTier;
  imageUrl: string;
  examples?: string[];
  isVowel?: boolean;
}

export interface OfficialMatch {
  id: string;
  leagueTier: LeagueTier;
  title: string;
  targetWord: string[];
  rewardCardId: string;
  crowdReward: number;
}

export interface Player {
  id: string;
  name: string;
  createdAt: Date;
  lastPlayedAt?: Date;
  crowd: number;
  leagueTier: LeagueTier;
  unlockedPhonemes: string[];
  completedOfficialMatchIds: string[];
}

export interface CustomWord {
  id: string;
  wordArray: string[];
  creatorName: string;
  createdAt: Date;
  golacos: number;
  faltas: number;
  totalMatches: number;
}

export interface GameStore {
  // State
  currentScreen: AppScreen;
  matchStatus: MatchStatus;
  currentMatchSource: MatchSource;
  currentPlayer: Player | null;
  cardsCatalog: Card[];
  currentOfficialMatch: OfficialMatch | null;
  targetWord: string[];
  availableCards: string[];
  assembledSlots: Array<string | null>;
  crowdDelta: number;
  isAudioPlaying: boolean;
  selectedCommunityWordId: string | null;

  // Actions
  setScreen: (screen: AppScreen) => void;
  setCurrentPlayer: (player: Player) => void;
  initializePlayerInventory: (playerName: string) => Player;
  setCardsCatalog: (cards: Card[]) => void;
  startOfficialMatch: (match: OfficialMatch) => void;
  startCommunityMatch: (wordArray: string[], customWordId: string) => void;
  handleDrop: (phonemeId: string, slotIndex: number) => boolean;
  checkWordCompletion: () => boolean;
  unlockPhoneme: (phonemeId: string) => void;
  addCrowd: (amount: number) => void;
  resetCurrentMatch: () => void;
}

export interface AudioManagerConfig {
  spriteUrl: string;
  indexUrl: string;
  volume: number;
  preload: boolean;
}

export interface AudioIndex {
  [key: string]: {
    start: number;
    duration: number;
  };
}
