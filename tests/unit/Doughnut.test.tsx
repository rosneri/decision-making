import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { sample, View } from "@/frameworks/doughnut";

describe("<Doughnut />", () => {
  it("renders shortfalls and overshoots", () => {
    render(<View data={sample} />);
    const shortfalls = screen.getByTestId("doughnut-shortfalls");
    expect(within(shortfalls).getByDisplayValue("housing")).toBeInTheDocument();
    const overshoots = screen.getByTestId("doughnut-overshoots");
    expect(within(overshoots).getByDisplayValue("CO₂")).toBeInTheDocument();
  });

  it("adding a shortfall extends the list", () => {
    render(<View data={sample} />);
    const shortfalls = screen.getByTestId("doughnut-shortfalls");
    const column = shortfalls.parentElement!;
    fireEvent.click(within(column).getByText("+ add"));
    expect(within(shortfalls).getAllByRole("textbox").length).toBe(sample.shortfalls.length + 1);
  });
});
