import { FORMULA_TIER_IDS } from "./constants";

export const formulasTrackTiers = [
  {
    id: FORMULA_TIER_IDS[0],
    label: "Beginner",
    order: 1,
    summary: "Build comfort with totals, counts, text cleanup, and simple extraction.",
    challengeTarget: 10,
    recommendedFunctions: [
      "SUM",
      "AVERAGE",
      "COUNT",
      "MIN",
      "MAX",
      "COUNTA",
      "LEN",
      "UPPER",
      "LOWER",
      "TRIM",
      "LEFT",
      "RIGHT",
      "MID",
      "ROUND",
      "ABS",
    ],
  },
  {
    id: FORMULA_TIER_IDS[1],
    label: "Intermediate",
    order: 2,
    summary: "Use conditional logic, conditional aggregation, and practical lookup flows.",
    challengeTarget: 6,
    recommendedFunctions: [
      "IF",
      "AND",
      "OR",
      "SUMIF",
      "COUNTIF",
      "VLOOKUP",
      "IFERROR",
      "DATE",
      "YEAR",
      "MONTH",
      "DAY",
      "TODAY",
    ],
  },
  {
    id: FORMULA_TIER_IDS[2],
    label: "Advanced",
    order: 3,
    summary: "Combine nested logic and modern analysis patterns for business reporting tasks.",
    challengeTarget: 4,
    recommendedFunctions: [
      "INDEX",
      "MATCH",
      "XLOOKUP",
      "IFS",
      "SWITCH",
      "LARGE",
      "SMALL",
      "RANK",
      "FILTER",
      "UNIQUE",
      "SORT",
      "SUMPRODUCT",
    ],
  },
];

export function getTierById(tierId) {
  return formulasTrackTiers.find((tier) => tier.id === tierId) ?? null;
}
