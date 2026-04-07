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

## CI Pipeline

Every push and pull request triggers GitHub Actions in `.github/workflows/main.yml` with the sequence: `Linter -> Testes E2E -> Build`.

## Teacher PIN (Hashed)

For the protected teacher dashboard, configure the SHA-256 hash of the school PIN:

```dotenv
VITE_TEACHER_REPORT_PIN_SHA256=<64-char lowercase hex>
```

Generate the hash from a 4-8 digit PIN:

```powershell
npm run teacher:pin-hash -- 1234
```

## End-to-End Testing

```powershell
Set-Location "c:\Users\mrfel\OneDrive\Laboratorio\VSCode\Copa dos Sons"
npm run e2e
npm run e2e:headed
```

## Docker (Multi-Stage)

```powershell
Set-Location "c:\Users\mrfel\OneDrive\Laboratorio\VSCode\Copa dos Sons"
docker build -t copa-dos-sons:latest .
docker run --rm -p 8080:80 copa-dos-sons:latest
```

## Lighthouse Audit (PWA)

```powershell
Set-Location "c:\Users\mrfel\OneDrive\Laboratorio\VSCode\Copa dos Sons"
npm run build
npm run preview
npx lighthouse http://localhost:4173 --preset=desktop --only-categories=performance,accessibility,best-practices,pwa --output=html --output-path=./docs/lighthouse-report.html
```

## License

Educational use project for literacy scenarios. See repository policy for distribution details.
