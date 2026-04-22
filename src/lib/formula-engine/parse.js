import { FormulaParseError } from "./errors";
import { tokenizeFormula } from "./tokenize";

function isCellReference(value) {
  return /^[A-Za-z]{1,3}[1-9][0-9]*$/.test(value);
}

function isBooleanLiteral(value) {
  return value.toUpperCase() === "TRUE" || value.toUpperCase() === "FALSE";
}

export function parseFormula(formula) {
  const tokens = tokenizeFormula(formula);
  let index = 0;

  function current() {
    return tokens[index] ?? null;
  }

  function consume(type, message) {
    const token = current();

    if (!token || token.type !== type) {
      throw new FormulaParseError(message ?? `Expected token of type ${type}.`, {
        index,
        token,
      });
    }

    index += 1;
    return token;
  }

  function match(type, value) {
    const token = current();

    if (!token || token.type !== type) {
      return false;
    }

    if (value !== undefined && token.value !== value) {
      return false;
    }

    index += 1;
    return true;
  }

  function parsePrimary() {
    const token = current();

    if (!token) {
      throw new FormulaParseError("Unexpected end of formula.", { index });
    }

    if (match("NUMBER")) {
      return {
        type: "NumberLiteral",
        value: Number(token.value),
      };
    }

    if (match("STRING")) {
      return {
        type: "StringLiteral",
        value: token.value,
      };
    }

    if (match("LPAREN")) {
      const expression = parseComparison();
      consume("RPAREN", "Expected closing parenthesis.");
      return expression;
    }

    if (token.type === "OPERATOR" && token.value === "-") {
      index += 1;
      return {
        type: "UnaryExpression",
        operator: "-",
        argument: parsePrimary(),
      };
    }

    if (token.type === "IDENTIFIER") {
      index += 1;
      const value = token.value;
      const uppercaseValue = value.toUpperCase();

      if (current()?.type === "LPAREN") {
        index += 1;
        const args = [];

        if (current()?.type !== "RPAREN") {
          do {
            args.push(parseComparison());
          } while (match("COMMA"));
        }

        consume("RPAREN", "Expected closing parenthesis after function arguments.");

        return {
          type: "FunctionCall",
          name: uppercaseValue,
          arguments: args,
        };
      }

      if (isBooleanLiteral(value)) {
        return {
          type: "BooleanLiteral",
          value: uppercaseValue === "TRUE",
        };
      }

      if (isCellReference(value)) {
        if (match("COLON")) {
          const end = consume("IDENTIFIER", "Expected range end after ':'.");
          if (!isCellReference(end.value)) {
            throw new FormulaParseError("Invalid range end reference.", { index, token: end });
          }

          return {
            type: "RangeReference",
            start: uppercaseValue,
            end: end.value.toUpperCase(),
          };
        }

        return {
          type: "CellReference",
          ref: uppercaseValue,
        };
      }

      throw new FormulaParseError(`Unknown identifier "${value}".`, { index });
    }

    throw new FormulaParseError("Expected a value, function, or reference.", {
      index,
      token,
    });
  }

  function parseMultiplicative() {
    let expression = parsePrimary();

    while (current()?.type === "OPERATOR" && ["*", "/"].includes(current().value)) {
      const operator = current().value;
      index += 1;
      expression = {
        type: "BinaryExpression",
        operator,
        left: expression,
        right: parsePrimary(),
      };
    }

    return expression;
  }

  function parseAdditive() {
    let expression = parseMultiplicative();

    while (current()?.type === "OPERATOR" && ["+", "-"].includes(current().value)) {
      const operator = current().value;
      index += 1;
      expression = {
        type: "BinaryExpression",
        operator,
        left: expression,
        right: parseMultiplicative(),
      };
    }

    return expression;
  }

  function parseComparison() {
    let expression = parseAdditive();

    while (current()?.type === "COMPARISON") {
      const operator = current().value;
      index += 1;
      expression = {
        type: "ComparisonExpression",
        operator,
        left: expression,
        right: parseAdditive(),
      };
    }

    return expression;
  }

  if (match("EQUALS")) {
    // Optional Excel-style prefix.
  }

  const ast = parseComparison();

  if (current()) {
    throw new FormulaParseError(`Unexpected trailing token "${current().value}".`, {
      index,
      token: current(),
    });
  }

  return ast;
}
