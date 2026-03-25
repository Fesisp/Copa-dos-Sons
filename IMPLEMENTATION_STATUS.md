# Copa dos Sons - Jogo Educativo de Fonemas

Um jogo PWA interativo para aprender fonemas em português, desenvolvido com React, TypeScript, Zustand, Framer Motion e banco de dados offline com Dexie.

## 🏆 Características

- ✅ **3 Níveis de Dificuldade**: Fácil, Médio, Difícil (progressão pedagógica)
- ✅ **Máquina de Estados**: Fluxo de jogo robusto e previsível
- ✅ **Áudio com Sprites**: Carregamento otimizado de fonemas
- ✅ **Persistência Local**: Banco de dados IndexedDB com Dexie
- ✅ **PWA Offline-First**: Funciona completamente sem internet
- ✅ **Animações Viscerais**: Feedback visual com Framer Motion
- ✅ **Design Responsivo**: Otimizado para tablets e smartphones
- ✅ **Sem Dependência de Backend**: Pronto para integração futura

## 📋 Status da Implementação

### ✅ Concluído (Fase 1-4)

- [x] Estrutura Vite + React + TypeScript
- [x] Arquitetura Limpa (Engine desacoplada, Services, Store)
- [x] Máquina de Estados (MENU → LEVEL_SELECT → PLAYING → FEEDBACK → VICTORY)
- [x] Game Engine com funções puras
- [x] Zustand Store com Immer middleware
- [x] AudioManager centralizado (com Audio Sprites)
- [x] Dexie Database (Players, Sessions, Progress)
- [x] Componentes UI reutilizáveis (Button, PhonemeCard, ProgressBar, DifficultySelector)
- [x] Telas principais (Menu, LevelSelect, Game, Results)
- [x] Animações com Framer Motion
- [x] Tailwind CSS com design tokens para crianças
- [x] Vite PWA plugin configurado

### ⏳ Aguardando Assets Finais

- [ ] Áudio Sprite (phonemes-sprite.mp3)
- [ ] Índice de Áudio (phonemes-index.json)
- [ ] Imagens dos Fonemas (easy/, medium/, hard/)
- [ ] Ícones PWA (192x192, 512x512, maskable)

## 🚀 Quick Start

### Instalação

```bash
cd "c:\Users\mrfel\OneDrive\Laboratorio\VSCode\Copa dos Sons"
npm install
```

### Desenvolvimento

```bash
npm run dev
```

A aplicação abrirá em `http://localhost:5173/`

### Build para Produção

```bash
npm run build
npm run preview
```

## 📁 Estrutura de Projeto

```
src/
├── engine/
│   ├── config/
│   │   └── phonemes.ts          # Configuração de 24 fonemas (3 dificuldades)
│   └── index.ts                 # Lógica pura do jogo
├── store/
│   └── gameStore.ts             # Zustand store com estado global
├── services/
│   ├── audioManager.ts          # Gerenciador de áudio com Howler.js
│   └── databaseService.ts       # CRUD Dexie (players, sessions, progress)
├── ui/
│   ├── components/
│   │   ├── Button.tsx           # Botão reutilizável
│   │   ├── PhonemeCard.tsx      # Card da imagem do fonema
│   │   ├── ProgressBar.tsx      # Barra de progresso
│   │   └── DifficultySelector.tsx
│   └── screens/
│       ├── MenuScreen.tsx       # Tela inicial
│       ├── LevelSelectScreen.tsx
│       ├── GameScreen.tsx       # Tela principal de jogo
│       └── ResultsScreen.tsx    # Tela de resultados
├── types/
│   └── index.ts                 # TypeScript interfaces globais
├── config/
│   └── assets.ts                # Documentação de assets esperados
├── App.tsx                      # Componente raiz com roteamento
├── main.tsx                     # Entrada React
└── index.css                    # Tailwind + estilos globais

public/
├── audio/
│   ├── phonemes-sprite.mp3      # ⏳ PENDENTE: Arquivo de áudio único
│   └── phonemes-index.json      # ⏳ PENDENTE: Índices dos fonemas
├── images/
│   ├── easy/                    # ⏳ PENDENTE: Imagens fáceis
│   ├── medium/                  # ⏳ PENDENTE: Imagens médias
│   └── hard/                    # ⏳ PENDENTE: Imagens difíceis
├── icon-192x192.png            # ⏳ PENDENTE
├── icon-512x512.png            # ⏳ PENDENTE
└── maskable-icon.png           # ⏳ PENDENTE
```

## 🎮 Fluxo de Jogo

```
MENU
  ↓ (Insere nome ou seleciona jogador recente)
LEVEL_SELECT
  ↓ (Escolhe Fácil, Médio ou Difícil)
PLAYING
  ↓ (Ouve som, seleciona imagem)
FEEDBACK
  ↓ (Mostra se acertou ou errou)
  ├→ Se tem mais questões: volta a PLAYING
  └→ Se acabou: vai a VICTORY ou GAME_OVER
VICTORY / GAME_OVER
  ↓ (Mostra estatísticas, salva sessão)
MENU
```

## 📚 3 Níveis de Dificuldade

### Nível 1: Fácil 🌱
- **Fonemas**: p, b, m, t, d, n, k, g (+ a, e, i, o, u)
- **Estrutura**: Sílabas simples (CV)
- **Exemplos**: pato, bola, mala
- **Questões**: 16
- **Tempo**: 5 minutos

### Nível 2: Médio 🌳
- **Fonemas**: f, v, s, z, r, l (+ ɛ, ɔ)
- **Estrutura**: Palavras CVC, CCV
- **Exemplos**: sofá, rosa, bloco
- **Questões**: 24
- **Tempo**: 10 minutos

