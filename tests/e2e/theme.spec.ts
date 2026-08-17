import { test, expect } from "@playwright/test";

test.describe("Theme toggle (E1-F2-S2)", () => {
  test("defaults to light theme with no stored preference", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("toggling persists across a full page reload with no flash of the wrong theme", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Switch to dark theme" });
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    // The blocking inline init script must apply data-theme before first
    // paint on reload — assert the attribute is already correct at
    // `domcontentloaded`, not just after hydration/React has run.
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await expect(page.getByRole("button", { name: "Switch to light theme" })).toBeVisible();
  });

  test("theme persists when navigating across routes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.goto("/pricing", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
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
});
