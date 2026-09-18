import { describe, it, expect } from "vitest";
import { generateKnockPuzzle, verifyKnock } from "@/lib/knockPuzzleGenerator";

describe("knockPuzzleGenerator", () => {
  describe("generateKnockPuzzle", () => {
    it("should be deterministic for the same seed", () => {
      expect(generateKnockPuzzle("seed1")).toEqual(generateKnockPuzzle("seed1"));
    });

    it("should produce different secrets for different seeds", () => {
      const a = generateKnockPuzzle("seed1");
      const b = generateKnockPuzzle("seed2");
      expect(a.normalizedSecret).not.toBe(b.normalizedSecret);
    });

    it("normalizedSecret should be a true palindrome", () => {
      const { normalizedSecret } = generateKnockPuzzle("seed1");
      expect(normalizedSecret).toBe(normalizedSecret.split("").reverse().join(""));
    });

    it("normalizedSecret should be lowercase alphanumeric only", () => {
      const { normalizedSecret } = generateKnockPuzzle("seed1");
      expect(normalizedSecret).toMatch(/^[a-z0-9]+$/);
    });

    it("displayPhrase should normalize back to exactly normalizedSecret", () => {
      const { displayPhrase, normalizedSecret } = generateKnockPuzzle("seed1");
      expect(displayPhrase.toLowerCase().replace(/[^a-z0-9]/g, "")).toBe(normalizedSecret);
    });
  });

  describe("verifyKnock", () => {
    it("should accept the exact secret", () => {
      const puzzle = generateKnockPuzzle("seed1");
      expect(verifyKnock(puzzle, puzzle.normalizedSecret)).toBe(true);
    });

    it("should accept the displayPhrase itself (case/punctuation-insensitive)", () => {
      const puzzle = generateKnockPuzzle("seed1");
      expect(verifyKnock(puzzle, puzzle.displayPhrase)).toBe(true);
    });

    it("should accept arbitrary case/punctuation variants of the secret", () => {
      const puzzle = generateKnockPuzzle("seed1");
      const variant = puzzle.normalizedSecret.toUpperCase().split("").join("-");
      expect(verifyKnock(puzzle, variant)).toBe(true);
    });

    it("should reject an unrelated but still valid general palindrome", () => {
      const puzzle = generateKnockPuzzle("seed1");
      expect(verifyKnock(puzzle, "racecar")).toBe(false);
    });

    it("should reject a near-miss (single character changed)", () => {
      const puzzle = generateKnockPuzzle("seed1");
      const tampered = puzzle.normalizedSecret.slice(0, -1) + "z";
      expect(verifyKnock(puzzle, tampered)).toBe(false);
    });
  });
});
