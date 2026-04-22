import { FormulaFunctionError } from "./errors";

function isRangeObject(value) {
  return value && typeof value === "object" && value.kind === "range";
}

function flattenValues(values) {
  return values.flatMap((value) => {
    if (isRangeObject(value)) {
      return flattenValues(value.rows);
    }

    return Array.isArray(value) ? flattenValues(value) : [value];
  });
}

function asNumber(value, functionName) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }

  throw new FormulaFunctionError(`${functionName} expected a numeric value.`, {
    functionName,
    value,
  });
}

function numericValues(values) {
  return flattenValues(values).filter((value) => typeof value === "number");
}

function asBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toUpperCase();
    if (normalized === "TRUE") {
      return true;
    }

    if (normalized === "FALSE") {
      return false;
    }

    return normalized.length > 0;
  }

  return Boolean(value);
}

function normalizeCriterion(criterion) {
  if (typeof criterion !== "string") {
    return { operator: "=", value: criterion };
  }

  const match = /^(>=|<=|!=|>|<|=)?(.*)$/.exec(criterion);
  return {
    operator: match?.[1] ?? "=",
    value: match?.[2] ?? criterion,
  };
}

function valuesMatchCriterion(value, criterion) {
  const { operator, value: criterionValue } = normalizeCriterion(criterion);
  const right =
    typeof value === "number" && criterionValue !== "" && !Number.isNaN(Number(criterionValue))
      ? Number(criterionValue)
      : criterionValue;

  switch (operator) {
    case "=":
      return value === right;
    case "!=":
      return value !== right;
    case ">":
      return value > right;
    case "<":
      return value < right;
    case ">=":
      return value >= right;
    case "<=":
      return value <= right;
    default:
      return value === right;
  }
}

function asFlatRange(value, functionName) {
  if (isRangeObject(value)) {
    return value.rows.flat();
  }

  if (Array.isArray(value)) {
    return flattenValues(value);
  }

  throw new FormulaFunctionError(`${functionName} requires a range argument.`, {
    functionName,
    value,
  });
}

function asTable(value, functionName) {
  if (isRangeObject(value)) {
    return value.rows;
  }

  throw new FormulaFunctionError(`${functionName} requires a table range.`, {
    functionName,
    value,
  });
}

export const formulaFunctions = {
  SUM: (...args) => numericValues(args).reduce((total, value) => total + value, 0),
  AVERAGE: (...args) => {
    const values = numericValues(args);

    if (values.length === 0) {
      throw new FormulaFunctionError("AVERAGE requires at least one numeric value.", {
        functionName: "AVERAGE",
      });
    }

    return formulaFunctions.SUM(values) / values.length;
  },
  COUNT: (...args) => numericValues(args).length,
  MIN: (...args) => {
    const values = numericValues(args);
    if (values.length === 0) {
      throw new FormulaFunctionError("MIN requires at least one numeric value.", {
        functionName: "MIN",
      });
    }

    return Math.min(...values);
  },
  MAX: (...args) => {
    const values = numericValues(args);
    if (values.length === 0) {
      throw new FormulaFunctionError("MAX requires at least one numeric value.", {
        functionName: "MAX",
      });
    }

    return Math.max(...values);
  },
  COUNTA: (...args) =>
    flattenValues(args).filter((value) => value !== "" && value !== null && value !== undefined).length,
  LEN: (value) => String(value ?? "").length,
  UPPER: (value) => String(value ?? "").toUpperCase(),
  LOWER: (value) => String(value ?? "").toLowerCase(),
  TRIM: (value) => String(value ?? "").trim().replace(/\s+/g, " "),
  LEFT: (value, count = 1) => String(value ?? "").slice(0, asNumber(count, "LEFT")),
  RIGHT: (value, count = 1) => String(value ?? "").slice(-asNumber(count, "RIGHT")),
  MID: (value, start, count) =>
    String(value ?? "").slice(asNumber(start, "MID") - 1, asNumber(start, "MID") - 1 + asNumber(count, "MID")),
  ROUND: (value, digits = 0) => {
    const numericValue = asNumber(value, "ROUND");
    const precision = asNumber(digits, "ROUND");
    const factor = 10 ** precision;
    return Math.round(numericValue * factor) / factor;
  },
  ABS: (value) => Math.abs(asNumber(value, "ABS")),
  IF: (condition, trueValue, falseValue) => (asBoolean(condition) ? trueValue : falseValue),
  AND: (...args) => flattenValues(args).every((value) => asBoolean(value)),
  OR: (...args) => flattenValues(args).some((value) => asBoolean(value)),
  SUMIF: (criteriaRange, criterion, sumRange = criteriaRange) => {
    const criteriaValues = asFlatRange(criteriaRange, "SUMIF");
    const sumValues = asFlatRange(sumRange, "SUMIF");

    if (criteriaValues.length !== sumValues.length) {
      throw new FormulaFunctionError("SUMIF requires matching range lengths.", {
        functionName: "SUMIF",
      });
    }

    return criteriaValues.reduce((total, value, index) => {
      if (valuesMatchCriterion(value, criterion)) {
        return total + asNumber(sumValues[index], "SUMIF");
      }

      return total;
    }, 0);
  },
  COUNTIF: (criteriaRange, criterion) => {
    const criteriaValues = asFlatRange(criteriaRange, "COUNTIF");
    return criteriaValues.filter((value) => valuesMatchCriterion(value, criterion)).length;
  },
  VLOOKUP: (lookupValue, tableRange, columnIndex, exactMatch = true) => {
    const table = asTable(tableRange, "VLOOKUP");
    const resolvedColumnIndex = asNumber(columnIndex, "VLOOKUP");
    const useApproximateMatch = asBoolean(exactMatch);

    if (useApproximateMatch) {
      throw new FormulaFunctionError("Only exact-match VLOOKUP is supported.", {
        functionName: "VLOOKUP",
      });
    }

    const row = table.find((rowValues) => rowValues[0] === lookupValue);

    if (!row) {
      throw new FormulaFunctionError("VLOOKUP could not find the requested value.", {
        functionName: "VLOOKUP",
        code: "LOOKUP_NOT_FOUND",
        lookupValue,
      });
    }

    const value = row[resolvedColumnIndex - 1];

    if (value === undefined) {
      throw new FormulaFunctionError("VLOOKUP column index is out of bounds.", {
        functionName: "VLOOKUP",
      });
    }

    return value;
  },
  MONTH: (value) => {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new FormulaFunctionError("MONTH requires a valid date value.", {
        functionName: "MONTH",
        value,
      });
    }

    return date.getUTCMonth() + 1;
  },
};

export function getFormulaFunction(name) {
  const normalizedName = String(name).toUpperCase();
  const fn = formulaFunctions[normalizedName];

  if (!fn) {
    throw new FormulaFunctionError(`Unsupported function "${normalizedName}".`, {
      functionName: normalizedName,
      code: "UNSUPPORTED_FUNCTION",
    });
  }

  return fn;
}
