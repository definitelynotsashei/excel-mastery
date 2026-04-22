export function selectGridCell(gridState, cellRef) {
  return {
    ...gridState,
    activeCell: cellRef,
  };
}

export function updateCellFormula(gridState, cellRef, formula) {
  return {
    ...gridState,
    formulasByCell: {
      ...gridState.formulasByCell,
      [cellRef]: formula,
    },
  };
}
