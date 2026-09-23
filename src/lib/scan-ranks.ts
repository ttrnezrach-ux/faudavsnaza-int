import { SLUG_ISO, type ParsedRanks } from "@/lib/flixpatrol";

const ISO = new Set(Object.values(SLUG_ISO));

function clampRank(n: unknown): number | null {
  const v = typeof n === "number" ? n : Number.parseInt(String(n ?? ""), 10);
  return Number.isInteger(v) && v >= 1 && v <= 10 ? v : null;
}

export function parseScanJson(raw: string): ParsedRanks {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  const slice = start >= 0 && end > start ? raw.slice(start, end + 1) : "{}";
  let parsed: { globalLatest?: unknown; ranks?: Record<string, unknown> } = {};
  try {
    parsed = JSON.parse(slice) as typeof parsed;
  } catch {
    parsed = {};
  }
  const latestByCountry: Record<string, number | null> = {};
  for (const [k, v] of Object.entries(parsed.ranks ?? {})) {
    const iso = k.trim().toUpperCase();
    if (!ISO.has(iso)) continue;
    const rank = clampRank(v);
    if (rank != null) latestByCountry[iso] = rank;
  }
  return {
    latestByCountry,
    globalLatest: clampRank(parsed.globalLatest),
    blocked: Object.keys(latestByCountry).length === 0,
    source: "weekly-scan",
  };
}

export async function ranksFromScreenshot(dataUrl: string): Promise<ParsedRanks> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return { latestByCountry: {}, globalLatest: null, blocked: true, source: "weekly-scan" };
  }
  const allowed = [...ISO].sort().join(", ");
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      max_tokens: 900,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: dataUrl } },
            {
              type: "text",
              text: `This is a screenshot of FlixPatrol or Netflix Top 10 for the TV series Fauda.
Extract the latest Netflix TV rank per country (1-10 only). Ignore dashes, blanks, and ranks above 10.
Return JSON only: {"globalLatest": number|null, "ranks": {"IL": 1, "LB": 2}}
Use ISO 3166-1 alpha-2 from this list only: ${allowed}.
If a country is not in top 10, omit it.`,
            },
          ],
        },
      ],
    }),
  });
  if (!res.ok) {
    return { latestByCountry: {}, globalLatest: null, blocked: true, source: "weekly-scan" };
  }
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return parseScanJson(body.choices?.[0]?.message?.content ?? "");
}
