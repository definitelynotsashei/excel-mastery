import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const loadAppState = vi.fn();
const saveAppState = vi.fn();

vi.mock("../../src/lib/storage/progress-storage", () => ({
  loadAppState,
  saveAppState,
}));

describe("App persistence flow", () => {
  beforeEach(() => {
    vi.resetModules();
    loadAppState.mockReset();
    saveAppState.mockReset();
    loadAppState.mockResolvedValue({
      progressByChallengeId: {
        "formulas-beginner-sum-q1-west": {
          completed: true,
          starsEarned: 3,
          submissionCount: 1,
          hintsUsed: 0,
        },
      },
      uiState: {},
    });
    saveAppState.mockResolvedValue(undefined);
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
    expect(screen.getByText(/best run: 1 checks, 0 hints/i)).toBeInTheDocument();
  });

  it("hydrates the saved current view and active challenge", async () => {
    loadAppState.mockResolvedValue({
      progressByChallengeId: {},
      uiState: {
        currentView: "challenge",
        activeChallengeId: "formulas-beginner-average-ticket",
      },
    });

    const { default: App } = await import("../../src/app/App");

    render(<App />);

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /average support ticket time/i }),
      ).toBeInTheDocument(),
    );
  });

  it("saves updated progress and resume context after navigation and completion", async () => {
    const { default: App } = await import("../../src/app/App");

    render(<App />);

    await waitFor(() => expect(loadAppState).toHaveBeenCalled());

    fireEvent.click(screen.getByRole("button", { name: /formulas track/i }));
    fireEvent.click(screen.getByRole("button", { name: /average support ticket time/i }));
    fireEvent.change(screen.getByLabelText(/formula input/i), {
      target: { value: "=AVERAGE(C2:C6)" },
    });
    fireEvent.click(screen.getByRole("button", { name: /check answer/i }));

    await waitFor(() =>
      expect(saveAppState).toHaveBeenCalledWith(
        expect.objectContaining({
          progressByChallengeId: expect.objectContaining({
            "formulas-beginner-average-ticket": expect.objectContaining({
              completed: true,
              starsEarned: 3,
              submissionCount: 1,
              hintsUsed: 0,
            }),
          }),
          uiState: expect.objectContaining({
            currentView: "challenge",
            activeChallengeId: "formulas-beginner-average-ticket",
          }),
        }),
      ),
    );
  });
});
