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

const SCENARIO_PROMPT = `You create short, non-graphic personal-safety practice scenarios for a training simulator.
Return ONLY valid JSON, no extra text:
{"scenario":"string","options":[{"id":"a","text":"string"},{"id":"b","text":"string"},{"id":"c","text":"string"}]}
Rules: scenario is 2-3 sentences, realistic and mild (e.g. feeling followed, missed last bus, unsafe-feeling taxi). No violence or graphic detail. Options are 3 distinct reasonable actions.`;

const FEEDBACK_PROMPT = `You give supportive feedback on a user's choice in a personal-safety practice scenario.
Return ONLY valid JSON, no extra text:
{"feedback":"string","tips":["string","string"]}
Rules: feedback is 2-3 sentences, kind and constructive, never blaming. Give 2 short practical tips. This is practice only; do not claim to contact anyone.`;

router.post("/scenario", async (req, res) => {
  const setting = clean(req.body.setting, 80) || "walking home at night";
  try {
    const out = await askClaude({
      system: SCENARIO_PROMPT,
      user: `Setting: ${setting}`,
    });
    res.json({ ...out, simulated: true });
  } catch (e) {
    console.error("Scenario error:", e.message);
    res.status(502).json({ error: "Could not generate a scenario right now." });
  }
});

router.post("/feedback", async (req, res) => {
  const scenario = clean(req.body.scenario, 600);
  const choice = clean(req.body.choice, 300);
  if (!scenario || !choice) {
    return res.status(400).json({ error: "scenario and choice are required." });
  }
  try {
    const out = await askClaude({
      system: FEEDBACK_PROMPT,
      user: `Scenario: ${scenario}\nUser's choice: ${choice}`,
    });
    res.json({ ...out, simulated: true });
  } catch (e) {
    console.error("Feedback error:", e.message);
    res.status(502).json({ error: "Could not generate feedback right now." });
  }
});

export default router;