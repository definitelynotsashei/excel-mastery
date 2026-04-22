import { formulaChallenges, getChallengesByTier } from "../features/formulas/data/challenges";
import { formulasTrackTiers } from "../features/formulas/data/tiers";

export function getDefaultFormulasChallenge() {
  return getChallengesByTier("beginner")[0] ?? null;
}

export function getRecommendedChallenge() {
  return getDefaultFormulasChallenge();
}

export function getChallengePosition(challengeId) {
  const challengeIndex = formulaChallenges.findIndex((challenge) => challenge.id === challengeId);

  if (challengeIndex < 0) {
    return null;
  }

  return {
    index: challengeIndex,
    total: formulaChallenges.length,
  };
}

export function getNextChallenge(challengeId) {
  const challengeIndex = formulaChallenges.findIndex((challenge) => challenge.id === challengeId);

  if (challengeIndex < 0 || challengeIndex === formulaChallenges.length - 1) {
    return null;
  }

  return formulaChallenges[challengeIndex + 1];
}

export function summarizeTierDrafts() {
  return formulasTrackTiers.map((tier) => ({
    ...tier,
    challengeCount: getChallengesByTier(tier.id).length,
  }));
}
