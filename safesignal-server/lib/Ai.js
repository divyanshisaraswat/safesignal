// Shared helpers: AI call (Groq, free tier) + input cleaning.
// The function keeps the name askClaude so the route files don't need changes.

export const clean = (v, max) =>
  String(v ?? "").replace(/[<>]/g, "").trim().slice(0, max);

export async function askClaude({ system, user, maxTokens = 1500 }) {
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL || "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.7,
      max_completion_tokens: maxTokens,
      response_format: { type: "json_object" },
    }),
  });

  if (!r.ok) throw new Error(`AI API status ${r.status}`);

  const data = await r.json();
  const text = data.choices?.[0]?.message?.content || "";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}