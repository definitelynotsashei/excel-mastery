import { computeLevelFromXp } from "./xp";
import { countCompletedChallengeIds, isTierUnlocked } from "./unlocks";

export function getCompletedChallengeIds(progressByChallengeId) {
  return Object.entries(progressByChallengeId)
    .filter(([, progress]) => progress?.completed)
    .map(([challengeId]) => challengeId);
}

export function getChallengeCompletion(progressByChallengeId, challengeId) {
  return progressByChallengeId[challengeId] ?? null;
}

export function getCompletedChallengeCount(progressByChallengeId) {
  return getCompletedChallengeIds(progressByChallengeId).length;
}

export function getEarnedXp(challenges, progressByChallengeId) {
  return challenges.reduce((total, challenge) => {
    const progress = progressByChallengeId[challenge.id];

    if (!progress?.completed) {
      return total;
    }

    return total + challenge.xp;
  }, 0);
}

export function getEarnedStars(progressByChallengeId) {
  return Object.values(progressByChallengeId).reduce(
    (total, progress) => total + (progress?.starsEarned ?? 0),
    0,
  );
}

export function getSessionLevel(challenges, progressByChallengeId) {
  return computeLevelFromXp(getEarnedXp(challenges, progressByChallengeId));
}

export function getRecommendedChallenge(challenges, progressByChallengeId) {
  return challenges.find((challenge) => !progressByChallengeId[challenge.id]?.completed) ?? challenges[0] ?? null;
}

export function summarizeTierProgress({
  tiers,
  getChallengesByTier,
  progressByChallengeId,
}) {
  const completedChallengeIds = getCompletedChallengeIds(progressByChallengeId);

  return tiers.map((tier, tierIndex) => {
    const tierChallenges = getChallengesByTier(tier.id);
    const previousTier = tiers[tierIndex - 1] ?? null;
    const previousTierChallenges = previousTier ? getChallengesByTier(previousTier.id) : [];

    return {
      ...tier,
      challengeCount: tierChallenges.length,
      completedCount: countCompletedChallengeIds(tierChallenges, completedChallengeIds),
      unlocked: isTierUnlocked({
        tierOrder: tier.order,
        previousTierChallenges,
        completedChallengeIds,
      }),
    };
  });
}
