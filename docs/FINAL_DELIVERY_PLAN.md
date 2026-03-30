# Plano Definitivo de Finalização e Entrega Escolar

## 1. Qualidade atual do projeto (baseline)

O projeto já apresenta características de produto pronto para escalar:

- Arquitetura clara por domínios (`config`, `services`, `store`, `ui`).
- Persistência offline robusta com `Dexie`.
- Estado previsível e centralizado com `Zustand`.
- Processamento de áudio otimizado por sprite com `Howler`.
- Estratégia PWA ativa (`vite-plugin-pwa`) com foco em funcionamento sem internet.
- Base pedagógica explícita (BNCC) e trilha docente com relatório dedicado.

Este plano não reinventa estrutura; ele fecha integração, QA e operação escolar sem refações.

---

## 2. Objetivo de entrega

Finalizar a versão escolar com os seguintes resultados:

1. Fluxos de aluno e professor estáveis ponta a ponta.
2. Operação offline validada em ambiente real (escola).
3. Critérios pedagógicos e técnicos auditáveis.
4. Pacote de handoff com instruções operacionais claras.

---

## 3. Escopo fechado (sem expansão)

### Em escopo

- Estabilização final dos fluxos: `Vestiário`, `Campo`, `Match`, `Álbum`, `Prancheta`, `Campeonato`, `Boletim`.
- QA funcional, offline, pedagógico e de UX.
- Preparação de entrega escolar (runbook + checklist + homologação).

### Fora de escopo

- Novas features não essenciais.
- Inclusão de novas bibliotecas (exceto manutenção crítica aprovada).
- Refatorações amplas sem ganho direto para entrega.

---

## 4. Regras de engenharia (anti-duplicação)

1. **Fonte única de verdade (SSOT):**
   - BNCC em `src/config/bncc.ts`.
   - Regras de jogo em `src/store/gameStore.ts`.
   - Persistência em `src/services/databaseService.ts`.
   - Relatórios em `src/services/pedagogicalReportService.ts`.
2. **Tela não reimplementa regra de negócio.**
3. **Sem duplicar lógica de votação, recompensa ou progressão em múltiplos pontos.**
4. **Toda alteração passa por critério de aceite + validação (`lint` e `build`).**

---

## 5. Sprints finais de execução

## Sprint 1 — Núcleo sensorial e física

### Objetivo
Consolidar experiência tátil e resposta imediata.

### Tarefas
- Validar `drag`, `dragSnapToOrigin`, `dragElastic` no `PhonemeCard`.
- Garantir highlight de zona ativa no `DropZone`.
- Confirmar gatilho de celebração e som de gol no fechamento de palavra.

### Critério de aceite
- Drag fluido em desktop/tablet.
- Drop com feedback visual consistente.
- Vitória sempre dispara retorno sensorial.

---

## Sprint 2 — Gameplay oficial + álbum

### Objetivo
Fechar loop oficial sem inconsistências.

### Tarefas
- Validar fluxo: selecionar partida oficial, montar palavra, vencer.
- Garantir persistência de partida concluída e recompensa.
- Exibir no `Álbum` cartas desbloqueadas corretamente.

### Critério de aceite
- Loop `Campo -> Match -> Vitória -> Álbum` sem falha.
- Estado persistente após recarregar aplicação.

---

## Sprint 3 — Co-criação offline (UGC)

### Objetivo
Operar criação e comunidade 100% local.

### Tarefas
- Validar composição de jogada na `Prancheta` (clique e drag/drop).
- Persistir tática via `saveCustomWord`.
- Executar partida comunitária no `Campeonato`.
- Registrar voto VAR ao final da partida.

### Critério de aceite
- Loop `Prancheta -> Campeonato -> Match comunitário -> VAR` concluído.
- Ranking atualizado sem inconsistência de votos.

---

## Sprint 4 — Fechamento pedagógico e hub

### Objetivo
Consolidar experiência docente e navegação principal.

### Tarefas
- Validar `BoletimTecnicoScreen` com dados reais do serviço pedagógico.
- Confirmar proteção por PIN (`teacherAccess`).
- Polir hub do `Vestiário` (status de progresso do estudante + atalhos).

### Critério de aceite
- Acesso docente protegido e estável.
- Indicadores pedagógicos coerentes com dados persistidos.

---

## Sprint 5 — QA final e release escolar

### Objetivo
Garantir prontidão operacional para escola.

### Tarefas
- Revisão visual e de contraste (tokens + CSS).
- Auditoria de cache PWA para mídias e índices.
- Validação offline no Chrome DevTools (`Network -> Offline`).
- Build final e pacote de handoff.

### Critério de aceite
- Funciona offline após primeiro carregamento.
- `npm run lint` e `npm run build` aprovados.
- Checklist de homologação completo.

---

## 6. Gates obrigatórios por sprint

Para avançar sprint:

1. Critérios de aceite da sprint concluídos.
2. Sem erro de lint.
3. Build de produção gerado.
4. Sem regressão de fluxo principal.

---

## 7. Riscos finais e mitigação

- **Risco:** regressão de estado em fluxos cruzados.  
  **Mitigação:** smoke test padronizado em todas as telas.

- **Risco:** diferença entre online/offline.  
  **Mitigação:** teste offline obrigatório antes de release.

- **Risco:** desvio de escopo na reta final.  
  **Mitigação:** congelamento de escopo + only critical fixes.

---

## 8. Definition of Done (entrega escolar)

A versão só é considerada pronta quando:

- Fluxos de aluno e professor funcionam sem bloqueios.
- Operação offline validada com evidências.
- Métricas pedagógicas visíveis e coerentes.
- `lint` e `build` aprovados.
- Handoff operacional entregue à escola.
