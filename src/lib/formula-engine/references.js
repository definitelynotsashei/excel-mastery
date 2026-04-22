import { FormulaReferenceError } from "./errors";

function columnLabelToIndex(label) {
  let total = 0;

  for (const character of label) {
    total *= 26;
    total += character.charCodeAt(0) - 64;
  }

  return total - 1;
}

function indexToColumnLabel(index) {
  let value = index + 1;
  let label = "";

  while (value > 0) {
    const remainder = (value - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    value = Math.floor((value - 1) / 26);
  }

  return label;
}

export function normalizeCellReference(reference) {
  const match = /^([A-Za-z]{1,3})([1-9][0-9]*)$/.exec(String(reference).trim());

  if (!match) {
    throw new FormulaReferenceError(`Invalid cell reference "${reference}".`, { reference });
  }

  return {
    ref: `${match[1].toUpperCase()}${match[2]}`,
    column: match[1].toUpperCase(),
    row: Number(match[2]),
    columnIndex: columnLabelToIndex(match[1].toUpperCase()),
    rowIndex: Number(match[2]) - 1,
  };
}

export function getCellRecord(grid, reference) {
  const normalized = normalizeCellReference(reference);
  return grid.cells[normalized.ref] ?? { value: "", editable: false };
}

export function getCellValue(grid, reference) {
  return getCellRecord(grid, reference).value;
}

export function expandRange(startRef, endRef) {
  const start = normalizeCellReference(startRef);
  const end = normalizeCellReference(endRef);
  const refs = [];

  const rowStart = Math.min(start.rowIndex, end.rowIndex);
  const rowEnd = Math.max(start.rowIndex, end.rowIndex);
  const columnStart = Math.min(start.columnIndex, end.columnIndex);
  const columnEnd = Math.max(start.columnIndex, end.columnIndex);

  for (let rowIndex = rowStart; rowIndex <= rowEnd; rowIndex += 1) {
    for (let columnIndex = columnStart; columnIndex <= columnEnd; columnIndex += 1) {
      refs.push(`${indexToColumnLabel(columnIndex)}${rowIndex + 1}`);
    }
  }

  return refs;
}

export function getRangeValues(grid, startRef, endRef) {
  return expandRange(startRef, endRef).map((reference) => getCellValue(grid, reference));
}
