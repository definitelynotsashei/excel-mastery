function FormulaBar({ activeCell, formula, editable, onFormulaChange }) {
  return (
    <section className="rounded-[22px] border border-white/10 bg-slate-950/75 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.22em] text-slate-400">Formula Bar</span>
        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
          {activeCell}
        </span>
      </div>
      <input
        aria-label="Formula input"
        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/20 disabled:cursor-not-allowed disabled:border-white/5 disabled:text-slate-500"
        disabled={!editable}
        placeholder={editable ? '=SUM(B2:B5)' : "Select a highlighted answer cell to edit"}
        value={formula}
        onChange={(event) => onFormulaChange(event.target.value)}
      />
    </section>
  );
}

export default FormulaBar;
