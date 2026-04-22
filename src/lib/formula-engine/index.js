import { evaluateAst } from "./evaluate";
import { formatFormulaError } from "./errors";
import { parseFormula } from "./parse";

export function evaluateFormula(formula, grid) {
  const ast = parseFormula(formula);
  const value = evaluateAst(ast, grid);

  return {
    ast,
    value,
  };
}

export function safeEvaluateFormula(formula, grid) {
  try {
    const result = evaluateFormula(formula, grid);
    return {
      ok: true,
      ...result,
    };
  } catch (error) {
    return {
      ok: false,
      error: formatFormulaError(error),
    };
  }
}
