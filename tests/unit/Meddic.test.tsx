import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/meddic";

describe("<Meddic />", () => {
  it("reports the open (unconfirmed) cells", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("meddic-open").textContent).toMatch(/Decision Process/i);
  });

  it("confirming the open cell flips it to 'all confirmed'", () => {
    render(<View data={sample} />);
    fireEvent.click(screen.getByTestId("meddic-decision_process-confirm"));
    expect(screen.getByTestId("meddic-open")).toHaveTextContent(/all confirmed/i);
  });
});
