import { describe, it, expect } from "vitest";
import { generateProducts, Product } from "@/data/products";

describe("products", () => {
  describe("generateProducts", () => {
    it("should generate 120 products", () => {
      const products = generateProducts();
      expect(products).toHaveLength(120);
    });

    it("should have unique IDs for all products", () => {
      const products = generateProducts();
      const ids = products.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(products.length);
    });

    it("should have valid product structure", () => {
      const products = generateProducts();
      products.forEach((product) => {
        expect(product).toHaveProperty("id");
        expect(product).toHaveProperty("name");
        expect(product).toHaveProperty("price");
        expect(product).toHaveProperty("category");
        expect(product).toHaveProperty("sku");
        expect(typeof product.price).toBe("number");
        expect(product.price).toBeGreaterThan(0);
      });
    });

    it("should have SKUs in correct format", () => {
      const products = generateProducts();
      const skuPattern = /^(SN|PN|RX|TX|MK)-[0-9A-F]+$/;
      products.forEach((product) => {
        expect(product.sku).toMatch(skuPattern);
      });
    });
  });

  describe("secret pair puzzle", () => {
    it("should contain the Ghost Protocol ECU", () => {
      const products = generateProducts();
      const ghostEcu = products.find((p) => p.name === "Ghost Protocol ECU");
      expect(ghostEcu).toBeDefined();
      expect(ghostEcu?.price).toBe(430.5);
      expect(ghostEcu?.category).toBe("Electronics");
    });

    it("should contain the Phantom Turbo Kit", () => {
      const products = generateProducts();
      const phantomTurbo = products.find((p) => p.name === "Phantom Turbo Kit");
      expect(phantomTurbo).toBeDefined();
      expect(phantomTurbo?.price).toBe(569.5);
      expect(phantomTurbo?.category).toBe("Engine");
    });

    it("secret pair should sum to exactly $1000", () => {
      const products = generateProducts();
      const ghostEcu = products.find((p) => p.name === "Ghost Protocol ECU");
      const phantomTurbo = products.find((p) => p.name === "Phantom Turbo Kit");

      expect(ghostEcu).toBeDefined();
      expect(phantomTurbo).toBeDefined();

      const sum = ghostEcu!.price + phantomTurbo!.price;
      expect(sum).toBe(1000);
    });

    it("should not have other products that pair with secret items to make $1000", () => {
      const products = generateProducts();
      const ghostEcu = products.find((p) => p.name === "Ghost Protocol ECU");
      const phantomTurbo = products.find((p) => p.name === "Phantom Turbo Kit");

      const otherProducts = products.filter(
        (p) => p.name !== "Ghost Protocol ECU" && p.name !== "Phantom Turbo Kit"
      );

      otherProducts.forEach((product) => {
        const sumWithGhost = product.price + ghostEcu!.price;
        const sumWithPhantom = product.price + phantomTurbo!.price;

        expect(Math.abs(sumWithGhost - 1000)).toBeGreaterThan(0.01);
        expect(Math.abs(sumWithPhantom - 1000)).toBeGreaterThan(0.01);
      });
    });
  });

  describe("price generation", () => {
    it("all prices should be positive", () => {
      const products = generateProducts();
      products.forEach((product) => {
        expect(product.price).toBeGreaterThan(0);
      });
    });

    it("prices should have at most 2 decimal places", () => {
      const products = generateProducts();
      products.forEach((product) => {
        const decimalPlaces = (product.price.toString().split(".")[1] || "")
          .length;
        expect(decimalPlaces).toBeLessThanOrEqual(2);
      });
    });
  });

  describe("categories", () => {
    const validCategories = [
      "Engine",
      "Suspension",
      "Brakes",
      "Exterior",
      "Interior",
      "Wheels",
      "Electronics",
      "Safety",
    ];

    it("all products should have valid categories", () => {
      const products = generateProducts();
      products.forEach((product) => {
        expect(validCategories).toContain(product.category);
      });
    });

    it("should have products in multiple categories", () => {
      const products = generateProducts();
      const usedCategories = new Set(products.map((p) => p.category));
      expect(usedCategories.size).toBeGreaterThan(1);
    });
  });
});
