import { useMemo, useState } from "react";
import { APP_VIEWS } from "./routes";
import {
  getDefaultFormulasChallenge,
  getChallengePosition,
  getNextChallenge,
} from "./app-shell";
import FormulaBar from "../features/formulas/components/FormulaBar";
import FeedbackPanel from "../features/formulas/components/FeedbackPanel";
import ReviewCard from "../features/formulas/components/ReviewCard";
import SpreadsheetGrid from "../features/formulas/components/SpreadsheetGrid";
import { formulaChallenges, getChallengesByTier } from "../features/formulas/data/challenges";
import { formulasCurriculum } from "../features/formulas/data/curriculum";
import { formulasTrackTiers } from "../features/formulas/data/tiers";
import { formulasTrack } from "../features/formulas/data/tracks";
import {
  applyValidationResult,
  createAttemptState,
  getCompletionStars,
  getVisibleHints,
  revealNextHint,
} from "../features/formulas/lib/attempt-state";
import { selectGridCell, updateCellFormula } from "../features/formulas/lib/grid-actions";
import {
  createChallengeGridState,
  createEmptyEvaluationState,
  evaluateGridState,
} from "../features/formulas/lib/grid-model";
import { getCellFormula, isEditableTargetCell } from "../features/formulas/lib/grid-selectors";
import { validateChallenge } from "../features/formulas/lib/validate-challenge";
import {
  getChallengeCompletion,
  getCompletedChallengeCount,
  getEarnedStars,
  getEarnedXp,
  getRecommendedChallenge,
  getSessionLevel,
  summarizeTierProgress,
} from "../lib/progression/session-progress";

const milestoneChecklist = [
  "Formula engine and challenge data are in place",
  "Dashboard and track navigation are now testable",
  "Spreadsheet sandbox handles real formula input",
  "Validation, hints, and review states come next",
];

const trackCards = [
  {
    id: "formulas",
    title: "Formulas & Functions",
    accent: "border-violet-400/30 bg-violet-400/10 text-violet-100",
    status: "Available now",
    summary:
      "Hands-on spreadsheet scenarios with real formulas, live calculation, and a challenge sandbox.",
  },
  {
    id: "analysis",
    title: "Data Analysis",
    accent: "border-sky-400/30 bg-sky-400/10 text-sky-100",
    status: "Planned",
    summary: "Reason through sorting, filtering, KPI interpretation, and reporting choices.",
  },
  {
    id: "shortcuts",
    title: "Keyboard Shortcuts",
    accent: "border-amber-400/30 bg-amber-400/10 text-amber-100",
    status: "Planned",
    summary: "Build speed with timed drills for navigation, selection, editing, and formatting.",
  },
  {
    id: "charts",
    title: "Charts & Visualization",
    accent: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
    status: "Planned",
    summary: "Choose the right chart and critique business reporting visuals with confidence.",
  },
];

