export type DifficultyPhase = 1 | 2 | 3;

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'an', 'on', 'em', 'im', 'um']);
const DIGRAPHS = new Set(['ch', 'nh', 'lh', 'rr']);
const SIMPLE_CONSONANTS = new Set(['b', 'c', 'd', 'f', 'g', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'x', 'z']);
const PHASE2_COMPLEX = new Set(['ch', 'nh', 'lh', 'rr', 'br', 'pr']);

const HARD_INVALID_ADJACENCY = new Set([
  'q|ç',
  'ç|q',
  'q|q',
  'ç|ç',
]);

const ALLOWED_CONSONANT_CLUSTERS_PHASE2 = new Set(['b|r', 'p|r', 'c|h', 'n|h', 'l|h']);
const ALLOWED_CONSONANT_CLUSTERS_PHASE3 = new Set([
  ...ALLOWED_CONSONANT_CLUSTERS_PHASE2,
  'p|l',
  't|r',
  'c|r',
  'g|r',
  'f|r',
  'd|r',
]);

const normalizeToken = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');

export const isVowelToken = (token: string): boolean => VOWELS.has(normalizeToken(token));

export const inferDifficultyPhaseByProgress = (completedOfficialMatches: number): DifficultyPhase => {
  if (completedOfficialMatches >= 6) return 3;
  if (completedOfficialMatches >= 3) return 2;
  return 1;
};

export const isTokenUnlockedForPhase = (token: string, phase: DifficultyPhase): boolean => {
  const normalized = normalizeToken(token);

  if (phase === 1) {
    return isVowelToken(normalized) || SIMPLE_CONSONANTS.has(normalized);
  }

  if (phase === 2) {
    return (
      isVowelToken(normalized) ||
      SIMPLE_CONSONANTS.has(normalized) ||
      PHASE2_COMPLEX.has(normalized)
    );
  }

  return true;
};

const isConsonantToken = (token: string): boolean => !isVowelToken(token);

interface AdjacencyOptions {
  enforcePhasePattern?: boolean;
}

export const canAttachPhoneme = (
  previousToken: string | null,
  nextToken: string,
  phase: DifficultyPhase,
  options: AdjacencyOptions = { enforcePhasePattern: true }
): boolean => {
  const next = normalizeToken(nextToken);
  if (!next) return false;

  if (!previousToken) {
    if (!options.enforcePhasePattern) return true;
    return isTokenUnlockedForPhase(next, phase);
  }

  const previous = normalizeToken(previousToken);
  const edge = `${previous}|${next}`;

  if (HARD_INVALID_ADJACENCY.has(edge)) {
    return false;
  }

  const previousIsConsonant = isConsonantToken(previous);
  const nextIsConsonant = isConsonantToken(next);

  if (!options.enforcePhasePattern) {
    return !(previousIsConsonant && nextIsConsonant && !ALLOWED_CONSONANT_CLUSTERS_PHASE3.has(edge));
  }

  if (phase === 1) {
    if (previousIsConsonant && nextIsConsonant) return false;
    if (!previousIsConsonant && !nextIsConsonant) return false;
    if (!previousIsConsonant && nextIsConsonant) return false;
    return true;
  }

  if (phase === 2) {
    if (previousIsConsonant && nextIsConsonant) {
      return ALLOWED_CONSONANT_CLUSTERS_PHASE2.has(edge) || DIGRAPHS.has(next) || DIGRAPHS.has(previous);
    }

    if (!previousIsConsonant && nextIsConsonant) {
      return false;
    }

    return true;
  }

  if (previousIsConsonant && nextIsConsonant) {
    return ALLOWED_CONSONANT_CLUSTERS_PHASE3.has(edge) || DIGRAPHS.has(next) || DIGRAPHS.has(previous);
  }

  return true;
};

export const normalizePhonemeToken = normalizeToken;
