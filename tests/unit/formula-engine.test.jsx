import { getChallengesByTier } from "../../src/features/formulas/data/challenges";
import { evaluateFormula, safeEvaluateFormula } from "../../src/lib/formula-engine";
import { FormulaFunctionError, FormulaParseError, FormulaReferenceError } from "../../src/lib/formula-engine/errors";
import { parseFormula } from "../../src/lib/formula-engine/parse";
import { expandRange, getCellValue, getRangeData, normalizeCellReference } from "../../src/lib/formula-engine/references";
import { tokenizeFormula } from "../../src/lib/formula-engine/tokenize";

describe("formula engine", () => {
  it("tokenizes function calls, ranges, strings, and operators", () => {
    expect(tokenizeFormula('=ROUND(AVERAGE(B2:B6),1)')).toEqual([
      { type: "EQUALS", value: "=" },
      { type: "IDENTIFIER", value: "ROUND" },
      { type: "LPAREN", value: "(" },
      { type: "IDENTIFIER", value: "AVERAGE" },
      { type: "LPAREN", value: "(" },
      { type: "IDENTIFIER", value: "B2" },
      { type: "COLON", value: ":" },
      { type: "IDENTIFIER", value: "B6" },
      { type: "RPAREN", value: ")" },
      { type: "COMMA", value: "," },
      { type: "NUMBER", value: "1" },
      { type: "RPAREN", value: ")" },
    ]);
  });

  it("parses nested formulas into an AST", () => {
    expect(parseFormula("=ROUND(AVERAGE(B2:B6),1)")).toEqual({
      type: "FunctionCall",
      name: "ROUND",
      arguments: [
        {
          type: "FunctionCall",
          name: "AVERAGE",
          arguments: [
            {
              type: "RangeReference",
              start: "B2",
              end: "B6",
            },
          ],
        },
        {
          type: "NumberLiteral",
          value: 1,
        },
      ],
    });
  });

  it("normalizes references and expands ranges", () => {
    expect(normalizeCellReference("b6")).toMatchObject({
      ref: "B6",
      column: "B",
      row: 6,
    });
    expect(expandRange("B2", "B5")).toEqual(["B2", "B3", "B4", "B5"]);
    expect(getRangeData(getChallengesByTier("intermediate")[3].grid, "E2", "F5")).toMatchObject({
      width: 2,
      height: 4,
    });
  });

  it("evaluates every beginner challenge expected formula", () => {
    const beginnerChallenges = getChallengesByTier("beginner");

    beginnerChallenges.forEach((challenge) => {
      const targetCell = challenge.targetCells[0];
      const expected = challenge.expectedAnswer[targetCell];
      const result = evaluateFormula(expected.formulaPattern, challenge.grid);
      expect(result.value).toEqual(expected.result);
    });
  });

  it("reads cell values from the challenge grid", () => {
    const [firstChallenge] = getChallengesByTier("beginner");
    expect(getCellValue(firstChallenge.grid, "B2")).toBe(12000);
  });

  it("returns structured parse errors for invalid formulas", () => {
    expect(() => parseFormula("=SUM(B2:B5")).toThrow(FormulaParseError);

    const result = safeEvaluateFormula("=SUM(B2:B5", getChallengesByTier("beginner")[0].grid);
    expect(result.ok).toBe(false);
    expect(result.error.type).toBe("PARSE_ERROR");
  });

  it("returns structured unsupported-function errors", () => {
    const result = safeEvaluateFormula("=XLOOKUP(B3,E2:E5,F2:F5)", getChallengesByTier("advanced")[1].grid);

    expect(result.ok).toBe(false);
    expect(result.error.type).toBe("UNSUPPORTED_FUNCTION");
  });

  it("throws on invalid cell references", () => {
    expect(() => normalizeCellReference("ABC")).toThrow(FormulaReferenceError);
  });

  it("throws for unsupported function lookups through the strict evaluator", () => {
    expect(() =>
      evaluateFormula("=XLOOKUP(B3,E2:E5,F2:F5)", getChallengesByTier("advanced")[1].grid),
    ).toThrow(FormulaFunctionError);
  });

  it("evaluates the supported intermediate challenge formulas", () => {
    const supportedChallengeIds = new Set([
      "formulas-intermediate-if-margin",
      "formulas-intermediate-sumif-east",
      "formulas-intermediate-countif-overdue",
      "formulas-intermediate-vlookup-plan",
      "formulas-intermediate-date-month",
      "formulas-intermediate-iferror-lookup",
    ]);

    getChallengesByTier("intermediate")
      .filter((challenge) => supportedChallengeIds.has(challenge.id))
      .forEach((challenge) => {
        const targetCell = challenge.targetCells[0];
        const expected = challenge.expectedAnswer[targetCell];
        const result = evaluateFormula(expected.formulaPattern, challenge.grid);
        expect(result.value).toEqual(expected.result);
      });
  });

  it("supports logical helper formulas directly", () => {
    const grid = getChallengesByTier("intermediate")[0].grid;

    expect(evaluateFormula("=AND(TRUE,C2>0.3)", grid).value).toBe(true);
    expect(evaluateFormula('=IF(OR(FALSE,C2>0.3),"Go","Stop")', grid).value).toBe("Go");
  });
});
