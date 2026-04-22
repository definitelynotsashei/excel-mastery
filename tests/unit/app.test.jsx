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

    expect(screen.getByText(/milestone 1: challenge model and curriculum data/i)).toBeInTheDocument();
  });
});
