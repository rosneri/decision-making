import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/stp";

describe("<Stp />", () => {
  it("renders the chosen target", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("stp-target")).toHaveTextContent(sample.segments[sample.targetIdx]!);
  });

  it("clicking another segment changes the target", () => {
    render(<View data={sample} />);
    fireEvent.click(screen.getByTestId("stp-seg-0"));
    expect(screen.getByTestId("stp-target")).toHaveTextContent(sample.segments[0]!);
  });
});
