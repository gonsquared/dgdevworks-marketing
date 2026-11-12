import { describe, it, expect } from "vitest";
import { caseStudies, getCaseStudyBySlug } from "@/data/caseStudies";
import { services } from "@/data/services";
import type { CaseStudySlug } from "@/data/types";

const EXPECTED_SLUGS: CaseStudySlug[] = [
  "dg-devteam",
  "n8n-reservation-automation",
  "moments-cafe-wordpress",
  "dgdevworks-marketing",
];

describe("src/data/caseStudies.ts (E2-F1-S2)", () => {
  it("exports exactly 4 entries (one per portfolio case study)", () => {
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
    expect(getCaseStudyBySlug("moments-cafe-wordpress")?.slug).toBe("moments-cafe-wordpress");
    expect(getCaseStudyBySlug("nonexistent")).toBeUndefined();
  });

  it("has no duplicate slugs", () => {
    const slugs = caseStudies.map((cs) => cs.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every entry has a headlineStat taken from its portfolio write-up, with non-empty value/label", () => {
    const EXPECTED: Record<CaseStudySlug, { value: string; label: string }> = {
      "dg-devteam": { value: "5", label: "delivery stages, each with a quality gate" },
      "n8n-reservation-automation": { value: "2", label: "coordinated workflows" },
      "moments-cafe-wordpress": { value: "7", label: "owner-editable details, no developer needed" },
      "dgdevworks-marketing": { value: "43", label: "user stories, planned and shipped by an agent team" },
    };
    for (const cs of caseStudies) {
      expect(cs.headlineStat, `${cs.slug} is missing headlineStat`).toBeDefined();
      expect(cs.headlineStat).toEqual(EXPECTED[cs.slug]);
    }
  });
});

describe("case study <-> service cross-link mapping table ", () => {
  // Exact primary/secondary mapping table from the approved design spec.
  const EXPECTED_MAPPING: Record<CaseStudySlug, string[]> = {
    "dg-devteam": ["fractional", "mvp-development"],
    "n8n-reservation-automation": ["mvp-development"],
    "moments-cafe-wordpress": ["marketing-sites"],
    "dgdevworks-marketing": ["marketing-sites"],
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

describe("portfolio sourcing", () => {
  it("every case study links to its full write-up on the portfolio, under the matching slug", () => {
    for (const cs of caseStudies) {
      expect(cs.fullCaseStudyUrl).toMatch(/^https:\/\//);
      expect(cs.fullCaseStudyUrl.endsWith(`/projects/${cs.slug}`)).toBe(true);
    }
  });

  it("every case study has a context line, tags, and a lead image served from /work/<slug>/ with alt text", () => {
    for (const cs of caseStudies) {
      expect(cs.context.length).toBeGreaterThan(0);
      expect(cs.tags.length).toBeGreaterThan(0);
      expect(cs.image?.src.startsWith(`/work/${cs.slug}/`)).toBe(true);
      expect(cs.image?.alt.length).toBeGreaterThan(0);
    }
  });
});

describe("case study images", () => {
  it("every referenced image (lead + screenshot gallery) exists under public/", async () => {
    const { existsSync } = await import("node:fs");
    const { join } = await import("node:path");
    for (const cs of caseStudies) {
      const srcs = [
        cs.image?.src,
        ...(cs.screenshots?.desktop ?? []).map((s) => s.src),
        ...(cs.screenshots?.mobile ?? []).map((s) => s.src),
      ].filter((s): s is string => Boolean(s));
      for (const src of srcs) {
        expect(existsSync(join(process.cwd(), "public", src)), `${cs.slug}: missing public${src}`).toBe(true);
      }
    }
  });

  it("the DG DevWorks marketing case study has both desktop and mobile screenshots with alt text", () => {
    const cs = getCaseStudyBySlug("dgdevworks-marketing")!;
    expect(cs.screenshots?.desktop.length).toBeGreaterThan(0);
    expect(cs.screenshots?.mobile.length).toBeGreaterThan(0);
    for (const shot of [...cs.screenshots!.desktop, ...cs.screenshots!.mobile]) {
      expect(shot.alt.length).toBeGreaterThan(0);
    }
  });
});
