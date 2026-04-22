function ReviewCard({
  challenge,
  starsEarned,
  submissionCount,
  hintsUsed,
  nextChallengeTitle,
  onNextChallenge,
  onBackToTrack,
}) {
  return (
    <section className="rounded-[24px] border border-emerald-400/30 bg-emerald-400/10 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-emerald-200">
            Challenge review
          </div>
          <h3 className="mt-2 text-xl font-semibold text-white">{challenge.review.concept}</h3>
        </div>
        <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white">
          {starsEarned} star{starsEarned === 1 ? "" : "s"}
        </div>
      </div>
      <div className="mt-3 text-sm text-emerald-100">
        Solved in {submissionCount} check{submissionCount === 1 ? "" : "s"} with {hintsUsed} hint{hintsUsed === 1 ? "" : "s"} used.
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {onNextChallenge && (
          <button
            type="button"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
            onClick={onNextChallenge}
          >
            Next Challenge: {nextChallengeTitle}
          </button>
        )}
        <button
          type="button"
          className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-100 transition hover:bg-white/[0.08]"
          onClick={onBackToTrack}
        >
          Back To Track
        </button>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Optimal solution</div>
          <p className="mt-2 text-sm font-medium text-slate-100">{challenge.review.optimalSolution}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Alternative approach</div>
          <p className="mt-2 text-sm text-slate-200">{challenge.review.alternativeApproach}</p>
        </div>
      </div>
    </section>
  );
}

export default ReviewCard;
