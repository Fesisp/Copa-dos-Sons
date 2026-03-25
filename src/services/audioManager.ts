/**
 * Audio Manager Service
 * Centralized audio handling with Audio Sprite support
 * Uses Howler.js for cross-browser audio playback
 */

import { Howl } from 'howler';
import type { AudioIndex, AudioManagerConfig } from '../types';

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
      this.audioIndex = await response.json();
    } catch {
      console.warn('Audio index not found, using default mock data');
      // Use mock data if file not found
      this.audioIndex = this.getMockAudioIndex();
    }
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
    this.howl = new Howl({
      src: [this.config.spriteUrl],
      sprite: this.audioIndex as unknown as Record<string, [number, number]>,
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

    if (!(phonemeKey in this.audioIndex)) {
      console.warn(`Phoneme key "${phonemeKey}" not found in audio index`);
      return;
    }

    // Stop any currently playing audio
    this.howl.stop();

    // Play the sprite
    return new Promise((resolve) => {
      this.howl!.play(phonemeKey);
      
      // Resolve when audio finishes or after max duration
      const duration = this.audioIndex[phonemeKey].duration;
      setTimeout(() => resolve(), duration + 100);
    });
  }

  /**
   * Play success feedback sound
   */
  async playSuccessSound(): Promise<void> {
    // Placeholder for success sound
    console.log('🎵 Success sound would play here');
    return new Promise((resolve) => setTimeout(resolve, 500));
  }

  /**
   * Play error feedback sound
   */
  async playErrorSound(): Promise<void> {
    // Placeholder for error sound
    console.log('❌ Error sound would play here');
    return new Promise((resolve) => setTimeout(resolve, 500));
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
