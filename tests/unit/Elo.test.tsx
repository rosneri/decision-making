import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/elo";
import { ratingsAfter } from "@/frameworks/elo/data";

describe("<Elo />", () => {
  it("renders one row per player", () => {
    render(<View data={sample} />);
    for (let i = 0; i < sample.players.length; i++) {
      expect(screen.getByTestId(`elo-player-${i}`)).toBeInTheDocument();
    }
  });

  it("upset (lower-rated wins) gains more than even-rated win", () => {
    const upset = ratingsAfter({ ...sample, matches: [{ a: 0, b: 1, result: "A" }] });
    // Alex (1500) beats Bea (1620) — Alex gains > 16 because of underdog premium
    expect(upset[0]! - 1500).toBeGreaterThan(16);
  });
});
