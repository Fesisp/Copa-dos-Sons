# Roadmap Orquestrado 0–5 (Execução no código atual)

## Fase 0 — Preparação e Bloqueios

### Objetivo
Garantir consistência de mídia, tipos e base de dados.

### Entregáveis
- Script de sprite validado para `.m4a/.mp3/.wav`.
- Tipos para progresso e UGC (unlocked, votos, ranking).
- Validação de catálogo de 31 fonemas.

### Aceite
- `node scripts/generate-sprite.js` conclui sem erro fatal.
- Build íntegro.

---

## Fase 1 — Fundação e Onboarding

### Objetivo
Entrada segura e guiada para criança e professor.

### Entregáveis
- Modal tutorial de primeiro acesso com mascote.
- Vestiário como hub central (4 ações + torcida).

### Aceite
- Onboarding exibido apenas no primeiro uso (flag local).

---

## Fase 2 — Motor de Jogo e Física

### Objetivo
Mecânica principal com resposta tátil robusta.

### Entregáveis
- Drag/drop com colisão de slot.
- Feedback de acerto/erro + celebração vitória.
- Power-up “Bola de Ouro” com custo de torcida.

### Aceite
- Latência mediana de resposta < 200ms.

---

## Fase 3 — Progressão e Coleção

### Objetivo
Retenção por inventário e progressão persistente.

### Entregáveis
- Álbum completo de 31 cartas.
- Loop de desbloqueio por vitória oficial.

### Aceite
- Desbloqueio persiste em recarga/offline.

---

## Fase 4 — UGC e Multiplayer local

### Objetivo
Autoria e colaboração como motor de longevidade.

### Entregáveis
- Prancheta salva táticas no Dexie.
- Campeonato renderiza ranking e inicia partidas UGC.
- VAR registra votos 👍/👎 e recalcula aprovação.

### Aceite
- Ranking respeita mínimo de votos configurado.

---

## Fase 5 — Relatórios, Polimento e Deploy

### Objetivo
Pronto para adoção escolar em escala.

### Entregáveis
- Boletim docente (indicadores por aluno/fonema).
- Polimento visual final e acessibilidade.
- PWA instalável com cache offline de áudio.

### Aceite
- Lint/build aprovados.
- SW com sprite/index no precache.

---

## Planejamento de execução (sprints)

- **Sprint A (1 semana):** Fase 0 + metade da Fase 1
- **Sprint B (1 semana):** restante da Fase 1 + Fase 2
- **Sprint C (1 semana):** Fase 3 + Fase 4
- **Sprint D (1 semana):** Fase 5 + homologação escolar
