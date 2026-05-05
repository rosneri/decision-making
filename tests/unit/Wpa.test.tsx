import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { sample, View } from "@/frameworks/wpa";

describe("<Wpa />", () => {
  it("highlights the option with highest WP", () => {
    render(<View data={sample} />);
    const goForIt = screen.getByTestId("wpa-option-1"); // Go for it = 0.47 > 0.41
    expect(within(goForIt).getByText(/★ pick/i)).toBeInTheDocument();
  });

  it("dropping that WP shifts the pick to the other option", () => {
    render(<View data={sample} />);
    fireEvent.change(screen.getByTestId("wpa-wp-1"), { target: { value: "0.10" } });
    const punt = screen.getByTestId("wpa-option-0");
    expect(within(punt).getByText(/★ pick/i)).toBeInTheDocument();
  });
});
