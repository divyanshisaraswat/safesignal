import express from "express";
import rateLimit from "express-rate-limit";
import { askClaude, clean } from "../lib/ai.js";

const router = express.Router();

router.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { error: "Too many requests, please wait a moment." },
  })
);

const SYSTEM_PROMPT = `You are a personal safety preparation assistant inside a web app called SafeSignal.
Return ONLY valid JSON in this exact shape, with no extra text:
{"items":[{"text":"string","priority":"high|medium|low"}]}
Rules:
- Give 6 to 8 practical preparation tips for the described situation.
- You only give preparation guidance. Never claim you can contact anyone or send help.
- If the user describes immediate danger, include a first high-priority item telling them to call local emergency services.
- Keep each item under 20 words.`;

const FALLBACK = {
  items: [
    { text: "Share your route and expected arrival time with a trusted contact.", priority: "high" },
    { text: "Charge your phone and carry a power bank if possible.", priority: "high" },
    { text: "Know the local emergency number.", priority: "high" },
    { text: "Stick to well-lit, busy routes where you can.", priority: "medium" },
    { text: "Keep your phone and valuables out of sight.", priority: "medium" },
  ],
};

router.post("/checklist", async (req, res) => {
  const tripType = clean(req.body.tripType, 60);
  const timeOfDay = clean(req.body.timeOfDay, 40);
  const notes = clean(req.body.notes, 300);

  if (!tripType || !timeOfDay) {
    return res.status(400).json({ error: "tripType and timeOfDay are required." });
  }

  try {
    const parsed = await askClaude({
      system: SYSTEM_PROMPT,
      user: `Trip type: ${tripType}\nTime of day: ${timeOfDay}\nNotes: ${notes || "none"}`,
    });
    if (!Array.isArray(parsed.items)) throw new Error("Bad shape");
    res.json(parsed);
  } catch (e) {
    console.error("Checklist error:", e.message);
    res.json({ ...FALLBACK, fallback: true });
  }
});

export default router;