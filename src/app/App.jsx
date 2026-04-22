import { useMemo, useState } from "react";
import FormulaBar from "../features/formulas/components/FormulaBar";
import SpreadsheetGrid from "../features/formulas/components/SpreadsheetGrid";
import { formulaChallenges, getChallengeById, getChallengesByTier } from "../features/formulas/data/challenges";
import { formulasCurriculum } from "../features/formulas/data/curriculum";
import { formulasTrack } from "../features/formulas/data/tracks";
import { formulasTrackTiers } from "../features/formulas/data/tiers";
import { selectGridCell, updateCellFormula } from "../features/formulas/lib/grid-actions";
import {
  createChallengeGridState,
  createEmptyEvaluationState,
  evaluateGridState,
} from "../features/formulas/lib/grid-model";
import { getCellFormula, isEditableTargetCell } from "../features/formulas/lib/grid-selectors";
import { sumChallengeXp } from "../lib/progression/xp";

const milestoneChecklist = [
  "Project scaffold and build tooling",
  "Challenge schema and formulas curriculum",
  "Formula engine core",
  "Spreadsheet sandbox",
  "Validation, hints, and completion flow",
];

const moduleGroups = [
  {
    title: "App Shell",
    body: "Navigation between dashboard, track view, and challenge view starts here.",
  },
  {
    title: "Formula Engine",
    body: "Pure helpers will parse formulas, resolve references, and evaluate supported functions.",
  },
  {
    title: "Progression",
    body: "XP, stars, unlocks, and persistence stay outside presentation code.",
  },
];

function App() {
  const activeChallenge =
    getChallengeById("formulas-beginner-sum-q1-west") ?? formulaChallenges[0];
  const challengeCount = formulaChallenges.length;
  const totalXp = sumChallengeXp(formulaChallenges);
  const [gridState, setGridState] = useState(() => createChallengeGridState(activeChallenge));
  const evaluationState = useMemo(
    () => evaluateGridState(activeChallenge, gridState),
    [activeChallenge, gridState],
  );
  const activeCellEditable = isEditableTargetCell(activeChallenge, gridState.activeCell);
  const activeFormula = getCellFormula(gridState, gridState.activeCell);
  const activeCellEvaluation =
    evaluationState[gridState.activeCell] ??
    createEmptyEvaluationState(activeChallenge)[gridState.activeCell];

  function handleFormulaChange(nextFormula) {
    if (!activeCellEditable) {
      return;
    }

    setGridState((currentState) =>
      updateCellFormula(currentState, currentState.activeCell, nextFormula),
    );
  }

  function handleResetChallenge() {
    setGridState(createChallengeGridState(activeChallenge));
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(91,72,179,0.28),_transparent_32%),linear-gradient(180deg,_#07111f_0%,_#040914_100%)] px-6 py-10 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-slate-950/70 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
          <span className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
            Excel Mastery
          </span>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Premium Excel training built around realistic spreadsheet work.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                The repository now includes the formulas-track data model, a
                working formula engine, and the first interactive spreadsheet
                sandbox slice wired to a real challenge.
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-sm text-cyan-100">
              <div className="font-medium text-cyan-200">Current focus</div>
              <div className="mt-1">Milestone 3: sandbox grid and formula bar</div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          <article className="rounded-[24px] border border-white/10 bg-slate-900/75 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Delivery sequence</h2>
              <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-violet-200">
                {formulasTrack.label}
              </span>
            </div>
            <ol className="mt-6 grid gap-3">
              {milestoneChecklist.map((item, index) => (
                <li
                  key={item}
                  className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-400/15 text-sm font-medium text-violet-200">
                    {index + 1}
                  </span>
                  <span className="text-slate-200">{item}</span>
                </li>
              ))}
            </ol>
          </article>

          <aside className="rounded-[24px] border border-white/10 bg-slate-900/75 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            <h2 className="text-xl font-semibold text-white">Track snapshot</h2>
            <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="text-sm uppercase tracking-[0.2em] text-cyan-200">
                Launch scope
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-300">
                <div>{challengeCount} drafted formula challenges</div>
                <div>{formulasCurriculum.launch.functions.length} launch functions</div>
                <div>{totalXp} total XP across drafted content</div>
              </div>
            </div>
            <div className="mt-5 grid gap-4">
              {formulasTrackTiers.map((tier) => (
                <section
                  key={tier.id}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
                    {tier.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {tier.summary}
                  </p>
                  <div className="mt-3 text-sm text-slate-400">
                    {getChallengesByTier(tier.id).length} drafted challenges
                  </div>
                </section>
              ))}
            </div>
          </aside>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-slate-900/75 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Planned modules</h2>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-emerald-200">
              Launch functions
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {formulasCurriculum.launch.functions.map((formulaName) => (
              <span
                key={formulaName}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200"
              >
                {formulaName}
              </span>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {moduleGroups.map((group) => (
              <section
                key={group.title}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
              >
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
                  {group.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{group.body}</p>
              </section>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="rounded-[24px] border border-white/10 bg-slate-900/75 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Sandbox preview
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {activeChallenge.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {activeChallenge.scenario}
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.08]"
                onClick={handleResetChallenge}
              >
                Reset
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Learning objective
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {activeChallenge.learningObjective}
                </p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Editable target
                </div>
                <p className="mt-2 text-sm text-slate-200">
                  Enter your answer in {activeChallenge.targetCells.join(", ")} using
                  the formula bar.
                </p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Cell status
                </div>
                <div className="mt-2 text-sm text-slate-200">
                  {activeCellEvaluation.status === "ok" && `Computed value: ${String(activeCellEvaluation.value)}`}
                  {activeCellEvaluation.status === "error" &&
                    `Formula error: ${activeCellEvaluation.error?.message ?? "Unknown error"}`}
                  {activeCellEvaluation.status === "idle" &&
                    "Select the highlighted answer cell and type a formula to see the result."}
                </div>
              </div>
            </div>
          </article>

          <div className="flex flex-col gap-4">
            <FormulaBar
              activeCell={gridState.activeCell}
              formula={activeFormula}
              editable={activeCellEditable}
              onFormulaChange={handleFormulaChange}
            />
            <SpreadsheetGrid
              challenge={activeChallenge}
              gridState={gridState}
              evaluationState={evaluationState}
              onSelectCell={(cellRef) =>
                setGridState((currentState) => selectGridCell(currentState, cellRef))
              }
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
