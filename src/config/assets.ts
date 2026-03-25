/**
 * Mock Audio Index Configuration
 * This file should be replaced with actual audio sprite indices
 * when real audio assets are integrated
 * 
 * Structure expected in /public/audio/phonemes-index.json:
 * {
 *   "phoneme": { "start": milliseconds, "duration": milliseconds },
 *   ...
 * }
 */

export const mockAudioIndex = {
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

/**
 * INSTRUCTIONS FOR FINAL ASSET INTEGRATION:
 * 
 * 1. CREATE AUDIO SPRITE:
 *    - Combine all phoneme audio files (.mp3, .wav) into one large file
 *    - Total duration should be calculated from all phoneme durations
 *    - Save as: /public/audio/phonemes-sprite.mp3
 * 
 * 2. GENERATE AUDIO INDEX:
 *    - Create JSON file at: /public/audio/phonemes-index.json
 *    - Update start times and durations for each phoneme
 *    - Follow the structure above
 * 
 * 3. CREATE IMAGES:
 *    - Easy phonemes: /public/images/easy/{phoneme}.png (e.g., p.png, b.png)
 *    - Medium phonemes: /public/images/medium/{phoneme}.png
 *    - Hard phonemes: /public/images/hard/{phoneme}.png
 *    - Placeholder: /public/images/placeholder.png
 * 
 * 4. CREATE PWA ICONS:
 *    - /public/icon-192x192.png
 *    - /public/icon-512x512.png
 *    - /public/maskable-icon.png (for adaptive icons)
 * 
 * 5. OPTIONAL: ADD APP ICONS
 *    - /public/favicon.ico
 *    - /public/apple-touch-icon.png
 */

export const assetRequirements = {
  audio: {
    sprite: '/public/audio/phonemes-sprite.mp3',
    index: '/public/audio/phonemes-index.json',
    format: 'mp3 or wav',
    totalPhonemesEasy: 13, // p, b, m, t, d, n, k, g, a, e, i, o, u
    totalPhonemesMedium: 8, // f, v, s, z, r, l, ɛ, ɔ
    totalPhonemesHard: 8, // ch, j, x, nh, lh, rr, ã, õ
    estimatedTotalDuration: 27000, // milliseconds (27 seconds for all phonemes)
  },
  images: {
    easyFolder: '/public/images/easy/',
    mediumFolder: '/public/images/medium/',
    hardFolder: '/public/images/hard/',
    imagesPerPhoneme: 3,
    format: 'png or jpg',
    recommendedSize: '512x512px',
    placeholder: '/public/images/placeholder.png',
  },
  icons: {
    icon192: '/public/icon-192x192.png',
    icon512: '/public/icon-512x512.png',
    maskable: '/public/maskable-icon.png',
    favicon: '/public/favicon.ico',
    appleTouchIcon: '/public/apple-touch-icon.png',
  },
};
