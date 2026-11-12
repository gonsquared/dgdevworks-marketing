import { test, expect } from "./fixtures";

test.describe("Privacy policy", () => {
  test("contact form links to /privacy, which renders the full policy", async ({ page }) => {
    await page.goto("/contact");
    const form = page.locator("form");
    await form.getByRole("link", { name: "Privacy Policy" }).click();
    await expect(page).toHaveURL(/\/privacy\/?$/);
    await expect(page.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Your rights" })).toBeVisible();
  });

  test("footer links to /privacy on every page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/privacy"
    );
  });
});
