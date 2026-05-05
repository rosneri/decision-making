import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/tki";

describe("<Tki />", () => {
  it("identifies the closest mode for the given coords", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("tki-closest")).toHaveTextContent("collaborate");
  });

  it("low-coop, high-assert maps to compete", () => {
    render(<View data={{ ...sample, assertiveness: 9, cooperativeness: 1 }} />);
    expect(screen.getByTestId("tki-closest")).toHaveTextContent("compete");
  });

  it("dragging the slider updates the closest mode", () => {
    render(<View data={sample} />);
    fireEvent.change(screen.getByTestId("tki-coop"), { target: { value: "1" } });
    fireEvent.change(screen.getByTestId("tki-assertiveness"), { target: { value: "1" } });
    expect(screen.getByTestId("tki-closest")).toHaveTextContent("avoid");
  });
});
