import { Check, ChevronDown, ChevronRight, Clock3, ShieldCheck } from "lucide-react";
import { STATUS } from "../data";

const statusOptions = [
  ["safe", "Safe"],
  ["delayed", "Delayed"],
  ["assist", "Need help"],
];

function formatTime(value) {
  if (!value) return "Not set";
  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function timeUntil(value) {
  if (!value) return "Arrival time not set";
  const [hours, minutes] = value.split(":").map(Number);
  const now = new Date();
  const arrival = new Date();
  arrival.setHours(hours, minutes, 0, 0);
  if (arrival < now) arrival.setDate(arrival.getDate() + 1);
  const totalMinutes = Math.max(1, Math.round((arrival - now) / 60000));
  const remainingHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  return remainingHours
    ? `In ${remainingHours} hr ${remainingMinutes} min`
    : `In ${remainingMinutes} min`;
}

export default function Journey({ journey, status, activity, onStatusChange }) {
  const currentStatus = STATUS[status] || STATUS.safe;
  const startTime = journey.startedAt
    ? new Date(journey.startedAt).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })
    : "Now";

  return (
    <div className="journey-card flex h-full flex-col rounded-xl p-4 text-white shadow-md sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-[11px] font-medium text-blue-100">
          <span className="size-2 rounded-full bg-emerald-400" />
          Live journey
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold">
          <ShieldCheck size={13} aria-hidden="true" />
          Private
        </span>
      </div>

      <div className="border-b border-white/10 pb-3">
        <h2 className="text-xl font-bold leading-6">On your way</h2>
        <p className="mt-1 text-[11px] leading-4 text-blue-100/80">
          Your trusted contact can be updated at each check-in.
        </p>
      </div>

      <ol className="my-3 space-y-3">
        <li className="flex items-center gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-[#073d5a]">
            <Check size={17} strokeWidth={3} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold">Journey started</span>
            <span className="block text-[10px] text-blue-100/70">Today, {startTime}</span>
          </span>
          <ChevronRight size={16} className="text-blue-100/70" aria-hidden="true" />
        </li>
        <li className="flex items-center gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-500 ring-4 ring-blue-400/20">
            <span className="size-2 rounded-full bg-white" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold">
              {status === "delayed" ? "Delayed" : status === "assist" ? "Assistance requested" : "En route"}
            </span>
            <span className="block truncate text-[10px] text-blue-100/70">{activity || "Currently travelling"}</span>
          </span>
          <details className="relative">
            <summary
              aria-label="Update journey status"
              className="flex size-7 cursor-pointer list-none items-center justify-center rounded-full text-blue-100/70 hover:bg-white/10"
            >
              <ChevronDown size={16} aria-hidden="true" />
            </summary>
            <div className="absolute right-0 top-8 z-10 min-w-36 rounded-lg border border-slate-200 bg-white p-1.5 text-slate-800 shadow-lg">
              {statusOptions.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={(event) => {
                    onStatusChange(value);
                    event.currentTarget.closest("details")?.removeAttribute("open");
                  }}
                  className={`block w-full rounded-md px-2.5 py-2 text-left text-xs hover:bg-slate-100 ${status === value ? "font-semibold text-indigo-700" : ""
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </details>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-blue-100">
            3
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold">Arrive at destination</span>
            <span className="block truncate text-[10px] text-blue-100/70">{journey.dest}</span>
          </span>
          <ChevronRight size={16} className="text-blue-100/70" aria-hidden="true" />
        </li>
      </ol>

      <div className="mt-auto rounded-xl border border-blue-300/30 bg-white/0.06 p-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-500/40">
            <Clock3 size={20} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-semibold">Next check-in</span>
            <span className="block text-sm font-bold">Today, {formatTime(journey.time)}</span>
          </span>
          <span className="text-[9px] text-blue-100/75">{timeUntil(journey.time)}</span>
          <ChevronRight size={15} className="text-blue-100/75" aria-hidden="true" />
        </div>
      </div>

      {status === "assist" && (
        <p role="status" className="mt-3 rounded-lg bg-rose-500/20 px-3 py-2 text-xs text-rose-100">
          This is a simulated assistance request; no message has been sent.
        </p>
      )}
      <span className="sr-only">Current status: {currentStatus.t}</span>
    </div>
  );
}
