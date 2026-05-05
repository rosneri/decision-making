import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/markkula";

describe("<Markkula />", () => {
  it("identifies the weakest lens", () => {
    render(<View data={sample} />);
    // sample has rights=2 and justice=2 — first encountered (rights) wins tie
    expect(screen.getByTestId("markkula-weakest").textContent).toMatch(/Rights|Justice/);
  });
});
