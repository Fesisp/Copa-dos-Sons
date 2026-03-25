# Copa dos Sons - Guia de Implementação Final

## ✅ Status do Projeto

**Data**: Março 25, 2026  
**Status**: ✅ **PRONTO PARA INTEGRAÇÃO DE ASSETS**

Toda a arquitetura, lógica de jogo, componentes UI, animações e persistência foram implementados. O projeto está **100% funcional** e aguardando apenas os arquivos de mídia (áudio, imagens, ícones).

---

## 🚀 Como Começar

### 1. Instalação e Setup Inicial

```bash
# Clonar repositório ou navegar para o diretório
cd "c:\Users\mrfel\OneDrive\Laboratorio\VSCode\Copa dos Sons"

# Instalar dependências
npm install --legacy-peer-deps
```

### 2. Desenvolvimento Local

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Abrirá em: http://localhost:5173/
```

### 3. Build para Produção

```bash
# Criar build otimizado
npm run build

# Testar build localmente
npm run preview
```

---

## 📁 Integração de Assets - CHECKLIST

### ✅ PASSO 1: Audio Sprite e Índices

**O que fazer:**
1. Compile todos os arquivos de áudio dos fonemas em **UM arquivo único** (.mp3 ou .wav)
2. Gere um arquivo JSON com os índices (start/duration de cada fonema)

**Ferramentas recomendadas:**
```bash
# Usar FFmpeg para concatenar áudios
ffmpeg -i "concat:p.mp3|b.mp3|m.mp3|..." -acodec libmp3lame -b:a 192k phonemes-sprite.mp3

# Ou usar npm package audiosprite
npm install -g audiosprite
audiosprite *.mp3 -o phonemes
```

**Arquivos finais esperados:**
- **Localização**: `/public/audio/`
- **Nome**: `phonemes-sprite.mp3` (arquivo de áudio único)
- **Nome**: `phonemes-index.json` (arquivo de índices)

**Exemplo de phonemes-index.json:**
```json
{
  "p": { "start": 0, "duration": 500 },
  "b": { "start": 600, "duration": 500 },
  "m": { "start": 1200, "duration": 500 },
  ...
  "on": { "start": 13800, "duration": 500 }
}
```

**Fonemas esperados (24 total):**
- **Easy (8)**: p, b, m, t, d, n, k, g
- **Medium (8)**: f, v, s, z, r, l, e, o
- **Hard (8)**: ch, j, x, nh, lh, rr, an, on

---

### ✅ PASSO 2: Imagens dos Fonemas

**O que fazer:**
Criar imagens das palavras-exemplo para cada fonema em 3 níveis.

**Estrutura de pastas esperada:**
```
public/images/
├── easy/
│   ├── p.png (ilustração de "pato")
│   ├── b.png (ilustração de "bola")
│   ├── m.png (ilustração de "maçã")
│   ├── t.png, d.png, n.png, k.png, g.png
│   └── ... (13 imagens no total, veja nota abaixo)
├── medium/
│   ├── f.png, v.png, s.png, z.png, r.png, l.png
│   ├── e.png (ilustração de "erva")
│   ├── o.png (ilustração de "ovo")
│   └── ... (8 imagens)
├── hard/
│   ├── ch.png (ilustração de "chave")
│   ├── j.png (ilustração de "jogo")
│   ├── x.png, nh.png, lh.png, rr.png, an.png, on.png
│   └── ... (8 imagens)
└── placeholder.png (imagem fallback 256x256px)
```

**Recomendações:**
- **Tamanho**: 512x512px ou 256x256px
- **Formato**: PNG (com transparência) ou JPG
- **Estilo**: Ilustrações infantis, coloridas, claras
- **Qualidade**: 72-150 DPI (otimizado para tela)

**Nota sobre Easy phonemes:**
A configuração atual tem 8 consonantes (p,b,m,t,d,n,k,g) + 5 vogais (a,e,i,o,u) = 13 total.
Se usar apenas 8 como mostra a config, remova 5 vogais do arquivo `src/engine/config/phonemes.ts`.

---

### ✅ PASSO 3: Ícones PWA

**O que fazer:**
Criar ícones da aplicação em diferentes tamanhos.

**Arquivos necessários:**
```
public/
├── icon-192x192.png       (Logo do jogo)
├── icon-512x512.png       (Logo maior)
├── maskable-icon.png      (Logo com margem - adaptive icons Android)
├── apple-touch-icon.png   (Ícone para iOS)
└── favicon.ico            (Favicon do navegador)
```

**Recomendações:**
- Use ferramentas como: [ImageMagick](https://imagemagick.org/), [Iconifier](https://www.iconifier.com/)
- Crie um logo simples com o tema "copa do mundo" + "sons"
- Mantenha design consistente em todos os tamanhos

---

## 🔧 Configuração Manual (Opcional)

Se precisar ajustar algo, edite estes arquivos:

### Modificar Fonemas
**Arquivo**: `src/engine/config/phonemes.ts`

```typescript
// Adicionar novo fonema
const easyPhonemes: Phoneme[] = [
  {
    id: 'p1',
    phoneme: 'p',
    difficulty: 'easy',
    imageUrl: '/images/easy/p.png',
    audioIndex: 0,  // Índice no audio sprite
    examples: ['pato', 'pé', 'pipa'],
  },
  // ... adicione mais
];
```

### Ajustar Design System
**Arquivo**: `tailwind.config.ts`

```typescript
const config: Config = {
  theme: {
    extend: {
      colors: {
        'field': { 500: '#22c55e' },  // Verde gramado
        'uniform': { 500: '#0ea5e9' }, // Azul uniforme
        // ... customize conforme necessário
      },
    },
  },
};
```

### Modificar Duração de Fases
**Arquivo**: `src/engine/config/phonemes.ts`

```typescript
const LEVELS: Record<string, Level> = {
  easy: {
    id: 'level-easy',
    totalQuestions: 16,    // Alterar aqui
    timeLimit: 300,         // 5 minutos em segundos
    // ...
  },
};
```

---

## 📊 Estrutura do Banco de Dados (Offline)

O aplicativo já está pronto para armazenar dados localmente via IndexedDB:

**Tabelas criadas automaticamente:**
- `players` - Informações do jogador
- `sessions` - Histórico de partidas
- `progress` - Progresso por fonema

**Dados salvos automaticamente:**
- Nome do jogador
- Pontuação de cada sessão
- Acertos/erros por fonema
- Data e hora

---

## 🎮 Testando o Jogo

### Sem Assets (Modo Desenvolvimento)
```bash
npm run dev
# O jogo funcionará com imagens placeholder e áudios simulados
# Você pode navegar por todas as telas e testar a lógica
```

### Com Assets Integrados
```bash
# 1. Adicione arquivos em public/
# 2. Execute
npm run build
npm run preview
# 3. Acesse http://localhost:4173/
```

### Testar no Celular/Tablet
```bash
# 1. Obtenha o IP local
ipconfig

