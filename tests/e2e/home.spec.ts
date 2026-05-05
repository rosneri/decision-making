import { expect, test } from "@playwright/test";

test("home page renders the Composer", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Begin with what you/i })).toBeVisible();
  await expect(page.getByPlaceholder(/What are you trying to decide/i)).toBeVisible();
});

test("frameworks page lists original framework sections", async ({ page }) => {
  await page.goto("/frameworks");
  await expect(page.locator("#decision_matrix")).toBeVisible();
  await expect(page.locator("#eisenhower")).toBeVisible();
  await expect(page.locator("#swot")).toBeVisible();
});
