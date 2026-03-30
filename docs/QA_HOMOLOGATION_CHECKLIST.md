# Checklist de QA e Homologação Escolar

Use este checklist como gate formal de aprovação antes da entrega.

## Instruções

- Marcar cada item como `OK`, `N/A` ou `PENDENTE`.
- Registrar evidência curta (ex.: print, vídeo, log).
- Não aprovar release com item crítico pendente.

---

## 1. Ambiente e versão

- [ ] Versão/commit da homologação registrada.
- [ ] Node e npm compatíveis com o projeto.
- [ ] Build de homologação gerada sem erro.

Evidências:
- Commit: `____________________________`
- Data/Hora: `__________________________`

---

## 2. Fluxos funcionais (estudante)

## 2.1 Vestiário
- [ ] Abre sem erro e mostra torcida do estudante.
- [ ] Botões navegam para Álbum, Treino, Prancheta e Campeonato.

## 2.2 Campo + Match oficial
- [ ] Partida oficial inicia corretamente.
- [ ] Drag & drop aceita somente slot correto.
- [ ] Vitória oficial aplica recompensa esperada.
- [ ] Retorno ao fluxo oficial funciona sem travar.

## 2.3 Álbum
- [ ] Cartas desbloqueadas aparecem liberadas.
- [ ] Cartas bloqueadas ficam visivelmente bloqueadas.
- [ ] Clique em carta liberada toca áudio.

## 2.4 Prancheta
- [ ] Composição funciona por clique.
- [ ] Composição funciona por drag/drop na faixa.
- [ ] Botão `Ouvir` reproduz sequência.
- [ ] Botão `Salvar` persiste tática localmente.

## 2.5 Campeonato + VAR
- [ ] Lista de táticas aparece (ranking/recentes).
- [ ] Partida comunitária abre corretamente.
- [ ] Modal VAR registra voto e retorna ao campeonato.

---

## 3. Fluxos funcionais (professor)

## 3.1 Segurança de acesso
- [ ] Área do boletim exige PIN.
- [ ] Sessão docente pode ser encerrada.

## 3.2 Indicadores pedagógicos
- [ ] Relatório carrega sem erro.
- [ ] Filtros (busca/BNCC/risco/ordenação) funcionam.
- [ ] Recomendações por aluno são exibidas.

---

## 4. Offline e PWA (crítico)

## 4.1 Procedimento
1. Abrir app online e navegar pelas telas principais.
2. Abrir DevTools -> `Network` -> selecionar `Offline`.
3. Repetir os fluxos principais.

## 4.2 Verificações
- [ ] App continua abrindo em offline após pré-carregamento.
- [ ] Dexie mantém progresso e táticas sem rede.
- [ ] Áudio (sprite) toca sem rede.
- [ ] Imagens essenciais carregam sem rede.
- [ ] Fluxos principais seguem utilizáveis sem internet.

---

## 5. UX, acessibilidade e estabilidade

- [ ] Contraste de textos em telas principais adequado.
- [ ] Mensagens de erro/sucesso claras para estudantes em alfabetização e professores.
- [ ] Não há travamentos ao navegar rapidamente entre telas.
- [ ] Não há erro crítico no console durante fluxo principal.

---

## 6. Validação técnica obrigatória

- [ ] `npm run lint` sem erros.
- [ ] `npm run build` concluído com sucesso.
- [ ] Artefatos `dist/sw.js` e `dist/workbox-*.js` gerados.

---

## 7. Go/No-Go para entrega

## Status final
- [ ] **GO** (aprovado para entrega)
- [ ] **NO-GO** (corrigir pendências)

Pendências críticas:
- `______________________________________________________________`
- `______________________________________________________________`

Responsáveis pela aprovação:
- QA Técnico: `____________________`
- Coordenação Pedagógica: `___________`
- Data: `___________________________`