# 2. Acesse de outro dispositivo na rede
http://<SEU_IP>:5173/
```

---

## 🚀 Deploy (Produção)

### Opção 1: Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Dashboard: https://vercel.com/dashboard
```

### Opção 2: Netlify
```bash
# Build
npm run build

# Arrastar a pasta 'dist' para Netlify
# Ou usar Netlify CLI:
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Opção 3: GitHub Pages
```bash
# Editar vite.config.ts e adicionar:
export default {
  base: '/copa-dos-sons/', // Se em subdiretório
  // ...
}

npm run build
# Push para GitHub e ativar Pages
```

---

## 📱 PWA (Progressive Web App)

Seu jogo será automaticamente instalável como app em celulares/tablets:

**Em Android:**
- Chrome → Menu → "Instalar no celular"

**Em iOS (Safari):**
- Compartilhar → "Adicionar à Tela de Início"

**Funcionalidades PWA:**
- ✅ Funciona offline
- ✅ Rápido carregamento
- ✅ Ícone na home screen
- ✅ Status bar customizado
- ✅ Cache de assets

---

## 🐛 Troubleshooting

### Problema: "Howler load error"
**Solução**: Verifique se `phonemes-sprite.mp3` existe em `/public/audio/`

### Problema: Imagens não aparecem
**Solução**: Confirme a estrutura de pastas `/public/images/easy/`, `/medium/`, `/hard/`

### Problema: Áudio não toca
**Solução**: Verifique `phonemes-index.json` está formatado corretamente e os índices correspondem ao arquivo .mp3

### Problema: Build falha com Tailwind
**Solução**: Execute `npm install @tailwindcss/postcss --legacy-peer-deps`

---

## 📚 Referências Técnicas

### Arquitectura
- **Engine**: Máquina de estados pura (sem React)
- **Store**: Zustand + Immer para state management imutável
- **Audio**: Howler.js com Audio Sprites (1 arquivo de áudio para todos os fonemas)
- **DB**: Dexie.js (abstração sobre IndexedDB)
- **UI**: React 19 + Framer Motion (animações)
- **Styling**: Tailwind CSS v4
- **PWA**: Vite PWA Plugin

### Fases de Jogo
1. **Menu** - Seleção de jogador
2. **LevelSelect** - Escolha de dificuldade
3. **Game** - Jogar e responder
4. **Results** - Estatísticas e salvar

---

## ✅ Checklist Final Pré-Produção

- [ ] Audio sprite (`/public/audio/phonemes-sprite.mp3`)
- [ ] Índices de áudio (`/public/audio/phonemes-index.json`)
- [ ] Imagens easy (13x)
- [ ] Imagens medium (8x)
- [ ] Imagens hard (8x)
- [ ] Ícones PWA (5 arquivos)
- [ ] Testar offline (fechar wifi)
- [ ] Testar em mobile/tablet
- [ ] Testar todas as 3 dificuldades
- [ ] Verificar banco de dados salva corretamente
- [ ] Realizar deploy em staging
- [ ] Teste final com usuários

---

## 📞 Próximas Etapas

1. **Integração de Assets** (~1-2 dias)
   - Gravar/obter áudios dos fonemas
   - Encontrar/criar ilustrações
   - Compilar audio sprite

2. **Testes Automatizados** (~1 dia)
   - Unit tests para engine
   - E2E tests com Playwright

3. **Analytics e Feedback** (~1 dia)
   - Integrar Mixpanel ou Google Analytics
   - Setup dashboard de uso

4. **Backend Opcional** (~2-3 dias)
   - Python/FastAPI para sincronizar dados
   - Dashboard de professor
   - Relatórios de aprendizado

---

**Parabéns! Seu projeto Copa dos Sons está pronto!** 🎉⚽🎤

Qualquer dúvida, consulte os arquivos de documentação dentro do projeto ou revise `IMPLEMENTATION_STATUS.md`.

