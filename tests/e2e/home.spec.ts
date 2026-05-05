import { expect, test } from "@playwright/test";

test("home page renders headline and framework cards", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /make better decisions/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Make a decision/i })).toBeVisible();
  await expect(page.getByText(/Decision Matrix/i).first()).toBeVisible();
  await expect(page.getByText(/Eisenhower Matrix/i).first()).toBeVisible();
  await expect(page.getByText(/SWOT Analysis/i).first()).toBeVisible();
});

test("can navigate from home to decide page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Make a decision/i }).click();
  await expect(page).toHaveURL(/\/decide$/);
  await expect(page.getByRole("heading", { name: /Make a decision/i })).toBeVisible();
  await expect(page.getByPlaceholder(/choosing between three job offers/i)).toBeVisible();
});

test("frameworks page shows all three sample renderings", async ({ page }) => {
  await page.goto("/frameworks");
  await expect(page.locator("#decision_matrix")).toBeVisible();
  await expect(page.locator("#eisenhower")).toBeVisible();
  await expect(page.locator("#swot")).toBeVisible();
});
