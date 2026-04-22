export function sumChallengeXp(challenges) {
  return challenges.reduce((total, challenge) => total + challenge.xp, 0);
}

export function computeLevelFromXp(xpTotal) {
  return Math.floor(xpTotal / 100) + 1;
}