### Nível 3: Difícil 🏆
- **Fonemas**: ch, j, x, nh, lh, rr (+ sons nasalizados)
- **Estrutura**: Dígrafos, dítongos, palavras complexas
- **Exemplos**: chave, ninho, saudade
- **Questões**: 32
- **Tempo**: 15 minutos

## 🔧 Tecnologias

| Camada | Tecnologia | Uso |
|--------|-----------|-----|
| Frontend | React 19 | UI |
| Tipagem | TypeScript | Type safety |
| Build | Vite | Fast bundling |
| Estado | Zustand | State management |
| UI | Framer Motion | Animações |
| Áudio | Howler.js | Audio playback com sprites |
| Banco Local | Dexie/IndexedDB | Persistência offline |
| Styling | Tailwind CSS | Design system |
| PWA | Vite PWA Plugin | Service Worker + manifest |

## 📱 Integração de Assets - INSTRUÇÕES FINAIS

### 1️⃣ Preparar Áudio Sprite

```bash
# Ferramentas recomendadas:
# - FFmpeg (concatenar áudios)
# - Audacity (editar e exportar)
# - audiosprite npm package

npm install -g audiosprite

# Comando exemplo:
audiosprite public/audio/raw/*.mp3 -o public/audio/phonemes
```

**Resultado esperado:**
- `public/audio/phonemes-sprite.mp3` (arquivo único)
- `public/audio/phonemes-index.json` (índices)

**Exemplo de phonemes-index.json:**
```json
{
  "p": { "start": 0, "duration": 500 },
  "b": { "start": 600, "duration": 500 },
  ...
}
```

### 2️⃣ Adicionar Imagens

```
public/images/
├── easy/
│   ├── p.png (pato)
│   ├── b.png (bola)
│   ├── m.png (maçã)
│   ... (13 imagens)
├── medium/
│   └── ... (8 imagens)
└── hard/
    └── ... (8 imagens)

public/
├── images/placeholder.png (256x256 - fallback)
```

Cada imagem deve ser:
- **Tamanho**: 512x512px ou 256x256px
- **Formato**: PNG ou JPG
- **Conteúdo**: Ilustrações infantis do exemplo de cada fonema

### 3️⃣ Criar Ícones PWA

```
public/
├── icon-192x192.png      (Logo do jogo em 192x192)
├── icon-512x512.png      (Logo do jogo em 512x512)
├── maskable-icon.png     (Logo com margem para adaptive icons)
├── apple-touch-icon.png  (Ícone para iOS)
└── favicon.ico           (Favicon do site)
```

### 4️⃣ Deploy e CI/CD

O projeto está pronto para:

**Vercel:**
```bash
vercel deploy
```

**Netlify:**
```bash
npm run build
# Arraste a pasta 'dist' para Netlify
```

**GitHub + Vercel Automático:**
```bash
git push origin main  # Triggered automatic build
```

## 📊 Banco de Dados (Offline)

### Tabelas Dexie

#### Players
```typescript
{
  id: string;
  name: string;
  createdAt: Date;
  lastPlayedAt: Date;
  totalSessions: number;
  averageScore: number;
}
```

#### Sessions
```typescript
{
  id: string;
  playerId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  startedAt: Date;
  completedAt?: Date;
  phonemesLearned: string[];
}
```

#### Progress
```typescript
{
  sessionId: string;
  phonemeId: string;
  isCorrect: boolean;
  attempts: number;
  timestamp: Date;
}
```

### Sincronização Futura

Quando integrar um backend em Python:

```python
# Backend Flask exemplo
@app.route('/api/sync', methods=['POST'])
def sync_sessions():
    data = request.json
    # Salvar sessions em SQL/SQLite
    player = Player.create(name=data['playerName'])
    for session in data['sessions']:
        Session.create(
            player_id=player.id,
            score=session['score'],
            ...
        )
    return { 'status': 'synced' }
```

## 🧪 Testes (Em desenvolvimento)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📝 TODO - Próximos Passos

- [ ] **Assets Finais**: Audio sprite + imagens + ícones
- [ ] **Testes Unitários**: Jest para engine e store
- [ ] **E2E Tests**: Playwright para fluxo completo
- [ ] **Analytics**: Rastreamento de uso (Mixpanel, Google Analytics)
- [ ] **Backend**: Python/FastAPI para sincronização de dados
- [ ] **Multi-idioma**: Suporte a mais idiomas (en, es, fr)
- [ ] **Multiplayer**: Competição entre crianças
- [ ] **Gamification**: Badges, leaderboards, streaks

## 🎨 Design Tokens

```typescript
// Cores
colors: {
  field: '#22c55e' (verde gramado)
  uniform: '#0ea5e9' (azul uniforme)
  success: '#22c55e'
  error: '#ef4444'
  warning: '#eab308'
}

// Tipografia
fonts: {
  display: 'Comic Sans MS, Comic Neue'  // Headings infantis
  sans: 'Segoe UI, Roboto, Arial'       // Body text
}

// Spacing
xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 24px
```

## 📞 Suporte

Para integrar assets ou reportar bugs:
- Verifique `src/config/assets.ts` para estrutura esperada
- Revise `src/services/audioManager.ts` para índices de áudio
- Consulte `src/engine/config/phonemes.ts` para lista de fonemas

## 📄 Licença

Projeto educativo - Direitos reservados

---

**Status**: ✅ Arquitetura completa, aguardando integração de assets finais.
