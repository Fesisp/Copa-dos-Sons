# Phoneme Cup (Copa dos Sons) - Autonomous AI Edition

## Offline-First Educational PWA with an Absolute Autonomous Agent as a Second Player

**Short Description:** A premium offline educational web app designed for Brazilian Portuguese literacy. Features a fully autonomous, local AI agent (Klayton) that acts as a smart second player for cooperative and competitive phoneme-building matches.

## Core Stack

- React + TypeScript
- Zustand (`gameStore`) + Immer
- Dexie (`databaseService`) for IndexedDB persistence
- Howler (`audioManager`) with audio sprite
- Framer Motion for touch-first drag physics
- Tailwind CSS
- Vite + `vite-plugin-pwa` (Workbox)

## Product Modules

- **Official Match Loop:** guided phoneme/word challenges with progression.
- **Album:** persistent unlock state for phoneme cards.
- **Tactical Board (UGC):** local creation and storage of custom words.
- **Championship:** local AI-assisted mode with autonomous agent Klayton.
- **Technical Report:** protected teacher dashboard with PIN gateway.

## Offline-First Guarantees

- Full local persistence with IndexedDB (Dexie).
- Workbox precache + runtime cache strategy for JS/CSS/HTML/images/audio/json.
- Dedicated long-term cache for core audio sprite assets.
- No external backend required for gameplay.

## Local Development

```powershell
Set-Location "c:\Users\mrfel\OneDrive\Laboratorio\VSCode\Copa dos Sons"
npm install
npm run dev
```

## Production Build

```powershell
Set-Location "c:\Users\mrfel\OneDrive\Laboratorio\VSCode\Copa dos Sons"
npm run lint
npm run build
npm run preview
```

## Audio Sprite Pipeline

```powershell
Set-Location "c:\Users\mrfel\OneDrive\Laboratorio\VSCode\Copa dos Sons"
node scripts/generate-sprite.js
```

Expected outputs:

- `public/audio/phonemes-sprite.mp3`
- `public/audio/phonemes-index.json`

## PWA Validation Checklist

1. Build the app and open it once online.
2. Switch browser network to Offline.
3. Re-open core flows (`Locker Room -> Match -> Board -> Championship`).
4. Confirm persisted progress and audio playback still work.

## License

Educational use project for literacy scenarios. See repository policy for distribution details.
