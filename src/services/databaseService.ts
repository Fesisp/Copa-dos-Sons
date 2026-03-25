/**
 * Dexie Database Service
 * Manages offline persistence with IndexedDB
 * Stores player data, sessions, and progress
 */

import Dexie, { type Table } from 'dexie';
import type { Player, GameSession, SessionProgress } from '../types';

/**
 * Dexie Database Schema
 */
export class CopaDosSonsDB extends Dexie {
  players!: Table<Player>;
  sessions!: Table<GameSession>;
  progress!: Table<SessionProgress>;

  constructor() {
    super('copa-dos-sons');
    this.version(1).stores({
      players: 'id, createdAt',
      sessions: 'id, playerId, startedAt',
      progress: '++id, sessionId, phonemeId, timestamp',
    });
  }
}

export const db = new CopaDosSonsDB();

/**
 * Player Service - CRUD operations for players
 */
export const playerService = {
  /**
   * Create or get a player by name
   */
  async upsertPlayer(name: string): Promise<Player> {
    const existing = await db.players
      .where('name')
      .equals(name)
      .first();

    if (existing) {
      existing.lastPlayedAt = new Date();
      await db.players.put(existing);
      return existing;
    }

    const newPlayer: Player = {
      id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      createdAt: new Date(),
      lastPlayedAt: new Date(),
      totalSessions: 0,
      averageScore: 0,
    };

    await db.players.add(newPlayer);
    return newPlayer;
  },

  /**
   * Get player by ID
   */
  async getPlayer(id: string): Promise<Player | undefined> {
    return db.players.get(id);
  },

  /**
   * Get all players
   */
  async getAllPlayers(): Promise<Player[]> {
    return db.players.toArray();
  },

  /**
   * Delete player
   */
  async deletePlayer(id: string): Promise<void> {
    await db.players.delete(id);
    // Also delete associated sessions and progress
    const sessions = await db.sessions.where('playerId').equals(id).toArray();
    for (const session of sessions) {
      await db.progress.where('sessionId').equals(session.id).delete();
    }
    await db.sessions.where('playerId').equals(id).delete();
  },

  /**
   * Update player stats
   */
  async updatePlayerStats(playerId: string, newSession: GameSession): Promise<void> {
    const player = await db.players.get(playerId);
    if (!player) return;

    const allSessions = await db.sessions
      .where('playerId')
      .equals(playerId)
      .toArray();

    const totalScore = allSessions.reduce((sum, s) => sum + s.score, 0) + newSession.score;
    const averageScore = totalScore / (allSessions.length + 1);

    player.totalSessions = allSessions.length + 1;
    player.averageScore = averageScore;
    player.lastPlayedAt = new Date();

    await db.players.put(player);
  },
};

/**
 * Session Service - CRUD operations for game sessions
 */
export const sessionService = {
  /**
   * Create a new game session
   */
  async createSession(playerId: string, difficulty: 'easy' | 'medium' | 'hard'): Promise<GameSession> {
    const session: GameSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      playerId,
      difficulty,
      score: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      startedAt: new Date(),
      phonemesLearned: [],
    };

    await db.sessions.add(session);
    return session;
  },

  /**
   * Update session
   */
  async updateSession(session: GameSession): Promise<void> {
    session.completedAt = new Date();
    await db.sessions.put(session);
  },

  /**
   * Get session by ID
   */
  async getSession(id: string): Promise<GameSession | undefined> {
    return db.sessions.get(id);
  },

  /**
   * Get all sessions for a player
   */
  async getPlayerSessions(playerId: string): Promise<GameSession[]> {
    return db.sessions
      .where('playerId')
      .equals(playerId)
      .reverse()
      .sortBy('startedAt');
  },

  /**
   * Get session count for a player
   */
  async getPlayerSessionCount(playerId: string): Promise<number> {
    return db.sessions.where('playerId').equals(playerId).count();
  },

  /**
   * Delete session
   */
  async deleteSession(id: string): Promise<void> {
    await db.progress.where('sessionId').equals(id).delete();
    await db.sessions.delete(id);
  },
};

/**
 * Progress Service - Track phoneme learning progress
 */
export const progressService = {
  /**
   * Record phoneme attempt
   */
  async recordAttempt(
    sessionId: string,
    phonemeId: string,
    isCorrect: boolean
  ): Promise<void> {
    const existing = await db.progress
      .where('sessionId')
      .equals(sessionId)
      .and((p) => p.phonemeId === phonemeId)
      .first();

    if (existing) {
      existing.attempts += 1;
      existing.timestamp = new Date();
      if (isCorrect && !existing.isCorrect) {
        existing.isCorrect = true;
      }
      await db.progress.put(existing);
    } else {
      const progress: SessionProgress = {
        sessionId,
        phonemeId,
        isCorrect,
        attempts: 1,
        timestamp: new Date(),
      };
      await db.progress.add(progress);
    }
  },

  /**
   * Get progress for a session
   */
  async getSessionProgress(sessionId: string): Promise<SessionProgress[]> {
    return db.progress.where('sessionId').equals(sessionId).toArray();
  },

  /**
   * Get phoneme stats for a player
   */
  async getPhonemeStats(
    playerId: string,
    phonemeId: string
  ): Promise<{
    totalAttempts: number;
    correctAttempts: number;
    accuracy: number;
  }> {
    const sessions = await db.sessions
      .where('playerId')
      .equals(playerId)
      .toArray();

    const sessionIds = sessions.map((s) => s.id);

    let totalAttempts = 0;
    let correctAttempts = 0;

    for (const sessionId of sessionIds) {
      const progress = await db.progress
        .where('sessionId')
        .equals(sessionId)
        .and((p) => p.phonemeId === phonemeId)
        .first();

      if (progress) {
        totalAttempts += progress.attempts;
        if (progress.isCorrect) {
          correctAttempts += progress.attempts;
        }
      }
    }

    const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

    return {
      totalAttempts,
      correctAttempts,
      accuracy: Math.round(accuracy),
    };
  },

  /**
   * Clear all data (for testing)
   */
  async clearAll(): Promise<void> {
    await db.players.clear();
    await db.sessions.clear();
    await db.progress.clear();
  },
};
