/**
 * Zustand Store - Global State Management
 * Connects game engine to React UI
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GameStore, DifficultyLevel, Player } from '../types';
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
};

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    ...initialState,

    setGameState: (gameState) => {
      set((state) => {
        state.gameState = gameState;
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
        state.difficulty = difficulty;
        state.currentLevel = getLevel(difficulty);
        state.gameState = 'PLAYING';
        state.score = 0;
        state.correctAnswers = 0;
        state.incorrectAnswers = 0;
        state.currentPhonemeIndex = 0;
        state.totalQuestions = LEVELS[difficulty].totalQuestions;
        state.lastFeedback = null;
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

    resetGame: () => {
      set((state) => {
        state.gameState = 'MENU';
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
