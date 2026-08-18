import { test as base, expect } from "@playwright/test";

export const PORTFOLIO_DISCLOSURE_DISMISSED_KEY = "dgdevworks-portfolio-disclosure-dismissed";

/**
 * Shared fixture for the pre-existing E2E suite (everything except the tests
 * that specifically exercise PortfolioDisclosureModal, E1-F4-S2/§9). The
 * modal is sitewide and opens on any route roughly 300ms after first mount
 * whenever sessionStorage has no dismissal flag — which is the case for
 * every fresh Playwright browser context. Left unhandled, it intercepts
 * pointer events (blocking clicks on links/buttons behind its backdrop) and
 * inerts+aria-hides the header/main/footer landmarks, which breaks
 * unrelated flows (nav, theme toggle, case-study navigation, etc.) in a way
 * that's timing-dependent and flaky rather than a real regression in those
 * features.
 *
 * This fixture seeds the same sessionStorage flag the component itself
 * checks via an init script, so the modal never opens for specs that aren't
 * testing it. Specs that DO need to see the modal (tests/e2e/
 * portfolio-disclosure-modal.spec.ts and the modal-open axe scan in
 * accessibility.spec.ts) must import `test`/`expect` from
 * "@playwright/test" directly instead of this file.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript((key) => {
      try {
        window.sessionStorage.setItem(key, "true");
      } catch {
        // Matches the component's own fail-open behavior — if sessionStorage
        // is unavailable, the modal will open regardless; nothing to do here.
      }
    }, PORTFOLIO_DISCLOSURE_DISMISSED_KEY);
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright fixture's use(), not a React hook
    await use(page);
  },
});

export { expect };
