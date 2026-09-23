const STORAGE_KEY = "fauda-visitor-key";
const SESSION_KEY = "fauda-session-key";
const SESSION_AT = "fauda-session-at";
const IDLE_MS = 30 * 60 * 1000;

export function getVisitorKey(): string {
  let key = localStorage.getItem(STORAGE_KEY);
  if (!key || !/^[a-zA-Z0-9-]{8,64}$/.test(key)) {
    key = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, key);
  }
  return key;
}

export function getSessionKey(): string {
  const now = Date.now();
  const at = Number(sessionStorage.getItem(SESSION_AT) || 0);
  let key = sessionStorage.getItem(SESSION_KEY);
  if (!key || !/^[a-zA-Z0-9-]{8,64}$/.test(key) || now - at > IDLE_MS) {
    key = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, key);
  }
  sessionStorage.setItem(SESSION_AT, String(now));
  return key;
}

export function clientTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

export function clientDevice(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export function clientSource(): "direct" | "google" | "internal" | "referral" {
  return clientArrival().source;
}

export type GoogleProduct = "search" | "news" | "images" | "ads" | "maps" | "other";

export type Arrival = {
  source: "direct" | "google" | "internal" | "referral";
  referrerHost: string | null;
  googleProduct: GoogleProduct | null;
  landing: string;
  campaign: string | null;
};

function cleanToken(raw: string | null, max = 64): string | null {
  if (!raw) return null;
  const v = raw.trim().slice(0, max).replace(/[^a-zA-Z0-9._-]/g, "");
  return v || null;
}

function googleProduct(host: string, page: URL): GoogleProduct {
  const params = page.searchParams;
  if (params.get("gclid") || params.get("gad_source") || /cpc|ppc|paid/i.test(params.get("utm_medium") ?? "")) {
    return "ads";
  }
  if (host.startsWith("news.") || host.includes("news.google")) return "news";
  if (host.startsWith("images.") || host.includes("images.google")) return "images";
  if (host.startsWith("maps.") || host.includes("maps.google")) return "maps";
  return "search";
}

export function clientArrival(): Arrival {
  const landing = clientPath();
  let campaign: string | null = null;
  try {
    const here = new URL(window.location.href);
    campaign = cleanToken(here.searchParams.get("utm_campaign") ?? here.searchParams.get("utm_term"));
    const ref = document.referrer;
    if (!ref) {
      const product = googleProduct("", here);
      const source = product === "ads" || here.searchParams.get("utm_source")?.includes("google") ? "google" : "direct";
      return {
        source,
        referrerHost: null,
        googleProduct: source === "google" ? product : null,
        landing,
        campaign,
      };
    }
    const url = new URL(ref);
    const host = url.hostname.toLowerCase().replace(/^www\./, "").slice(0, 80);
    if (host === window.location.hostname) {
      return { source: "internal", referrerHost: host, googleProduct: null, landing, campaign };
    }
    const isGoogle =
      host === "google.com" ||
      host.endsWith(".google.com") ||
      host.includes("google.") ||
      host === "google.co.il" ||
      host.endsWith(".google.co.il");
    if (isGoogle) {
      return {
        source: "google",
        referrerHost: host,
        googleProduct: googleProduct(host, here),
        landing,
        campaign,
      };
    }
    return { source: "referral", referrerHost: host, googleProduct: null, landing, campaign };
  } catch {
    return { source: "direct", referrerHost: null, googleProduct: null, landing, campaign };
  }
}

export function clientPath(): string {
  const p = window.location.pathname || "/";
  if (p === "/" || p === "/office" || p === "/accessibility") return p;
  return "/other";
}
