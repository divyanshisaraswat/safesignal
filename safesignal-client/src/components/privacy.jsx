import { useState } from "react";
import { card } from "../Data";
import { Toggle } from "./Ui";

export default function Privacy() {
  const [p, setP] = useState({ loc: false, ai: true, hist: false });
  return (
    <div className={card}>
      <h2 className="text-lg font-semibold">Privacy controls</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-2">You decide what's shared. Defaults are the most private.</p>
      <Toggle on={p.loc} set={(v) => setP({ ...p, loc: v })} title="Share location with contact" desc="Off by default. SafeSignal never tracks you in the background." />
      <Toggle on={p.ai} set={(v) => setP({ ...p, ai: v })} title="Use AI checklist" desc="Only the destination and time are used to suggest preparation steps." />
      <Toggle on={p.hist} set={(v) => setP({ ...p, hist: v })} title="Keep journey history" desc="Off: journeys are deleted automatically after they end." />
      <button className="mt-4 text-sm font-medium text-rose-600 hover:underline">Delete all my data</button>
    </div>
  );
}
