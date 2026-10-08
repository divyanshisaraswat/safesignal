export function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-2.5 py-0.5 text-xs font-semibold">
      {children}
    </span>
  );
}

export function Toggle({ on, set, title, desc }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b last:border-0 border-slate-100 dark:border-slate-800">
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
      </div>
      <button role="switch" aria-checked={on} onClick={() => set(!on)}
        className={`shrink-0 w-11 h-6 rounded-full transition relative ${on ? "bg-teal-600" : "bg-slate-300 dark:bg-slate-700"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}
