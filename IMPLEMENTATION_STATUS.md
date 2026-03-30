# Status de Implementação — Copa dos Sons

## Resumo executivo

O projeto encontra-se em **estado de entrega escolar** com foco em operação offline, gameplay funcional e fechamento pedagógico. A fase atual é de **homologação final em campo** (escola), não de desenvolvimento estrutural.

## Arquitetura atual (validada)

- **UI/Fluxo:** React + telas especializadas (`Vestiário`, `Campo`, `Match`, `Álbum`, `Prancheta`, `Campeonato`, `Boletim`)
- **Estado:** Zustand (`gameStore`) como orquestrador de regras de jogo
- **Persistência:** Dexie/IndexedDB (`databaseService`) para progresso e UGC local
- **Áudio:** Howler + sprite + reprodução sequencial
- **PWA:** vite-plugin-pwa + Workbox com cache de mídia

## Módulos de domínio (SSOT)

- BNCC: `src/config/bncc.ts`
- Regras de jogo: `src/store/gameStore.ts`
- Persistência: `src/services/databaseService.ts`
- Relatórios pedagógicos: `src/services/pedagogicalReportService.ts`
- Segurança docente: `src/config/teacherAccess.ts`

## Entregas implementadas

## 1. Gameplay oficial
- Partidas oficiais iniciam via `CampoScreen`
- Drag/drop funcional em `MatchScreen`
- Vitória aplica recompensa de torcida e desbloqueio
- Conclusão oficial persistida no perfil do aluno

## 2. Álbum e progressão
- Renderização das 31 cartas
- Estado bloqueado/desbloqueado consistente
- Reprodução de áudio em cartas liberadas

## 3. Co-criação e campeonato
- Prancheta com composição por clique e por drag/drop
- Salvamento local de táticas
- Campeonato com ranking e partidas comunitárias
- Votação VAR registrada no banco local

## 4. Boletim docente
- Tela protegida por PIN
- Indicadores de turma e aluno
- Filtros e ordenação para leitura pedagógica
- Recomendações didáticas com foco BNCC

## 5. Performance e UX
- Lazy loading por tela
- Prefetch em idle
- Prefetch por intenção (hover/focus/touch)
- Build com chunking de vendors

## 6. Offline/PWA
- Precache/runtime cache cobrindo áudio e imagens
- Extensões de mídia: `.mp3`, `.m4a`, `.wav`
- Artefatos de SW gerados no build

## Validação técnica recente

- `npm run lint` ✅
- `npm run build` ✅

## Próximo marco

**Homologação escolar assistida** usando:
- `docs/QA_HOMOLOGATION_CHECKLIST.md`
- `docs/SCHOOL_HANDOFF_RUNBOOK.md`

Após homologação sem bloqueios críticos, a versão está pronta para entrega oficial.
