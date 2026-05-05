import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/deterrence";

describe("<Deterrence />", () => {
  it("reports the weak link when any condition isn't 'yes'", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("deterrence-verdict")).toHaveTextContent(/Credibility/i);
  });

  it("toggling all conditions to 'yes' yields 'will hold'", () => {
    render(<View data={sample} />);
    // credibility starts as 'weak', cycle once → 'no', again → 'yes'
    const cred = screen.getByTestId("deterrence-credibility-state");
    fireEvent.click(cred);
    fireEvent.click(cred);
    expect(screen.getByTestId("deterrence-verdict")).toHaveTextContent(/will hold/i);
  });
});
