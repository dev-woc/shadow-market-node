/**
 * Seeded random number generator using mulberry32
 * Same seed = same sequence of random numbers
 */
export function createSeededRandom(seed: string): () => number {
  // Convert string seed to number using simple hash
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // mulberry32 PRNG
  let a = Math.abs(hash) || 1;

  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * Seeded random integer between min and max (inclusive)
 */
export function seededRandomInt(random: () => number, min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

/**
 * Seeded array shuffle (Fisher-Yates)
 */
export function seededShuffle<T>(random: () => number, array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
