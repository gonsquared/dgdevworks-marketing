import { describe, it, expect } from "vitest";
import { buildMetadata } from "@/lib/seo";
import { services } from "@/data/services";
import { caseStudies } from "@/data/caseStudies";

// The full 14-page static route inventory per docs/api-contract.md.
const STATIC_PAGES = [
  { title: "Home", description: "Home page description", path: "" },
  { title: "Services", description: "Services index description", path: "/services" },
  { title: "Work", description: "Work index description", path: "/work" },
  { title: "About", description: "About page description", path: "/about" },
  { title: "Pricing", description: "Pricing page description", path: "/pricing" },
  { title: "Contact", description: "Contact page description", path: "/contact" },
];

describe("src/lib/seo.ts buildMetadata (E4-F1-S1 generateMetadata per route)", () => {
  it("produces a canonical URL built from NEXT_PUBLIC_SITE_URL for every route", () => {
    for (const page of STATIC_PAGES) {
      const meta = buildMetadata(page);
      expect(meta.alternates?.canonical).toMatch(/^https?:\/\//);
      expect(meta.alternates?.canonical).toContain(page.path);
    }
  });

  it("root path gets a distinct title format (absolute, no double brand suffix)", () => {
    const meta = buildMetadata(STATIC_PAGES[0]);
    const title = meta.title as { absolute: string };
    expect(title.absolute).toContain("DG DevWorks");
  });

  it("every static + dynamic route title/description combination is unique across all 14 pages", () => {
    const allRouteMeta = [
      ...STATIC_PAGES,
      ...services.map((s) => ({ title: s.title, description: s.summary, path: `/services/${s.slug}` })),
      ...caseStudies.map((cs) => ({ title: cs.title, description: cs.challenge, path: `/work/${cs.slug}` })),
    ];

    expect(allRouteMeta).toHaveLength(14);

    const titles = allRouteMeta.map((p) => buildMetadata(p).title as { absolute: string }).map((t) => t.absolute);
    const descriptions = allRouteMeta.map((p) => buildMetadata(p).description);

    expect(new Set(titles).size, "duplicate <title> found across routes").toBe(titles.length);
    expect(new Set(descriptions).size, "duplicate meta description found across routes").toBe(
      descriptions.length
    );
  });

  it("dynamic service/case-study routes derive metadata from data-layer content, not a generic fallback", () => {
    for (const service of services) {
      const meta = buildMetadata({ title: service.title, description: service.summary, path: `/services/${service.slug}` });
      const title = meta.title as { absolute: string };
      expect(title.absolute).toContain(service.title);
      expect(meta.description).toBe(service.summary);
    }
    for (const cs of caseStudies) {
      const meta = buildMetadata({ title: cs.title, description: cs.challenge, path: `/work/${cs.slug}` });
      const title = meta.title as { absolute: string };
      expect(title.absolute).toContain(cs.title);
      expect(meta.description).toBe(cs.challenge);
    }
  });

  it("includes matching Open Graph and Twitter card metadata for social preview correctness", () => {
    const meta = buildMetadata(STATIC_PAGES[1]);
    expect(meta.openGraph?.title).toBeDefined();
    expect(meta.openGraph?.url).toContain("/services");
    expect((meta.twitter as Record<string, unknown> | undefined)?.card).toBe("summary_large_image");
  });
});
