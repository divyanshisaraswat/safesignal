import { useState } from "react";
import { Check, LockKeyhole, ShieldCheck } from "lucide-react";
import { Toggle } from "./ui";

const privacyFeatures = [
  "No location tracking",
  "Minimal data collection",
  "Private by design",
];

export default function Privacy() {
  const [settings, setSettings] = useState({
    location: false,
    checklist: true,
    history: false,
  });

  return (
    <div className="privacy-card rounded-xl border border-teal-100 bg-[#effbf9] p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
          <ShieldCheck size={22} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-bold">Your privacy matters</h2>
          <p className="mt-2 text-[10px] leading-[1.05rem] text-slate-600">
            No location tracking. No account required to view. We only use the
            minimum data needed to keep you and your trusted contact informed.
          </p>
        </div>
      </div>

      <ul className="mt-3 space-y-2">
        {privacyFeatures.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-[10px] font-medium text-slate-700">
            <Check size={15} className="text-teal-700" strokeWidth={3} aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="privacy-art mt-3 flex justify-end text-teal-700" aria-hidden="true">
        <LockKeyhole size={48} strokeWidth={1.5} />
      </div>

      <details className="mt-2 border-t border-teal-100 pt-2">
        <summary className="cursor-pointer text-[11px] font-semibold text-teal-800">
          Privacy settings
        </summary>
        <div className="pt-2">
          <Toggle
            on={settings.location}
            set={(value) => setSettings((current) => ({ ...current, location: value }))}
            title="Share location with contact"
            desc="Off by default. SafeSignal never tracks you in the background."
          />
          <Toggle
            on={settings.checklist}
            set={(value) => setSettings((current) => ({ ...current, checklist: value }))}
            title="Use AI checklist"
            desc="Only your destination and time are used for suggestions."
          />
          <Toggle
            on={settings.history}
            set={(value) => setSettings((current) => ({ ...current, history: value }))}
            title="Keep journey history"
            desc="Off by default; journeys are deleted after they end."
          />
        </div>
      </details>
    </div>
  );
}
