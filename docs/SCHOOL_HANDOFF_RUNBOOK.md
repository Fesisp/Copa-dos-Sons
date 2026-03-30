# Runbook de Handoff para Escola

Este documento orienta coordenação e professores para operar a versão final do Copa dos Sons.

---

## 1. Pré-requisitos da escola

- Dispositivo com navegador moderno (Chrome recomendado).
- Primeiro acesso com internet para carregar e instalar PWA.
- Espaço local disponível para cache e banco local (IndexedDB).

---

## 2. Primeira ativação (implantação)

1. Abrir a URL/aplicação no dispositivo.
2. Aguardar carregamento completo de telas e mídia.
3. Instalar como app (PWA) quando disponível.
4. Navegar rapidamente por Vestiário, Campo, Álbum, Prancheta, Campeonato e Boletim.
5. Confirmar áudio funcionando.

Resultado esperado:
- App pronto para uso em modo offline após aquecimento inicial.

---

## 3. Rotina de uso em sala

## 3.1 Fluxo recomendado para estudantes

1. Iniciar no `Vestiário`.
2. Fazer 1–2 partidas oficiais no `Treino`.
3. Ver cartas no `Álbum`.
4. Criar tática na `Prancheta`.
5. Jogar e avaliar no `Campeonato`.

## 3.2 Fluxo recomendado para professor

1. Acessar `Boletim do Técnico` com PIN.
2. Filtrar alunos por risco e BNCC.
3. Registrar intervenção pedagógica breve por aluno.

---

## 4. Operação offline (procedimento prático)

- Após primeira ativação online, o app pode operar sem Wi-Fi.
- Em caso de internet instável, manter uso normal.
- Dados de progresso e criações permanecem no dispositivo.

Observação:
- Cada dispositivo mantém sua própria base local.

---

## 5. Segurança e acesso docente

- Definir PIN docente no arquivo de ambiente (`VITE_TEACHER_REPORT_PIN`).
- Não compartilhar PIN com estudantes.
- Encerrar sessão docente ao finalizar uso.

---

## 6. Backup operacional (simples)

Como os dados são locais (IndexedDB), recomenda-se:

- Designar dispositivo principal por turma.
- Evitar limpar dados do navegador durante período letivo.
- Manter rotina de verificação semanal da aplicação.

---

## 7. Troubleshooting rápido

## Sintoma: áudio não toca
- Verificar volume do dispositivo.
- Reabrir app.
- Repetir aquecimento online inicial se necessário.

## Sintoma: app não abre offline
- Garantir que houve primeiro carregamento online completo.
- Verificar se PWA foi instalada/armazenada em cache.

## Sintoma: ranking ou progresso “sumiu”
- Confirmar se é o mesmo dispositivo/navegador.
- Verificar se dados do navegador foram limpos.

---

## 8. Checklist de encerramento diário

- [ ] Professor encerrou sessão do boletim.
- [ ] Dispositivo carregando para próximo dia.
- [ ] Sem limpeza de cache/dados do navegador.

---

## 9. Responsáveis e escalonamento

- Professor responsável pela turma: `______________________`
- Coordenação pedagógica: `__________________________`
- Responsável técnico escolar: `________________________`

Contato de suporte interno:
- `______________________________________________________________`
