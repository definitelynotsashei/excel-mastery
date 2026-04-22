import { FormulaFunctionError } from "./errors";

function flattenValues(values) {
  return values.flatMap((value) => (Array.isArray(value) ? flattenValues(value) : [value]));
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
