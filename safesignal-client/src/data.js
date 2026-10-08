export const card = "rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5";
export const input = "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500";
export const label = "block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300";

export const STATUS = {
  planned: { t: "Planned", c: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  safe: { t: "Safe", c: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
  delayed: { t: "Delayed", c: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
  assist: { t: "Needs assistance", c: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300" },
};

export const SCENARIOS = [
  { q: "Your cab takes a route you don't recognise.", o: [
    ["Stay calm, share your live trip with a contact, and ask the driver to confirm the route.", true, "Good. Staying calm and looping in someone keeps options open."],
    ["Say nothing and hope it corrects itself.", false, "Silence removes your chance to catch a problem early."],
    ["Jump out at the next red light.", false, "Risky. Try calmer steps first; leave only if you feel in immediate danger."]]},
  { q: "You feel followed on a quiet street at night.", o: [
    ["Head to the nearest open, well-lit place and call someone.", true, "Right. Public, lit places with people are safest."],
    ["Take a dark shortcut to lose them.", false, "Isolated routes reduce your safety."],
    ["Put in earphones and walk faster.", false, "Staying aware of your surroundings matters more."]]},
  { q: "You're running 40 minutes late and your contact is waiting.", o: [
    ["Update your status to Delayed and send a short note.", true, "Exactly. Early updates prevent needless worry."],
    ["Wait until you arrive to tell them.", false, "They may worry or raise an alarm unnecessarily."]]},
];

export function checklistFor(dest, time) {
  const h = time ? parseInt(time.split(":")[0], 10) : 12;
  const night = h >= 19 || h < 6;
  return [
    "Charge your phone and carry a power bank",
    `Share your route to ${dest || "your destination"} with your trusted contact`,
    night ? "Prefer well-lit, busy routes after dark" : "Note the busiest route and open places along the way",
    "Keep emergency numbers one tap away",
    "Tell your contact when you've arrived",
  ];
}