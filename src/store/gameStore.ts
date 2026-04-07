/**
 * Zustand Store - Global State Management
 * Clean-slate Craque Fônico inventory and match state
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Card, GameStore, OfficialMatch, Player } from '../types';
import { audioManager } from '../services/audioManager';
import { celebrationService } from '../services/celebrationService';
import { playerService } from '../services/databaseService';
import { agentService } from '../services/autonomousAgent';
import {
  canAttachPhoneme,
  inferDifficultyPhaseByProgress,
  isTokenUnlockedForPhase,
  normalizePhonemeToken,
} from '../config/phonotactics';

const INITIAL_UNLOCKED = ['a', 'e', 'i', 'o', 'u'];
const DEFAULT_MAX_ASSEMBLY_SLOTS = 6;

const normalizeToken = normalizePhonemeToken;

const randomize = <T>(items: T[]): T[] => [...items].sort(() => Math.random() - 0.5);

const withIntruders = (target: string[], cardPool: string[], amount = 2): string[] => {
  const normalizedTarget = new Set(target.map((item) => normalizeToken(item)));
  const intruders = cardPool
    .filter((item) => !normalizedTarget.has(normalizeToken(item)))
    .slice(0, Math.max(0, amount));

  return randomize([...target, ...intruders]);
};

const DEFAULT_CARDS: Card[] = [
  { id: 'a', phoneme: 'a', audioKey: 'a', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png', isVowel: true },
  { id: 'b', phoneme: 'b', audioKey: 'b', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png' },
  { id: 'c', phoneme: 'c', audioKey: 'k', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png' },
  { id: 'ch', phoneme: 'ch', audioKey: 'ch', leagueTier: 'serie-a', imageUrl: '/images/placeholder.png' },
  { id: 'd', phoneme: 'd', audioKey: 'd', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png' },
  { id: 'e', phoneme: 'e', audioKey: 'e', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png', isVowel: true },
  { id: 'em', phoneme: 'em', audioKey: 'em', leagueTier: 'serie-b', imageUrl: '/images/placeholder.png' },
  { id: 'f', phoneme: 'f', audioKey: 'f', leagueTier: 'serie-b', imageUrl: '/images/placeholder.png' },
  { id: 'g', phoneme: 'g', audioKey: 'g', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png' },
  { id: 'i', phoneme: 'i', audioKey: 'i', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png', isVowel: true },
  { id: 'im', phoneme: 'im', audioKey: 'im', leagueTier: 'serie-b', imageUrl: '/images/placeholder.png' },
  { id: 'j', phoneme: 'j', audioKey: 'j', leagueTier: 'serie-b', imageUrl: '/images/placeholder.png' },
  { id: 'k', phoneme: 'k', audioKey: 'k', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png' },
  { id: 'l', phoneme: 'l', audioKey: 'l', leagueTier: 'serie-b', imageUrl: '/images/placeholder.png' },
  { id: 'lh', phoneme: 'lh', audioKey: 'lh', leagueTier: 'serie-a', imageUrl: '/images/placeholder.png' },
  { id: 'p', phoneme: 'p', audioKey: 'p', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png' },
  { id: 'm', phoneme: 'm', audioKey: 'm', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png' },
  { id: 'n', phoneme: 'n', audioKey: 'n', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png' },
  { id: 'nh', phoneme: 'nh', audioKey: 'nh', leagueTier: 'serie-a', imageUrl: '/images/placeholder.png' },
  { id: 'o', phoneme: 'o', audioKey: 'o', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png', isVowel: true },
  { id: 'on', phoneme: 'on', audioKey: 'on', leagueTier: 'serie-a', imageUrl: '/images/placeholder.png' },
  { id: 'an', phoneme: 'an', audioKey: 'an', leagueTier: 'serie-a', imageUrl: '/images/placeholder.png' },
  { id: 't', phoneme: 't', audioKey: 't', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png' },
  { id: 'r', phoneme: 'r', audioKey: 'r', leagueTier: 'serie-b', imageUrl: '/images/placeholder.png' },
  { id: 'rr', phoneme: 'rr', audioKey: 'rr', leagueTier: 'serie-a', imageUrl: '/images/placeholder.png' },
  { id: 's', phoneme: 's', audioKey: 's', leagueTier: 'serie-b', imageUrl: '/images/placeholder.png' },
  { id: 'u', phoneme: 'u', audioKey: 'u', leagueTier: 'serie-c', imageUrl: '/images/placeholder.png', isVowel: true },
  { id: 'um', phoneme: 'um', audioKey: 'um', leagueTier: 'serie-a', imageUrl: '/images/placeholder.png' },
  { id: 'v', phoneme: 'v', audioKey: 'v', leagueTier: 'serie-b', imageUrl: '/images/placeholder.png' },
  { id: 'x', phoneme: 'x', audioKey: 'x', leagueTier: 'serie-b', imageUrl: '/images/placeholder.png' },
  { id: 'z', phoneme: 'z', audioKey: 'z', leagueTier: 'serie-b', imageUrl: '/images/placeholder.png' },
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
  gameplayMode: 'mission' as const,
  gameFocus: 'words' as const,
  difficultyPhase: 1 as const,
  maxAssemblySlots: DEFAULT_MAX_ASSEMBLY_SLOTS,
  missionCardPool: [] as string[],
  labAssemblySlots: [] as string[],
  lastAssemblyFeedback: null,
  isAgentTurn: false,
  agentMode: true,
  agentDifficulty: 'medium' as const,
  agentProfile: agentService.getAgentProfile(),
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
        state.difficultyPhase = inferDifficultyPhaseByProgress(player.completedOfficialMatchIds.length);
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
        state.difficultyPhase = 1;
      });

      return player;
    },

    setCardsCatalog: (cards) => {
      set((state) => {
        state.cardsCatalog = cards;
      });
    },

    startOfficialMatch: (match: OfficialMatch) => {
      const state = get();
      const unlockedSet = new Set(state.currentPlayer?.unlockedPhonemes ?? INITIAL_UNLOCKED);
      const allowedPool = state.cardsCatalog
        .filter((card) => unlockedSet.has(card.id))
        .map((card) => normalizeToken(card.audioKey))
        .filter((token) => isTokenUnlockedForPhase(token, state.difficultyPhase));

      const targetWord = match.targetWord
        .map((item) => normalizeToken(item))
        .slice(0, state.maxAssemblySlots);

      const missionPool = withIntruders(targetWord, allowedPool, Math.min(3, Math.max(1, targetWord.length - 1)));

      set((state) => {
        state.currentMatchSource = 'official';
        state.gameplayMode = 'mission';
        state.gameFocus = 'words';
        state.matchStatus = 'playing';
        state.currentOfficialMatch = match;
        state.targetWord = targetWord;
        state.availableCards = randomize(missionPool);
        state.missionCardPool = [...missionPool];
        state.assembledSlots = new Array(targetWord.length).fill(null);
        state.isAgentTurn = false;
        state.crowdDelta = 0;
        state.selectedCommunityWordId = null;
        state.lastAssemblyFeedback = null;
        state.currentScreen = 'match';
      });
    },

    startCommunityMatch: (wordArray: string[], customWordId: string) => {
      const normalized = wordArray.map((item) => normalizeToken(item)).filter(Boolean);
      const state = get();
      const trimmed = normalized.slice(0, state.maxAssemblySlots);
      const unlockedSet = new Set(state.currentPlayer?.unlockedPhonemes ?? INITIAL_UNLOCKED);
      const allowedPool = state.cardsCatalog
        .filter((card) => unlockedSet.has(card.id))
        .map((card) => normalizeToken(card.audioKey))
        .filter((token) => isTokenUnlockedForPhase(token, state.difficultyPhase));
      const missionPool = withIntruders(trimmed, allowedPool, Math.min(2, Math.max(1, trimmed.length - 1)));

      set((state) => {
        state.currentMatchSource = 'community';
        state.gameplayMode = 'mission';
        state.gameFocus = 'words';
        state.matchStatus = 'playing';
        state.currentOfficialMatch = null;
        state.targetWord = trimmed;
        state.availableCards = randomize(missionPool);
        state.missionCardPool = [...missionPool];
        state.assembledSlots = new Array(trimmed.length).fill(null);
        state.isAgentTurn = false;
        state.selectedCommunityWordId = customWordId;
        state.crowdDelta = 0;
        state.lastAssemblyFeedback = null;
        state.currentScreen = 'match';
      });
    },

    startLaboratoryMode: () => {
      set((state) => {
        state.gameplayMode = 'laboratory';
        state.gameFocus = 'phonemes';
        state.matchStatus = 'idle';
        state.currentMatchSource = 'community';
        state.currentOfficialMatch = null;
        state.targetWord = [];
        state.availableCards = [];
        state.assembledSlots = [];
        state.missionCardPool = [];
        state.isAgentTurn = false;
        state.lastAssemblyFeedback = null;
      });
    },

    setGameplayMode: (mode) => {
      set((state) => {
        state.gameplayMode = mode;
        state.gameFocus = mode === 'laboratory' ? 'phonemes' : 'words';
      });
    },

    setDifficultyPhase: (phase) => {
      set((state) => {
        state.difficultyPhase = phase;
      });
    },

    setAgentMode: (enabled) => {
      set((state) => {
        state.agentMode = enabled;
        state.isAgentTurn = false;
      });
    },

    setAgentDifficulty: (difficulty) => {
      agentService.setDifficulty(difficulty);
      set((state) => {
        state.agentDifficulty = difficulty;
      });
    },

    passTurn: () => {
      set((state) => {
        state.isAgentTurn = !state.isAgentTurn;
      });

      const current = get();
      if (current.isAgentTurn && current.agentMode) {
        window.setTimeout(() => {
          get().executeAgentMove();
        }, 1500);
      }
    },

    executeAgentMove: () => {
      const state = get();

      if (!state.agentMode || !state.isAgentTurn || state.matchStatus !== 'playing') {
        return;
      }

      const firstOpenSlot = state.assembledSlots.findIndex((slot) => slot === null);
      if (firstOpenSlot < 0) {
        set((draft) => {
          draft.isAgentTurn = false;
        });
        return;
      }

      const availablePhonemes = state.availableCards
        .map((token, index) => {
          const normalized = normalizeToken(token);
          const known = state.cardsCatalog.find(
            (card) => normalizeToken(card.audioKey) === normalized || normalizeToken(card.id) === normalized
          );

          if (!known) {
            return null;
          }

          return {
            ...known,
            id: `${known.id}-agent-${index}`,
          };
        })
        .filter((item): item is Card => item !== null);

      const currentBoard = state.assembledSlots
        .filter((slot): slot is string => !!slot)
        .map((slot, index) => {
          const normalized = normalizeToken(slot);
          const known = state.cardsCatalog.find(
            (card) => normalizeToken(card.audioKey) === normalized || normalizeToken(card.id) === normalized
          );

          return (
            known ?? {
              id: `${normalized}-board-${index}`,
              phoneme: normalized,
              audioKey: normalized,
              leagueTier: 'serie-c' as const,
              imageUrl: '/images/placeholder.png',
            }
          );
        });

      const move = agentService.calculateNextMove(availablePhonemes, currentBoard, {
        targetWord: state.targetWord,
        slotIndex: firstOpenSlot,
        phase: state.difficultyPhase,
      });

      if (move) {
        const didPlay = get().handleDrop(move.audioKey, firstOpenSlot);
        if (didPlay) {
          void audioManager.playUiTapSound();
        } else {
          void audioManager.playNearMissSound();
        }
      }

      set((draft) => {
        draft.isAgentTurn = false;
      });
    },

    handleDrop: (phonemeId: string, slotIndex: number) => {
      const state = get();

      if (state.matchStatus !== 'playing') {
        return false;
      }

      if (slotIndex < 0 || slotIndex >= state.targetWord.length) {
        set((draft) => {
          draft.lastAssemblyFeedback = {
            reason: 'invalid_drop',
            message: 'Essa jogada saiu da área válida.',
            token: normalizeToken(phonemeId),
            timestamp: Date.now(),
          };
        });
        return false;
      }

      if (state.assembledSlots[slotIndex] !== null) {
        set((draft) => {
          draft.lastAssemblyFeedback = {
            reason: 'occupied_slot',
            message: 'Este espaço já está ocupado.',
            token: normalizeToken(phonemeId),
            timestamp: Date.now(),
          };
        });
        return false;
      }

      const normalized = normalizeToken(phonemeId);
      const expected = normalizeToken(state.targetWord[slotIndex]);
      const leftNeighbor = slotIndex > 0 ? state.assembledSlots[slotIndex - 1] : null;
      const rightNeighbor = slotIndex < state.assembledSlots.length - 1 ? state.assembledSlots[slotIndex + 1] : null;
      const leftAllowed = canAttachPhoneme(leftNeighbor, normalized, 3, { enforcePhasePattern: false });
      const rightAllowed = rightNeighbor
        ? canAttachPhoneme(normalized, rightNeighbor, 3, { enforcePhasePattern: false })
        : true;

      if (!leftAllowed || !rightAllowed) {
        set((draft) => {
          draft.lastAssemblyFeedback = {
            reason: 'invalid_adjacency',
            message: 'Combinação fonêmica impossível neste ponto.',
            token: normalized,
            timestamp: Date.now(),
          };
        });
        return false;
      }

      const isCorrect = normalized === expected;

      set((draft) => {
        if (isCorrect) {
          draft.assembledSlots[slotIndex] = expected;
          draft.crowdDelta += 100;
          draft.lastAssemblyFeedback = null;

          const consumedIndex = draft.availableCards.findIndex(
            (item) => normalizeToken(item) === normalized
          );
          if (consumedIndex >= 0) {
            draft.availableCards.splice(consumedIndex, 1);
          }
        } else {
          draft.lastAssemblyFeedback = {
            reason: 'wrong_slot',
            message: 'Peça válida, mas no lugar incorreto da missão.',
            token: normalized,
            timestamp: Date.now(),
          };
        }
      });

      if (isCorrect) {
        void get().checkWordCompletion();
      }

      return isCorrect;
    },

    appendLabPhoneme: (phonemeId: string) => {
      const state = get();
      const normalized = normalizeToken(phonemeId);

      if (!isTokenUnlockedForPhase(normalized, state.difficultyPhase)) {
        set((draft) => {
          draft.lastAssemblyFeedback = {
            reason: 'phase_locked',
            message: 'Esse fonema será liberado nas próximas fases.',
            token: normalized,
            timestamp: Date.now(),
          };
        });
        return false;
      }

      if (state.labAssemblySlots.length >= state.maxAssemblySlots) {
        set((draft) => {
          draft.lastAssemblyFeedback = {
            reason: 'slot_limit',
            message: `Limite de ${state.maxAssemblySlots} slots atingido.`,
            token: normalized,
            timestamp: Date.now(),
          };
        });
        return false;
      }

      const previousToken = state.labAssemblySlots[state.labAssemblySlots.length - 1] ?? null;
      const canAttach = canAttachPhoneme(previousToken, normalized, state.difficultyPhase, {
        enforcePhasePattern: true,
      });

      if (!canAttach) {
        set((draft) => {
          draft.lastAssemblyFeedback = {
            reason: 'invalid_adjacency',
            message: 'Esta junção não forma estrutura pronunciável nesta fase.',
            token: normalized,
            timestamp: Date.now(),
          };
        });
        return false;
      }

      set((draft) => {
        draft.labAssemblySlots.push(normalized);
        draft.lastAssemblyFeedback = null;
      });

      return true;
    },

    removeLastLabPhoneme: () => {
      set((state) => {
        state.labAssemblySlots.pop();
        state.lastAssemblyFeedback = null;
      });
    },

    clearLabAssembly: () => {
      set((state) => {
        state.labAssemblySlots = [];
        state.lastAssemblyFeedback = null;
      });
    },

    clearMatchAssembly: () => {
      set((state) => {
        if (state.targetWord.length === 0) return;

        state.assembledSlots = new Array(state.targetWord.length).fill(null);
        state.availableCards = [...state.missionCardPool];
        state.lastAssemblyFeedback = null;
      });
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
        const officialReward =
          state.currentMatchSource === 'official' && state.currentOfficialMatch
            ? state.currentOfficialMatch.crowdReward
            : 0;

        set((draft) => {
          draft.matchStatus = 'victory';
          draft.crowdDelta += officialReward;
        });

        const { currentOfficialMatch, currentPlayer, crowdDelta } = get();

        if (state.currentMatchSource === 'official' && currentOfficialMatch?.rewardCardId) {
          get().unlockPhoneme(currentOfficialMatch.rewardCardId);
        }

        if (state.currentMatchSource === 'official' && currentOfficialMatch?.id) {
          set((draft) => {
            if (!draft.currentPlayer) return;

            if (!draft.currentPlayer.completedOfficialMatchIds.includes(currentOfficialMatch.id)) {
              draft.currentPlayer.completedOfficialMatchIds.push(currentOfficialMatch.id);
            }
          });

          if (currentPlayer) {
            void playerService.markOfficialMatchCompleted(currentPlayer.id, currentOfficialMatch.id);
          }

          const completedCount = (currentPlayer?.completedOfficialMatchIds.length ?? 0) + 1;
          const nextPhase = inferDifficultyPhaseByProgress(completedCount);
          set((draft) => {
            draft.difficultyPhase = nextPhase;
          });
        }

        if (currentPlayer && crowdDelta > 0) {
          get().addCrowd(crowdDelta);
        }

        void audioManager.play('acerto');
        celebrationService.goalExplosion();
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
        state.missionCardPool = [];
        state.assembledSlots = [];
        state.isAgentTurn = false;
        state.crowdDelta = 0;
        state.selectedCommunityWordId = null;
        state.lastAssemblyFeedback = null;
      });
    },
  }))
);
