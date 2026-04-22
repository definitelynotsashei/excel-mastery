import {
  createStoredAppStatePayload,
  createStoredProgressPayload,
  normalizeStoredProgressRecord,
  normalizeStoredUiState,
  parseStoredAppStatePayload,
  parseStoredProgressPayload,
} from "../../src/lib/storage/progress-storage";

describe("progress storage helpers", () => {
  const challengeIds = [
    "formulas-beginner-sum-q1-west",
    "formulas-beginner-average-ticket",
  ];
  const viewIds = ["dashboard", "track", "challenge"];

  it("normalizes only valid completed challenge records", () => {
    expect(
      normalizeStoredProgressRecord(
        {
          "formulas-beginner-sum-q1-west": {
            completed: true,
            starsEarned: 5,
            submissionCount: 1,
            hintsUsed: 0,
          },
          "formulas-beginner-average-ticket": { completed: false, starsEarned: 2 },
          "unknown-challenge": { completed: true, starsEarned: 3 },
        },
        challengeIds,
      ),
    ).toEqual({
      "formulas-beginner-sum-q1-west": {
        completed: true,
        starsEarned: 3,
        submissionCount: 1,
        hintsUsed: 0,
      },
    });
  });

  it("normalizes only valid stored UI state values", () => {
    expect(
      normalizeStoredUiState(
        {
          currentView: "challenge",
          activeChallengeId: "formulas-beginner-average-ticket",
          extra: "ignore",
        },
        challengeIds,
        viewIds,
      ),
    ).toEqual({
      currentView: "challenge",
      activeChallengeId: "formulas-beginner-average-ticket",
    });
  });

  it("creates and parses the stored app-state shape", () => {
    const payload = createStoredAppStatePayload({
      progressByChallengeId: {
        "formulas-beginner-average-ticket": {
          completed: true,
          starsEarned: 2,
          submissionCount: 2,
          hintsUsed: 1,
        },
      },
      uiState: {
        currentView: "challenge",
        activeChallengeId: "formulas-beginner-average-ticket",
      },
    });

    expect(payload).toMatchObject({
      schemaVersion: 1,
      progressByChallengeId: {
        "formulas-beginner-average-ticket": {
          completed: true,
          starsEarned: 2,
          submissionCount: 2,
          hintsUsed: 1,
        },
      },
      uiState: {
        currentView: "challenge",
        activeChallengeId: "formulas-beginner-average-ticket",
      },
    });
    expect(typeof payload.updatedAt).toBe("string");

    expect(parseStoredAppStatePayload(payload, challengeIds, viewIds)).toEqual({
      progressByChallengeId: {
        "formulas-beginner-average-ticket": {
          completed: true,
          starsEarned: 2,
          submissionCount: 2,
          hintsUsed: 1,
        },
      },
      uiState: {
        currentView: "challenge",
        activeChallengeId: "formulas-beginner-average-ticket",
      },
    });
  });

  it("keeps backward compatibility with progress-only payloads", () => {
    const payload = createStoredProgressPayload({
      "formulas-beginner-average-ticket": {
        completed: true,
        starsEarned: 2,
      },
    });

    expect(parseStoredProgressPayload(payload, challengeIds)).toEqual({
      "formulas-beginner-average-ticket": {
        completed: true,
        starsEarned: 2,
        submissionCount: 0,
        hintsUsed: 0,
      },
    });
    expect(parseStoredAppStatePayload(payload, challengeIds, viewIds)).toEqual({
      progressByChallengeId: {
        "formulas-beginner-average-ticket": {
          completed: true,
          starsEarned: 2,
          submissionCount: 0,
          hintsUsed: 0,
        },
      },
      uiState: {},
    });
  });
});
