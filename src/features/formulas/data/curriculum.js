import {
  FORMULA_LAUNCH_FUNCTIONS,
  FORMULA_PHASE_THREE_FUNCTIONS,
  FORMULA_PHASE_TWO_FUNCTIONS,
} from "./constants";

export const formulasCurriculum = {
  launch: {
    label: "V1 Launch Scope",
    functions: FORMULA_LAUNCH_FUNCTIONS,
    notes: "Every beginner challenge and the first intermediate slice should stay within this function set.",
  },
  phaseTwo: {
    label: "Phase 2",
    functions: FORMULA_PHASE_TWO_FUNCTIONS,
    notes: "Introduce broader conditional logic, lookups, and date formatting after the engine core is stable.",
  },
  phaseThree: {
    label: "Phase 3",
    functions: FORMULA_PHASE_THREE_FUNCTIONS,
    notes: "Reserved for advanced parity work and modern Excel / Excel 365 patterns.",
  },
};
