# Copa dos Sons ⚽🔊

Aplicativo educacional gamificado para alfabetização fonêmica em português, com tema de futebol, jogabilidade por arrastar/soltar, criação de palavras da turma e funcionamento offline (PWA).

## Visão geral

- Hub principal no `Vestiário` com progresso da torcida e atalhos.
- `Meu Álbum` com grade de 31 cartas de fonemas (bloqueadas e liberadas).
- `Partida` com drag & drop no gramado, slots de montagem e feedback sensorial.
- `Prancheta` para criar táticas fonêmicas com cartas já desbloqueadas.
- `Campeonato` com ranking comunitário por aprovação e voto no VAR (👍/👎).
- Persistência local via Dexie/IndexedDB.
- PWA com Service Worker e cache de sprite de áudio para uso em tablets.

## Requisitos

- Node.js 20+
- npm 10+

## Configuração de ambiente

1. Copie o exemplo de variáveis:

```powershell
cd "c:\Users\mrfel\OneDrive\Laboratorio\VSCode\Copa dos Sons"
Copy-Item .env.example .env
```

2. Ajuste o PIN docente em `.env`:

- `VITE_TEACHER_REPORT_PIN` (4 a 8 dígitos)

Template para produção escolar:

- `.env.production.example`

## Executar localmente

```powershell
cd "c:\Users\mrfel\OneDrive\Laboratorio\VSCode\Copa dos Sons"
npm install
npm run dev
```

## Build de produção

```powershell
cd "c:\Users\mrfel\OneDrive\Laboratorio\VSCode\Copa dos Sons"
npm run build
npm run preview
```

## Pipeline de áudio

Gerar/atualizar o sprite de áudio:

```powershell
cd "c:\Users\mrfel\OneDrive\Laboratorio\VSCode\Copa dos Sons"
node scripts/generate-sprite.js
```

Saída esperada:

- `public/audio/phonemes-sprite.mp3`
- `public/audio/phonemes-index.json`

## Checklist de entrega para a escola

- `npm run lint` sem erros críticos.
- `npm run build` concluído com geração de `dist/sw.js`.
- `dist/sw.js` contendo `audio/phonemes-sprite.mp3` e `audio/phonemes-index.json` no precache.
- Ícones PWA definidos (`icon-ball.svg`, `icon-trophy.svg`).
- Fluxos principais testados: Vestiário → Álbum → Treino/Partida → Prancheta → Campeonato.

## Protocolo de teste offline (obrigatório)

1. Abrir o app no Chrome e entrar no DevTools (`F12`).
2. Na aba `Network`, marcar `Offline`.
3. Repetir os fluxos principais para validar que:
	- Dexie persiste progresso/jogadas sem internet;
	- Howler toca áudio do sprite em cache;
	- telas carregam sem dependência de rede.

Mídias esperadas em cache PWA: `.mp3`, `.m4a`, `.wav`, imagens e índices `.json`.

## Stack

- React 19 + TypeScript + Vite
- Zustand + Immer
- Dexie (IndexedDB)
- Howler.js (sprite de áudio)
- Framer Motion
- vite-plugin-pwa

## Documentação de entrega final

- Plano executivo de finalização: `docs/FINAL_DELIVERY_PLAN.md`
- Checklist de QA/homologação: `docs/QA_HOMOLOGATION_CHECKLIST.md`
- Runbook de handoff para escola: `docs/SCHOOL_HANDOFF_RUNBOOK.md`
- Evidências técnicas da release final (30/03/2026): `docs/FINAL_RELEASE_EVIDENCE_2026-03-30.md`