function App() {
  const [currentView, setCurrentView] = useState(APP_VIEWS.dashboard);
  const [activeChallenge, setActiveChallenge] = useState(
    () => getDefaultFormulasChallenge() ?? formulaChallenges[0],
  );
  const [attemptState, setAttemptState] = useState(() => createAttemptState());
  const [scenarioExpanded, setScenarioExpanded] = useState(true);
  const [progressByChallengeId, setProgressByChallengeId] = useState({});
  const tierSummaries = useMemo(
    () =>
      summarizeTierProgress({
        tiers: formulasTrackTiers,
        getChallengesByTier,
        progressByChallengeId,
      }),
    [progressByChallengeId],
  );
  const challengeCount = formulaChallenges.length;
  const completedChallengeCount = getCompletedChallengeCount(progressByChallengeId);
  const earnedXp = getEarnedXp(formulaChallenges, progressByChallengeId);
  const totalPossibleXp = formulaChallenges.reduce((total, challenge) => total + challenge.xp, 0);
  const earnedStars = getEarnedStars(progressByChallengeId);
  const sessionLevel = getSessionLevel(formulaChallenges, progressByChallengeId);
  const recommendedChallenge = getRecommendedChallenge(formulaChallenges, progressByChallengeId);
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
  const visibleHints = getVisibleHints(activeChallenge, attemptState);
  const starsEarned = getCompletionStars(attemptState);
  const challengePosition = getChallengePosition(activeChallenge.id);
  const nextChallenge = getNextChallenge(activeChallenge.id);
  const activeChallengeProgress = getChallengeCompletion(progressByChallengeId, activeChallenge.id);

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
    setAttemptState(createAttemptState());
    setScenarioExpanded(true);
  }

  function openTrackView() {
    setCurrentView(APP_VIEWS.track);
  }

  function openChallenge(challenge) {
    setActiveChallenge(challenge);
    setGridState(createChallengeGridState(challenge));
    setAttemptState(createAttemptState());
    setScenarioExpanded(true);
    setCurrentView(APP_VIEWS.challenge);
  }

  function handleCheckAnswer() {
    const validationResult = validateChallenge(activeChallenge, gridState, evaluationState);
    setAttemptState((currentState) => {
      const nextAttemptState = applyValidationResult(currentState, validationResult);

      if (validationResult.status === "correct") {
        const completionStars = getCompletionStars(nextAttemptState);

        setProgressByChallengeId((currentProgress) => {
          const previousProgress = currentProgress[activeChallenge.id];
          const previousStars = previousProgress?.starsEarned ?? 0;

          return {
            ...currentProgress,
            [activeChallenge.id]: {
              completed: true,
              starsEarned: Math.max(previousStars, completionStars),
            },
          };
        });
      }

      return nextAttemptState;
    });
  }

  function handleRevealHint() {
    setAttemptState((currentState) => revealNextHint(currentState, activeChallenge));
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(91,72,179,0.28),_transparent_32%),linear-gradient(180deg,_#07111f_0%,_#040914_100%)] px-6 py-10 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-slate-950/70 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <span className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
                Excel Mastery
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Premium Excel training built around realistic spreadsheet work.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                The app shell now mirrors the real product direction: dashboard,
                formulas track overview, and a challenge workspace built around the
                spreadsheet sandbox.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:w-[26rem]">
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-sm text-cyan-100">
                <div className="font-medium text-cyan-200">Current focus</div>
                <div className="mt-1">Product UI shell</div>
              </div>
              <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 px-5 py-4 text-sm text-violet-100">
                <div className="font-medium text-violet-200">Challenge bank</div>
                <div className="mt-1">{challengeCount} drafted formulas</div>
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-100">
                <div className="font-medium text-emerald-200">Launch scope</div>
                <div className="mt-1">{formulasCurriculum.launch.functions.length} functions</div>
              </div>
            </div>
          </div>
          <nav className="flex flex-wrap gap-3">
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm transition ${
                currentView === APP_VIEWS.dashboard
                  ? "bg-white text-slate-950"
                  : "border border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]"
              }`}
              onClick={() => setCurrentView(APP_VIEWS.dashboard)}
            >
              Dashboard
            </button>
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm transition ${
                currentView === APP_VIEWS.track
                  ? "bg-white text-slate-950"
                  : "border border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]"
              }`}
              onClick={openTrackView}
            >
              Formulas Track
            </button>
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm transition ${
                currentView === APP_VIEWS.challenge
                  ? "bg-white text-slate-950"
                  : "border border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]"
              }`}
              onClick={() => setCurrentView(APP_VIEWS.challenge)}
            >
              Challenge Workspace
            </button>
          </nav>
        </header>

        {currentView === APP_VIEWS.dashboard && (
          <>
            <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <article className="rounded-[24px] border border-white/10 bg-slate-900/75 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Recommended next challenge</h2>
                  <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-violet-200">
                    {formulasTrack.label}
                  </span>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                  <div>
                    <div className="text-sm uppercase tracking-[0.22em] text-slate-400">
                      {completedChallengeCount === challengeCount ? "Track complete" : "Session recommendation"}
                    </div>
                    <h3 className="mt-2 text-3xl font-semibold text-white">
                      {recommendedChallenge?.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                      {recommendedChallenge?.scenario}
                    </p>
                    <p className="mt-4 text-sm text-slate-400">
                      Objective: {recommendedChallenge?.learningObjective}
                    </p>
                    <p className="mt-2 text-sm text-emerald-200">
                      {completedChallengeCount} of {challengeCount} formulas challenges solved in this session
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
                    onClick={() => openChallenge(recommendedChallenge)}
                  >
                    Open Challenge
                  </button>
                </div>
              </article>

              <aside className="rounded-[24px] border border-white/10 bg-slate-900/75 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                <h2 className="text-xl font-semibold text-white">Snapshot</h2>
                <div className="mt-5 grid gap-4">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Session XP</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{earnedXp}</div>
                    <div className="mt-1 text-sm text-slate-400">earned out of {totalPossibleXp} drafted formulas XP</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Session Level</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{sessionLevel}</div>
                    <div className="mt-1 text-sm text-slate-400">{earnedStars} total stars earned this session</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Milestone Readiness</div>
                    <ol className="mt-3 grid gap-3 text-sm text-slate-300">
                      {milestoneChecklist.map((item, index) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15 text-xs text-emerald-200">
                            {index + 1}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </aside>
            </section>

            <section className="grid gap-6 lg:grid-cols-4">
              {trackCards.map((track) => (
                <article
                  key={track.id}
                  className="rounded-[24px] border border-white/10 bg-slate-900/75 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
                >
                  <div className={`inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em] ${track.accent}`}>
                    {track.status}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-white">{track.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{track.summary}</p>
                  {track.id === "formulas" ? (
                    <button
                      type="button"
                      className="mt-5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-100 transition hover:bg-white/[0.08]"
                      onClick={openTrackView}
                    >
                      View Track
                    </button>
                  ) : (
                    <div className="mt-5 text-sm text-slate-500">Track shell planned after formulas v1.</div>
                  )}
                </article>
              ))}
            </section>
          </>
        )}

        {currentView === APP_VIEWS.track && (
          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="rounded-[24px] border border-white/10 bg-slate-900/75 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">{formulasTrack.label}</h2>
                <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-violet-200">
                  Active track
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{formulasTrack.description}</p>
              <div className="mt-6 rounded-[22px] border border-white/10 bg-slate-950/70 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Dashboard summary</div>
                <p className="mt-2 text-sm leading-6 text-slate-200">{formulasTrack.dashboardSummary}</p>
              </div>
              <div className="mt-4 rounded-[22px] border border-white/10 bg-slate-950/70 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Launch functions</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {formulasCurriculum.launch.functions.map((formulaName) => (
                    <span
                      key={formulaName}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-200"
                    >
                      {formulaName}
                    </span>
                  ))}
                </div>
              </div>
            </aside>

            <div className="grid gap-4">
              {tierSummaries.map((tier) => (
                <section
                  key={tier.id}
                  className="rounded-[24px] border border-white/10 bg-slate-900/75 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold text-white">{tier.label}</h2>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] ${
                            tier.unlocked
                              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                              : "border-slate-400/20 bg-slate-400/10 text-slate-300"
                          }`}
                        >
                          {tier.unlocked ? "Unlocked" : "Locked"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{tier.summary}</p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200">
                      {tier.completedCount}/{tier.challengeCount} complete
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3">
                    {getChallengesByTier(tier.id).map((challenge) => (
                      (() => {
                        const challengeProgress = getChallengeCompletion(progressByChallengeId, challenge.id);
                        const isCompleted = Boolean(challengeProgress?.completed);

                        return (
                      <button
                        key={challenge.id}
                        type="button"
                        className={`rounded-2xl border px-4 py-4 text-left transition ${
                          activeChallenge.id === challenge.id
                            ? "border-violet-400/40 bg-violet-400/12"
                            : isCompleted
                              ? "border-emerald-400/25 bg-emerald-400/10 hover:bg-emerald-400/15"
                              : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                        }`}
                        disabled={!tier.unlocked}
                        onClick={() => openChallenge(challenge)}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-sm font-medium text-white">{challenge.title}</div>
                            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                              {challenge.department}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            {isCompleted && (
                              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-emerald-200">
                                Solved {challengeProgress.starsEarned}★
                              </span>
                            )}
                            <span>{challenge.xp} XP</span>
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                          {challenge.learningObjective}
                        </p>
                        {!tier.unlocked && (
                          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                            Complete enough of the previous tier to unlock this section.
                          </p>
                        )}
                      </button>
                        );
                      })()
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        )}

        {currentView === APP_VIEWS.challenge && (
          <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
            <article className="rounded-[24px] border border-white/10 bg-slate-900/75 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-slate-400">
                    <span>Challenge workspace</span>
                    {challengePosition && (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-slate-300">
                        Challenge {challengePosition.index + 1} of {challengePosition.total}
                      </span>
                    )}
                    <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-[11px] text-violet-200">
                      {activeChallenge.tier}
                    </span>
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {activeChallenge.title}
                  </h2>
                  {activeChallengeProgress?.completed && (
                    <div className="mt-3 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-emerald-200">
                      Completed in this session • {activeChallengeProgress.starsEarned}★
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.08]"
                    onClick={openTrackView}
                  >
                    Back To Track
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.08]"
                    onClick={handleResetChallenge}
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                        Scenario briefing
                      </div>
                      <div className="mt-2 text-sm text-slate-500">
                        Workplace setup for the formula task
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.08]"
                      onClick={() => setScenarioExpanded((currentValue) => !currentValue)}
                    >
                      {scenarioExpanded ? "Collapse Brief" : "Show Brief"}
                    </button>
                  </div>
                  {scenarioExpanded && (
                    <p className="mt-4 text-sm leading-6 text-slate-200">{activeChallenge.scenario}</p>
                  )}
                </div>
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
                    Current cell status
                  </div>
                  <div className="mt-2 text-sm text-slate-200">
                    {activeCellEvaluation.status === "ok" && `Computed value: ${String(activeCellEvaluation.value)}`}
                    {activeCellEvaluation.status === "error" &&
                      `Formula error: ${activeCellEvaluation.error?.message ?? "Unknown error"}`}
                    {activeCellEvaluation.status === "idle" &&
                      "Select the highlighted answer cell and type a formula to see the result."}
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Hints
                  </div>
                  <div className="mt-3 grid gap-3">
                    {visibleHints.length === 0 && (
                      <p className="text-sm text-slate-400">
                        No hints revealed yet. Use the hint button when you want guided support.
                      </p>
                    )}
                    {visibleHints.map((hint, index) => (
                      <div
                        key={`${activeChallenge.id}-hint-${index + 1}`}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                      >
                        <div className="text-xs uppercase tracking-[0.18em] text-violet-200">
                          Hint {index + 1}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-200">{hint}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Supported functions for this challenge
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeChallenge.supportedFunctions.map((formulaName) => (
                      <span
                        key={formulaName}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-200"
                      >
                        {formulaName}
                      </span>
                    ))}
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
              <FeedbackPanel
                validationResult={attemptState.lastValidation}
                submissionCount={attemptState.submissionCount}
                hintsShown={attemptState.hintsShown}
                hasMoreHints={attemptState.hintsShown < activeChallenge.hints.length}
                onCheckAnswer={handleCheckAnswer}
                onRevealHint={handleRevealHint}
              />
              <SpreadsheetGrid
                challenge={activeChallenge}
                gridState={gridState}
                evaluationState={evaluationState}
                onSelectCell={(cellRef) =>
                  setGridState((currentState) => selectGridCell(currentState, cellRef))
                }
              />
              {attemptState.completed && (
                <ReviewCard
                  challenge={activeChallenge}
                  starsEarned={starsEarned}
                  nextChallengeTitle={nextChallenge?.title ?? null}
                  onNextChallenge={nextChallenge ? () => openChallenge(nextChallenge) : null}
                  onBackToTrack={openTrackView}
                />
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
