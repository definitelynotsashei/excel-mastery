import { calculateStars } from "../../src/lib/progression/stars";
import { computeLevelFromXp, sumChallengeXp } from "../../src/lib/progression/xp";
import {
  computeCompletionRate,
  countCompletedChallengeIds,
  isTierUnlocked,
} from "../../src/lib/progression/unlocks";
import { getChallengesByTier } from "../../src/features/formulas/data/challenges";

describe("progression helpers", () => {
  it("calculates star ratings from attempts and hints", () => {
    expect(calculateStars({ attempts: 1, hintsUsed: 0 })).toBe(3);
    expect(calculateStars({ attempts: 2, hintsUsed: 1 })).toBe(2);
    expect(calculateStars({ attempts: 3, hintsUsed: 2 })).toBe(1);
  });

  it("sums xp and derives levels from xp totals", () => {
    const beginnerChallenges = getChallengesByTier("beginner");
    const xp = sumChallengeXp(beginnerChallenges);

    expect(xp).toBeGreaterThan(0);
    expect(computeLevelFromXp(0)).toBe(1);
    expect(computeLevelFromXp(250)).toBe(3);
  });

  it("computes tier completion and unlock state", () => {
    const beginnerChallenges = getChallengesByTier("beginner");
    const completedIds = beginnerChallenges.slice(0, 7).map((challenge) => challenge.id);

    expect(countCompletedChallengeIds(beginnerChallenges, completedIds)).toBe(7);
    expect(computeCompletionRate(beginnerChallenges, completedIds)).toBe(0.7);
    expect(
      isTierUnlocked({
        tierOrder: 2,
        previousTierChallenges: beginnerChallenges,
        completedChallengeIds: completedIds,
      }),
    ).toBe(true);
  });

  it("always unlocks the first tier", () => {
    expect(
      isTierUnlocked({
        tierOrder: 1,
        previousTierChallenges: [],
        completedChallengeIds: [],
      }),
    ).toBe(true);
  });
});
