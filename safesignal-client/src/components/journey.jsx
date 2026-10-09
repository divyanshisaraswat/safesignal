import { useState, useEffect } from "react";
import { card, STATUS, checklistFor } from "../Data";
import { Badge } from "./Ui";
import { getChecklist } from "../Api";

// "21:30" -> a coarse label. We send only this, never the exact time or address.
function timeOfDayLabel(time) {
  const h = time ? parseInt(time.split(":")[0], 10) : 12;
  if (h >= 22 || h < 5) return "late night";
  if (h >= 19) return "late evening";
  if (h >= 17) return "evening";
  if (h >= 12) return "afternoon";
  return "morning";
}

export default function Journey({ j, status, setStatus, log }) {
  const [done, setDone] = useState({});
  const [items, setItems] = useState(() => checklistFor(j.dest, j.time));
  const [source, setSource] = useState("loading"); // loading | ai | default

  useEffect(() => {
    let cancelled = false;
    getChecklist("general journey", timeOfDayLabel(j.time))
      .then((data) => {
        if (cancelled) return;
        if (data.fallback || !data.items?.length) {
          setSource("default");
          return;
        }
        setItems(data.items.map((i) => i.text));
        setDone({});
        setSource("ai");
      })
      .catch(() => {
        if (!cancelled) setSource("default");
      });
    return () => { cancelled = true; };
  }, [j.time]);

  const btn = (k, text, cls) => (
    <button onClick={() => setStatus(k)}
      className={`flex-1 rounded-xl py-3 text-sm font-semibold transition border ${status === k ? cls + " ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900" : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
      {text}
    </button>
  );
  return (
    <div className="space-y-5">
      <div className={card}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Active journey</p>
            <h2 className="text-xl font-semibold mt-1">{j.dest}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Arrive by {j.time} · Contact: {j.cname}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS[status].c}`}>{STATUS[status].t}</span>
        </div>
        <p className="text-sm font-medium mt-5 mb-2">Check in</p>
        <div className="flex gap-2">
          {btn("safe", "Safe", "bg-emerald-600 text-white border-emerald-600 ring-emerald-500")}
          {btn("delayed", "Delayed", "bg-amber-500 text-white border-amber-500 ring-amber-400")}
          {btn("assist", "Need help", "bg-rose-600 text-white border-rose-600 ring-rose-500")}
        </div>
      </div>

      {status === "assist" && (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 p-5">
          <div className="flex items-center gap-2 mb-2"><Badge>SIMULATED</Badge><span className="font-semibold text-rose-900 dark:text-rose-200">Assistance request sent</span></div>
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900 p-4 text-sm">
            <p className="text-xs text-slate-500 mb-1">What {j.cname} would see:</p>
            <p>Your contact needs assistance. Destination: <b>{j.dest}</b>. Expected arrival: <b>{j.time}</b>. Please try to reach them.</p>
          </div>
          <p className="text-xs text-rose-900/80 dark:text-rose-200/80 mt-3">This is a demo. SafeSignal does not contact police or emergency services. In real danger, call your local emergency number.</p>
        </div>
      )}

      <div className={card}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Safety checklist</h3>
          <Badge>
            {source === "ai" ? "AI-generated" : source === "loading" ? "Loading AI tips..." : "Sample checklist"}
          </Badge>
        </div>
        <ul className="space-y-2">
          {items.map((t, i) => (
            <li key={i}>
              <label className="flex items-start gap-3 text-sm cursor-pointer">
                <input type="checkbox" className="mt-0.5 h-4 w-4 accent-teal-600" checked={!!done[i]} onChange={() => setDone({ ...done, [i]: !done[i] })} />
                <span className={done[i] ? "line-through text-slate-400" : ""}>{t}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className={card}>
        <h3 className="font-semibold mb-3">Activity</h3>
        <ul className="space-y-2 text-sm">
          {log.map((l, i) => <li key={i} className="flex justify-between text-slate-600 dark:text-slate-400"><span>{l[0]}</span><span>{l[1]}</span></li>)}
        </ul>
      </div>
    </div>
  );
}