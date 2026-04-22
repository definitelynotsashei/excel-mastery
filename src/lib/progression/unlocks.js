import { DEFAULT_UNLOCK_COMPLETION_RATE } from "../../features/formulas/data/constants";

export function countCompletedChallengeIds(challenges, completedChallengeIds) {
  const completed = new Set(completedChallengeIds);

  return challenges.filter((challenge) => completed.has(challenge.id)).length;
}

export function computeCompletionRate(challenges, completedChallengeIds) {
  if (challenges.length === 0) {
    return 0;
  }

  return countCompletedChallengeIds(challenges, completedChallengeIds) / challenges.length;
}

export function isTierUnlocked({
  tierOrder,
  previousTierChallenges,
  completedChallengeIds,
  unlockRate = DEFAULT_UNLOCK_COMPLETION_RATE,
}) {
  if (tierOrder <= 1) {
    return true;
  }

  return computeCompletionRate(previousTierChallenges, completedChallengeIds) >= unlockRate;
}
