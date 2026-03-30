# Copa dos Sons — Blueprint Executivo EdTech (BNCC + UGC)

## 1. Tese do Produto

A plataforma transforma alfabetização fonêmica em um jogo de estratégia com tema futebolístico, no qual a criança atua como técnica(o), coleciona cartas de fonemas, cria desafios e avalia colegas.

### Proposta de valor
- **Para estudantes:** aprendizagem ativa, feedback rápido, autoria e pertencimento.
- **Para professores:** visibilidade de progresso por habilidade e diagnóstico formativo.
- **Para escola:** operação offline-first, baixo custo de infraestrutura e alta aderência em tablets.

## 2. Norte Pedagógico (BNCC)

- **EF01LP02:** reconhecimento e discriminação de fonemas.
- **EF01LP05:** construção de palavras e relações grafema-fonema.
- **EF01LP08:** leitura/escrita inicial com apoio de segmentação sonora.

## 3. Arquitetura de Referência

### Stack confirmada
- **UI:** React 19 + Vite
- **Interação tátil:** Framer Motion
- **Estado:** Zustand
- **Persistência local:** Dexie (IndexedDB)
- **Áudio:** Howler + sprite otimizado
- **Offline:** vite-plugin-pwa + Service Worker

### Domínios funcionais
1. **Identity & Progress:** jogador, torcida, cartas desbloqueadas, histórico de partidas.
2. **Core Gameplay:** partida oficial/comunidade, validação de slots, feedback multimodal.
3. **UGC:** criação de táticas, publicação local e ranking por aprovação.
4. **Pedagogical Analytics:** indicadores por fonema, taxa de sucesso, evolução temporal.
5. **Teacher Console (próxima entrega):** boletim com recomendações didáticas.

## 4. Benchmark de Produto (alto nível)

Comparação de princípios adotados por produtos líderes (referência de design e operação, não de código):
- **Duolingo:** ciclos curtos de feedback, progressão explícita e reforço positivo.
- **Khan Academy Kids:** UX infantil acessível, clareza visual e autonomia guiada.
- **Prodigy:** aprendizagem por mecânica de jogo persistente (progressão/coleção).
- **Minecraft Education:** autoria e colaboração como vetor de engajamento.

## 5. Princípios de Engenharia para Escala Escolar

- **Offline-first real:** funcionalidades críticas não dependem de internet após primeiro carregamento.
- **Latência tátil:** resposta de interação em até 200ms nos eventos centrais.
- **Resiliência de dados locais:** versionamento Dexie e migrações seguras.
- **Observabilidade pedagógica:** eventos didáticos estruturados para diagnóstico.
- **Acessibilidade:** alto contraste, pistas multimodais, leitura de estado e redução de fricção.

## 6. KPIs de Sucesso (produto + aprendizagem)

- **Adoção:** taxa de alunos ativos por turma/semana.
- **Retenção:** sessões por aluno/semana e recorrência de criação UGC.
- **Aprendizagem:** aumento da taxa de acerto por fonema-alvo.
- **Qualidade UGC:** proporção de táticas com aprovação >= 70% após mínimo de votos.
- **Tempo de resposta:** mediana de interação drag/drop <= 200ms.

## 7. Política de UGC (segurança pedagógica)

- UGC restrito a tokens/fonemas válidos do catálogo.
- Ranking só com mínimo de votos para evitar viés amostral.
- Registro local de autoria (nome do jogador) e data.
- Revisão docente recomendada para uso em avaliação formal.

## 8. Riscos e Mitigações

- **Ruído no ranking (poucos votos):** gate mínimo + desempate por volume.
- **Áudio inconsistente:** script de sprite com normalização e validação de duplicatas.
- **Drift pedagógico:** matriz BNCC por funcionalidade e checklist de QA didático.
- **Fragmentação de dispositivo:** testes em resolução tablet e PWA instalada.

## 9. Definição de “Pronto para adoção escolar”

- Build e lint aprovados.
- PWA instalável e operacional offline.
- Fluxo completo: Vestiário → Álbum → Partida → Prancheta → Campeonato.
- Evidências de aderência BNCC e relatório básico para professor.
