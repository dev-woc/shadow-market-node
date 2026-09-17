import { createSeededRandom, seededRandomInt, seededShuffle } from './seededRandom';

export interface VotePuzzleConfig {
  sellerAlias: string; // themed, generated per seed — the player's bot-swarm identity
  votes: string[]; // large shuffled array of candidate names, one holds a strict majority
  majorityCandidate: string; // === sellerAlias, kept for quick lookup
}

const aliasPrefixes = [
  'GHOST', 'PHANTOM', 'SHADOW', 'VOID', 'CIPHER', 'WRAITH', 'NOVA', 'ECLIPSE', 'SPECTER', 'ENIGMA',
];
const aliasSuffixes = [
  'RUNNER', 'PROTOCOL', 'MODULE', 'CORE', 'SIGNAL', 'NODE', 'BREACH', 'VECTOR',
];

const decoyNames = [
  'user_3821', 'nightowl_vendor', 'trader88', 'xX_Seller_Xx', 'darkmarket_dan', 'quiet_broker',
  'ratchet_reseller', 'midnight_merchant', 'crypto_carl', 'backalley_bex', 'discount_dmitri',
  'shady_shipper', 'vendor_47', 'blackmarket_bo', 'flip_king', 'thegrey_trader', 'lowkey_larry',
  'ghost_buyer_99', 'underground_uma', 'pawn_pete', 'vault_vera', 'sketchy_sam', 'offgrid_ollie',
  'rerouted_rae', 'anon_alex',
];

/**
 * Generate a unique, deterministic "Seller of the Month" vote puzzle.
 * Same seed = same puzzle every time.
 */
export function generateVotePuzzle(userSeed: string): VotePuzzleConfig {
  // Salted so this puzzle's stream doesn't trivially correlate with the other
  // per-seed puzzles generated off the same raw seed.
  const random = createSeededRandom(`${userSeed}:votes`);

  const prefix = aliasPrefixes[seededRandomInt(random, 0, aliasPrefixes.length - 1)];
  const suffix = aliasSuffixes[seededRandomInt(random, 0, aliasSuffixes.length - 1)];
  const hexTag = seededRandomInt(random, 4096, 65535).toString(16).toUpperCase();
  const sellerAlias = `${prefix}_${suffix}-${hexTag}`;

  const totalVotes = seededRandomInt(random, 400, 900);
  const majorityShare = 0.55 + random() * 0.1; // 55%-65%
  const majorityCount = Math.round(totalVotes * majorityShare);
  const remainingVotes = totalVotes - majorityCount;

  const candidates = seededShuffle(random, [...decoyNames]).slice(0, seededRandomInt(random, 15, decoyNames.length));

  // Distribute the remainder across decoys, capping each well below majorityCount
  // so there's no ambiguity or near-tie.
  const maxPerDecoy = Math.max(1, Math.floor(majorityCount / 3));
  const votes: string[] = new Array(majorityCount).fill(sellerAlias);

  let votesLeft = remainingVotes;
  let candidateIndex = 0;
  while (votesLeft > 0) {
    const candidate = candidates[candidateIndex % candidates.length];
    const share = Math.min(votesLeft, seededRandomInt(random, 1, maxPerDecoy));
    for (let i = 0; i < share; i++) {
      votes.push(candidate);
    }
    votesLeft -= share;
    candidateIndex++;
  }

  return {
    sellerAlias,
    votes: seededShuffle(random, votes),
    majorityCandidate: sellerAlias,
  };
}

/**
 * Verify a player's submitted name against the puzzle's true majority candidate.
 * Independently recounts votes rather than trusting the stored majorityCandidate,
 * so a generator bug can't silently produce a false "success".
 */
export function verifyMajoritySolution(puzzle: VotePuzzleConfig, submitted: string): boolean {
  const normalized = submitted.trim().toLowerCase();
  if (normalized !== puzzle.majorityCandidate.toLowerCase()) {
    return false;
  }

  const counts = new Map<string, number>();
  for (const vote of puzzle.votes) {
    counts.set(vote, (counts.get(vote) ?? 0) + 1);
  }
  const trueMajorityCount = counts.get(puzzle.majorityCandidate) ?? 0;

  return trueMajorityCount > puzzle.votes.length / 2;
}
