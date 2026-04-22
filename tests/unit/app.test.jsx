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
    expect(screen.getByRole("button", { name: /check answer/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reveal hint/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/formula input/i)).toBeInTheDocument();
  });

  it("renders the formulas track overview", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /formulas track/i }));

    expect(screen.getByRole("heading", { name: /formulas & functions/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /q1 west revenue total/i })).toBeInTheDocument();
  });

  it("shows feedback and review state after solving the recommended challenge", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /open challenge/i }));
    fireEvent.change(screen.getByLabelText(/formula input/i), {
      target: { value: "=SUM(B2:B5)" },
    });
    fireEvent.click(screen.getByRole("button", { name: /check answer/i }));

    expect(screen.getByText(/the target cell matches the expected result/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /sum adds all numeric values in a range/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next challenge: average support ticket time/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/completed on this device/i)).toBeInTheDocument();
  });

  it("can collapse the scenario brief and move to the next challenge after completion", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /open challenge/i }));

    expect(screen.getByText(/sales standup/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /collapse brief/i }));
    expect(screen.queryByText(/sales standup/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/formula input/i), {
      target: { value: "=SUM(B2:B5)" },
    });
    fireEvent.click(screen.getByRole("button", { name: /check answer/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /next challenge: average support ticket time/i }),
    );

    expect(screen.getByRole("heading", { name: /average support ticket time/i })).toBeInTheDocument();
    expect(screen.getByText(/support wants the average resolution time/i)).toBeInTheDocument();
  });

  it("updates dashboard and track progress after completing a challenge", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /open challenge/i }));
    fireEvent.change(screen.getByLabelText(/formula input/i), {
      target: { value: "=SUM(B2:B5)" },
    });
    fireEvent.click(screen.getByRole("button", { name: /check answer/i }));
    fireEvent.click(screen.getByRole("button", { name: /^dashboard$/i }));

    expect(
      screen.getByText(/1 of 20 formulas challenges solved on this device/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/^25$/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /formulas track/i }));

    expect(screen.getByText(/1\/10 complete/i)).toBeInTheDocument();
    expect(screen.getByText(/solved 3 stars/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /average support ticket time/i })).toBeInTheDocument();
  });
});
