import { createSeededRandom, seededRandomInt } from './seededRandom';

export interface KnockPuzzle {
  displayPhrase: string;
  normalizedSecret: string;
}

const CORE_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
const SEPARATORS = [' ', ', ', ' - ', ': ', '. '];
const MIN_CORE_LEN = 5;
const MAX_CORE_LEN = 9;

function buildPalindromeCore(random: () => number): string {
  const len = seededRandomInt(random, MIN_CORE_LEN, MAX_CORE_LEN);
  let core = '';
  for (let i = 0; i < len; i++) {
    core += CORE_CHARS[seededRandomInt(random, 0, CORE_CHARS.length - 1)];
  }
  return core;
}

// Mirrors core around its last character: c0..c(n-1) + c(n-2)..c0 — always
// odd-length, always a palindrome, for any core length >= 1.
function toPalindrome(core: string): string {
  return core + core.slice(0, -1).split('').reverse().join('');
}

// Single left-to-right pass appending characters — never replacing/splicing —
// so the "decorations never add alphanumerics" invariant holds by
// construction, not by luck. Case changes are invisible to normalize();
// separators come only from a hardcoded non-alphanumeric SEPARATORS array.
function buildDisplayPhrase(secret: string, random: () => number): string {
  let out = '';
  for (let i = 0; i < secret.length; i++) {
    const ch = secret[i];
    out += random() < 0.5 ? ch.toUpperCase() : ch.toLowerCase();
    if (i < secret.length - 1 && random() < 0.35) {
      out += SEPARATORS[seededRandomInt(random, 0, SEPARATORS.length - 1)];
    }
  }
  return out;
}

export const normalize = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Generate a unique, deterministic "secret knock" palindrome puzzle.
 * Same seed = same puzzle every time.
 */
export function generateKnockPuzzle(userSeed: string): KnockPuzzle {
  const random = createSeededRandom(`${userSeed}:knock`);

  const core = buildPalindromeCore(random);
  const normalizedSecret = toPalindrome(core);

  // Closed-form construction, not a heuristic — assert it once here rather
  // than re-deriving on every verify call (there's nothing probabilistic to
  // re-check, unlike the forced dip/spike in marketPuzzleGenerator).
  if (
    normalizedSecret.length < MIN_CORE_LEN * 2 - 1 ||
    normalizedSecret !== normalizedSecret.split('').reverse().join('')
  ) {
    throw new Error('generateKnockPuzzle: constructed secret is not a valid palindrome');
  }

  return { displayPhrase: buildDisplayPhrase(normalizedSecret, random), normalizedSecret };
}

/**
 * Verify a player's submitted phrase against THIS puzzle's specific secret
 * (not general palindrome validity — normalization must match exactly).
 */
export function verifyKnock(puzzle: KnockPuzzle, submitted: string): boolean {
  return normalize(submitted) === puzzle.normalizedSecret;
}
