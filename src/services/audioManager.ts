/**
 * Audio Manager Service
 * Centralized audio handling with Audio Sprite support
 * Uses Howler.js for cross-browser audio playback
 */

import { Howl } from 'howler';
import type { AudioIndex, AudioManagerConfig } from '../types';

interface AudioSpriteHowlerEntry {
  start: number;
  end: number;
  loop?: boolean;
}

interface AudioSpriteHowlerJson {
  resources?: string[];
  spritemap?: Record<string, AudioSpriteHowlerEntry>;
}

const keyAliases: Record<string, string[]> = {
  'ɛ': ['e', 'eh'],
  'ɔ': ['o', 'oh'],
  'ã': ['an', 'am'],
  'õ': ['on', 'om'],
  x: ['ch'],
};

const nonPhonemeKeys = new Set(['acerto', 'erro', 'gol', 'comecar', 'completar', 'silence']);

const displayAliases: Record<string, string> = {
  an: 'ã',
  on: 'õ',
};

class AudioManager {
  private howl: Howl | null = null;
  private audioIndex: AudioIndex = {};
  private config: AudioManagerConfig;
  private isInitialized = false;

  constructor(config: Partial<AudioManagerConfig> = {}) {
    this.config = {
      spriteUrl: '/audio/phonemes-sprite.mp3',
      indexUrl: '/audio/phonemes-index.json',
      volume: 0.8,
      preload: true,
      ...config,
    };
  }

  /**
   * Initialize the Audio Manager
   * Load the audio sprite and index
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load audio index
      await this.loadAudioIndex();

      // Initialize Howler with sprite
      this.initializeHowler();

      this.isInitialized = true;
      console.log('✓ AudioManager initialized successfully');
    } catch (error) {
      console.error('✗ Failed to initialize AudioManager:', error);
      throw error;
    }
  }

  /**
   * Load audio index from JSON file
   */
  private async loadAudioIndex(): Promise<void> {
    try {
      const response = await fetch(this.config.indexUrl);
      if (!response.ok) {
        throw new Error(`Failed to load audio index: ${response.statusText}`);
      }
      const loadedIndex = (await response.json()) as AudioIndex | AudioSpriteHowlerJson;
      this.audioIndex = this.normalizeAudioIndex(loadedIndex);
    } catch {
      console.warn('Audio index not found, using default mock data');
      // Use mock data if file not found
      this.audioIndex = this.getMockAudioIndex();
    }
  }

  /**
   * Normalize supported audio index formats into internal start/duration map
   */
  private normalizeAudioIndex(index: AudioIndex | AudioSpriteHowlerJson): AudioIndex {
    if ('spritemap' in index && index.spritemap) {
      const normalized: AudioIndex = {};

      Object.entries(index.spritemap).forEach(([key, value]) => {
        normalized[key] = {
          start: value.start,
          duration: Math.max(0, value.end - value.start),
        };
      });

      return normalized;
    }

    return index as AudioIndex;
  }

  /**
   * Normalize incoming token to canonical audio key
   */
  private normalizeKeyToken(token: string): string {
    return token
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');
  }

  /**
   * Get mock audio index for development
   */
  private getMockAudioIndex(): AudioIndex {
    return {
      // Easy phonemes
      p: { start: 0, duration: 500 },
      b: { start: 600, duration: 500 },
      m: { start: 1200, duration: 500 },
      t: { start: 1800, duration: 500 },
      d: { start: 2400, duration: 500 },
      n: { start: 3000, duration: 500 },
      k: { start: 3600, duration: 500 },
      g: { start: 4200, duration: 500 },

      // Medium phonemes
      f: { start: 4800, duration: 500 },
      v: { start: 5400, duration: 500 },
      s: { start: 6000, duration: 500 },
      z: { start: 6600, duration: 500 },
      r: { start: 7200, duration: 500 },
      l: { start: 7800, duration: 500 },
      e: { start: 8400, duration: 500 },
      o: { start: 9000, duration: 500 },

      // Hard phonemes
      ch: { start: 9600, duration: 500 },
      j: { start: 10200, duration: 500 },
      x: { start: 10800, duration: 500 },
      nh: { start: 11400, duration: 500 },
      lh: { start: 12000, duration: 500 },
      rr: { start: 12600, duration: 500 },
      an: { start: 13200, duration: 500 },
      on: { start: 13800, duration: 500 },
    };
  }

