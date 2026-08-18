// Uses tests/e2e/fixtures.ts (not "@playwright/test" directly) so the
// sitewide PortfolioDisclosureModal (E1-F4-S2) is pre-dismissed via
// sessionStorage — it adds an extra <div role="dialog"> otherwise, which is
// irrelevant noise for these metadata/sitemap/JSON-LD assertions.
import { test, expect } from "./fixtures";

/**
 * E6-F1-S4: cross-route SEO validation against the actual built static
 * export output — metadata uniqueness, sitemap/robots correctness, and
 * JSON-LD presence/parseability on every route.
 */
const STATIC_ROUTES = ["/", "/services", "/work", "/about", "/pricing", "/contact"];
const SERVICE_ROUTES = [
  "/services/mvp-development",
  "/services/marketing-sites",
  "/services/modernization",
  "/services/fractional",
];
const CASE_STUDY_ROUTES = [
  "/work/bank-platform-modernization",
  "/work/hardware-brand-partner-portals",
  "/work/retail-pos-platform",
  "/work/stock-exchange-data-migration",
];
const ALL_ROUTES = [...STATIC_ROUTES, ...SERVICE_ROUTES, ...CASE_STUDY_ROUTES];

test.describe("SEO: sitemap.xml (E4-F1-S2)", () => {
  test("lists all 14 pages", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const body = await response.text();
    for (const route of ALL_ROUTES) {
      const suffix = route === "/" ? "" : route;
      expect(body.includes(`${suffix}</loc>`) || body.includes(`${suffix}<`)).toBe(true);
    }
    // 14 <loc> entries total.
    const locCount = (body.match(/<loc>/g) ?? []).length;
    expect(locCount).toBe(14);
  });
});

test.describe("SEO: robots.txt (E4-F1-S2)", () => {
  test("allows crawling and references the sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toMatch(/User-agent:\s*\*/i);
    expect(body).toMatch(/Allow:\s*\//i);
    expect(body).toMatch(/Sitemap:\s*https?:\/\//i);
  });
});

test.describe("SEO: per-route metadata uniqueness (E4-F1-S1, E6-F1-S4)", () => {
  test("no two routes share an identical <title> or meta description", async ({ page }) => {
    const titles = new Map<string, string>();
    const descriptions = new Map<string, string>();

    for (const route of ALL_ROUTES) {
      await page.goto(route);
      const title = await page.title();
      const description = await page.locator('meta[name="description"]').getAttribute("content");

      expect(title.length, `${route} has an empty title`).toBeGreaterThan(0);
      expect(description?.length ?? 0, `${route} has an empty description`).toBeGreaterThan(0);

      expect(titles.has(title), `Duplicate <title> "${title}" on ${route} (already used by ${titles.get(title)})`).toBe(
        false
      );
      expect(
        descriptions.has(description!),
        `Duplicate description on ${route} (already used by ${descriptions.get(description!)})`
      ).toBe(false);

      titles.set(title, route);
      descriptions.set(description!, route);
    }
  });

  test("every route declares a canonical link", async ({ page }) => {
    for (const route of ALL_ROUTES) {
      await page.goto(route);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical, `${route} missing canonical link`).toBeTruthy();
    }
  });
});

test.describe("SEO: JSON-LD structured data (E4-F3-S1/S2/S3, E6-F1-S4)", () => {
  test("Person/ProfessionalService JSON-LD is present and parses on every route", async ({ page }) => {
    for (const route of STATIC_ROUTES) {
      await page.goto(route);
      const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(scripts.length, `${route} missing JSON-LD`).toBeGreaterThan(0);
      const parsedBlocks = scripts.map((s) => JSON.parse(s));
      const hasPersonService = parsedBlocks.some(
        (block) =>
          block["@graph"]?.some((node: { "@type": string }) => node["@type"] === "ProfessionalService")
      );
      expect(hasPersonService, `${route} missing ProfessionalService JSON-LD`).toBe(true);
    }
  });

  test("Service JSON-LD is present, parseable, and distinct per /services/[slug] page", async ({ page }) => {
    const names = new Set<string>();
    for (const route of SERVICE_ROUTES) {
      await page.goto(route);
      const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      const parsedBlocks = scripts.map((s) => JSON.parse(s));
      const serviceBlock = parsedBlocks.find((b) => b["@type"] === "Service");
      expect(serviceBlock, `${route} missing Service JSON-LD`).toBeTruthy();
      expect(names.has(serviceBlock.name)).toBe(false);
      names.add(serviceBlock.name);
    }
  });

  test("FAQPage JSON-LD on /pricing and /contact matches the visible FAQ content", async ({ page }) => {
    for (const route of ["/pricing", "/contact"]) {
      await page.goto(route);
      const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      const parsedBlocks = scripts.map((s) => JSON.parse(s));
      const faqBlock = parsedBlocks.find((b) => b["@type"] === "FAQPage");
      expect(faqBlock, `${route} missing FAQPage JSON-LD`).toBeTruthy();
      expect(faqBlock.mainEntity.length).toBeGreaterThan(0);

      const firstQuestion = faqBlock.mainEntity[0].name;
      await expect(page.getByText(firstQuestion)).toBeVisible();
    }
  });
});

test.describe("SEO: Open Graph images (E4-F2-S1/S2)", () => {
  test("root and every dynamic route's opengraph-image responds with an image", async ({ request }) => {
    const paths = [
      "/opengraph-image",
      ...SERVICE_ROUTES.map((r) => `${r}/opengraph-image`),
      ...CASE_STUDY_ROUTES.map((r) => `${r}/opengraph-image`),
    ];
    for (const path of paths) {
      const response = await request.get(path);
      expect(response.status(), `${path} did not respond 200`).toBe(200);
      // Verify by magic bytes rather than the Content-Type header: the plain
      // static file server used for this E2E run doesn't MIME-sniff
      // extensionless files the way Next.js's own route handler (or
      // Vercel's Next.js Runtime build) does in production. See QA report
      // for a recommendation to verify the real Content-Type header on an
      // actual Vercel deployment before launch.
      const body = await response.body();
      const isPng = body.length > 8 && body[0] === 0x89 && body[1] === 0x50 && body[2] === 0x4e && body[3] === 0x47;
      expect(isPng, `${path} did not return valid PNG bytes`).toBe(true);
    }
  });
});
