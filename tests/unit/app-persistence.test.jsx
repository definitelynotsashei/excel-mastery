import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const loadProgressState = vi.fn();
const saveProgressState = vi.fn();

vi.mock("../../src/lib/storage/progress-storage", () => ({
  loadProgressState,
  saveProgressState,
}));

describe("App persistence flow", () => {
  beforeEach(() => {
    vi.resetModules();
    loadProgressState.mockReset();
    saveProgressState.mockReset();
    loadProgressState.mockResolvedValue({
      "formulas-beginner-sum-q1-west": {
        completed: true,
        starsEarned: 3,
      },
    });
    saveProgressState.mockResolvedValue(undefined);
  });

  it("hydrates saved progress into the dashboard and track view", async () => {
    const { default: App } = await import("../../src/app/App");

    render(<App />);

    await waitFor(() =>
      expect(
        screen.getByText(/1 of 20 formulas challenges solved on this device/i),
      ).toBeInTheDocument(),
    );

    expect(screen.getByText(/saved locally/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /formulas track/i }));

    expect(screen.getByText(/1\/10 complete/i)).toBeInTheDocument();
    expect(screen.getByText(/solved 3 stars/i)).toBeInTheDocument();
  });

  it("saves updated progress after a challenge is solved", async () => {
    const { default: App } = await import("../../src/app/App");

    render(<App />);

    await waitFor(() => expect(loadProgressState).toHaveBeenCalled());

    fireEvent.click(screen.getByRole("button", { name: /open challenge/i }));
    fireEvent.change(screen.getByLabelText(/formula input/i), {
      target: { value: "=SUM(B2:B5)" },
    });
    fireEvent.click(screen.getByRole("button", { name: /check answer/i }));

    await waitFor(() =>
      expect(saveProgressState).toHaveBeenCalledWith(
        expect.objectContaining({
          "formulas-beginner-sum-q1-west": expect.objectContaining({
            completed: true,
            starsEarned: 3,
          }),
        }),
      ),
    );
  });
});
