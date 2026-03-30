# Checklist Final de Entrega — Copa dos Sons

## Estado de release (Mar/2026)

- [x] Arquitetura consolidada (`config`, `services`, `store`, `ui`)
- [x] Fluxos principais implementados (aluno + professor)
- [x] Persistência offline com Dexie ativa
- [x] PWA com Service Worker e cache de mídia
- [x] Build de produção validado

---

## 1) Gameplay e UX

- [x] `VestiarioScreen`: hub com acesso para Álbum, Treino, Prancheta, Campeonato e Boletim
- [x] `CampoScreen`: lista de partidas oficiais
- [x] `MatchScreen`: drag/drop com `DropZone` e feedback de progresso
- [x] `AlbumScreen`: 31 cartas com bloqueio/desbloqueio e áudio
- [x] Celebração de vitória (confete + som)

## 2) Progressão e dados

- [x] Recompensa de torcida aplicada corretamente em vitória
- [x] Desbloqueio de carta persistido no jogador
- [x] Partida oficial concluída persistida (`completedOfficialMatchIds`)
- [x] Dados de jogador mantidos entre sessões

## 3) Co-criação (UGC)

- [x] `PranchetaScreen`: criação por clique e por drag/drop
- [x] Reprodução da sequência de fonemas
- [x] Salvamento local de tática no Dexie
- [x] `CampeonatoScreen`: ranking + fallback para recentes
- [x] VAR comunitário ao final da partida

## 4) Camada pedagógica

- [x] BNCC centralizado em `src/config/bncc.ts`
- [x] `pedagogicalReportService` com métricas de turma/aluno
- [x] `BoletimTecnicoScreen` com filtros e recomendações
- [x] Acesso docente protegido por PIN (`teacherAccess`)

## 5) Performance e robustez

- [x] Lazy loading de telas
- [x] Prefetch em idle e por intenção de navegação
- [x] Chunk splitting por vendors no build
- [x] Sem duplicação de lógica de domínio nas telas

## 6) Offline e PWA

- [x] Cache de `.mp3`, `.m4a`, `.wav`, imagens e índices `.json`
- [x] `sw.js` e `workbox` gerados no build
- [x] Protocolo de teste offline documentado

## 7) Critérios técnicos finais

- [x] `npm run lint`
- [x] `npm run build`
- [x] Projeto apto para homologação escolar

---

## Pendências externas ao código (operação)

- [ ] Executar homologação em dispositivo real da escola
- [ ] Validar operação com `Network -> Offline` na rotina da coordenação
- [ ] Definir PIN docente final de produção no `.env`
- [ ] Assinar termo interno de aceite pedagógico

