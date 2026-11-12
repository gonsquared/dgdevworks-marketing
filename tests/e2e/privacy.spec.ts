import { test, expect } from "./fixtures";

test.describe("Privacy policy modal", () => {
  test("contact form's Privacy Policy link opens the policy in a modal, and Esc closes it", async ({ page }) => {
    await page.goto("/contact");
    await page.locator("form").getByRole("button", { name: "Privacy Policy" }).click();

    const dialog = page.getByRole("dialog", { name: "Privacy Policy" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Your rights" })).toBeVisible();
    await expect(page).toHaveURL(/\/contact\/?$/);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("footer opens the modal on every page, and /#privacy deep-links to it", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("contentinfo").getByRole("button", { name: "Privacy Policy" }).click();
    await expect(page.getByRole("dialog", { name: "Privacy Policy" })).toBeVisible();

    await page.goto("/pricing#privacy");
    await expect(page.getByRole("dialog", { name: "Privacy Policy" })).toBeVisible();
  });
});
