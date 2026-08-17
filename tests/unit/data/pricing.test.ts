import { describe, it, expect } from "vitest";
import { pricing } from "@/data/pricing";

describe("src/data/pricing.ts (E2-F1-S3)", () => {
  it("exports hourlyRate as the placeholder value of 90", () => {
    expect(pricing.hourlyRate).toBe(90);
  });

  it("exports exactly 4 packages", () => {
    expect(pricing.packages).toHaveLength(4);
  });

  it("packages cover all 4 service slugs with matching placeholder price labels", () => {
    const bySlug = Object.fromEntries(pricing.packages.map((p) => [p.slug, p]));
    expect(bySlug["marketing-sites"].priceLabel).toBe("$3,500–$6,500");
    expect(bySlug["mvp-development"].priceLabel).toBe("Starting at $12,000");
    expect(bySlug["modernization"].priceLabel).toContain("$8,000");
    expect(bySlug["fractional"].priceLabel).toBe("$3,500–$7,000/mo");
  });

  it("every package has a non-empty timeframe and rangeNote", () => {
    for (const pkg of pricing.packages) {
      expect(pkg.timeframe.length).toBeGreaterThan(0);
      expect(pkg.rangeNote.length).toBeGreaterThan(0);
      expect(pkg.name.length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate package slugs", () => {
    const slugs = pricing.packages.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
