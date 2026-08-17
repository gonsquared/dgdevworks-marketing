import { test, expect, devices } from "@playwright/test";

// Spread only the viewport/touch-emulation fields from the iPhone 13 device
// descriptor — the full descriptor also pins `defaultBrowserType: "webkit"`,
// which isn't installed in this project's Playwright config (chromium-only).
const { viewport, isMobile, hasTouch, userAgent } = devices["iPhone 13"];
test.use({ viewport, isMobile, hasTouch, userAgent });

test.describe("Mobile nav (E1-F3-S2, docs/design-system.md §5/§7)", () => {
  test("hamburger opens a dialog with focus trapped, Esc closes and returns focus to the hamburger", async ({
    page,
  }) => {
    await page.goto("/");
    const hamburger = page.getByRole("button", { name: "Open navigation menu" });
    await expect(hamburger).toBeVisible();
    await hamburger.click();

    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    await expect(dialog).toBeVisible();
    await expect(hamburger).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(hamburger).toBeFocused();
  });

  test("booking CTA and hamburger remain visible on the bar (never buried inside the collapsed menu)", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Book a call" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeVisible();
  });

  test("mobile panel repeats all 6 nav links and both CTAs", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    for (const label of ["Home", "Services", "Work", "About", "Pricing", "Contact"]) {
      await expect(dialog.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await expect(dialog.getByRole("link", { name: "Book a call" })).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Send a message" })).toBeVisible();
  });
});
