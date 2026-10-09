import mapRouter from "./routes/map.js"; 
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import assistantRouter from "./routes/assistant.js";
import simulatorRouter from "./routes/Simulator.js";
import journeysRouter from "./routes/journeys.js";

const app = express(); // 2. Declare 'app' first!

app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json({ limit: "10kb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, db: mongoose.connection.readyState === 1 })
);

app.use("/api/assistant", assistantRouter);
app.use("/api/simulator", simulatorRouter);
app.use("/api/journeys", journeysRouter);
app.use("/api/map", mapRouter); // 3. Mount after 'app' is declared

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

const PORT = process.env.PORT || 5000;

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB connected");
    } catch (e) {
      console.warn("MongoDB not connected (journey routes will fail):", e.message);
    }
  }
  app.listen(PORT, () => console.log(`SafeSignal API running on port ${PORT}`));
}

start();