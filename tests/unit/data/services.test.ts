import { describe, it, expect } from "vitest";
import { services, getServiceBySlug } from "@/data/services";
import { caseStudies } from "@/data/caseStudies";
import type { ServiceSlug } from "@/data/types";

const EXPECTED_SLUGS: ServiceSlug[] = [
  "mvp-development",
  "marketing-sites",
  "modernization",
  "fractional",
];

describe("src/data/services.ts (E2-F1-S1)", () => {
  it("exports exactly 4 entries", () => {
    expect(services).toHaveLength(4);
  });

  it("slugs match the spec exactly", () => {
    expect(services.map((s) => s.slug).sort()).toEqual([...EXPECTED_SLUGS].sort());
  });

  it("every entry conforms to the Service shape with no missing/empty required fields", () => {
    for (const service of services) {
      expect(typeof service.slug).toBe("string");
      expect(typeof service.title).toBe("string");
      expect(service.title.length).toBeGreaterThan(0);
      expect(typeof service.summary).toBe("string");
      expect(service.summary.length).toBeGreaterThan(0);
      expect(Array.isArray(service.includes)).toBe(true);
      expect(service.includes.length).toBeGreaterThan(0);
      expect(Array.isArray(service.process)).toBe(true);
      expect(service.process.length).toBeGreaterThan(0);
      expect(typeof service.idealClient).toBe("string");
      expect(service.idealClient.length).toBeGreaterThan(0);
      expect(typeof service.priceLabel).toBe("string");
      expect(service.priceLabel.length).toBeGreaterThan(0);
      expect(Array.isArray(service.relatedCaseStudySlugs)).toBe(true);
    }
  });

  it("relatedCaseStudySlugs on every service resolve to real caseStudies entries", () => {
    const validCaseStudySlugs = new Set(caseStudies.map((cs) => cs.slug));
    for (const service of services) {
      for (const slug of service.relatedCaseStudySlugs) {
        expect(validCaseStudySlugs.has(slug), `${service.slug} references unknown case study "${slug}"`).toBe(
          true
        );
      }
    }
  });

  it("getServiceBySlug resolves valid slugs and returns undefined for unknown slugs", () => {
    expect(getServiceBySlug("mvp-development")?.slug).toBe("mvp-development");
    expect(getServiceBySlug("does-not-exist")).toBeUndefined();
    expect(getServiceBySlug("")).toBeUndefined();
  });

  it("has no duplicate slugs", () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every entry has a situation string for the services-index chooser", () => {
    const EXPECTED: Record<ServiceSlug, string> = {
      "mvp-development": "I have an idea and no code yet.",
      "marketing-sites": "I need a site that actually converts.",
      modernization: "I have a system that's slow to change and risky to touch.",
      fractional: "I have a team that needs senior judgment on tap.",
    };
    for (const service of services) {
      expect(service.situation, `${service.slug} is missing situation`).toBe(EXPECTED[service.slug]);
    }
  });
});
