/**
 * Local autonomous AI agent used as the second player in offline matches.
 * It selects phoneme moves based on difficulty and phonotactic constraints,
 * providing deterministic educational gameplay without external services.
 */

import { db } from './databaseService';
import {
  canAttachPhoneme,
  isTokenUnlockedForPhase,
  normalizePhonemeToken,
  type DifficultyPhase,
} from '../config/phonotactics';
import type { Phoneme } from '../types';

export type AgentDifficulty = 'easy' | 'medium' | 'hard';

interface AgentMoveContext {
  targetWord?: string[];
  slotIndex?: number;
  phase?: DifficultyPhase;
}

interface AgentProfile {
  id: string;
  name: string;
  avatar: string;
}

const randomPick = <T>(items: T[]): T | null => {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)] ?? null;
};

export class AutonomousAgent {
  private readonly name: string = 'Klayton';
  private difficulty: AgentDifficulty;

  constructor(difficulty: AgentDifficulty = 'medium') {
    this.difficulty = difficulty;
  }

  public setDifficulty(difficulty: AgentDifficulty): void {
    this.difficulty = difficulty;
  }

  public calculateNextMove(
    availablePhonemes: Phoneme[],
    currentBoard: Phoneme[],
    context: AgentMoveContext = {}
  ): Phoneme | null {
    if (availablePhonemes.length === 0) return null;

    const phase = context.phase ?? 1;
    const phaseFiltered = availablePhonemes.filter((phoneme) =>
      isTokenUnlockedForPhase(phoneme.audioKey, phase)
    );

    if (phaseFiltered.length === 0) {
      return null;
    }

    const shouldInjectError =
      this.difficulty === 'easy' ? Math.random() < 0.4 : this.difficulty === 'medium' ? Math.random() < 0.18 : false;

    if (shouldInjectError) {
      return randomPick(phaseFiltered);
    }

    const bestMove = this.findBestPhonotacticMatch(phaseFiltered, currentBoard, context);
    if (bestMove) return bestMove;

    return randomPick(phaseFiltered);
  }

  private findBestPhonotacticMatch(
    available: Phoneme[],
    board: Phoneme[],
    context: AgentMoveContext
  ): Phoneme | null {
    const phase = context.phase ?? 1;
    const boardTail = board.length > 0 ? normalizePhonemeToken(board[board.length - 1].audioKey) : null;

    const phonotacticCandidates = available.filter((candidate) => {
      const token = normalizePhonemeToken(candidate.audioKey);
      return canAttachPhoneme(boardTail, token, phase, { enforcePhasePattern: true });
    });

    if (phonotacticCandidates.length === 0) {
      return null;
    }

    if (this.difficulty === 'hard' && context.targetWord && typeof context.slotIndex === 'number') {
      const expected = normalizePhonemeToken(context.targetWord[context.slotIndex] ?? '');
      const exact = phonotacticCandidates.find(
        (candidate) => normalizePhonemeToken(candidate.audioKey) === expected
      );
      if (exact) return exact;
    }

    if ((this.difficulty === 'medium' || this.difficulty === 'hard') && context.targetWord && typeof context.slotIndex === 'number') {
      const expected = normalizePhonemeToken(context.targetWord[context.slotIndex] ?? '');
      const ranked = [...phonotacticCandidates].sort((left, right) => {
        const leftMatch = normalizePhonemeToken(left.audioKey) === expected ? 1 : 0;
        const rightMatch = normalizePhonemeToken(right.audioKey) === expected ? 1 : 0;
        return rightMatch - leftMatch;
      });
      return ranked[0] ?? null;
    }

    return randomPick(phonotacticCandidates);
  }

  public getAgentProfile(): AgentProfile {
    return {
      id: `agent_01_${db.name}`,
      name: this.name,
      avatar: '🤖',
    };
  }
}

export const agentService = new AutonomousAgent('medium');
