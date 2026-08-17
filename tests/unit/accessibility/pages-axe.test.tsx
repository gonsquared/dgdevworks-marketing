import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";

let currentPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
}));

import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

import HomePage from "@/app/page";
import ServicesIndexPage from "@/app/services/page";
import ServiceDetailPage, { generateStaticParams as serviceParams } from "@/app/services/[slug]/page";
import WorkIndexPage from "@/app/work/page";
import CaseStudyDetailPage, { generateStaticParams as caseStudyParams } from "@/app/work/[slug]/page";
import AboutPage from "@/app/about/page";
import PricingPage from "@/app/pricing/page";
import ContactPage from "@/app/contact/page";

/**
 * Renders Nav + page content + Footer together (approximating the real root
 * layout's chrome) and runs an axe scan against the full assembled DOM.
 * This is a jsdom-level accessibility audit — see E6-F1-S3 notes for how
 * this complements (rather than replaces) a live-browser Playwright+axe
 * scan, which this sandboxed environment could not execute end-to-end.
 */
async function renderFullPage(pathname: string, content: React.ReactElement) {
  currentPathname = pathname;
  return render(
    <>
      <Nav />
      <main id="main-content">{content}</main>
      <Footer />
    </>
  );
}

afterEach(() => {
  cleanup();
});

// AC scope is "no critical/serious violations" — axe also reports
// moderate/minor findings (e.g. heading-order) which are tracked separately
// (see qaFindings below) rather than failing this gate, matching the
// acceptance criterion's exact wording.
const CRITICAL_IMPACTS = new Set(["critical", "serious"]);
export const qaFindings: { route: string; impact: string; id: string; help: string }[] = [];

async function assertNoSeriousViolations(container: HTMLElement, route: string) {
  const results = await axe(container);
  for (const violation of results.violations) {
    qaFindings.push({ route, impact: violation.impact ?? "unknown", id: violation.id, help: violation.help });
  }
  const blocking = results.violations.filter((v) => CRITICAL_IMPACTS.has(v.impact ?? ""));
  expect(
    blocking,
    blocking
      .map((v) => `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s)) on ${route}`)
      .join("\n")
  ).toEqual([]);
}

describe("Accessibility audit — axe scan across all 14 rendered pages (E6-F1-S3)", () => {
  it("/ (Home) has no critical/serious axe violations", async () => {
    const { container } = await renderFullPage("/", <HomePage />);
    await assertNoSeriousViolations(container, "/");
  });

  it("/services (Services index) has no critical/serious axe violations", async () => {
    const { container } = await renderFullPage("/services", <ServicesIndexPage />);
    await assertNoSeriousViolations(container, "/services");
  });

  it("/work (Work index) has no critical/serious axe violations", async () => {
    const { container } = await renderFullPage("/work", <WorkIndexPage />);
    await assertNoSeriousViolations(container, "/work");
  });

  it("/about has no critical/serious axe violations", async () => {
    const { container } = await renderFullPage("/about", <AboutPage />);
    await assertNoSeriousViolations(container, "/about");
  });

  it("/pricing has no critical/serious axe violations", async () => {
    const { container } = await renderFullPage("/pricing", <PricingPage />);
    await assertNoSeriousViolations(container, "/pricing");
  });

  it("/contact has no critical/serious axe violations", async () => {
    const { container } = await renderFullPage("/contact", <ContactPage />);
    await assertNoSeriousViolations(container, "/contact");
  });

  const serviceSlugs = serviceParams().map((p) => p.slug);
  it.each(serviceSlugs)("/services/%s has no critical/serious axe violations", async (slug) => {
    const element = await ServiceDetailPage({ params: Promise.resolve({ slug }) });
    const { container } = await renderFullPage(`/services/${slug}`, element);
    await assertNoSeriousViolations(container, `/services/${slug}`);
  });

  const caseStudySlugs = caseStudyParams().map((p) => p.slug);
  it.each(caseStudySlugs)("/work/%s has no critical/serious axe violations", async (slug) => {
    const element = await CaseStudyDetailPage({ params: Promise.resolve({ slug }) });
    const { container } = await renderFullPage(`/work/${slug}`, element);
    await assertNoSeriousViolations(container, `/work/${slug}`);
  });

  it("prints a summary of any non-blocking (moderate/minor) findings for remediation tracking", () => {
    if (qaFindings.length > 0) {
      console.log(
        "[a11y] non-blocking findings (moderate/minor, not required by AC):",
        JSON.stringify(qaFindings, null, 2)
      );
    }
  });
});
