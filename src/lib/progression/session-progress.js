import { computeLevelFromXp } from "./xp";
import { countCompletedChallengeIds, isTierUnlocked } from "./unlocks";

export function getCompletedChallengeIds(progressByChallengeId) {
  return Object.entries(progressByChallengeId)
    .filter(([, progress]) => progress?.completed)
    .map(([challengeId]) => challengeId);
}

function normalizeRunSummary(progress) {
  return {
    completed: Boolean(progress?.completed),
    starsEarned: Math.max(progress?.starsEarned ?? 0, 0),
    submissionCount: Math.max(progress?.submissionCount ?? 0, 0),
    hintsUsed: Math.max(progress?.hintsUsed ?? 0, 0),
  };
}

export function choosePreferredProgressRecord(leftProgress, rightProgress) {
  const left = normalizeRunSummary(leftProgress);
  const right = normalizeRunSummary(rightProgress);

  if (right.starsEarned > left.starsEarned) {
    return right;
  }

  if (right.starsEarned < left.starsEarned) {
    return left;
  }

  if (right.submissionCount < left.submissionCount) {
    return right;
  }

  if (right.submissionCount > left.submissionCount) {
    return left;
  }

  if (right.hintsUsed < left.hintsUsed) {
    return right;
  }

  return left;
}

export function mergeProgressRecords(baseProgressByChallengeId, incomingProgressByChallengeId) {
  const mergedProgress = { ...baseProgressByChallengeId };

  for (const [challengeId, progress] of Object.entries(incomingProgressByChallengeId)) {
    const previousProgress = mergedProgress[challengeId];

    mergedProgress[challengeId] = choosePreferredProgressRecord(previousProgress, progress);
  }

  return mergedProgress;
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
