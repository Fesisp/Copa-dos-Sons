# Copa dos Sons — EdTech Executive Blueprint (BNCC + UGC)

## 1. Product Thesis

The platform transforms early phonemic literacy into a football-themed strategy game where children act as coaches, collect phoneme cards, create challenges, and evaluate peer-created plays.

### Value proposition
- **For students:** active learning, fast feedback, authorship, and belonging.
- **For teachers:** clear skill progress visibility and formative diagnostics.
- **For schools:** offline-first operation, low infrastructure cost, and strong tablet readiness.

## 2. Pedagogical North Star (BNCC)

- **EF01LP02:** phoneme recognition and discrimination.
- **EF01LP05:** word construction and grapheme-phoneme relationships.
- **EF01LP08:** early reading/writing with sound segmentation support.

## 3. Reference Architecture

### Confirmed stack
- **UI:** React 19 + Vite
- **Touch interactions:** Framer Motion
- **State:** Zustand
- **Local persistence:** Dexie (IndexedDB)
- **Audio:** Howler + optimized sprite
- **Offline:** `vite-plugin-pwa` + Service Worker

### Functional domains
1. **Identity & Progress:** player profile, crowd score, unlocked cards, and match history.
2. **Core Gameplay:** official/community matches, slot validation, and multimodal feedback.
3. **UGC:** local tactic creation, publishing, and approval-based ranking.
4. **Pedagogical Analytics:** phoneme indicators, success rates, and trend evolution.
5. **Teacher Console (next delivery):** technical report with instructional recommendations.

## 4. Product Benchmark (high level)

Reference principles adopted by leading products (design and operations benchmark, not code reuse):
- **Duolingo:** short feedback cycles, explicit progression, and positive reinforcement.
- **Khan Academy Kids:** child-friendly accessibility, visual clarity, and guided autonomy.
- **Prodigy:** persistent game mechanics for progression/collection.
- **Minecraft Education:** authorship and collaboration as engagement drivers.

## 5. Engineering Principles for School Scale

- **True offline-first:** critical functionality does not depend on internet after first load.
- **Touch latency:** core interactions respond within 200ms.
- **Local data resilience:** Dexie versioning and safe migrations.
- **Pedagogical observability:** structured didactic events for diagnostics.
- **Accessibility:** high contrast, multimodal cues, and reduced friction.

## 6. Success KPIs (product + learning)

- **Adoption:** active students per class/week.
- **Retention:** sessions per student/week and recurring UGC creation.
- **Learning:** improvement in target-phoneme accuracy.
- **UGC quality:** proportion of tactics with >= 70% approval after minimum votes.
- **Responsiveness:** median drag/drop interaction <= 200ms.

## 7. UGC Policy (pedagogical safety)

- UGC is restricted to valid tokens/phonemes from the official catalog.
- Ranking visibility requires a minimum vote threshold to reduce sampling bias.
- Local authorship metadata stores creator name and timestamp.
- Teacher review is recommended for formal assessment contexts.

## 8. Risks and Mitigations

- **Ranking noise (low votes):** minimum-vote gate + volume tie-breaker.
- **Audio inconsistency:** sprite generation script with normalization and duplicate validation.
- **Pedagogical drift:** BNCC matrix mapping per feature + didactic QA checklist.
- **Device fragmentation:** tablet-resolution testing and installed PWA validation.

## 9. Definition of “Ready for School Adoption”

- Build and lint pass.
- PWA is installable and fully operational offline.
- Full flow works: Locker Room -> Album -> Match -> Board -> Championship.
- BNCC evidence and baseline teacher reporting are available.
