import {
  createStoredProgressPayload,
  normalizeStoredProgressRecord,
  parseStoredProgressPayload,
} from "../../src/lib/storage/progress-storage";

describe("progress storage helpers", () => {
  const challengeIds = [
    "formulas-beginner-sum-q1-west",
    "formulas-beginner-average-ticket",
  ];

  it("normalizes only valid completed challenge records", () => {
    expect(
      normalizeStoredProgressRecord(
        {
          "formulas-beginner-sum-q1-west": { completed: true, starsEarned: 5 },
          "formulas-beginner-average-ticket": { completed: false, starsEarned: 2 },
          "unknown-challenge": { completed: true, starsEarned: 3 },
        },
        challengeIds,
      ),
    ).toEqual({
      "formulas-beginner-sum-q1-west": {
        completed: true,
        starsEarned: 3,
      },
    });
  });

  it("creates and parses the stored payload shape", () => {
    const payload = createStoredProgressPayload({
      "formulas-beginner-average-ticket": {
        completed: true,
        starsEarned: 2,
      },
    });

    expect(payload).toMatchObject({
      schemaVersion: 1,
      progressByChallengeId: {
        "formulas-beginner-average-ticket": {
          completed: true,
          starsEarned: 2,
        },
      },
    });
    expect(typeof payload.updatedAt).toBe("string");

    expect(parseStoredProgressPayload(payload, challengeIds)).toEqual({
      "formulas-beginner-average-ticket": {
        completed: true,
        starsEarned: 2,
      },
    });
  });
});
