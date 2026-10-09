import express from "express";

const router = express.Router();

function parseCoordinatePair(value) {
  if (typeof value !== "string") return null;
  const parts = value.split(",").map(Number);
  if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part))) return null;
  const [longitude, latitude] = parts;
  if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) return null;
  return [longitude, latitude];
}

router.get("/route", async (req, res) => {
  const start = parseCoordinatePair(req.query.start);
  const end = parseCoordinatePair(req.query.end);
  if (!start || !end) {
    return res.status(400).json({ error: "start and end must be longitude,latitude coordinate pairs" });
  }

  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "Routing is not configured on the server" });
  }

  try {
    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?start=${start.join(",")}&end=${end.join(",")}`,
      { headers: { Authorization: apiKey, Accept: "application/geo+json" }, signal: AbortSignal.timeout(15000) }
    );
    const data = await response.json();
    if (!response.ok) {
      console.error("OpenRouteService error:", response.status, data);
      return res.status(response.status === 429 ? 503 : 502).json({ error: "The routing provider could not calculate this route" });
    }
    return res.json(data);
  } catch (error) {
    console.error("Route request failed:", error.message);
    return res.status(502).json({ error: "Failed to calculate route" });
  }
});

export default router;
