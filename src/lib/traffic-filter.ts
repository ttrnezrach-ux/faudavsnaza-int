/**
 * Who is left out of visitor totals, charts, and anomaly detection.
 * Bot hits are stored separately. Owner devices and internal checks are dropped.
 */

const BOT_UA =
  /bot|crawler|spider|slurp|facebookexternalhit|facebot|whatsapp|telegram|slack|discord|pinterest|googlebot|adsbot|mediapartners|bingbot|bingpreview|yandex|baidu|duckduck|headless|playwright|puppeteer|phantomjs|curl\/|wget|python-requests|axios\/|go-http-client|okhttp|scrapy|httpie|libwww|java\/|apache-httpclient|pingdom|statuscake|site24x7|uptimerobot|betteruptime|hetrix|freshping|lighthouse|pagespeed|gtmetrix|vercel-screenshot|vercel-preview|vercelbot|screenshot|prerender|preview|semrush|ahrefs|mj12|petalbot|bytespider|gptbot|claudebot|amazonbot|applebot|ia_archiver|archive\.org/i;

export function isBotUserAgent(userAgent: string | null | undefined): boolean {
  const ua = userAgent?.trim() ?? "";
  if (!ua) return true;
  return BOT_UA.test(ua);
}

export function isPrefetch(get: (name: string) => string | null): boolean {
  const joined = ["purpose", "sec-purpose", "x-purpose", "x-moz", "x-moz-purpose"]
    .map((name) => get(name) ?? "")
    .join(" ")
    .toLowerCase();
  if (/prefetch|prerender|preview/.test(joined)) return true;
  if ((get("next-router-prefetch") ?? "") === "1") return true;
  if ((get("x-middleware-prefetch") ?? "") === "1") return true;
  return false;
}

/** Header `X-Internal-Check: 1`, a valid monitoring bearer, or the cookie that header set. */
export function isInternalCheck(input: {
  internalHeader: string | null;
  monitorAuthorized: boolean;
  internalCookie: string | null;
}): boolean {
  if (input.internalCookie === "1") return true;
  if (input.monitorAuthorized) return true;
  return input.internalHeader === "1";
}

export type TrafficDecision = "count" | "bot" | "prefetch" | "owner" | "internal";

export function trafficDecision(input: {
  internal: boolean;
  ownerCookie: string | null;
  prefetch: boolean;
  bot: boolean;
}): TrafficDecision {
  if (input.internal) return "internal";
  if (input.ownerCookie === "1") return "owner";
  if (input.prefetch) return "prefetch";
  if (input.bot) return "bot";
  return "count";
}
