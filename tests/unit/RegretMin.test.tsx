import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/regret-min";

describe("<RegretMin />", () => {
  it("identifies the option with greatest regret-asymmetry", () => {
    render(<View data={sample} />);
    // Moonshot: 8-2 = 6; Safe: 3-6 = -3 → Moonshot wins
    expect(screen.getByTestId("regret-best")).toHaveTextContent("Moonshot");
  });
});
