import { describe, it, expect } from "vitest";
import { generateVotePuzzle, verifyMajoritySolution } from "@/lib/votePuzzleGenerator";

describe("votePuzzleGenerator", () => {
  describe("generateVotePuzzle", () => {
    it("should be deterministic for the same seed", () => {
      const a = generateVotePuzzle("seed1");
      const b = generateVotePuzzle("seed1");
      expect(a).toEqual(b);
    });

    it("should produce different puzzles for different seeds", () => {
      const a = generateVotePuzzle("seed1");
      const b = generateVotePuzzle("seed2");
      expect(a.sellerAlias).not.toBe(b.sellerAlias);
    });

    it("should give the seller alias a strict majority of votes", () => {
      const puzzle = generateVotePuzzle("seed1");
      const count = puzzle.votes.filter((v) => v === puzzle.sellerAlias).length;
      expect(count).toBeGreaterThan(puzzle.votes.length / 2);
    });

    it("should not let any decoy candidate come close to a majority", () => {
      const puzzle = generateVotePuzzle("seed1");
      const counts = new Map<string, number>();
      for (const vote of puzzle.votes) {
        counts.set(vote, (counts.get(vote) ?? 0) + 1);
      }
      for (const [name, count] of counts) {
        if (name === puzzle.sellerAlias) continue;
        expect(count).toBeLessThan(puzzle.votes.length / 2);
      }
    });
  });

  describe("verifyMajoritySolution", () => {
    it("should accept the correct seller alias", () => {
      const puzzle = generateVotePuzzle("seed1");
      expect(verifyMajoritySolution(puzzle, puzzle.sellerAlias)).toBe(true);
    });

    it("should accept the correct alias with different casing/whitespace", () => {
      const puzzle = generateVotePuzzle("seed1");
      expect(verifyMajoritySolution(puzzle, `  ${puzzle.sellerAlias.toLowerCase()}  `)).toBe(true);
    });

    it("should reject every decoy name", () => {
      const puzzle = generateVotePuzzle("seed1");
      const decoys = new Set(puzzle.votes.filter((v) => v !== puzzle.sellerAlias));
      for (const decoy of decoys) {
        expect(verifyMajoritySolution(puzzle, decoy)).toBe(false);
      }
    });

    it("should reject an unrelated name", () => {
      const puzzle = generateVotePuzzle("seed1");
      expect(verifyMajoritySolution(puzzle, "not_a_real_candidate")).toBe(false);
    });
  });
});
