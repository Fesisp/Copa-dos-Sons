/**
 * Dexie Database Service
 * Clean-slate offline persistence for Craque Fônico
 */

import Dexie, { type Table } from 'dexie';
import type { Player, CustomWord } from '../types';

const INITIAL_UNLOCKED = ['a', 'e', 'i', 'o', 'u'];
const MIN_VOTES_FOR_RANKING = 3;

/**
 * Dexie Database Schema
 */
export class CopaDosSonsDB extends Dexie {
  players!: Table<Player>;
  customWords!: Table<CustomWord>;

  constructor() {
    super('copa-dos-sons');
    this.version(1).stores({
      players: 'id, name, createdAt',
      customWords: 'id, creatorName, createdAt, totalMatches, golacos, faltas',
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
    const normalizedName = name.trim();
    if (!normalizedName) {
      throw new Error('Nome do jogador é obrigatório');
    }

    const existing = await db.players
      .where('name')
      .equalsIgnoreCase(normalizedName)
      .first();

    if (existing) {
      existing.lastPlayedAt = new Date();
      await db.players.put(existing);
      return existing;
    }

    const newPlayer: Player = {
      id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: normalizedName,
      createdAt: new Date(),
      lastPlayedAt: new Date(),
      crowd: 0,
      leagueTier: 'serie-c',
      unlockedPhonemes: [...INITIAL_UNLOCKED],
      completedOfficialMatchIds: [],
    };

    await db.players.add(newPlayer);
    return newPlayer;
  },

  async savePlayer(player: Player): Promise<void> {
    await db.players.put({ ...player, lastPlayedAt: new Date() });
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
    return db.players.orderBy('lastPlayedAt').reverse().toArray();
  },

  async unlockPhoneme(playerId: string, phonemeId: string): Promise<void> {
    const player = await db.players.get(playerId);
    if (!player) return;

    if (!player.unlockedPhonemes.includes(phonemeId)) {
      player.unlockedPhonemes.push(phonemeId);
      player.lastPlayedAt = new Date();
      await db.players.put(player);
    }
  },

  async addCrowd(playerId: string, amount: number): Promise<void> {
    const player = await db.players.get(playerId);
    if (!player) return;

    player.crowd = Math.max(0, player.crowd + amount);
    player.lastPlayedAt = new Date();

    await db.players.put(player);
  },

  async markOfficialMatchCompleted(playerId: string, matchId: string): Promise<void> {
    const player = await db.players.get(playerId);
    if (!player) return;

    if (!player.completedOfficialMatchIds.includes(matchId)) {
      player.completedOfficialMatchIds.push(matchId);
      player.lastPlayedAt = new Date();
      await db.players.put(player);
    }
  },
};

/**
 * Custom Word Service - Manage class-created challenge words
 */
export const customWordService = {
  /**
   * Save a new custom challenge word
   */
  async saveCustomWord(wordArray: string[], creatorName: string): Promise<CustomWord> {
    const normalizedWordArray = wordArray
      .map((item) => item.trim().toLowerCase())
      .filter((item) => item.length > 0);

    if (normalizedWordArray.length === 0) {
      throw new Error('A palavra precisa ter ao menos um fonema');
    }

    const customWord: CustomWord = {
      id: `word_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      wordArray: normalizedWordArray,
      creatorName,
      createdAt: new Date(),
      golacos: 0,
      faltas: 0,
      totalMatches: 0,
    };

    await db.customWords.add(customWord);
    return customWord;
  },

  /**
   * List all challenge words, newest first
   */
  async getAllCustomWords(): Promise<CustomWord[]> {
    return db.customWords.orderBy('createdAt').reverse().toArray();
  },

  async voteWord(wordId: string, vote: 'golaco' | 'falta'): Promise<void> {
    const existing = await db.customWords.get(wordId);
    if (!existing) return;

    if (vote === 'golaco') {
      existing.golacos += 1;
    } else {
      existing.faltas += 1;
    }
    existing.totalMatches += 1;

    await db.customWords.put(existing);
  },

  async getRankedWords(): Promise<Array<CustomWord & { approvalRate: number }>> {
    const words = await db.customWords.toArray();

    return words
      .filter((word) => word.totalMatches >= MIN_VOTES_FOR_RANKING)
      .map((word) => {
        const totalVotes = word.golacos + word.faltas;
        const approvalRate = totalVotes > 0 ? (word.golacos / totalVotes) * 100 : 0;
        return { ...word, approvalRate };
      })
      .sort((left, right) => {
        if (right.approvalRate !== left.approvalRate) {
          return right.approvalRate - left.approvalRate;
        }

        return right.totalMatches - left.totalMatches;
      });
  },
};

export const debugService = {
  async clearAll(): Promise<void> {
    await db.players.clear();
    await db.customWords.clear();
  },
};
