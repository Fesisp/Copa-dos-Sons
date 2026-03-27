/**
 * Zustand Store - Global State Management
 * Clean-slate Craque Fônico inventory and match state
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Card, GameStore, OfficialMatch, Player } from '../types';
import { audioManager } from '../services/audioManager';
import { playerService } from '../services/databaseService';

const INITIAL_UNLOCKED = ['a', 'e', 'i', 'o', 'u'];

const normalizeToken = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');

const DEFAULT_CARDS: Card[] = [
  { id: 'a', phoneme: 'a', audioKey: 'a', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png', isVowel: true },
  { id: 'e', phoneme: 'e', audioKey: 'e', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png', isVowel: true },
  { id: 'i', phoneme: 'i', audioKey: 'i', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png', isVowel: true },
  { id: 'o', phoneme: 'o', audioKey: 'o', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png', isVowel: true },
  { id: 'u', phoneme: 'u', audioKey: 'u', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png', isVowel: true },
  { id: 'b', phoneme: 'b', audioKey: 'b', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png' },
  { id: 'p', phoneme: 'p', audioKey: 'p', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png' },
  { id: 'm', phoneme: 'm', audioKey: 'm', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png' },
  { id: 't', phoneme: 't', audioKey: 't', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png' },
  { id: 'f', phoneme: 'f', audioKey: 'f', leagueTier: 'serie-b', imageUrl: '/images/placeholder.png' },
  { id: 'v', phoneme: 'v', audioKey: 'v', leagueTier: 'serie-b', imageUrl: '/images/placeholder.png' },
  { id: 's', phoneme: 's', audioKey: 's', leagueTier: 'serie-b', imageUrl: '/images/placeholder.png' },
  { id: 'z', phoneme: 'z', audioKey: 'z', leagueTier: 'serie-b', imageUrl: '/images/placeholder.png' },
  { id: 'ch', phoneme: 'ch', audioKey: 'ch', leagueTier: 'serie-a', imageUrl: '/images/placeholder.png' },
  { id: 'nh', phoneme: 'nh', audioKey: 'nh', leagueTier: 'serie-a', imageUrl: '/images/placeholder.png' },
  { id: 'lh', phoneme: 'lh', audioKey: 'lh', leagueTier: 'serie-a', imageUrl: '/images/placeholder.png' },
  { id: 'rr', phoneme: 'rr', audioKey: 'rr', leagueTier: 'serie-a', imageUrl: '/images/placeholder.png' },
];

const initialState = {
  currentScreen: 'vestiario' as const,
  matchStatus: 'idle' as const,
  currentMatchSource: 'official' as const,
  currentPlayer: null,
  cardsCatalog: DEFAULT_CARDS,
  currentOfficialMatch: null,
  targetWord: [] as string[],
  availableCards: [] as string[],
  assembledSlots: [] as Array<string | null>,
  crowdDelta: 0,
  isAudioPlaying: false,
  selectedCommunityWordId: null as string | null,
};

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    ...initialState,

    setScreen: (screen) => {
      set((state) => {
        state.currentScreen = screen;
      });
    },

    setCurrentPlayer: (player) => {
      set((state) => {
        state.currentPlayer = player;
      });
    },

    initializePlayerInventory: (playerName: string): Player => {
      const player: Player = {
        id: `player_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        name: playerName,
        createdAt: new Date(),
        lastPlayedAt: new Date(),
        crowd: 0,
        leagueTier: 'serie-c',
        unlockedPhonemes: [...INITIAL_UNLOCKED],
        completedOfficialMatchIds: [],
      };

      set((state) => {
        state.currentPlayer = player;
      });

      return player;
    },

    setCardsCatalog: (cards) => {
      set((state) => {
        state.cardsCatalog = cards;
      });
    },

    startOfficialMatch: (match: OfficialMatch) => {
      const shuffled = [...match.targetWord].sort(() => Math.random() - 0.5);

      set((state) => {
        state.currentMatchSource = 'official';
        state.matchStatus = 'playing';
        state.currentOfficialMatch = match;
        state.targetWord = [...match.targetWord];
        state.availableCards = shuffled;
        state.assembledSlots = new Array(match.targetWord.length).fill(null);
        state.crowdDelta = 0;
        state.selectedCommunityWordId = null;
        state.currentScreen = 'match';
      });
    },

    startCommunityMatch: (wordArray: string[], customWordId: string) => {
      const normalized = wordArray.map((item) => normalizeToken(item)).filter(Boolean);
      const shuffled = [...normalized].sort(() => Math.random() - 0.5);

      set((state) => {
        state.currentMatchSource = 'community';
        state.matchStatus = 'playing';
        state.currentOfficialMatch = null;
        state.targetWord = normalized;
        state.availableCards = shuffled;
        state.assembledSlots = new Array(normalized.length).fill(null);
        state.selectedCommunityWordId = customWordId;
        state.crowdDelta = 0;
        state.currentScreen = 'match';
      });
    },

    handleDrop: (phonemeId: string, slotIndex: number) => {
      const state = get();

      if (state.matchStatus !== 'playing') {
        return false;
      }

      if (slotIndex < 0 || slotIndex >= state.targetWord.length) {
        return false;
      }

      if (state.assembledSlots[slotIndex] !== null) {
        return false;
      }

      const normalized = normalizeToken(phonemeId);
      const expected = normalizeToken(state.targetWord[slotIndex]);
      const isCorrect = normalized === expected;

      set((draft) => {
        if (isCorrect) {
          draft.assembledSlots[slotIndex] = expected;
          draft.crowdDelta += 100;

          const consumedIndex = draft.availableCards.findIndex(
            (item) => normalizeToken(item) === normalized
          );
          if (consumedIndex >= 0) {
            draft.availableCards.splice(consumedIndex, 1);
          }
        }
      });

      if (isCorrect) {
        void get().checkWordCompletion();
      }

      return isCorrect;
    },

    checkWordCompletion: () => {
      const state = get();

      if (state.matchStatus !== 'playing') {
        return false;
      }

      const isCompleted =
        state.assembledSlots.length > 0 &&
        state.assembledSlots.every((slot, index) => slot === state.targetWord[index]);

      if (isCompleted) {
        set((draft) => {
          draft.matchStatus = 'victory';
        });

        const { currentOfficialMatch, currentPlayer } = get();

        if (state.currentMatchSource === 'official' && currentOfficialMatch?.rewardCardId) {
          get().unlockPhoneme(currentOfficialMatch.rewardCardId);
        }

        if (currentPlayer) {
          void playerService.addCrowd(currentPlayer.id, state.crowdDelta);
        }

        void audioManager.playGoalSound();
      }

      return isCompleted;
    },

    unlockPhoneme: (phonemeId: string) => {
      const normalized = normalizeToken(phonemeId);

      set((state) => {
        if (!state.currentPlayer) return;

        if (!state.currentPlayer.unlockedPhonemes.includes(normalized)) {
          state.currentPlayer.unlockedPhonemes.push(normalized);
        }
      });

      const player = get().currentPlayer;
      if (player) {
        void playerService.unlockPhoneme(player.id, normalized);
      }
    },

    addCrowd: (amount: number) => {
      set((state) => {
        if (!state.currentPlayer) return;
        state.currentPlayer.crowd = Math.max(0, state.currentPlayer.crowd + amount);
      });

      const player = get().currentPlayer;
      if (player) {
        void playerService.addCrowd(player.id, amount);
      }
    },

    resetCurrentMatch: () => {
      set((state) => {
        state.matchStatus = 'idle';
        state.currentOfficialMatch = null;
        state.targetWord = [];
        state.availableCards = [];
        state.assembledSlots = [];
        state.crowdDelta = 0;
        state.selectedCommunityWordId = null;
      });
    },
  }))
);
