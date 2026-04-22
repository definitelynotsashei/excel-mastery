import { formulaChallenges, getChallengesByTier } from "../../src/features/formulas/data/challenges";
import { formulasTrackTiers } from "../../src/features/formulas/data/tiers";
import {
  getChallengeCompletion,
  getCompletedChallengeCount,
  getCompletedChallengeIds,
  getEarnedStars,
  getEarnedXp,
  getRecommendedChallenge,
  getSessionLevel,
  summarizeTierProgress,
} from "../../src/lib/progression/session-progress";

describe("session progress helpers", () => {
  const progress = {
    "formulas-beginner-sum-q1-west": { completed: true, starsEarned: 3 },
    "formulas-beginner-average-ticket": { completed: true, starsEarned: 2 },
  };

  it("summarizes completed ids, xp, stars, and level", () => {
    expect(getCompletedChallengeIds(progress)).toEqual([
      "formulas-beginner-sum-q1-west",
      "formulas-beginner-average-ticket",
    ]);
    expect(getCompletedChallengeCount(progress)).toBe(2);
    expect(getEarnedXp(formulaChallenges, progress)).toBe(50);
    expect(getEarnedStars(progress)).toBe(5);
    expect(getSessionLevel(formulaChallenges, progress)).toBe(1);
  });

  it("returns challenge completion detail and the next recommended unsolved challenge", () => {
    expect(getChallengeCompletion(progress, "formulas-beginner-sum-q1-west")).toMatchObject({
      completed: true,
      starsEarned: 3,
    });
    expect(getRecommendedChallenge(formulaChallenges, progress)?.id).toBe(
      "formulas-beginner-count-completed",
    );
  });

  it("summarizes unlocked and completed counts per tier", () => {
    const beginnerProgress = Object.fromEntries(
      getChallengesByTier("beginner")
        .slice(0, 7)
        .map((challenge) => [challenge.id, { completed: true, starsEarned: 2 }]),
    );

    const tierSummary = summarizeTierProgress({
      tiers: formulasTrackTiers,
      getChallengesByTier,
      progressByChallengeId: beginnerProgress,
    });

    expect(tierSummary[0]).toMatchObject({
      id: "beginner",
      completedCount: 7,
      unlocked: true,
    });
    expect(tierSummary[1]).toMatchObject({
      id: "intermediate",
      unlocked: true,
    });
  });
});
