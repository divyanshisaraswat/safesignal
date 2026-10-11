import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleAlert,
  PencilLine,
  Phone,
  Share2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Planner from "./Planner";
import Journey from "./Journey";
import Privacy from "./Privacy";
import Simulator from "./Simulator";

export default function HeroSection({
  journey,
  status,
  activity,
  onCreate,
  onStatusChange,
}) {
  const [notice, setNotice] = useState("");

  const shareJourney = async () => {
    const message = `I'm travelling to ${journey.dest} and expect to arrive at ${journey.time}.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My SafeSignal journey", text: message });
        setNotice("Journey shared.");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(message);
        setNotice("Journey details copied to clipboard.");
      } else {
        setNotice(message);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setNotice("Unable to share right now. Please try again.");
      }
    }
  };

  return (
    <main id="top" className="pb-10">
      <section className="dashboard-hero relative isolate overflow-hidden bg-[#122b68] text-white">
        <div className="hero-sky absolute inset-0 -z-10" aria-hidden="true">
          <div className="hero-sun" />
          <div className="hero-mountain hero-mountain-back" />
          <div className="hero-mountain hero-mountain-front" />
          <div className="hero-traveler">
            <span />
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl items-center px-6 sm:px-10">
          <div className="max-w-xl">
            <div className="mb-1 flex items-center gap-2 text-lg font-bold">
              <ShieldCheck size={23} aria-hidden="true" />
              <span>SafeSignal</span>
            </div>
            <h1 className="text-3xl font-extrabold leading-[1.08] tracking-tight">
              Travel with someone
              <br />
              <span className="hero-highlight">in your corner.</span>
            </h1>
            <p className="mt-2 max-w-md text-sm leading-5 text-blue-100">
              Plan a trip, check in, and keep a trusted person informed.
              <br className="hidden sm:block" /> Private by design.
            </p>
            <a
              href="#planner"
              className="mt-3 inline-flex items-center gap-3 rounded-full bg-indigo-500 px-6 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-400"
            >
              Plan a journey <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
          <p className="hero-tagline ml-auto hidden -rotate-6 text-right font-medium italic text-white/85 md:block">
            Safer
            <br />
            Journeys
            <br />
            Together
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-8">
        <div className="dashboard-grid grid grid-cols-1 gap-3">
          <section id="planner" className="planner-area min-w-0">
            <Planner key={journey.startedAt} journey={journey} onCreate={onCreate} />
          </section>

          <section id="journey" className="journey-area min-w-0">
            <Journey
              journey={journey}
              status={status}
              activity={activity}
              onStatusChange={onStatusChange}
            />
          </section>

          <aside className="dashboard-aside flex min-w-0 flex-col gap-3">
            <section id="privacy">
              <Privacy />
            </section>
            <section id="help" className="help-card rounded-xl border border-rose-200 bg-[#fff5f7] p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                  <CircleAlert size={22} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Need help?</h2>
                  <p className="mt-0.5 text-xs leading-4 text-slate-500">
                    Get quick access to local emergency services.
                  </p>
                </div>
              </div>
              <a
                href="tel:112"
                className="mt-4 flex items-center justify-between rounded-lg border border-rose-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 transition hover:bg-rose-50"
              >
                <span className="flex items-center gap-2">
                  <Phone size={15} className="text-rose-500" aria-hidden="true" />
                  Local emergency services
                </span>
                <ChevronRight size={16} aria-hidden="true" />
              </a>
              <p className="mt-3 text-[10px] leading-4 text-slate-500">
                This opens your phone app. SafeSignal does not contact emergency
                services for you.
              </p>
            </section>
          </aside>

          <section id="simulator" className="simulator-area min-w-0">
            <Simulator />
          </section>

          <section className="quick-actions rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_1fr] sm:items-center">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                  <Zap size={21} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-sm font-bold">Quick actions</h2>
                  <p className="text-[11px] text-slate-500">Stay in control of your journey.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onStatusChange("safe")}
                className="flex min-h-12 items-center justify-between rounded-lg bg-emerald-500 px-3 text-left text-white transition hover:bg-emerald-600"
              >
                <span className="flex items-center gap-2">
                  <Check size={21} aria-hidden="true" />
                  <span>
                    <span className="block text-xs font-bold">Check in</span>
                    <span className="block text-[10px] text-white/80">Update your status</span>
                  </span>
                </span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={shareJourney}
                className="flex min-h-12 items-center justify-between rounded-lg bg-blue-500 px-3 text-left text-white transition hover:bg-blue-600"
              >
                <span className="flex items-center gap-2">
                  <Share2 size={20} aria-hidden="true" />
                  <span>
                    <span className="block text-xs font-bold">Share trip</span>
                    <span className="block text-[10px] text-white/80">Let someone know</span>
                  </span>
                </span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => document.getElementById("planner")?.scrollIntoView({ behavior: "smooth" })}
                className="flex min-h-12 items-center justify-between rounded-lg bg-indigo-600 px-3 text-left text-white transition hover:bg-indigo-700"
              >
                <span className="flex items-center gap-2">
                  <PencilLine size={20} aria-hidden="true" />
                  <span>
                    <span className="block text-xs font-bold">Edit plan</span>
                    <span className="block text-[10px] text-white/80">Update details</span>
                  </span>
                </span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
            {notice && (
              <p role="status" className="mt-3 text-xs text-slate-600">
                {notice}
              </p>
            )}
          </section>
        </div>

      </div>
    </main>
  );
}
