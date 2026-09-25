import { recordBehavior, recordClick, recordUniqueVisit, touchSession, getVisitStats, type VisitStats } from "@/lib/visits";
import { gaFromClick, sendGaEvent } from "@/lib/ga";
import {
  clientArrival,
  clientDevice,
  clientPath,
  clientTimezone,
  getSessionKey,
  getVisitorKey,
} from "@/lib/visitor-key";

function payload(kind: "page" | "event", name: string, locale?: string) {
  const arrival = clientArrival();
  return {
    visitorKey: getVisitorKey(),
    sessionKey: getSessionKey(),
    kind,
    name,
    device: clientDevice(),
    source: arrival.source,
    locale: locale ?? document.documentElement.lang ?? "he",
    timezone: clientTimezone(),
    referrerHost: arrival.referrerHost ?? undefined,
    landing: arrival.landing,
    googleProduct: arrival.googleProduct ?? undefined,
    campaign: arrival.campaign ?? undefined,
  };
}

let uniqueVisitSent = false;
let visitStats: VisitStats | null = null;
const visitListeners = new Set<(stats: VisitStats) => void>();

function publishVisitStats(stats: VisitStats) {
  visitStats = stats;
  for (const cb of visitListeners) cb(stats);
}

export function onVisitStats(cb: (stats: VisitStats) => void) {
  if (visitStats) cb(visitStats);
  visitListeners.add(cb);
  return () => {
    visitListeners.delete(cb);
  };
}

export function currentVisitStats(): VisitStats | null {
  return visitStats;
}

export function trackClick(target: string) {
  if (!/^[a-z0-9:_/-]{1,64}$/.test(target)) return;
  const safe = target.replace(/\//g, "-");
  try {
    const data = payload("event", safe);
    void recordClick({
      data: { visitorKey: data.visitorKey, target: safe, timezone: data.timezone },
    }).catch(() => {});
    void recordBehavior({ data }).catch(() => {});
    gaFromClick(safe);
  } catch {
    /* first-party counts must never wait on consent or GA */
  }
}

const TRACKED_PATHS = new Set(["/", "/office", "/accessibility", "/scan", "/other"]);

/** Keeps session length current so time-on-site is not stuck at the last click. */
export function noteStay() {
  try {
    const data = payload("event", "stay");
    void touchSession({
      data: { visitorKey: data.visitorKey, sessionKey: data.sessionKey },
    }).catch(() => {});
  } catch {
    /* dwell must never break the page */
  }
}

/** Records an outbound http(s) link without the path or query (no PII). */
export function trackOutbound(href: string) {
  try {
    const url = new URL(href, window.location.href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return;
    if (url.host === window.location.host) return;
    const host = url.host
      .replace(/^www\./, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);
    if (!host) return;
    trackClick(`out:${host}`);
  } catch {
    /* ignore malformed hrefs */
  }
}

export function trackPage(path?: string, locale?: string, extra?: Record<string, string>) {
  const name = path ?? clientPath();
  if (!TRACKED_PATHS.has(name)) return;
  try {
    const data = payload("page", name, locale);
    if (!uniqueVisitSent) {
      uniqueVisitSent = true;
      void recordUniqueVisit({
        data: { visitorKey: data.visitorKey, timezone: data.timezone },
      })
        .then((stats) => {
          if (stats) publishVisitStats(stats);
        })
        .catch(() => {
          void getVisitStats()
            .then((stats) => publishVisitStats(stats))
            .catch(() => {});
        });
    } else if (!visitStats) {
      void getVisitStats()
        .then((stats) => publishVisitStats(stats))
        .catch(() => {});
    }
    void recordBehavior({ data }).catch(() => {});
    sendGaEvent("page_view", { page_path: name, language: locale ?? "he", ...extra });
  } catch {
    /* first-party unique-IP visits do not depend on cookie consent */
  }
}
