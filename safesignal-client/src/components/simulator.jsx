import { useState } from "react";
import { card, input, SCENARIOS } from "../Data";
import { Badge } from "./Ui";
import { getScenario, getScenarioFeedback } from "../Api";

const SETTINGS = [
  "walking home at night",
  "taking a cab or ride-share",
  "using public transport late",
  "travelling alone in a new city",
];

export default function Simulator() {
  const [mode, setMode] = useState("classic"); // classic | ai

  // --- classic (your original fixed scenarios) ---
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const s = SCENARIOS[i];

  // --- AI scenarios ---
  const [setting, setSetting] = useState(SETTINGS[0]);
  const [ai, setAi] = useState(null);       // { scenario, options: [{id, text}] }
  const [aiPick, setAiPick] = useState(null);
  const [fb, setFb] = useState(null);       // { feedback, tips }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadScenario = async () => {
    setLoading(true);
    setError("");
    setAi(null);
    setAiPick(null);
    setFb(null);
    try {
      const d = await getScenario(setting);
      if (!d.scenario || !Array.isArray(d.options)) throw new Error("Unexpected response");
      setAi(d);
    } catch (e) {
      setError(e.message || "Could not load a scenario. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const choose = async (opt) => {
    setAiPick(opt.id);
    setLoading(true);
    setError("");
    try {
      setFb(await getScenarioFeedback(ai.scenario, opt.text));
    } catch (e) {
      setError(e.message || "Could not get feedback. Please try again.");
      setAiPick(null);
    } finally {
      setLoading(false);
    }
  };

  const tabBtn = (k, text) => (
    <button onClick={() => setMode(k)}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${mode === k ? "bg-teal-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}>
      {text}
    </button>
  );

  return (
    <div className={card}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Scenario simulator</h2>
        <Badge>Practice</Badge>
      </div>
      <div className="flex gap-2 mb-5">
        {tabBtn("classic", "Classic")}
        {tabBtn("ai", "AI scenarios")}
      </div>

      {mode === "classic" && (
        <>
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
        </>
      )}

      {mode === "ai" && (
        <>
          <div className="flex gap-2 items-center mb-4">
            <select className={input} value={setting} onChange={(e) => setSetting(e.target.value)} disabled={loading}>
              {SETTINGS.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
            <button onClick={loadScenario} disabled={loading}
              className="shrink-0 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2.5">
              {ai ? "New scenario" : "Generate"}
            </button>
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>}
          {loading && !ai && <p className="text-sm text-slate-500">Creating a scenario...</p>}

          {ai && (
            <>
              <div className="flex items-center gap-2 mb-3"><Badge>AI-generated</Badge></div>
              <p className="font-medium mb-4">{ai.scenario}</p>
              <div className="space-y-2.5">
                {ai.options.map((o) => (
                  <button key={o.id} disabled={aiPick !== null || loading} onClick={() => choose(o)}
                    className={`w-full text-left rounded-xl border p-3.5 text-sm transition ${aiPick === null ? "border-slate-200 dark:border-slate-700 hover:border-teal-500" : aiPick === o.id ? "border-teal-500 bg-teal-50 dark:bg-teal-950/40" : "border-slate-200 dark:border-slate-800 opacity-60"}`}>
                    {o.text}
                  </button>
                ))}
              </div>

              {loading && aiPick !== null && <p className="text-sm text-slate-500 mt-4">Getting feedback...</p>}

              {fb && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm rounded-xl bg-slate-100 dark:bg-slate-800 p-3.5">{fb.feedback}</p>
                  {Array.isArray(fb.tips) && fb.tips.length > 0 && (
                    <ul className="text-sm space-y-1.5 list-disc pl-5 text-slate-700 dark:text-slate-300">
                      {fb.tips.map((t, k) => <li key={k}>{t}</li>)}
                    </ul>
                  )}
                  <p className="text-xs text-slate-500">Practice only. In real danger, call your local emergency number.</p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}