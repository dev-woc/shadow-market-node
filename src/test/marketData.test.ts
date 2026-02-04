import { describe, it, expect } from "vitest";
import { generateMarketData, MarketDataPoint } from "@/data/marketData";

describe("marketData", () => {
  describe("generateMarketData", () => {
    it("should generate 721 data points (30 days hourly)", () => {
      const data = generateMarketData();
      expect(data).toHaveLength(721);
    });

    it("should have valid data point structure", () => {
      const data = generateMarketData();
      data.forEach((point) => {
        expect(point).toHaveProperty("time");
        expect(point).toHaveProperty("price");
        expect(typeof point.time).toBe("string");
        expect(typeof point.price).toBe("number");
      });
    });

    it("should have chronologically ordered timestamps", () => {
      const data = generateMarketData();
      for (let i = 1; i < data.length; i++) {
        const prevTime = new Date(data[i - 1].time).getTime();
        const currTime = new Date(data[i].time).getTime();
        expect(currTime).toBeGreaterThan(prevTime);
      }
    });

    it("should have valid ISO timestamp format", () => {
      const data = generateMarketData();
      data.forEach((point) => {
        expect(() => new Date(point.time)).not.toThrow();
        expect(new Date(point.time).toISOString()).toBe(point.time);
      });
    });
  });

  describe("price boundaries", () => {
    it("all prices should be between $50 and $400", () => {
      const data = generateMarketData();
      data.forEach((point) => {
        expect(point.price).toBeGreaterThanOrEqual(50);
        expect(point.price).toBeLessThanOrEqual(400);
      });
    });

    it("prices should have at most 2 decimal places", () => {
      const data = generateMarketData();
      data.forEach((point) => {
        const decimalPart = point.price.toString().split(".")[1] || "";
        expect(decimalPart.length).toBeLessThanOrEqual(2);
      });
    });
  });

  describe("buy/sell opportunity", () => {
    it("should contain the buy point at $67.50", () => {
      const data = generateMarketData();
      const buyPoint = data.find((p) => p.price === 67.5);
      expect(buyPoint).toBeDefined();
    });

    it("should contain the sell point at $385.99", () => {
      const data = generateMarketData();
      const sellPoint = data.find((p) => p.price === 385.99);
      expect(sellPoint).toBeDefined();
    });

    it("buy point should come before sell point", () => {
      const data = generateMarketData();
      const buyIndex = data.findIndex((p) => p.price === 67.5);
      const sellIndex = data.findIndex((p) => p.price === 385.99);

      expect(buyIndex).toBeGreaterThan(-1);
      expect(sellIndex).toBeGreaterThan(-1);
      expect(buyIndex).toBeLessThan(sellIndex);
    });

    it("max profit should be $318.49", () => {
      const data = generateMarketData();
      const buyPoint = data.find((p) => p.price === 67.5);
      const sellPoint = data.find((p) => p.price === 385.99);

      expect(buyPoint).toBeDefined();
      expect(sellPoint).toBeDefined();

      const profit = sellPoint!.price - buyPoint!.price;
      expect(profit).toBeCloseTo(318.49, 2);
    });
  });

  describe("data variability", () => {
    it("should have price variation (not all same price)", () => {
      const data = generateMarketData();
      const prices = data.map((p) => p.price);
      const uniquePrices = new Set(prices);
      expect(uniquePrices.size).toBeGreaterThan(10);
    });

    it("should have reasonable price distribution", () => {
      const data = generateMarketData();
      const prices = data.map((p) => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const range = maxPrice - minPrice;

      // Should have at least $100 price range
      expect(range).toBeGreaterThan(100);
    });
  });
});
