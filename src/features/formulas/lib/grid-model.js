import { safeEvaluateFormula } from "../../../lib/formula-engine";

export function createChallengeGridState(challenge) {
  return {
    challengeId: challenge.id,
    activeCell: challenge.targetCells[0] ?? `${challenge.grid.columns[0]}1`,
    formulasByCell: Object.fromEntries(challenge.targetCells.map((cell) => [cell, ""])),
  };
}

export function createEmptyEvaluationState(challenge) {
  return Object.fromEntries(
    challenge.targetCells.map((cell) => [
      cell,
      {
        status: "idle",
        value: "",
        error: null,
      },
    ]),
  );
}

export function evaluateGridState(challenge, gridState) {
  return Object.fromEntries(
    challenge.targetCells.map((cell) => {
      const formula = gridState.formulasByCell[cell] ?? "";

      if (!formula.trim()) {
        return [
          cell,
          {
            status: "idle",
            value: "",
            error: null,
          },
        ];
      }

      const result = safeEvaluateFormula(formula, challenge.grid);

      if (!result.ok) {
        return [
          cell,
          {
            status: "error",
            value: "",
            error: result.error,
          },
        ];
      }

      return [
        cell,
        {
          status: "ok",
          value: result.value,
          error: null,
        },
      ];
    }),
  );
}
