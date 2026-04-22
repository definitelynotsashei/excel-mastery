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
                The repository is now scaffolded for the first delivery milestone:
                a Vite + React + Tailwind baseline aligned to the implementation
                plan, ready for the formulas-track vertical slice.
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-sm text-cyan-100">
              <div className="font-medium text-cyan-200">Current focus</div>
              <div className="mt-1">Milestone 0: scaffold and module boundaries</div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          <article className="rounded-[24px] border border-white/10 bg-slate-900/75 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Delivery sequence</h2>
              <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-violet-200">
                Vertical slice
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
            <h2 className="text-xl font-semibold text-white">Planned modules</h2>
            <div className="mt-5 grid gap-4">
              {moduleGroups.map((group) => (
                <section
                  key={group.title}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
                    {group.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {group.body}
                  </p>
                </section>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default App;
