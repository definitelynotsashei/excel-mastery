function valuesEqual(left, right) {
  if (Array.isArray(left) || Array.isArray(right)) {
    return JSON.stringify(left) === JSON.stringify(right);
  }

  return left === right;
}

export function validateChallenge(challenge, gridState, evaluationState) {
  const targetCell = challenge.targetCells[0];
  const formula = gridState.formulasByCell[targetCell] ?? "";
  const evaluation = evaluationState[targetCell];
  const expected = challenge.expectedAnswer[targetCell];

  if (!formula.trim()) {
    return {
      status: "empty",
      title: "No answer yet",
      message: "Enter a formula in the target cell before checking your answer.",
    };
  }

  if (evaluation?.status === "error") {
    return {
      status: "error",
      title: "Formula error",
      message: evaluation.error?.message ?? "The formula could not be evaluated.",
      detail: evaluation.error?.type ?? null,
    };
  }

  if (evaluation?.status !== "ok") {
    return {
      status: "pending",
      title: "Calculation pending",
      message: "The target cell does not have a computed result yet.",
    };
  }

  if (challenge.validationMode === "formula_shape") {
    const normalizedActual = formula.replace(/\s+/g, "").toUpperCase();
    const normalizedExpected = expected.formulaPattern.replace(/\s+/g, "").toUpperCase();

    if (normalizedActual !== normalizedExpected) {
      return {
        status: "incorrect",
        title: "Method mismatch",
        message: "The result may be close, but this challenge expects a different formula approach.",
      };
    }
  }

  if (valuesEqual(evaluation.value, expected.result)) {
    return {
      status: "correct",
      title: "Correct",
      message: "The target cell matches the expected result for this scenario.",
      value: evaluation.value,
    };
  }

  return {
    status: "incorrect",
    title: "Not quite",
    message: "The formula runs, but the result does not match the expected answer yet.",
    expected: expected.result,
    actual: evaluation.value,
  };
}
