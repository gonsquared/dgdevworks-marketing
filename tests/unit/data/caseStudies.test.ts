import { describe, it, expect } from "vitest";
import { caseStudies, getCaseStudyBySlug } from "@/data/caseStudies";
import { services } from "@/data/services";
import type { CaseStudySlug } from "@/data/types";

const EXPECTED_SLUGS: CaseStudySlug[] = [
  "bank-platform-modernization",
  "hardware-brand-partner-portals",
  "retail-pos-platform",
  "stock-exchange-data-migration",
];

describe("src/data/caseStudies.ts (E2-F1-S2)", () => {
  it("exports exactly 4 entries", () => {
    expect(caseStudies).toHaveLength(4);
  });

  it("slugs match the spec exactly", () => {
    expect(caseStudies.map((cs) => cs.slug).sort()).toEqual([...EXPECTED_SLUGS].sort());
  });

  it("every entry conforms to the CaseStudy shape with no missing/empty required fields", () => {
    for (const cs of caseStudies) {
      expect(typeof cs.title).toBe("string");
      expect(cs.title.length).toBeGreaterThan(0);
      expect(typeof cs.challenge).toBe("string");
      expect(cs.challenge.length).toBeGreaterThan(0);
      expect(typeof cs.approach).toBe("string");
      expect(cs.approach.length).toBeGreaterThan(0);
      expect(Array.isArray(cs.impact)).toBe(true);
      expect(cs.impact.length).toBeGreaterThan(0);
      expect(Array.isArray(cs.relatedServiceSlugs)).toBe(true);
      expect(cs.relatedServiceSlugs.length).toBeGreaterThan(0);
    }
  });

  it("relatedServiceSlugs on every case study resolve to real services entries", () => {
    const validServiceSlugs = new Set(services.map((s) => s.slug));
    for (const cs of caseStudies) {
      for (const slug of cs.relatedServiceSlugs) {
        expect(validServiceSlugs.has(slug), `${cs.slug} references unknown service "${slug}"`).toBe(true);
      }
    }
  });

  it("contains no proprietary/internal confidential markers (no client PII, no raw internal system names beyond public ones)", () => {
    const bannedTerms = ["confidential", "internal use only", "ssn", "password", "api key"];
    for (const cs of caseStudies) {
      const haystack = `${cs.challenge} ${cs.approach} ${cs.impact.join(" ")}`.toLowerCase();
      for (const term of bannedTerms) {
        expect(haystack.includes(term), `${cs.slug} unexpectedly contains "${term}"`).toBe(false);
      }
    }
  });

  it("getCaseStudyBySlug resolves valid slugs and returns undefined for unknown slugs", () => {
    expect(getCaseStudyBySlug("hardware-brand-partner-portals")?.slug).toBe("hardware-brand-partner-portals");
    expect(getCaseStudyBySlug("nonexistent")).toBeUndefined();
  });

  it("has no duplicate slugs", () => {
    const slugs = caseStudies.map((cs) => cs.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("case study <-> service cross-link mapping table (spec: docs/superpowers/specs/2026-08-18-dgdevworks-marketing-site-design.md)", () => {
  // Exact primary/secondary mapping table from the approved design spec.
  const EXPECTED_MAPPING: Record<CaseStudySlug, string[]> = {
    "bank-platform-modernization": ["modernization", "fractional"],
    "hardware-brand-partner-portals": ["marketing-sites"],
    "retail-pos-platform": ["mvp-development"],
    "stock-exchange-data-migration": ["mvp-development", "modernization"],
  };

  it("relatedServiceSlugs match the spec's mapping table exactly, in primary-then-secondary order", () => {
    for (const cs of caseStudies) {
      expect(cs.relatedServiceSlugs).toEqual(EXPECTED_MAPPING[cs.slug]);
    }
  });

  it("services.ts relatedCaseStudySlugs are the mirror image of the case study mapping (every case study that lists a service also appears in that service's related list)", () => {
    for (const cs of caseStudies) {
      for (const serviceSlug of cs.relatedServiceSlugs) {
        const service = services.find((s) => s.slug === serviceSlug);
        expect(service, `service "${serviceSlug}" referenced by ${cs.slug} does not exist`).toBeDefined();
        expect(
          service!.relatedCaseStudySlugs.includes(cs.slug),
          `service "${serviceSlug}" does not link back to case study "${cs.slug}"`
        ).toBe(true);
      }
    }
  });
});
