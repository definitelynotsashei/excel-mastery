import { FORMULA_LAUNCH_FUNCTIONS, FORMULAS_TRACK_ID } from "./constants";
import { formulasTrackTiers } from "./tiers";

export const formulasTrack = {
  id: FORMULAS_TRACK_ID,
  label: "Formulas & Functions",
  accentColor: "violet",
  status: "active",
  description:
    "Learn Excel formulas through workplace-style spreadsheet challenges with guided validation and review.",
  dashboardSummary:
    "The first release-quality track. Solve practical spreadsheet tasks inside the sandbox to build real formula fluency.",
  tierIds: formulasTrackTiers.map((tier) => tier.id),
  launchFunctionCount: FORMULA_LAUNCH_FUNCTIONS.length,
};
