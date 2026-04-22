import { FormulaEvaluationError } from "./errors";
import { getFormulaFunction } from "./functions";
import { getCellValue, getRangeData } from "./references";

function evaluateBinaryExpression(operator, left, right) {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      if (right === 0) {
        throw new FormulaEvaluationError("Division by zero.");
      }

      return left / right;
    default:
      throw new FormulaEvaluationError(`Unsupported operator "${operator}".`, { operator });
  }
}

function evaluateComparisonExpression(operator, left, right) {
  switch (operator) {
    case "=":
      return left === right;
    case "!=":
      return left !== right;
    case ">":
      return left > right;
    case "<":
      return left < right;
    case ">=":
      return left >= right;
    case "<=":
      return left <= right;
    default:
      throw new FormulaEvaluationError(`Unsupported comparison operator "${operator}".`, { operator });
  }
}

export function evaluateAst(ast, grid) {
  switch (ast.type) {
    case "NumberLiteral":
    case "StringLiteral":
    case "BooleanLiteral":
      return ast.value;
    case "UnaryExpression":
      return -evaluateAst(ast.argument, grid);
    case "CellReference":
      return getCellValue(grid, ast.ref);
    case "RangeReference":
      return getRangeData(grid, ast.start, ast.end);
    case "BinaryExpression":
      return evaluateBinaryExpression(
        ast.operator,
        evaluateAst(ast.left, grid),
        evaluateAst(ast.right, grid),
      );
    case "ComparisonExpression":
      return evaluateComparisonExpression(
        ast.operator,
        evaluateAst(ast.left, grid),
        evaluateAst(ast.right, grid),
      );
    case "FunctionCall": {
      if (ast.name === "IFERROR") {
        try {
          return evaluateAst(ast.arguments[0], grid);
        } catch {
          return evaluateAst(ast.arguments[1], grid);
        }
      }

      const fn = getFormulaFunction(ast.name);
      const args = ast.arguments.map((arg) => evaluateAst(arg, grid));
      return fn(...args);
    }
    default:
      throw new FormulaEvaluationError(`Unknown AST node "${ast.type}".`, { ast });
  }
}
