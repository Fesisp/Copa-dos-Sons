# Evidências de Release — 2026-03-30

## Escopo desta execução

Este registro consolida as 5 pendências finais de entrega para a escola e o que foi efetivamente concluído no ambiente local.

## 1) Homologação GO/NO-GO

- Base de checklist pronta em `docs/QA_HOMOLOGATION_CHECKLIST.md`.
- Runbook operacional pronto em `docs/SCHOOL_HANDOFF_RUNBOOK.md`.
- Resultado: **pronto para execução presencial na escola** (pendência operacional externa).

## 2) Configuração final de produção

- Variável de PIN docente definida por ambiente: `VITE_TEACHER_REPORT_PIN`.
- Template de produção criado: `.env.production.example`.
- Resultado: **concluído tecnicamente** (falta apenas aplicar PIN real no ambiente da escola).

## 3) Pipeline de mídia final

- Insumos encontrados em `public/audio/raw`.
- Execução local realizada: `npm run audio:sprite`.
- Resultado:
  - `public/audio/phonemes-sprite.mp3` gerado com sucesso.
  - `public/audio/phonemes-index.json` gerado com sucesso.
  - Aviso tratado automaticamente: duplicidade de variações de `e`/`o` (script escolhe arquivo canônico).

## 4) Validação de release

- Execução local realizada:
  - `npm run lint` ✅
  - `npm run build` ✅
- Artefatos PWA gerados:
  - `dist/sw.js`
  - `dist/workbox-66610c77.js`
- Evidência de cache no `sw.js`:
  - `audio/phonemes-sprite.mp3`
  - `audio/phonemes-index.json`
  - Runtime route de áudio: `/\\/audio\\/.*\\.(mp3|m4a|wav)$/`

## 5) Handoff formal

Pacote final disponível:
- `docs/FINAL_DELIVERY_PLAN.md`
- `docs/QA_HOMOLOGATION_CHECKLIST.md`
- `docs/PHASE_4_UX_POLISH_CHECKLIST.md`
- `docs/SCHOOL_HANDOFF_RUNBOOK.md`
- `docs/FINAL_RELEASE_EVIDENCE_2026-03-30.md`

## 6) Ajuste de público (alfabetização ampla)

- Linguagem de UX e validação revisada para não restringir faixa etária fixa.
- Critérios focados em estudantes em diferentes estágios de alfabetização.
- Terminologia ajustada em artefatos de entrega/homologação (ex.: estudante em vez de recorte etário específico).

## Metadados da sessão

- Repositório: `Fesisp/Copa-dos-Sons`
- Branch: `main`
- Commit base da validação: `9c01bbb`
- Data: `2026-03-30`

## Pendências externas (não automatizáveis neste ambiente)

1. Executar GO/NO-GO em dispositivo real da escola.
2. Validar fluxo completo em modo offline (`Network -> Offline`) com equipe pedagógica.
3. Definir e aplicar PIN docente real de produção no ambiente da escola.
4. Registrar assinaturas de aceite (QA técnico + coordenação pedagógica).
