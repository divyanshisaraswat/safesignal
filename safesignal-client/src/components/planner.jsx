import { useState } from "react";
import { card, input, label } from "../data";

export default function Planner({ onCreate }) {
  const [f, setF] = useState({ dest: "", time: "", cname: "", cemail: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const ok = f.dest && f.time && f.cname;
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
        <button disabled={!ok} onClick={() => onCreate(f)}
          className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-semibold py-3 transition">
          Start journey
        </button>
      </div>
    </div>
  );
}
