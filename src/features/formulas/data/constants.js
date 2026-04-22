export const FORMULAS_TRACK_ID = "formulas";

export const FORMULA_TIER_IDS = ["beginner", "intermediate", "advanced"];

export const TRACK_ACCENTS = {
  formulas: "violet",
  analysis: "sky",
  shortcuts: "amber",
  charts: "emerald",
};

export const FORMULA_LAUNCH_FUNCTIONS = [
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
  "IF",
  "AND",
  "OR",
  "SUMIF",
  "COUNTIF",
  "ROUND",
  "ABS",
];

export const FORMULA_PHASE_TWO_FUNCTIONS = [
  "SUMIFS",
  "COUNTIFS",
  "AVERAGEIF",
  "VLOOKUP",
  "IFERROR",
  "TEXT",
  "VALUE",
  "DATE",
  "YEAR",
  "MONTH",
  "DAY",
  "TODAY",
  "ROUNDUP",
  "ROUNDDOWN",
];

export const FORMULA_PHASE_THREE_FUNCTIONS = [
  "INDEX",
  "MATCH",
  "XLOOKUP",
  "IFS",
  "SWITCH",
  "LARGE",
  "SMALL",
  "RANK",
  "UNIQUE",
  "SORT",
  "FILTER",
  "TEXTJOIN",
  "SUBSTITUTE",
  "FIND",
  "SEARCH",
  "SUMPRODUCT",
];

export const DEFAULT_UNLOCK_COMPLETION_RATE = 0.7;

export const STAR_RULES = {
  perfect: {
    attempts: 1,
    hintsUsed: 0,
    stars: 3,
  },
  assisted: {
    attempts: 2,
    hintsUsed: 1,
    stars: 2,
  },
  recovered: {
    stars: 1,
  },
};
