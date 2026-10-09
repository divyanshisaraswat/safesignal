import express from "express";
import crypto from "crypto";
import Journey from "../models/Journey.js";
import { clean } from "../lib/ai.js";

const router = express.Router();

const STATUSES = ["Safe", "Delayed", "Need Assistance"];
const HOUR = 60 * 60 * 1000;

const rand = (bytes) => crypto.randomBytes(bytes).toString("hex");

const ownerView = (j) => ({
  token: j.token,
  shareCode: j.shareCode,
  destination: j.destination,
  contactName: j.contactName,
  expectedArrival: j.expectedArrival,
  status: j.status,
  alerts: j.alerts,
});

// What the trusted contact is allowed to see (no token, minimal data).
const contactView = (j) => ({
  destination: j.destination,
  expectedArrival: j.expectedArrival,
  status: j.status,
  alerts: j.alerts,
  simulated: true,
});

// If the expected arrival has passed and nobody checked in, mark as Delayed.
async function refreshStatus(j) {
  if (j.status === "Active" && new Date() > j.expectedArrival) {
    j.status = "Delayed";
    j.alerts.push({
      type: "delayed",
      message: `[SIMULATED] ${j.contactName} would be notified: the traveller has not arrived by the expected time.`,
    });
    await j.save();
  }
  return j;
}

// Create a journey
router.post("/", async (req, res) => {
  try {
    const destination = clean(req.body.destination, 120);
    const contactName = clean(req.body.contactName, 60);
    const expectedArrival = new Date(req.body.expectedArrival);

    if (!destination || !contactName || isNaN(expectedArrival)) {
      return res.status(400).json({
        error: "destination, contactName and a valid expectedArrival are required.",
      });
    }
    if (expectedArrival <= new Date()) {
      return res.status(400).json({ error: "expectedArrival must be in the future." });
    }

    const journey = await Journey.create({
      token: rand(16),
      shareCode: rand(4),
      destination,
      contactName,
      expectedArrival,
      expiresAt: new Date(expectedArrival.getTime() + 24 * HOUR),
    });

    res.status(201).json(ownerView(journey));
  } catch (e) {
    console.error("Create journey error:", e.message);
    res.status(500).json({ error: "Could not create journey." });
  }
});

// Trusted contact view (must be declared before "/:token")
router.get("/contact/:shareCode", async (req, res) => {
  try {
    const j = await Journey.findOne({ shareCode: clean(req.params.shareCode, 20) });
    if (!j) return res.status(404).json({ error: "Journey not found or expired." });
    await refreshStatus(j);
    res.json(contactView(j));
  } catch (e) {
    res.status(500).json({ error: "Could not load journey." });
  }
});

// Owner: get journey
router.get("/:token", async (req, res) => {
  try {
    const j = await Journey.findOne({ token: clean(req.params.token, 40) });
    if (!j) return res.status(404).json({ error: "Journey not found or expired." });
    await refreshStatus(j);
    res.json(ownerView(j));
  } catch (e) {
    res.status(500).json({ error: "Could not load journey." });
  }
});

// Owner: check in (Safe / Delayed / Need Assistance)
router.post("/:token/checkin", async (req, res) => {
  try {
    const status = clean(req.body.status, 30);
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${STATUSES.join(", ")}` });
    }

    const j = await Journey.findOne({ token: clean(req.params.token, 40) });
    if (!j) return res.status(404).json({ error: "Journey not found or expired." });

    j.status = status;

    if (status === "Safe") {
      j.alerts.push({
        type: "safe",
        message: `[SIMULATED] ${j.contactName} would be told the traveller arrived safely.`,
      });
      j.expiresAt = new Date(Date.now() + HOUR); // delete soon after completion
    } else if (status === "Delayed") {
      j.alerts.push({
        type: "delayed",
        message: `[SIMULATED] ${j.contactName} would be told the traveller is running late.`,
      });
    } else {
      j.alerts.push({
        type: "assistance",
        message: `[SIMULATED] ${j.contactName} would be alerted that the traveller needs assistance. In a real emergency, call your local emergency number.`,
      });
    }

    await j.save();
    res.json(ownerView(j));
  } catch (e) {
    console.error("Check-in error:", e.message);
    res.status(500).json({ error: "Could not update status." });
  }
});

// Owner: delete all data for this journey now
router.delete("/:token", async (req, res) => {
  try {
    const result = await Journey.deleteOne({ token: clean(req.params.token, 40) });
    if (!result.deletedCount) return res.status(404).json({ error: "Journey not found." });
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: "Could not delete journey." });
  }
});

export default router;