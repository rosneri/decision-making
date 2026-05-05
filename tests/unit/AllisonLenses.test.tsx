import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/allison-lenses";

describe("<AllisonLenses />", () => {
  it("identifies the loudest lens (highest weight)", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("allison-loudest")).toHaveTextContent("Organizational");
  });

  it("dropping that weight changes the loudest lens", () => {
    render(<View data={sample} />);
    fireEvent.change(screen.getByTestId("allison-organizational-weight"), { target: { value: "1" } });
    expect(screen.getByTestId("allison-loudest")).toHaveTextContent(/Politics|Rational/);
  });
});
