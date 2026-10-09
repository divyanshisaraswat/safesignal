import { useState } from "react";
import { STATUS } from "./Data";
import Planner from "./components/Planner";
import Journey from "./components/Journey";
import Simulator from "./components/Simulator";
import Privacy from "./components/Privacy";
import { checkIn } from "./Api";

const tabs = [["journey", "Journey"], ["sim", "Simulator"], ["privacy", "Privacy"]];
const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function App() {
  const [tab, setTab] = useState("journey");
  const [j, setJ] = useState(null);
  const [status, setSt] = useState("planned");
  const [log, setLog] = useState([]);

  const create = (f) => { setJ(f); setSt("planned"); setLog([["Journey started", now()]]); };
  // Maps your UI status keys to the backend's status names.
// Keys not listed here only change locally.
const BACKEND_STATUS = { safe: "Safe", delayed: "Delayed", late: "Delayed", assist: "Need Assistance" };

const setStatus = async (k) => {
  setSt(k);
  setLog((l) => [[`Status: ${STATUS[k].t}${k === "assist" ? " (simulated alert)" : ""}`, now()], ...l]);

  const BACKEND_STATUS = { safe: "Safe", delayed: "Delayed", assist: "Need Assistance" };
  if (backendStatus && j?.journey?.token) {
    try {
      await checkIn(j.journey.token, backendStatus);
    } catch {
      setLog((l) => [["Could not sync with server", now()], ...l]);
    }
  }
};

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-br from-teal-700 to-indigo-800 text-white">
        <div className="max-w-2xl mx-auto px-5 pt-6 pb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
              <span className="text-xl font-bold tracking-tight">SafeSignal</span>
            </div>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">Demo mode</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mt-6 leading-tight">Travel with someone in your corner.</h1>
          <p className="text-teal-50/90 mt-2 text-sm">Plan, check in, and keep a trusted person informed. Private by design.</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 -mt-5">
        <nav className="flex gap-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-1.5 mb-5">
          {tabs.map(([k, t]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${tab === k ? "bg-teal-600 text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
              {t}
            </button>
          ))}
        </nav>

        {tab === "journey" && (j ? <Journey j={j} status={status} setStatus={setStatus} log={log} /> : <Planner onCreate={create} />)}
        {tab === "sim" && <Simulator />}
        {tab === "privacy" && <Privacy />}

        <footer className="text-xs text-slate-500 dark:text-slate-400 text-center py-8 leading-relaxed">
          SafeSignal is a demonstration. Alerts are simulated and do not reach emergency services.<br />
          In an emergency, contact your local emergency number.
        </footer>
      </main>
    </div>
  );
}
