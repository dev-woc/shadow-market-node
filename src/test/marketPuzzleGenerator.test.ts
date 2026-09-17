import { describe, it, expect } from "vitest";
import { generateMarketPuzzle, verifyWashSolution } from "@/lib/marketPuzzleGenerator";

describe("marketPuzzleGenerator", () => {
  describe("generateMarketPuzzle", () => {
    it("should be deterministic for the same seed", () => {
      const a = generateMarketPuzzle("seed1");
      const b = generateMarketPuzzle("seed1");
      expect(a).toEqual(b);
    });

    it("should produce different puzzles for different seeds", () => {
      const a = generateMarketPuzzle("seed1");
      const b = generateMarketPuzzle("seed2");
      expect(a.priceHistory).not.toEqual(b.priceHistory);
    });

    it("should have chronologically increasing timestamps", () => {
      const puzzle = generateMarketPuzzle("seed1");
      for (let i = 1; i < puzzle.priceHistory.length; i++) {
        const prev = new Date(puzzle.priceHistory[i - 1].time).getTime();
        const curr = new Date(puzzle.priceHistory[i].time).getTime();
        expect(curr).toBeGreaterThan(prev);
      }
    });

    it("should have the buy index before the sell index", () => {
      const puzzle = generateMarketPuzzle("seed1");
      expect(puzzle.buyIndex).toBeLessThan(puzzle.sellIndex);
    });

    it("should have maxProfit equal to sellPrice minus buyPrice", () => {
      const puzzle = generateMarketPuzzle("seed1");
      const expectedProfit = parseFloat((puzzle.sellPrice - puzzle.buyPrice).toFixed(2));
      expect(puzzle.maxProfit).toBe(expectedProfit);
    });

    it("should have a comfortably large forced profit gap", () => {
      const puzzle = generateMarketPuzzle("seed1");
      expect(puzzle.maxProfit).toBeGreaterThan(50);
    });
  });

  describe("verifyWashSolution", () => {
    it("should accept the true optimal pair", () => {
      const puzzle = generateMarketPuzzle("seed1");
      const result = verifyWashSolution(puzzle, puzzle.buyPrice, puzzle.sellPrice);
      expect(result.status).toBe("success");
    });

    it("should reject a profitable but non-optimal pair", () => {
      const puzzle = generateMarketPuzzle("seed1");
      // Buy at the true optimal (forced global minimum) but sell one step later
      // instead of at the true peak — still profitable, but not the max.
      const sellPoint = puzzle.priceHistory[puzzle.buyIndex + 1];
      expect(sellPoint.price).toBeGreaterThan(puzzle.buyPrice);

      const result = verifyWashSolution(puzzle, puzzle.buyPrice, sellPoint.price);
      expect(result.status).toBe("not-optimal");
    });

    it("should reject when sell occurs only before buy chronologically", () => {
      const puzzle = generateMarketPuzzle("seed1");
      // Submit the true sell price as "buy" and true buy price as "sell" — the
      // only occurrence of each is in the wrong order.
      const result = verifyWashSolution(puzzle, puzzle.sellPrice, puzzle.buyPrice);
      expect(result.status).toBe("wrong-order");
    });

    it("should reject a buy price that doesn't exist in the history", () => {
      const puzzle = generateMarketPuzzle("seed1");
      const result = verifyWashSolution(puzzle, -999, puzzle.sellPrice);
      expect(result.status).toBe("buy-price-not-found");
    });

    it("should reject a sell price that doesn't exist in the history", () => {
      const puzzle = generateMarketPuzzle("seed1");
      const result = verifyWashSolution(puzzle, puzzle.buyPrice, -999);
      expect(result.status).toBe("sell-price-not-found");
    });
  });
});
