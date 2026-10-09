// Put this file at: safesignal-client/src/api.js
// With the Vite proxy, "/api/..." is forwarded to the backend on port 5000.

async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

const post = (path, body) =>
  request(path, { method: "POST", body: JSON.stringify(body) });

// AI Safety Assistant
export const getChecklist = (tripType, timeOfDay, notes = "") =>
  post("/assistant/checklist", { tripType, timeOfDay, notes });

// Journey Safety Planner + Check-in
export const createJourney = (destination, contactName, expectedArrival) =>
  post("/journeys", { destination, contactName, expectedArrival });
export const getJourney = (token) => request(`/journeys/${token}`);
export const checkIn = (token, status) =>
  post(`/journeys/${token}/checkin`, { status });
export const deleteJourney = (token) =>
  request(`/journeys/${token}`, { method: "DELETE" });

// Trusted contact view
export const getContactView = (shareCode) =>
  request(`/journeys/contact/${shareCode}`);

// Scenario Simulator
export const getScenario = (setting) => post("/simulator/scenario", { setting });
export const getScenarioFeedback = (scenario, choice) =>
  post("/simulator/feedback", { scenario, choice });