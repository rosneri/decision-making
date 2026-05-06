import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/ice";
import { score } from "@/frameworks/ice/data";

describe("<Ice />", () => {
  it("scores as I*C*E", () => {
    expect(score(sample.ideas[0]!)).toBe(7 * 8 * 9);
  });

  it("renders one row per idea", () => {
    render(<View data={sample} />);
    for (let i = 0; i < sample.ideas.length; i++) {
      expect(screen.getByTestId(`ice-row-${i}`)).toBeInTheDocument();
    }
  });
});
