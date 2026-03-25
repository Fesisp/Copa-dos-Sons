/**
 * Zustand Store - Global State Management
 * Connects game engine to React UI
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GameStore, DifficultyLevel, Player } from '../types';
import { audioManager } from '../services/audioManager';
import {
  generateFeedback,
  calculateScore,
  calculateSessionStats,
  getLevel,
  validateAnswer,
} from '../engine';
import { LEVELS } from '../engine/config/phonemes';

const initialState = {
  gameState: 'MENU' as const,
  gameMode: 'quiz' as const,
  difficulty: null,
  currentLevel: null,
  currentPhonemeIndex: 0,
  score: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  currentPlayer: null,
  isAudioPlaying: false,
  lastFeedback: null,
  targetWord: [] as string[],
  assembledSlots: [] as Array<string | null>,
  availableWordPhonemes: [] as string[],
  currentChallengeId: null as string | null,
};

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    ...initialState,

    setGameState: (gameState) => {
      set((state) => {
        state.gameState = gameState;
      });
    },

    setGameMode: (mode) => {
      set((state) => {
        state.gameMode = mode;
      });
    },

    selectDifficulty: (difficulty: DifficultyLevel) => {
      set((state) => {
        state.difficulty = difficulty;
        state.currentLevel = getLevel(difficulty);
        state.totalQuestions = LEVELS[difficulty].totalQuestions;
      });
    },

    initializeGame: (player: Player, difficulty: DifficultyLevel) => {
      set((state) => {
        state.currentPlayer = player;
        state.gameMode = 'quiz';
        state.difficulty = difficulty;
        state.currentLevel = getLevel(difficulty);
        state.gameState = 'PLAYING';
        state.score = 0;
        state.correctAnswers = 0;
        state.incorrectAnswers = 0;
        state.currentPhonemeIndex = 0;
        state.totalQuestions = LEVELS[difficulty].totalQuestions;
        state.lastFeedback = null;
        state.targetWord = [];
        state.assembledSlots = [];
        state.availableWordPhonemes = [];
        state.currentChallengeId = null;
      });
    },

    setWordChallenge: (wordArray: string[], challengeId: string | null = null) => {
      const normalized = wordArray
        .map((item) => item.trim().toLowerCase())
        .filter((item) => item.length > 0);

      const shuffled = [...normalized].sort(() => Math.random() - 0.5);

      set((state) => {
        state.gameMode = 'word-builder';
        state.gameState = 'PLAYING';
        state.targetWord = normalized;
        state.assembledSlots = new Array(normalized.length).fill(null);
        state.availableWordPhonemes = shuffled;
        state.currentChallengeId = challengeId;
        state.totalQuestions = normalized.length;
        state.currentPhonemeIndex = 0;
        state.lastFeedback = null;
        state.correctAnswers = 0;
        state.incorrectAnswers = 0;
        state.score = 0;
      });
    },

    playPhonemeAudio: async () => {
      set((state) => {
        state.isAudioPlaying = true;
      });

      // Simulate audio playback
      // In real implementation, this will trigger AudioManager
      setTimeout(() => {
        set((state) => {
          state.isAudioPlaying = false;
        });
      }, 1000);
    },

    answerQuestion: (selectedPhonemeId: string, correctPhonemeId: string) => {
      const state = get();

      if (state.gameMode === 'word-builder') {
        return;
      }

      const isCorrect = validateAnswer(correctPhonemeId, selectedPhonemeId);
      const scorePoints = calculateScore(state.difficulty || 'easy', 5, isCorrect);

      set((s) => {
        if (isCorrect) {
          s.correctAnswers += 1;
          s.score += scorePoints;
        } else {
          s.incorrectAnswers += 1;
        }

        s.lastFeedback = generateFeedback(
          isCorrect,
          selectedPhonemeId,
          correctPhonemeId,
          s.score
        );

        s.gameState = 'FEEDBACK';
        s.currentPhonemeIndex += 1;

        // Check if game should end
        const answeredQuestions = s.correctAnswers + s.incorrectAnswers;
        if (answeredQuestions >= s.totalQuestions) {
          const stats = calculateSessionStats(s.correctAnswers, s.totalQuestions);
          s.gameState = stats.isPassed ? 'VICTORY' : 'GAME_OVER';
        }
      });
    },

    nextPhoneme: () => {
      set((state) => {
        state.gameState = 'PLAYING';
        state.lastFeedback = null;
      });
    },

    handleDrop: (phonemeId: string, slotIndex: number) => {
      const state = get();

      if (state.gameMode !== 'word-builder') {
        return false;
      }

      if (slotIndex < 0 || slotIndex >= state.targetWord.length) {
        return false;
      }

      if (state.assembledSlots[slotIndex] !== null) {
        return false;
      }

      const normalized = phonemeId.trim().toLowerCase();
      const expected = state.targetWord[slotIndex];
      const isCorrect = normalized === expected;

      set((draft) => {
        if (isCorrect) {
          draft.assembledSlots[slotIndex] = normalized;
          draft.correctAnswers += 1;
          draft.score += 25;
        } else {
          draft.incorrectAnswers += 1;
        }
      });

      if (isCorrect) {
        void get().checkWordCompletion();
      }

      return isCorrect;
    },

    checkWordCompletion: () => {
      const state = get();

      if (state.gameMode !== 'word-builder') {
        return false;
      }

      const isCompleted =
        state.assembledSlots.length > 0 &&
        state.assembledSlots.every((slot, index) => slot === state.targetWord[index]);

      if (isCompleted) {
        set((draft) => {
          draft.gameState = 'VICTORY';
          draft.lastFeedback = {
            isCorrect: true,
            selectedId: 'word-builder',
            correctId: 'word-builder',
            currentScore: draft.score,
            message: 'GOOOOOL! Palavra montada com sucesso! ⚽',
          };
        });
        void audioManager.playGoalSound();
      }

      return isCompleted;
    },

    resetGame: () => {
      set((state) => {
        state.gameState = 'MENU';
        state.gameMode = 'quiz';
        state.difficulty = null;
        state.currentLevel = null;
        state.currentPhonemeIndex = 0;
        state.score = 0;
        state.totalQuestions = 0;
        state.correctAnswers = 0;
        state.incorrectAnswers = 0;
        state.currentPlayer = null;
        state.isAudioPlaying = false;
        state.lastFeedback = null;
        state.targetWord = [];
        state.assembledSlots = [];
        state.availableWordPhonemes = [];
        state.currentChallengeId = null;
      });
    },

    incrementScore: (points: number) => {
      set((state) => {
        state.score += points;
      });
    },

    setCurrentPlayer: (player: Player) => {
      set((state) => {
        state.currentPlayer = player;
      });
    },
  }))
);
