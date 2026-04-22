function FeedbackPanel({ validationResult, submissionCount, hintsShown, onCheckAnswer, onRevealHint, hasMoreHints }) {
  const toneByStatus = {
    empty: "border-slate-400/20 bg-slate-400/10 text-slate-100",
    pending: "border-slate-400/20 bg-slate-400/10 text-slate-100",
    error: "border-rose-400/30 bg-rose-400/10 text-rose-100",
    incorrect: "border-amber-400/30 bg-amber-400/10 text-amber-100",
    correct: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
  };

  const tone = toneByStatus[validationResult?.status ?? "empty"];

  return (
    <section className="rounded-[22px] border border-white/10 bg-slate-950/75 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.24)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Feedback</div>
          <div className="mt-1 text-sm text-slate-500">
            {submissionCount} checks run • {hintsShown} hints shown
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
            onClick={onCheckAnswer}
          >
            Check Answer
          </button>
          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!hasMoreHints}
            onClick={onRevealHint}
          >
            Reveal Hint
          </button>
        </div>
      </div>

      <div className={`mt-4 rounded-2xl border px-4 py-4 ${tone}`}>
        <div className="text-sm font-semibold">
          {validationResult?.title ?? "Ready to check"}
        </div>
        <p className="mt-2 text-sm leading-6">
          {validationResult?.message ??
            "Use the formula bar, then check your answer to see whether the challenge is solved."}
        </p>
      </div>
    </section>
  );
}

export default FeedbackPanel;
