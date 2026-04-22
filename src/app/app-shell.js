import { getChallengesByTier } from "../features/formulas/data/challenges";
import { formulasTrackTiers } from "../features/formulas/data/tiers";

export function getDefaultFormulasChallenge() {
  return getChallengesByTier("beginner")[0] ?? null;
}

export function getRecommendedChallenge() {
  return getDefaultFormulasChallenge();
}

export function summarizeTierDrafts() {
  return formulasTrackTiers.map((tier) => ({
    ...tier,
    challengeCount: getChallengesByTier(tier.id).length,
  }));
}
