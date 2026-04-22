import { formulaChallenges, getChallengeById, getChallengesByTier } from "../../src/features/formulas/data/challenges";
import { FORMULA_LAUNCH_FUNCTIONS } from "../../src/features/formulas/data/constants";
import { formulasTrack } from "../../src/features/formulas/data/tracks";
import { formulasTrackTiers } from "../../src/features/formulas/data/tiers";
import { sumChallengeXp } from "../../src/lib/progression/xp";

describe("formulas track data", () => {
  it("defines the active formulas track metadata", () => {
    expect(formulasTrack.id).toBe("formulas");
    expect(formulasTrack.status).toBe("active");
    expect(formulasTrack.launchFunctionCount).toBe(FORMULA_LAUNCH_FUNCTIONS.length);
  });

  it("drafts the milestone-one challenge targets by tier", () => {
    expect(getChallengesByTier("beginner")).toHaveLength(10);
    expect(getChallengesByTier("intermediate")).toHaveLength(6);
    expect(getChallengesByTier("advanced")).toHaveLength(4);
    expect(formulaChallenges).toHaveLength(20);
  });

  it("keeps every beginner challenge within the launch function set", () => {
    const launchSet = new Set(FORMULA_LAUNCH_FUNCTIONS);
    const beginnerChallenges = getChallengesByTier("beginner");

    expect(beginnerChallenges.length).toBeGreaterThanOrEqual(8);

    beginnerChallenges.forEach((challenge) => {
      challenge.supportedFunctions.forEach((functionName) => {
        expect(launchSet.has(functionName)).toBe(true);
      });
    });
  });

  it("gives each drafted challenge a unique id and editable target cell", () => {
    const ids = new Set();

    formulaChallenges.forEach((challenge) => {
      expect(ids.has(challenge.id)).toBe(false);
      ids.add(challenge.id);
      expect(challenge.targetCells).toHaveLength(1);
      expect(challenge.grid.cells[challenge.targetCells[0]].editable).toBe(true);
    });
  });

  it("can look up a challenge by id and summarize total xp", () => {
    expect(getChallengeById("formulas-beginner-sum-q1-west")?.title).toBe("Q1 West Revenue Total");
    expect(sumChallengeXp(formulaChallenges)).toBeGreaterThan(0);
  });

  it("keeps tier metadata aligned with drafted content", () => {
    formulasTrackTiers.forEach((tier) => {
      expect(getChallengesByTier(tier.id).length).toBe(tier.challengeTarget);
    });
  });
});
