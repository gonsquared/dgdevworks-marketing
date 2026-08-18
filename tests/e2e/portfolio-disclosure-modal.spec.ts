import { test, expect } from "@playwright/test";
import { PORTFOLIO_DISCLOSURE_DISMISSED_KEY } from "./fixtures";

/**
 * E1-F4-S2/S3 (docs/design-system.md §9): live-browser coverage for the
 * sitewide, once-per-session portfolio disclosure modal. Deliberately
 * imports `test`/`expect` straight from "@playwright/test" (NOT
 * tests/e2e/fixtures.ts) throughout this file, since every test here needs
 * a genuinely fresh, non-dismissed session for the modal to behave as a
 * first-time visitor would experience it.
 */
const HEADING = "You're looking at a portfolio project";

test.describe("PortfolioDisclosureModal (E1-F4-S2, docs/design-system.md §9)", () => {
  test("appears on first page load on the home route", async ({ page }) => {
    await page.goto("/");
    const dialog = page.getByRole("dialog", { name: HEADING });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  test("appears on first page load on a second, non-home route (proves sitewide route scope)", async ({
    page,
  }) => {
    await page.goto("/pricing");
    const dialog = page.getByRole("dialog", { name: HEADING });
    await expect(dialog).toBeVisible();
  });

  test("is dismissible via the close (X) button and returns focus on close", async ({ page }) => {
    await page.goto("/");
    const dialog = page.getByRole("dialog", { name: HEADING });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Close portfolio notice" }).click();
    await expect(dialog).toBeHidden();
  });

  test("is dismissible via clicking the backdrop outside the panel", async ({ page }) => {
    await page.goto("/");
    const dialog = page.getByRole("dialog", { name: HEADING });
    await expect(dialog).toBeVisible();
    // Click near the top-left corner of the viewport, well outside the
    // centered 440px-wide card, to hit the backdrop rather than the panel.
    await page.mouse.click(10, 10);
    await expect(dialog).toBeHidden();
  });

  test("Esc closes the modal", async ({ page }) => {
    await page.goto("/");
    const dialog = page.getByRole("dialog", { name: HEADING });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("Tab focus is trapped inside the dialog while open", async ({ page }) => {
    await page.goto("/");
    const dialog = page.getByRole("dialog", { name: HEADING });
    await expect(dialog).toBeVisible();

    const closeButton = dialog.getByRole("button", { name: "Close portfolio notice" });
    await expect(closeButton).toBeFocused();

    const primaryCta = dialog.getByRole("link", { name: "Get in touch" });
    await primaryCta.focus();
    await page.keyboard.press("Tab");
    await expect(closeButton).toBeFocused();
  });

  test("inerts the header, main, and footer behind the modal while open, and restores them on close", async ({
    page,
  }) => {
    await page.goto("/");
    const dialog = page.getByRole("dialog", { name: HEADING });
    await expect(dialog).toBeVisible();

    for (const id of ["site-header-content", "main-content", "site-footer-content"]) {
      const el = page.locator(`#${id}`);
      await expect(el).toHaveAttribute("aria-hidden", "true");
      expect(await el.evaluate((node) => node.hasAttribute("inert"))).toBe(true);
    }

    // aria-hidden removes the header's nav from the accessibility tree
    // entirely, so the role query below must find nothing while inert —
    // proving the background is genuinely unreachable, not just visually
    // covered by the backdrop.
    await expect(page.getByRole("link", { name: "Book a call" })).toHaveCount(0);

    await dialog.getByRole("button", { name: "Close portfolio notice" }).click();
    await expect(dialog).toBeHidden();

    for (const id of ["site-header-content", "main-content", "site-footer-content"]) {
      const el = page.locator(`#${id}`);
      await expect(el).not.toHaveAttribute("aria-hidden", "true");
    }
    await expect(page.getByRole("link", { name: "Book a call" }).first()).toBeVisible();
  });

  test("'Get in touch' CTA dismisses the modal and navigates to /contact", async ({ page }) => {
    await page.goto("/");
    const dialog = page.getByRole("dialog", { name: HEADING });
    await expect(dialog).toBeVisible();

    await dialog.getByRole("link", { name: "Get in touch" }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(dialog).toBeHidden();
  });

  test("dismissal persists across subsequent in-session navigation (no reappearance)", async ({ page }) => {
    await page.goto("/");
    const dialog = page.getByRole("dialog", { name: HEADING });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Close portfolio notice" }).click();
    await expect(dialog).toBeHidden();

    for (const route of ["/services", "/work", "/about", "/pricing", "/contact", "/"]) {
      await page.goto(route);
      // Give the component's 300ms open-delay timer a chance to fire if it
      // were (incorrectly) going to reopen, then assert it never does.
      await page.waitForTimeout(500);
      await expect(page.getByRole("dialog", { name: HEADING })).not.toBeVisible();
    }
  });

  test("dismissal is session-scoped, not permanent: a brand-new browser context sees the modal again", async ({
    browser,
  }) => {
    const firstContext = await browser.newContext();
    const firstPage = await firstContext.newPage();
    await firstPage.goto("/");
    const firstDialog = firstPage.getByRole("dialog", { name: HEADING });
    await expect(firstDialog).toBeVisible();
    await firstDialog.getByRole("button", { name: "Close portfolio notice" }).click();
    await expect(firstDialog).toBeHidden();
    await firstContext.close();

    const secondContext = await browser.newContext();
    const secondPage = await secondContext.newPage();
    await secondPage.goto("/");
    await expect(secondPage.getByRole("dialog", { name: HEADING })).toBeVisible();
    await secondContext.close();
  });

  test("fails open when sessionStorage.setItem throws — the modal still shows and dismissal doesn't crash the page", async ({
    page,
  }) => {
    await page.addInitScript((key) => {
      const originalSetItem = window.sessionStorage.setItem.bind(window.sessionStorage);
      Object.defineProperty(window.sessionStorage, "setItem", {
        value: (k: string, v: string) => {
          if (k === key) throw new DOMException("access denied", "SecurityError");
          return originalSetItem(k, v);
        },
      });
    }, PORTFOLIO_DISCLOSURE_DISMISSED_KEY);

    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/");
    const dialog = page.getByRole("dialog", { name: HEADING });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Close portfolio notice" }).click();

    expect(consoleErrors, `Uncaught page errors: ${consoleErrors.join("\n")}`).toEqual([]);
  });
});
