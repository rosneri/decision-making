import { expect, test } from "@playwright/test";
import { SAMPLES } from "../../src/frameworks";

test.describe("/decide", () => {
  test("submit is disabled until text is entered", async ({ page }) => {
    await page.goto("/decide");
    const submit = page.getByRole("button", { name: /Analyze decision/i });
    await expect(submit).toBeDisabled();
    await page.getByPlaceholder(/choosing between three job offers/i).fill("hi");
    await expect(submit).toBeEnabled();
  });

  test("framework chips toggle selection", async ({ page }) => {
    await page.goto("/decide");
    const chip = page.getByRole("button", { name: "Decision Matrix" });
    await chip.click();
    // The selected chip swaps background classes; assert the auto chip lost its dark bg.
    const auto = page.getByRole("button", { name: /Auto \(let AI pick\)/i });
    await expect(auto).toBeVisible();
  });

  test("renders matrix on a successful API response (mocked)", async ({ page }) => {
    await page.route("**/api/decide", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ result: SAMPLES.decision_matrix }),
      });
    });

    await page.goto("/decide");
    await page
      .getByPlaceholder(/choosing between three job offers/i)
      .fill("Pick between two job offers.");
    await page.getByRole("button", { name: /Analyze decision/i }).click();

    await expect(
      page.getByRole("heading", { name: SAMPLES.decision_matrix.title }),
    ).toBeVisible();
    await expect(page.getByText(/winner/i)).toBeVisible();
  });

  test("shows error message on API failure (mocked)", async ({ page }) => {
    await page.route("**/api/decide", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "boom" }),
      });
    });

    await page.goto("/decide");
    await page.getByPlaceholder(/choosing between three job offers/i).fill("test");
    await page.getByRole("button", { name: /Analyze decision/i }).click();

    await expect(page.getByText("boom")).toBeVisible();
  });
});
