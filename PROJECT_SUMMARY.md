# Project Summary — Copa dos Sons

## Produto

Copa dos Sons é uma plataforma lúdica de alfabetização fonêmica com temática de futebol, preparada para uso escolar com operação offline e foco em evidências pedagógicas.

## Objetivo pedagógico

- Reforçar consciência fonêmica e relação fonema-grafema
- Estimular autoria infantil com co-criação de táticas
- Oferecer ao professor visão de progresso com alinhamento BNCC

## Diferenciais implementados

1. **Offline-first real** (Dexie + PWA)
2. **Loop de aprendizagem completo** (treino oficial + criação + comunidade)
3. **Boletim técnico docente** com filtros e recomendações
4. **Arquitetura pronta para escala** com separação clara de domínios

## Fluxo principal

1. Criança acessa `Vestiário`
2. Joga no `Campo` (partidas oficiais)
3. Evolui no `Álbum` (cartas desbloqueadas)
4. Cria jogadas na `Prancheta`
5. Participa do `Campeonato` e recebe votação VAR
6. Professor acompanha no `Boletim`

## Qualidade de engenharia

- TypeScript + tipagem de domínio
- Store central para regras (sem lógica duplicada em UI)
- Persistência local consistente
- Caching de assets para continuidade sem internet
- Documentação operacional de entrega e homologação

## Artefatos de governança de entrega

- Plano final: `docs/FINAL_DELIVERY_PLAN.md`
- QA/Homologação: `docs/QA_HOMOLOGATION_CHECKLIST.md`
- Handoff escolar: `docs/SCHOOL_HANDOFF_RUNBOOK.md`

## Estado atual

**Pronto para homologação final na escola** com build validado e checklist de aceite definido.

