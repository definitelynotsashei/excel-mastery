import { getChallengeById } from "../../src/features/formulas/data/challenges";
import {
  applyValidationResult,
  createAttemptState,
  getCompletionStars,
  getVisibleHints,
  revealNextHint,
} from "../../src/features/formulas/lib/attempt-state";
import { updateCellFormula } from "../../src/features/formulas/lib/grid-actions";
import { createChallengeGridState, evaluateGridState } from "../../src/features/formulas/lib/grid-model";
import { validateChallenge } from "../../src/features/formulas/lib/validate-challenge";

describe("validation flow helpers", () => {
  const challenge = getChallengeById("formulas-beginner-sum-q1-west");

  it("returns an empty state before any formula is entered", () => {
    const gridState = createChallengeGridState(challenge);
    const evaluationState = evaluateGridState(challenge, gridState);

    expect(validateChallenge(challenge, gridState, evaluationState)).toMatchObject({
      status: "empty",
    });
  });

  it("returns a correct state for the expected formula result", () => {
    const gridState = updateCellFormula(createChallengeGridState(challenge), "D8", "=SUM(B2:B5)");
    const evaluationState = evaluateGridState(challenge, gridState);

    expect(validateChallenge(challenge, gridState, evaluationState)).toMatchObject({
      status: "correct",
      value: 42000,
    });
  });

  it("returns an incorrect state for the wrong result", () => {
    const gridState = updateCellFormula(createChallengeGridState(challenge), "D8", "=SUM(B2:B4)");
    const evaluationState = evaluateGridState(challenge, gridState);

    expect(validateChallenge(challenge, gridState, evaluationState)).toMatchObject({
      status: "incorrect",
      actual: 32500,
    });
  });

  it("tracks submissions, hints, and completion stars", () => {
    const initialState = createAttemptState();
    const hintedState = revealNextHint(initialState, challenge);
    const validatedState = applyValidationResult(hintedState, {
      status: "correct",
      title: "Correct",
      message: "Solved",
    });

    expect(getVisibleHints(challenge, hintedState)).toHaveLength(1);
    expect(validatedState.completed).toBe(true);
    expect(getCompletionStars(validatedState)).toBe(2);
  });
});
