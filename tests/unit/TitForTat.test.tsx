import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { sample, View } from "@/frameworks/tit-for-tat";

describe("<TitForTat />", () => {
  it("you start cooperating regardless of them", () => {
    render(<View data={sample} />);
    const you = screen.getByTestId("tft-you");
    const first = within(you).getAllByRole("button")[0]!;
    expect(first).toHaveTextContent("C");
  });

  it("after they defect, you defect on the next round", () => {
    render(<View data={sample} />);
    // sample.rounds[2].them === "D" → you[3] should be "D"
    const you = screen.getByTestId("tft-you");
    expect(within(you).getAllByRole("button")[3]).toHaveTextContent("D");
  });

  it("flipping their move updates the row immediately", () => {
    render(<View data={sample} />);
    const them = screen.getByTestId("tft-them");
    fireEvent.click(within(them).getAllByRole("button")[0]!);
    expect(within(them).getAllByRole("button")[0]).toHaveTextContent("D");
  });
});
