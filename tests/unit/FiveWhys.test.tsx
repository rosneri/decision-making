import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/five-whys";

describe("<FiveWhys />", () => {
  it("renders the symptom + each why", () => {
    render(<View data={sample} />);
    expect(screen.getByDisplayValue(sample.problem)).toBeInTheDocument();
    for (let i = 0; i < sample.whys.length; i++) {
      expect(screen.getByTestId(`why-${i}`)).toBeInTheDocument();
    }
  });

  it("the last why is marked as the root cause", () => {
    render(<View data={sample} />);
    const last = screen.getByTestId(`why-${sample.whys.length - 1}`);
    expect(last).toHaveTextContent(/Root/i);
  });

  it("adding a why pushes the root marker to the new last item", () => {
    render(<View data={sample} />);
    fireEvent.click(screen.getByText("+ another why"));
    const newLast = screen.getByTestId(`why-${sample.whys.length}`);
    expect(newLast).toHaveTextContent(/Root/i);
  });
});
