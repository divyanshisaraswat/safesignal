import { useState } from "react";
import { card, SCENARIOS } from "../data";
import { Badge } from "./ui";

export default function Simulator() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const s = SCENARIOS[i];
  return (
    <div className={card}>
      <div className="flex items-center justify-between mb-1"><h2 className="text-lg font-semibold">Scenario simulator</h2><Badge>Practice</Badge></div>
      <p className="text-xs text-slate-500 mb-5">Scenario {i + 1} of {SCENARIOS.length}</p>
      <p className="font-medium mb-4">{s.q}</p>
      <div className="space-y-2.5">
        {s.o.map((o, k) => (
          <button key={k} disabled={pick !== null} onClick={() => setPick(k)}
            className={`w-full text-left rounded-xl border p-3.5 text-sm transition ${pick === null ? "border-slate-200 dark:border-slate-700 hover:border-teal-500" : o[1] ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" : pick === k ? "border-rose-400 bg-rose-50 dark:bg-rose-950/40" : "border-slate-200 dark:border-slate-800 opacity-60"}`}>
            {o[0]}
          </button>
        ))}
      </div>
      {pick !== null && (
        <div className="mt-4">
          <p className="text-sm rounded-xl bg-slate-100 dark:bg-slate-800 p-3.5">{s.o[pick][2]}</p>
          <button onClick={() => { setPick(null); setI((i + 1) % SCENARIOS.length); }}
            className="mt-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2.5">
            Next scenario
          </button>
        </div>
      )}
    </div>
  );
}
