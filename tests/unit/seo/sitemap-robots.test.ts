import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { services } from "@/data/services";
import { caseStudies } from "@/data/caseStudies";
import { getSiteUrl } from "@/lib/env";

describe("app/sitemap.ts (E4-F1-S2)", () => {
  const entries = sitemap();

  it("statically generates entries for all 14 pre-rendered pages", () => {
    expect(entries).toHaveLength(14);
  });

  it("includes every static route", () => {
    const siteUrl = getSiteUrl();
    const urls = entries.map((e) => e.url);
    for (const path of ["/", "/services", "/work", "/about", "/pricing", "/contact"]) {
      expect(urls).toContain(`${siteUrl}${path === "/" ? "/" : path}`);
    }
  });

  it("includes an entry for every service and case study slug, driven by the same data used by generateStaticParams()", () => {
    const siteUrl = getSiteUrl();
    const urls = entries.map((e) => e.url);
    for (const service of services) {
      expect(urls).toContain(`${siteUrl}/services/${service.slug}`);
    }
    for (const cs of caseStudies) {
      expect(urls).toContain(`${siteUrl}/work/${cs.slug}`);
    }
  });

  it("all URLs use the canonical production domain from NEXT_PUBLIC_SITE_URL (no localhost/placeholder leaking through unexpectedly)", () => {
    const siteUrl = getSiteUrl();
    for (const entry of entries) {
      expect(entry.url.startsWith(siteUrl)).toBe(true);
    }
  });

  it("has no duplicate URLs", () => {
    const urls = entries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("app/robots.ts (E4-F1-S2)", () => {
  const result = robots();

  it("allows crawling of all routes", () => {
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rules.userAgent).toBe("*");
    expect(rules.allow).toBe("/");
  });

  it("references the sitemap using NEXT_PUBLIC_SITE_URL", () => {
    const siteUrl = getSiteUrl();
    expect(result.sitemap).toBe(`${siteUrl}/sitemap.xml`);
  });
});
