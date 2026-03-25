/**
 * Game Engine - Pure Functions
 * Implements game logic, validation, and state transitions
 * Completely decoupled from React/UI
 */

import type { Phoneme, FeedbackResult, GameState, DifficultyLevel, Level } from '../types';
import { LEVELS, PHONEME_MAP } from './config/phonemes';

/**
 * Validate if the selected image phoneme matches the audio phoneme
 * Pure function: no side effects
 */
export const validateAnswer = (
  correctPhonemeId: string,
  selectedPhonemeId: string
): boolean => {
  return correctPhonemeId === selectedPhonemeId;
};

/**
 * Check if a phoneme exists in the system
 */
export const checkPhoneme = (phonemeId: string): boolean => {
  return phonemeId in PHONEME_MAP;
};

/**
 * Get a phoneme by ID
 */
export const getPhonemeById = (phonemeId: string): Phoneme | null => {
  return PHONEME_MAP[phonemeId] || null;
};

/**
 * Get a random phoneme from a difficulty level
 */
export const getRandomPhoneme = (difficulty: DifficultyLevel): Phoneme => {
  const level = LEVELS[difficulty];
  const phonemes = level.phonemes;
  return phonemes[Math.floor(Math.random() * phonemes.length)];
};

/**
 * Get random incorrect options (other phonemes for multiple choice)
 */
export const getIncorrectOptions = (
  correctPhonemeId: string,
  difficulty: DifficultyLevel,
  count: number = 3
): Phoneme[] => {
  const level = LEVELS[difficulty];
  const availablePhonemes = level.phonemes.filter(p => p.id !== correctPhonemeId);
  
  const selected: Phoneme[] = [];
  for (let i = 0; i < Math.min(count, availablePhonemes.length); i++) {
    const randomIndex = Math.floor(Math.random() * availablePhonemes.length);
    selected.push(availablePhonemes[randomIndex]);
    availablePhonemes.splice(randomIndex, 1);
  }
  
  return selected;
};

/**
 * Shuffle an array (Fisher-Yates)
 */
export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Generate feedback result after answer submission
 */
export const generateFeedback = (
  isCorrect: boolean,
  selectedId: string,
  correctId: string,
  currentScore: number
): FeedbackResult => {
  return {
    isCorrect,
    selectedId,
    correctId,
    currentScore,
    message: isCorrect
      ? '🎉 Parabéns! Você acertou!'
      : '❌ Tente novamente!',
  };
};

/**
 * Calculate score based on difficulty and time
 */
export const calculateScore = (
  difficulty: DifficultyLevel,
  timeSpentSeconds: number,
  isCorrect: boolean
): number => {
  if (!isCorrect) return 0;

  const baseScore: Record<DifficultyLevel, number> = {
    easy: 10,
    medium: 20,
    hard: 30,
  };

  const speedBonus = Math.max(0, 5 - Math.floor(timeSpentSeconds / 10));
  
  return baseScore[difficulty] + speedBonus;
};

/**
 * Validate if game session should end
 */
export const shouldGameEnd = (
  correctAnswers: number,
  totalQuestions: number
): boolean => {
  return correctAnswers + (totalQuestions - correctAnswers) >= totalQuestions;
};

/**
 * Determine if player achieved victory (80%+ correct)
 */
export const isVictory = (correctAnswers: number, totalQuestions: number): boolean => {
  const percentage = (correctAnswers / totalQuestions) * 100;
  return percentage >= 80;
};

/**
 * Calculate session statistics
 */
export const calculateSessionStats = (
  correctAnswers: number,
  totalQuestions: number
) => {
  const accuracy = (correctAnswers / totalQuestions) * 100;
  const accuracy_rounded = Math.round(accuracy);
  
  return {
    accuracy: accuracy_rounded,
    correctAnswers,
    incorrectAnswers: totalQuestions - correctAnswers,
    totalQuestions,
    isPassed: isVictory(correctAnswers, totalQuestions),
  };
};

/**
 * Get level by difficulty
 */
export const getLevel = (difficulty: DifficultyLevel): Level => {
  return LEVELS[difficulty];
};

/**
 * State Machine - Determine next state based on current conditions
 */
export const getNextGameState = (
  currentState: GameState,
  correctAnswers: number,
  totalQuestions: number,
  answeredQuestions: number
): GameState => {
  switch (currentState) {
    case 'MENU':
      return 'LEVEL_SELECT';
    case 'LEVEL_SELECT':
      return 'PLAYING';
    case 'PLAYING':
      return 'FEEDBACK';
    case 'FEEDBACK':
      // Check if game should continue or end
      if (answeredQuestions >= totalQuestions) {
        return isVictory(correctAnswers, totalQuestions) ? 'VICTORY' : 'GAME_OVER';
      }
      return 'PLAYING';
    case 'LEVEL_COMPLETE':
      return 'LEVEL_SELECT';
    case 'VICTORY':
      return 'MENU';
    case 'GAME_OVER':
      return 'MENU';
    default:
      return 'MENU';
  }
};
