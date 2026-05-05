import { expect, test } from "@playwright/test";
import { SAMPLES } from "../../src/frameworks";

test.describe("/decide", () => {
  test("submit is disabled until text is entered", async ({ page }) => {
    await page.goto("/decide");
    const submit = page.getByRole("button", { name: /Analyse decision/i });
    await expect(submit).toBeDisabled();
    await page.getByPlaceholder(/What are you trying to decide/i).fill("hi");
    await expect(submit).toBeEnabled();
  });

  test("framework chips toggle selection", async ({ page }) => {
    await page.goto("/decide");
    const auto = page.getByRole("button", { name: /Auto — let AI decide/i });
    await expect(auto).toBeVisible();
    const chip = page.getByRole("button", { name: "Decision Matrix" });
    await chip.click();
    await expect(chip).toBeVisible();
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
      .getByPlaceholder(/What are you trying to decide/i)
      .fill("Pick between two job offers.");
    await page.getByRole("button", { name: /Analyse decision/i }).click();

    await expect(page.locator(`input[value="${SAMPLES.decision_matrix.options[0]!.name}"]`)).toBeVisible();
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
    await page.getByPlaceholder(/What are you trying to decide/i).fill("test");
    await page.getByRole("button", { name: /Analyse decision/i }).click();

    await expect(page.getByText("boom")).toBeVisible();
  });
});
