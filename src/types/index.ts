/**
 * Global TypeScript Types for Copa dos Sons
 * Defines all data structures for the game engine, state, and UI
 */

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Phoneme {
  id: string;
  phoneme: string; // e.g., "p", "b", "m"
  difficulty: DifficultyLevel;
  imageUrl: string;
  audioIndex: number; // Index in the Audio Sprite
  examples: string[]; // e.g., ["pato", "pé", "pipa"]
}

export interface Level {
  id: string;
  difficulty: DifficultyLevel;
  phonemes: Phoneme[];
  totalQuestions: number;
  timeLimit?: number; // in seconds, optional
  description: string;
}

export type GameState = 
  | 'MENU' 
  | 'LEVEL_SELECT' 
  | 'PLAYING' 
  | 'FEEDBACK' 
  | 'LEVEL_COMPLETE' 
  | 'VICTORY' 
  | 'GAME_OVER';

export interface GameSession {
  id: string;
  playerId: string;
  difficulty: DifficultyLevel;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  startedAt: Date;
  completedAt?: Date;
  phonemesLearned: string[];
}

export interface Player {
  id: string;
  name: string;
  createdAt: Date;
  lastPlayedAt?: Date;
  totalSessions: number;
  averageScore: number;
}

export interface FeedbackResult {
  isCorrect: boolean;
  selectedId: string;
  correctId: string;
  currentScore: number;
  message: string;
}

export interface GameStore {
  // State
  gameState: GameState;
  difficulty: DifficultyLevel | null;
  currentLevel: Level | null;
  currentPhonemeIndex: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  currentPlayer: Player | null;
  isAudioPlaying: boolean;
  lastFeedback: FeedbackResult | null;

  // Actions
  setGameState: (state: GameState) => void;
  selectDifficulty: (difficulty: DifficultyLevel) => void;
  initializeGame: (player: Player, difficulty: DifficultyLevel) => void;
  playPhonemeAudio: () => Promise<void>;
  answerQuestion: (selectedPhonemeId: string, correctPhonemeId: string) => void;
  nextPhoneme: () => void;
  resetGame: () => void;
  incrementScore: (points: number) => void;
  setCurrentPlayer: (player: Player) => void;
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

export interface SessionProgress {
  sessionId: string;
  phonemeId: string;
  isCorrect: boolean;
  attempts: number;
  timestamp: Date;
}
