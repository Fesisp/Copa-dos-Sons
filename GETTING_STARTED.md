# Guia de Início Rápido — Copa dos Sons

Este guia é para equipe pedagógica e técnica configurarem o jogo em laboratório/tablet.

## 1) Instalação

```powershell
cd "c:\Users\mrfel\OneDrive\Laboratorio\VSCode\Copa dos Sons"
npm install
```

## 2) Ambiente de desenvolvimento

```powershell
npm run dev
```

Abra `http://localhost:5173`.

## 3) Build para entrega

```powershell
npm run lint
npm run build
npm run preview
```

## 4) Áudio (sprite)

Sempre que trocar fonemas/efeitos em `public/audio/raw`, regenere:

```powershell
node scripts/generate-sprite.js
```

Arquivos gerados:

- `public/audio/phonemes-sprite.mp3`
- `public/audio/phonemes-index.json`

## 5) Fluxo funcional esperado

1. `Vestiário`: exibe torcida, progresso e atalhos.
2. `Meu Álbum`: mostra 31 cartas (bloqueadas/cinza e liberadas/ativas).
3. `Ir para o Treino`: inicia partidas oficiais no campo.
4. `Prancheta`: cria tática fonêmica e salva no banco local.
5. `Campeonato`: lista táticas da turma e avalia no VAR (👍/👎).

## 6) Operação offline (PWA)

- O Service Worker é gerado no build (`dist/sw.js`).
- O cache inclui sprite e índice de áudio.
- Em tablets, após primeiro carregamento, o app continua funcional offline.

## 7) Banco local (Dexie)

Persistido no navegador:

- Jogador atual e progresso (`crowd`, cartas desbloqueadas)
- Táticas criadas pela turma
- Votos de aprovação/reprovação para ranking

## 8) Checklist final de entrega

- [ ] `npm run lint` sem erros bloqueantes
- [ ] `npm run build` concluído
- [ ] `dist/sw.js` contém `audio/phonemes-sprite.mp3`
- [ ] Fluxos Vestiário/Álbum/Partida/Prancheta/Campeonato testados
- [ ] Ícones PWA e manifesto carregando corretamente
