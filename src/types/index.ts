/**
 * Global TypeScript Types for Copa dos Sons
 * Clean-slate Card Game architecture (Craque Fônico)
 */

export type LeagueTier = 'serie-c' | 'serie-b' | 'serie-a';

export type MatchSource = 'official' | 'community';

export type MatchStatus = 'idle' | 'playing' | 'victory' | 'review';

export type GameplayMode = 'treino_chute' | 'penaltis' | 'var_juiz' | 'mission' | 'laboratory';

export type GameFocus = 'phonemes' | 'words';

export type CommunityPlayMode = 'coop' | 'versus';

export type DifficultyPhase = 1 | 2 | 3;

export type AssemblyErrorReason =
  | 'invalid_adjacency'
  | 'slot_limit'
  | 'phase_locked'
  | 'occupied_slot'
  | 'wrong_slot'
  | 'invalid_drop';

export interface AssemblyFeedback {
  reason: AssemblyErrorReason;
  message: string;
  token?: string;
  timestamp: number;
}

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

export type Phoneme = Card;

export type AgentDifficulty = 'easy' | 'medium' | 'hard';

export interface AgentProfile {
  id: string;
  name: string;
  avatar: string;
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
  gameplayMode: GameplayMode;
  gameFocus: GameFocus;
  communityPlayMode: CommunityPlayMode;
  difficultyPhase: DifficultyPhase;
  maxAssemblySlots: number;
  missionCardPool: string[];
  labAssemblySlots: string[];
  lastAssemblyFeedback: AssemblyFeedback | null;
  isAgentTurn: boolean;
  agentMode: boolean;
  agentDifficulty: AgentDifficulty;
  agentProfile: AgentProfile;
  versusScore: {
    student: number;
    agent: number;
  };
  timerSeconds: number;
  playerScore: number;
  klaytonScore: number;
  varMistakeIndex: number | null;

  // Actions
  setScreen: (screen: AppScreen) => void;
  setCurrentPlayer: (player: Player) => void;
  initializePlayerInventory: (playerName: string) => Player;
  setCardsCatalog: (cards: Card[]) => void;
  startOfficialMatch: (match: OfficialMatch) => void;
  startCommunityMatch: (wordArray: string[], customWordId: string) => void;
  startTreinoChute: (targetPhonemeId: string) => void;
  startPenaltisMode: (wordArray: string[], customWordId?: string) => void;
  startVarMode: (correctWord: string[], mistakeIndex: number, wrongPhoneme: string) => void;
  startLaboratoryMode: () => void;
  setCommunityPlayMode: (mode: CommunityPlayMode) => void;
  setGameplayMode: (mode: GameplayMode) => void;
  setTimerSeconds: (seconds: number) => void;
  registerPenaltisGoal: (by: 'player' | 'klayton') => void;
  setDifficultyPhase: (phase: DifficultyPhase) => void;
  setAgentMode: (enabled: boolean) => void;
  setAgentDifficulty: (difficulty: AgentDifficulty) => void;
  passTurn: () => void;
  executeAgentMove: () => void;
  handleDrop: (phonemeId: string, slotIndex: number) => boolean;
  appendLabPhoneme: (phonemeId: string) => boolean;
  removeLastLabPhoneme: () => void;
  clearLabAssembly: () => void;
  clearMatchAssembly: () => void;
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
