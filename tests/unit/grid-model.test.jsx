import { getChallengeById } from "../../src/features/formulas/data/challenges";
import {
  createChallengeGridState,
  createEmptyEvaluationState,
  evaluateGridState,
} from "../../src/features/formulas/lib/grid-model";
import { selectGridCell, updateCellFormula } from "../../src/features/formulas/lib/grid-actions";
import { getCellDisplayValue, isEditableTargetCell } from "../../src/features/formulas/lib/grid-selectors";

describe("grid model", () => {
  const challenge = getChallengeById("formulas-beginner-sum-q1-west");

  it("creates an initial grid state around the challenge target", () => {
    const gridState = createChallengeGridState(challenge);

    expect(gridState.activeCell).toBe("D8");
    expect(gridState.formulasByCell).toEqual({ D8: "" });
  });

  it("supports active-cell selection and formula updates", () => {
    const gridState = createChallengeGridState(challenge);
    const selectedState = selectGridCell(gridState, "B2");
    const updatedState = updateCellFormula(gridState, "D8", "=SUM(B2:B5)");

    expect(selectedState.activeCell).toBe("B2");
    expect(updatedState.formulasByCell.D8).toBe("=SUM(B2:B5)");
  });

  it("evaluates target-cell formulas and exposes display values", () => {
    const updatedState = updateCellFormula(createChallengeGridState(challenge), "D8", "=SUM(B2:B5)");
    const evaluationState = evaluateGridState(challenge, updatedState);

    expect(evaluationState.D8).toMatchObject({
      status: "ok",
      value: 42000,
    });
    expect(getCellDisplayValue(challenge, updatedState, evaluationState, "D8")).toBe(42000);
  });

  it("marks invalid formulas with error display state", () => {
    const updatedState = updateCellFormula(createChallengeGridState(challenge), "D8", "=SUM(B2:B5");
    const evaluationState = evaluateGridState(challenge, updatedState);

    expect(evaluationState.D8.status).toBe("error");
    expect(getCellDisplayValue(challenge, updatedState, evaluationState, "D8")).toBe("#ERR");
  });

  it("distinguishes editable target cells from static cells", () => {
    expect(isEditableTargetCell(challenge, "D8")).toBe(true);
    expect(isEditableTargetCell(challenge, "B2")).toBe(false);
    expect(createEmptyEvaluationState(challenge).D8.status).toBe("idle");
  });
});
