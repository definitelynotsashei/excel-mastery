import { getCellDisplayValue, isEditableTargetCell } from "../lib/grid-selectors";

function SpreadsheetGrid({ challenge, gridState, evaluationState, onSelectCell }) {
  return (
    <section className="overflow-x-auto rounded-[24px] border border-white/10 bg-slate-950/80 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
      <table className="min-w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th className="h-10 w-12 rounded-tl-2xl border border-white/10 bg-slate-900 text-slate-500" />
            {challenge.grid.columns.map((column) => (
              <th
                key={column}
                className="h-10 min-w-28 border border-white/10 bg-slate-900 px-3 text-center font-medium text-slate-300"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: challenge.grid.rows }, (_, rowIndex) => {
            const rowNumber = rowIndex + 1;

            return (
              <tr key={rowNumber}>
                <th className="h-12 border border-white/10 bg-slate-900 px-3 text-center font-medium text-slate-500">
                  {rowNumber}
                </th>
                {challenge.grid.columns.map((column) => {
                  const cellRef = `${column}${rowNumber}`;
                  const active = gridState.activeCell === cellRef;
                  const editable = isEditableTargetCell(challenge, cellRef);
                  const evaluation = evaluationState[cellRef];
                  const displayValue = getCellDisplayValue(
                    challenge,
                    gridState,
                    evaluationState,
                    cellRef,
                  );

                  let tone =
                    "border-white/10 bg-slate-900 text-slate-400 hover:bg-slate-800/80";

                  if (editable) {
                    tone =
                      "border-violet-400/30 bg-violet-400/10 text-slate-100 hover:bg-violet-400/16";
                  }

                  if (evaluation?.status === "error") {
                    tone = "border-rose-400/40 bg-rose-400/10 text-rose-100 hover:bg-rose-400/16";
                  }

                  if (active) {
                    tone += " ring-2 ring-cyan-300/70 ring-inset";
                  }

                  return (
                    <td key={cellRef} className="border border-white/10 p-0">
                      <button
                        type="button"
                        className={`flex h-12 w-full items-center justify-start px-3 text-left transition ${tone}`}
                        onClick={() => onSelectCell(cellRef)}
                      >
                        <span className="truncate">
                          {displayValue === "" ? <span className="text-slate-600"> </span> : String(displayValue)}
                        </span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export default SpreadsheetGrid;
