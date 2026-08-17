import { describe, it, expect } from "vitest";
import { business } from "@/data/business";

describe("src/data/business.ts (E2-F1-S4)", () => {
  it("exports the brand name 'DG DevWorks'", () => {
    expect(business.brandName).toBe("DG DevWorks");
  });

  it("exports non-empty tagline and positioning copy per the spec's positioning language", () => {
    expect(business.tagline.length).toBeGreaterThan(0);
    expect(business.tagline).toMatch(/Daryll/);
    expect(business.positioningCopy.length).toBeGreaterThan(0);
    expect(business.positioningCopy).toMatch(/marketing site that sells it/i);
  });

  it("bookingUrl is a non-empty URL string", () => {
    expect(business.bookingUrl.length).toBeGreaterThan(0);
    expect(() => new URL(business.bookingUrl)).not.toThrow();
  });

  it("social links point to the exact spec-documented profiles", () => {
    expect(business.socialLinks.linkedin).toBe("https://linkedin.com/in/gonsquared");
    expect(business.socialLinks.github).toBe("https://github.com/gonsquared");
    expect(business.socialLinks.portfolio.length).toBeGreaterThan(0);
  });

  it("contactEmail is a syntactically valid email address", () => {
    expect(business.contactEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("trustLine matches the exact copy specified in E5-F1-S3's acceptance criteria", () => {
    expect(business.trustLine).toBe(
      "Your info is only used to respond to your inquiry — no spam, no third parties."
    );
  });
});
