import { createSeededRandom, seededRandomInt } from './seededRandom';

export interface MarketPricePoint {
  time: string; // ISO timestamp, chronological
  price: number;
}

export interface MarketPuzzle {
  priceHistory: MarketPricePoint[];
  buyIndex: number;
  sellIndex: number;
  buyPrice: number;
  sellPrice: number;
  maxProfit: number;
}

export type WashResult =
  | { status: 'buy-price-not-found' }
  | { status: 'sell-price-not-found' }
  | { status: 'wrong-order' }
  | { status: 'not-optimal'; profit: number }
  | { status: 'success'; profit: number };

const POINT_COUNT = 200;
const PRICE_TOLERANCE = 0.01;

/**
 * Generate a unique, deterministic price-history puzzle for the "Wash" scenario.
 * Same seed = same puzzle every time.
 */
export function generateMarketPuzzle(userSeed: string): MarketPuzzle {
  // Salted so this puzzle's stream doesn't trivially correlate with generatePuzzle's
  // off the same raw seed.
  const random = createSeededRandom(`${userSeed}:wash`);

  const now = new Date();
  const priceHistory: MarketPricePoint[] = [];
  let price = 150 + random() * 50; // Start between 150-200

  for (let i = POINT_COUNT; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);

    // Random walk with momentum
    const change = (random() - 0.48) * 8;
    price = Math.max(50, Math.min(400, price + change));

    // Occasional volatility spikes
    if (random() > 0.95) {
      price += (random() - 0.5) * 30;
    }

    priceHistory.push({
      time: time.toISOString(),
      price: parseFloat(price.toFixed(2)),
    });
  }

  // Compute the natural range of the realized walk, then force a dip and a
  // later spike comfortably outside it — this makes the forced points the
  // global min/max by construction, regardless of how volatile the walk was.
  const naturalMin = Math.min(...priceHistory.map((p) => p.price));
  const naturalMax = Math.max(...priceHistory.map((p) => p.price));

  const dipIndex = seededRandomInt(random, Math.floor(POINT_COUNT * 0.25), Math.floor(POINT_COUNT * 0.4));
  const spikeIndex = seededRandomInt(random, Math.floor(POINT_COUNT * 0.6), Math.floor(POINT_COUNT * 0.85));
  const gap = seededRandomInt(random, 30, 60);

  priceHistory[dipIndex].price = parseFloat(Math.max(1, naturalMin - gap).toFixed(2));
  priceHistory[spikeIndex].price = parseFloat((naturalMax + gap).toFixed(2));

  // Don't trust the forcing math — run the real single-pass "best time to buy
  // and sell stock" scan over the final array so the generator is self-verifying.
  let minSoFarIndex = 0;
  let bestBuyIndex = 0;
  let bestSellIndex = 0;
  let bestProfit = -Infinity;

  for (let i = 1; i < priceHistory.length; i++) {
    if (priceHistory[i].price < priceHistory[minSoFarIndex].price) {
      minSoFarIndex = i;
    }
    const profit = priceHistory[i].price - priceHistory[minSoFarIndex].price;
    if (profit > bestProfit) {
      bestProfit = profit;
      bestBuyIndex = minSoFarIndex;
      bestSellIndex = i;
    }
  }

  return {
    priceHistory,
    buyIndex: bestBuyIndex,
    sellIndex: bestSellIndex,
    buyPrice: priceHistory[bestBuyIndex].price,
    sellPrice: priceHistory[bestSellIndex].price,
    maxProfit: parseFloat(bestProfit.toFixed(2)),
  };
}

/**
 * Verify a player's submitted buy/sell prices against the puzzle's true optimal trade.
 * Prices are matched by tolerance rather than index identity, so incidental
 * near-duplicate prices elsewhere in the walk can only ever help find a valid
 * *ordering* — never a wrong *profit* value, since profit is checked independently.
 */
export function verifyWashSolution(puzzle: MarketPuzzle, buyPrice: number, sellPrice: number): WashResult {
  const buyIndices = puzzle.priceHistory
    .map((p, i) => (Math.abs(p.price - buyPrice) < PRICE_TOLERANCE ? i : -1))
    .filter((i) => i !== -1);
  const sellIndices = puzzle.priceHistory
    .map((p, i) => (Math.abs(p.price - sellPrice) < PRICE_TOLERANCE ? i : -1))
    .filter((i) => i !== -1);

  if (buyIndices.length === 0) {
    return { status: 'buy-price-not-found' };
  }
  if (sellIndices.length === 0) {
    return { status: 'sell-price-not-found' };
  }

  const hasValidOrder = buyIndices.some((bi) => sellIndices.some((si) => si > bi));
  if (!hasValidOrder) {
    return { status: 'wrong-order' };
  }

  const profit = parseFloat((sellPrice - buyPrice).toFixed(2));
  if (Math.abs(profit - puzzle.maxProfit) >= PRICE_TOLERANCE) {
    return { status: 'not-optimal', profit };
  }

  return { status: 'success', profit };
}
