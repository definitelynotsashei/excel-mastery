import { fireEvent, render, screen } from "@testing-library/react";
import App from "../../src/app/App";

describe("App", () => {
  it("renders the dashboard shell and can navigate into the formulas workspace", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /premium excel training built around realistic spreadsheet work/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: /recommended next challenge/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open challenge/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /open challenge/i }));

    expect(screen.getByRole("heading", { name: /q1 west revenue total/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back to track/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/formula input/i)).toBeInTheDocument();
  });

  it("renders the formulas track overview", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /formulas track/i }));

    expect(screen.getByRole("heading", { name: /formulas & functions/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /q1 west revenue total/i })).toBeInTheDocument();
  });
});
