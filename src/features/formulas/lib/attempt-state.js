import { calculateStars } from "../../../lib/progression/stars";

export function createAttemptState() {
  return {
    submissionCount: 0,
    hintsShown: 0,
    completed: false,
    lastValidation: null,
  };
}

export function applyValidationResult(attemptState, validationResult) {
  const nextSubmissionCount = attemptState.submissionCount + 1;
  const completed = validationResult.status === "correct";

  return {
    ...attemptState,
    submissionCount: nextSubmissionCount,
    completed,
    lastValidation: validationResult,
  };
}

export function revealNextHint(attemptState, challenge) {
  return {
    ...attemptState,
    hintsShown: Math.min(attemptState.hintsShown + 1, challenge.hints.length),
  };
}

export function getVisibleHints(challenge, attemptState) {
  return challenge.hints.slice(0, attemptState.hintsShown);
}

export function getCompletionStars(attemptState) {
  return calculateStars({
    attempts: Math.max(attemptState.submissionCount, 1),
    hintsUsed: attemptState.hintsShown,
  });
}
