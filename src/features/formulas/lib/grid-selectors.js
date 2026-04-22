export function isEditableTargetCell(challenge, cellRef) {
  return challenge.targetCells.includes(cellRef);
}

export function getCellFormula(gridState, cellRef) {
  return gridState.formulasByCell[cellRef] ?? "";
}

export function getCellDisplayValue(challenge, gridState, evaluationState, cellRef) {
  const cell = challenge.grid.cells[cellRef];
  const evaluation = evaluationState[cellRef];

  if (evaluation?.status === "ok") {
    return evaluation.value;
  }

  if (evaluation?.status === "error") {
    return "#ERR";
  }

  if (challenge.targetCells.includes(cellRef)) {
    return gridState.formulasByCell[cellRef] ?? "";
  }

  return cell?.value ?? "";
}
