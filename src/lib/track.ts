import { recordBehavior, recordClick, recordUniqueVisit, getVisitStats, type VisitStats } from "@/lib/visits";
import { gaFromClick, syncGaView, type GaDims } from "@/lib/ga";
import {
  clientArrival,
  clientDevice,
  clientPath,
  clientTimezone,
  getSessionKey,
  getVisitorKey,
} from "@/lib/visitor-key";

const WORKS = ["fauda", "naza", "compare"] as const;
const TABS = ["map", "social", "algo", "concl"] as const;
export type TrackWork = (typeof WORKS)[number];
export type TrackTab = (typeof TABS)[number];

function isTrackWork(v: string | null): v is TrackWork {
  return !!v && (WORKS as readonly string[]).includes(v);
}

function isTrackTab(v: string | null): v is TrackTab {
  return !!v && (TABS as readonly string[]).includes(v);
}

export function readViewDims(): { work: TrackWork; tab: TrackTab } {
  if (typeof window === "undefined") return { work: "compare", tab: "map" };
  const params = new URLSearchParams(window.location.search);
  const work = params.get("work");
  const tab = params.get("tab");
  return {
    work: isTrackWork(work) ? work : "compare",
    tab: isTrackTab(tab) ? tab : "map",
  };
}

function homeDims(): { work: TrackWork; contentTab: TrackTab } | undefined {
  if (typeof window === "undefined" || window.location.pathname !== "/") return undefined;
  const dims = readViewDims();
  return { work: dims.work, contentTab: dims.tab };
}

function payload(kind: "page" | "event", name: string, locale?: string, dims?: { work: TrackWork; contentTab: TrackTab }) {
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
    ...(dims ? { work: dims.work, contentTab: dims.contentTab } : {}),
  };
}

let uniqueVisitSent = false;
let visitStats: VisitStats | null = null;
const visitListeners = new Set<(stats: VisitStats) => void>();
let lastPageKey = "";
let lastPageAt = 0;

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

function gaDims(data: { locale?: string; work?: string; contentTab?: string }): GaDims {
  return { language: data.locale, work: data.work, tab: data.contentTab };
}

export function trackClick(target: string) {
  if (!/^[a-z0-9:_/-]{1,64}$/.test(target)) return;
  const safe = target.replace(/\//g, "-");
  try {
    const data = payload("event", safe, undefined, homeDims());
    void recordClick({
      data: { visitorKey: data.visitorKey, target: safe, timezone: data.timezone },
    }).catch(() => {});
    void recordBehavior({ data }).catch(() => {});
    gaFromClick(safe, gaDims(data));
  } catch {
    /* first-party counts must never wait on consent or GA */
  }
}

export function trackPage(path?: string, locale?: string, extra?: Record<string, string>) {
  const name = path ?? clientPath();
  const allowed = name === "/" || name === "/office" || name === "/accessibility" || name === "/other";
  if (!allowed) return;
  try {
    const lang = locale && /^[a-z]{2}$/.test(locale) ? locale : "he";
    const dims = name === "/" ? homeDims() : undefined;
    const key = `${name}|${lang}|${dims?.work ?? ""}|${dims?.contentTab ?? ""}`;
    const now = Date.now();
    if (key === lastPageKey && now - lastPageAt < 700) return;
    lastPageKey = key;
    lastPageAt = now;

    const data = payload("page", name, lang, dims);
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
    syncGaView(name, {
      language: lang,
      work: dims?.work ?? extra?.work ?? extra?.content_group,
      tab: dims?.contentTab ?? extra?.tab ?? extra?.content_id ?? extra?.item_id,
    });
  } catch {
    /* first-party unique-IP visits do not depend on cookie consent */
  }
}
