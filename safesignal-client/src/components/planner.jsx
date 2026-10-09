import { useState } from "react";
import { card, input, label } from "../Data";
import { createJourney } from "../Api";

// "21:30" -> full ISO date. If the time already passed today, use tomorrow.
function toArrivalDate(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  if (d <= new Date()) d.setDate(d.getDate() + 1);
  return d.toISOString();
}

export default function Planner({ onCreate }) {
  const [f, setF] = useState({ dest: "", time: "", cname: "", cemail: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const ok = f.dest && f.time && f.cname && !loading;

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const journey = await createJourney(f.dest, f.cname, toArrivalDate(f.time));
      // Same data as before, plus the saved journey (token, shareCode, status...)
      onCreate({ ...f, journey });
    } catch (e) {
      setError(e.message || "Could not start the journey. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={card}>
      <h2 className="text-lg font-semibold">Plan a journey</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">Only what's needed. No location tracking, no account required to view.</p>
      <div className="space-y-4">
        <div><label className={label}>Destination</label><input className={input} value={f.dest} onChange={set("dest")} placeholder="e.g. Home, Central Library" /></div>
        <div><label className={label}>Expected arrival</label><input type="time" className={input} value={f.time} onChange={set("time")} /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={label}>Trusted contact name</label><input className={input} value={f.cname} onChange={set("cname")} placeholder="Name" /></div>
          <div><label className={label}>Contact email</label><input className={input} value={f.cemail} onChange={set("cemail")} placeholder="optional" /></div>
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button disabled={!ok} onClick={submit}
          className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-semibold py-3 transition">
          {loading ? "Starting..." : "Start journey"}
        </button>
      </div>
    </div>
  );
}