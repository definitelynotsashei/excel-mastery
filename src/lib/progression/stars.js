import { STAR_RULES } from "../../features/formulas/data/constants";

export function calculateStars({ attempts, hintsUsed }) {
  if (attempts <= STAR_RULES.perfect.attempts && hintsUsed <= STAR_RULES.perfect.hintsUsed) {
    return STAR_RULES.perfect.stars;
  }

  if (attempts <= STAR_RULES.assisted.attempts && hintsUsed <= STAR_RULES.assisted.hintsUsed) {
    return STAR_RULES.assisted.stars;
  }

  return STAR_RULES.recovered.stars;
}
