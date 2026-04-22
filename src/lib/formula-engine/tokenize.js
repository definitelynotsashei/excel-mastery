import { FormulaParseError } from "./errors";

function isDigit(character) {
  return character >= "0" && character <= "9";
}

function isLetter(character) {
  return /[A-Za-z]/.test(character);
}

function isIdentifierCharacter(character) {
  return /[A-Za-z0-9_.]/.test(character);
}

export function tokenizeFormula(formula) {
  if (typeof formula !== "string") {
    throw new FormulaParseError("Formula must be a string.");
  }

  const source = formula.trim();
  const tokens = [];
  let index = 0;

  while (index < source.length) {
    const character = source[index];

    if (/\s/.test(character)) {
      index += 1;
      continue;
    }

    if (character === "=") {
      tokens.push({ type: "EQUALS", value: character });
      index += 1;
      continue;
    }

    if (character === ",") {
      tokens.push({ type: "COMMA", value: character });
      index += 1;
      continue;
    }

    if (character === ":") {
      tokens.push({ type: "COLON", value: character });
      index += 1;
      continue;
    }

    if (character === "(") {
      tokens.push({ type: "LPAREN", value: character });
      index += 1;
      continue;
    }

    if (character === ")") {
      tokens.push({ type: "RPAREN", value: character });
      index += 1;
      continue;
    }

    if ("+-*/".includes(character)) {
      tokens.push({ type: "OPERATOR", value: character });
      index += 1;
      continue;
    }

    if ([">", "<"].includes(character)) {
      const next = source[index + 1];
      if (next === "=") {
        tokens.push({ type: "COMPARISON", value: `${character}=` });
        index += 2;
        continue;
      }

      tokens.push({ type: "COMPARISON", value: character });
      index += 1;
      continue;
    }

    if (character === "!") {
      if (source[index + 1] === "=") {
        tokens.push({ type: "COMPARISON", value: "!=" });
        index += 2;
        continue;
      }

      throw new FormulaParseError(`Unexpected token "${character}".`, { index });
    }

    if (character === '"') {
      let cursor = index + 1;
      let value = "";

      while (cursor < source.length && source[cursor] !== '"') {
        value += source[cursor];
        cursor += 1;
      }

      if (cursor >= source.length) {
        throw new FormulaParseError("Unterminated string literal.", { index });
      }

      tokens.push({ type: "STRING", value });
      index = cursor + 1;
      continue;
    }

    if (isDigit(character) || (character === "." && isDigit(source[index + 1] ?? ""))) {
      let cursor = index;
      let hasDecimal = false;

      while (cursor < source.length) {
        const current = source[cursor];

        if (current === ".") {
          if (hasDecimal) {
            break;
          }

          hasDecimal = true;
          cursor += 1;
          continue;
        }

        if (!isDigit(current)) {
          break;
        }

        cursor += 1;
      }

      tokens.push({
        type: "NUMBER",
        value: source.slice(index, cursor),
      });
      index = cursor;
      continue;
    }

    if (isLetter(character) || character === "_") {
      let cursor = index;

      while (cursor < source.length && isIdentifierCharacter(source[cursor])) {
        cursor += 1;
      }

      const value = source.slice(index, cursor);
      tokens.push({ type: "IDENTIFIER", value });
      index = cursor;
      continue;
    }

    throw new FormulaParseError(`Unexpected token "${character}".`, { index });
  }

  return tokens;
}
