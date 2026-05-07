import { expect, test } from "@playwright/test";
import { SAMPLES } from "../../src/frameworks";

test.describe("chat-fill happy path", () => {
  test("opens the chat panel, sends a message, and applies the patched framework", async ({ page }) => {
    // ── Stub /api/analyze so we land on the result page deterministically ──
    await page.route("**/api/analyze", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(SAMPLES.eisenhower),
      });
    });

    // ── Stub /api/chat-fill: kickoff turn, then a turn that patches the data ──
    const patched = {
      ...SAMPLES.eisenhower,
      tasks: [
        ...SAMPLES.eisenhower.tasks,
        { text: "Send investor update", urgent: true, important: true },
      ],
    };
    let chatCallCount = 0;
    await page.route("**/api/chat-fill", async (route) => {
      const body = JSON.parse(route.request().postData() ?? "{}") as {
        kickoff?: boolean;
        messages?: { role: string; content: string }[];
      };
      chatCallCount += 1;
      if (body.kickoff) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            reply: "What's the most pressing thing on your plate?",
            updatedData: null,
            done: false,
          }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          reply: "Got it — added 'Send investor update' to Do First.",
          updatedData: patched,
          done: false,
        }),
      });
    });

    // ── Walk through compose → reading → result ──
    await page.goto("/");
    await page
      .getByPlaceholder(/What are you trying to decide/i)
      .fill("How should I prioritize this week?");
    await page.getByRole("button", { name: /Decide/i }).click();

    // Result page renders the framework header
    await expect(page.getByRole("heading", { name: /Eisenhower Matrix/i })).toBeVisible();

    // Switch to Advanced mode so the framework form and chat button are visible
    await page.getByRole("button", { name: /Advanced/i }).click();

    // Open the chat panel from the description-line button
    await page.getByRole("button", { name: /Fill by chatting/i }).click();

    // The kickoff message arrives
    await expect(
      page.getByText(/most pressing thing on your plate/i),
    ).toBeVisible();

    // Send a reply and confirm the patched data lands
    const textarea = page.getByPlaceholder(/Type your answer/i);
    await textarea.fill("Send investor update tomorrow.");
    await page.getByRole("button", { name: /^Send$/i }).click();

    await expect(page.getByText(/added 'Send investor update'/i)).toBeVisible();
    await expect(page.getByText(/framework updated/i)).toBeVisible();

    // The framework view should now show the new task
    await expect(page.locator(`input[value="Send investor update"]`)).toBeVisible();

    // Close the panel
    await page.getByRole("button", { name: /Close chat/i }).click();
    await expect(page.getByPlaceholder(/Type your answer/i)).not.toBeVisible();

    expect(chatCallCount).toBe(2);
  });
});
