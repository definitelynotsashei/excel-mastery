import { render, screen } from "@testing-library/react";
import App from "../../src/app/App";

describe("App", () => {
  it("renders the milestone scaffold summary", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /premium excel training built around realistic spreadsheet work/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/milestone 3: sandbox grid and formula bar/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/formula input/i)).toBeInTheDocument();
  });
});