  /**
   * Initialize Howler instance with sprite
   */
  private initializeHowler(): void {
    const spriteMap: Record<string, [number, number]> = {};

    Object.entries(this.audioIndex).forEach(([key, value]) => {
      spriteMap[key] = [value.start, value.duration];
    });

    this.howl = new Howl({
      src: [this.config.spriteUrl],
      sprite: spriteMap,
      volume: this.config.volume,
      preload: this.config.preload,
      onloaderror: (_soundId: number, error: unknown) => {
        console.error('Howler load error:', error);
      },
    });
  }

  /**
   * Play phoneme audio by key
   */
  async playPhoneme(phonemeKey: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.howl) {
      throw new Error('Howler not initialized');
    }

    const resolvedKey = this.resolveAudioKey(phonemeKey);

    if (!resolvedKey || !(resolvedKey in this.audioIndex)) {
      console.warn(`Phoneme key "${phonemeKey}" not found in audio index`);
      return;
    }

    // Stop any currently playing audio
    this.howl.stop();

    // Play the sprite
    return new Promise((resolve) => {
      this.howl!.play(resolvedKey);
      
      // Resolve when audio finishes or after max duration
      const duration = this.audioIndex[resolvedKey].duration;
      setTimeout(() => resolve(), duration + 100);
    });
  }

  /**
   * Resolve requested key to an available key in index
   */
  private resolveAudioKey(requestedKey: string): string | null {
    const normalized = this.normalizeKeyToken(requestedKey);

    if (normalized in this.audioIndex) {
      return normalized;
    }

    const aliases = keyAliases[normalized] ?? [];
    const match = aliases.find((alias) => alias in this.audioIndex);
    return match ?? null;
  }

  /**
   * Play a full word phoneme by phoneme
   */
  async playPhonemeSequence(phonemeKeys: string[], gapMs = 80): Promise<void> {
    for (const rawKey of phonemeKeys) {
      const key = this.normalizeKeyToken(rawKey);
      await this.playPhoneme(key);
      await new Promise((resolve) => setTimeout(resolve, gapMs));
    }
  }

  /**
   * Alias semântico para o Modo Criação
   */
  async playWord(wordArray: string[], gapMs = 80): Promise<void> {
    await this.playPhonemeSequence(wordArray, gapMs);
  }

  /**
   * Get available phoneme keys from loaded index
   */
  getAvailablePhonemeKeys(): string[] {
    return Object.keys(this.audioIndex)
      .filter((key) => !nonPhonemeKeys.has(key))
      .sort((a, b) => a.localeCompare(b));
  }

  /**
   * Presentational label for a key in UI
   */
  getDisplayLabel(key: string): string {
    return displayAliases[key] ?? key;
  }

  /**
   * Play success feedback sound
   */
  async playSuccessSound(): Promise<void> {
    await this.playPhoneme('acerto');
  }

  /**
   * Play error feedback sound
   */
  async playErrorSound(): Promise<void> {
    await this.playPhoneme('erro');
  }

  /**
   * Play goal feedback sound
   */
  async playGoalSound(): Promise<void> {
    await this.playPhoneme('gol');
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume));
    if (this.howl) {
      this.howl.volume(this.config.volume);
    }
  }

  /**
   * Mute/unmute
   */
  setMute(mute: boolean): void {
    if (this.howl) {
      this.howl.mute(mute);
    }
  }

  /**
   * Stop all audio
   */
  stopAll(): void {
    if (this.howl) {
      this.howl.stop();
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.howl) {
      this.howl.unload();
    }
    this.isInitialized = false;
  }

  /**
   * Get current initialization status
   */
  getStatus(): { isInitialized: boolean; hasAudio: boolean } {
    return {
      isInitialized: this.isInitialized,
      hasAudio: this.howl !== null,
    };
  }
}

// Export singleton instance
export const audioManager = new AudioManager();

// Export class for testing
export { AudioManager };
