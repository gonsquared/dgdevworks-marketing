// Uses tests/e2e/fixtures.ts (not "@playwright/test" directly) so the
// sitewide PortfolioDisclosureModal (E1-F4-S2) is pre-dismissed via
// sessionStorage and never inerts the header (hiding the theme toggle from
// the accessibility tree) mid-test.
import { test, expect } from "./fixtures";

test.describe("Theme toggle (E1-F2-S2)", () => {
  test("defaults to dark theme with no stored preference", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("toggling persists across a full page reload with no flash of the wrong theme", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Switch to light theme" });
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    // The blocking inline init script must apply data-theme before first
    // paint on reload — assert the attribute is already correct at
    // `domcontentloaded`, not just after hydration/React has run.
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
  });

  test("theme persists when navigating across routes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Switch to light theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.goto("/pricing", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("theme toggle has no flash of incorrect theme on first load with a pre-existing dark preference", async ({
    page,
    context,
  }) => {
    // Pre-seed localStorage the way a returning visitor would have it, then
    // load a fresh page and assert the very first paint's data-theme is
    // already correct (the blocking init script runs before React).
    await context.addInitScript(() => {
      window.localStorage.setItem("dgdevworks-theme", "dark");
    });
    const response = await page.goto("/services");
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("theme toggle has no flash of incorrect theme on first load with a pre-existing light preference", async ({
    page,
    context,
  }) => {
    // Light is no longer the default, so this branch of the blocking init
    // script needs its own explicit coverage (mirrors the old default test's
    // intent, now that "light" must be explicitly stored to appear).
    await context.addInitScript(() => {
      window.localStorage.setItem("dgdevworks-theme", "light");
    });
    const response = await page.goto("/services");
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });
});
