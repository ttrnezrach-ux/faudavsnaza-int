import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { LIVE, recomputeGlobal, type LiveFile } from "@/lib/live";
import { fetchFaudaRanks } from "@/lib/flixpatrol";
import bundledChanges from "@/data/changes.json";

export type IngestSlot = "morning" | "evening" | "manual" | "weekly";

export type RankDelta = {
  work: "fauda" | "naza";
  id: string;
  from: number | null;
  to: number | null;
  kind: "enter" | "leave" | "jump" | "first" | "discourse";
};

export type ChangeNote = {
  lastRunAt: string | null;
  slot: IngestSlot | null;
  significant: boolean;
  noteHe: string;
  noteEn: string;
  wikiAt: string | null;
  deltas: RankDelta[];
  timezone: string;
  morning: string;
  evening: string;
  version?: number;
};

export type LiveRun = ChangeNote & {
  id: number;
  source: string;
  fauda: LiveFile | null;
};

export const BUNDLED_CHANGES = bundledChanges as ChangeNote;

const TZ = "Asia/Jerusalem";

export function jerusalemNow(d = new Date()): { dayLabel: string; hour: number; iso: string } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    hour12: false,
    year: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = Number(get("day"));
  const month = Number(get("month"));
  const hour = Number(get("hour"));
  const iso = `${get("year")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${get("hour")}:${get("minute")}:${get("second")}+03:00`;
  return { dayLabel: `${day}.${month}`, hour, iso };
}

export function slotForHour(hour: number): IngestSlot {
  if (hour < 12) return "morning";
  if (hour >= 18) return "evening";
  return "manual";
}

/** Compact Asia/Jerusalem stamp shown on the public site, e.g. "15.9 06:40". */
export function formatJerusalemClock(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = Number(get("day"));
  const month = Number(get("month"));
  if (!day || !month || !get("hour")) return null;
  return `${day}.${month} ${get("hour")}:${get("minute")}`;
}

export function nextIngestClock(_hour?: number): string {
  return "weekly";
}

/** Prefer a live ingest stamp, then the bundled note, then the FlixPatrol snapshot. */
export function siteUpdatedIso(note?: Pick<ChangeNote, "lastRunAt"> | null): string {
  return note?.lastRunAt || BUNDLED_CHANGES.lastRunAt || LIVE.fetchedAt;
}

function richerLive(a: LiveFile | null | undefined, b: LiveFile): LiveFile {
  if (!a) return b;
  if ((a.days?.length ?? 0) < (b.days?.length ?? 0)) return b;
  if ((a.days?.length ?? 0) > (b.days?.length ?? 0)) return a;
  const at = Date.parse(a.fetchedAt) || 0;
  const bt = Date.parse(b.fetchedAt) || 0;
  return at >= bt ? a : b;
}

export function lastColumn(ranks: (number | null)[] | undefined): number | null {
  if (!ranks?.length) return null;
  return ranks[ranks.length - 1] ?? null;
}

export function diffLatest(
  prev: Record<string, (number | null)[]>,
  nextLatest: Record<string, number | null>,
): RankDelta[] {
  const ids = new Set([...Object.keys(prev), ...Object.keys(nextLatest)]);
  const deltas: RankDelta[] = [];
  for (const id of ids) {
    const from = lastColumn(prev[id]);
    const to = nextLatest[id] ?? null;
    if (from === to) continue;
    let kind: RankDelta["kind"] = "jump";
    if (from == null && to != null) kind = "enter";
    else if (from != null && to == null) kind = "leave";
    else if (to === 1 && from !== 1) kind = "first";
    else if (from != null && to != null && Math.abs(from - to) < 2) continue;
    deltas.push({ work: "fauda", id, from, to, kind });
  }
  return deltas;
}

export function isSignificant(deltas: RankDelta[], globalFrom: number, globalTo: number | null): boolean {
  if (globalTo != null && globalTo !== globalFrom) return true;
  return deltas.some((d) => d.kind === "enter" || d.kind === "leave" || d.kind === "first" || d.kind === "discourse" || d.kind === "jump");
}

export function mergeFaudaDay(base: LiveFile, dayLabel: string, latest: Record<string, number | null>, fetchedAt: string): LiveFile {
  const replace = base.days[base.days.length - 1] === dayLabel;
  const days = replace ? [...base.days] : [...base.days, dayLabel].slice(-21);
  const width = days.length;
  const ranks: Record<string, (number | null)[]> = {};
  const ids = new Set([...Object.keys(base.ranks), ...Object.keys(latest)]);
  for (const id of ids) {
    const prev = base.ranks[id] ? [...base.ranks[id]] : base.days.map(() => null);
    if (replace) {
      prev[prev.length - 1] = latest[id] ?? null;
      ranks[id] = prev.length === width ? prev : padSeries(prev, width);
    } else {
      const trimmed = prev.slice(-(width - 1));
      while (trimmed.length < width - 1) trimmed.unshift(null);
      ranks[id] = [...trimmed, latest[id] ?? null];
    }
  }
  const global = recomputeGlobal(ranks, days);
  if (latest && Object.keys(latest).length === 0) {
    return { ...base, fetchedAt };
  }
  const snapshot = `${days[0]}–${days[days.length - 1]}`;
  return {
    ...base,
    fetchedAt,
    days,
    ranks,
    global,
    snapshot,
  };
}

function padSeries(series: (number | null)[], width: number): (number | null)[] {
  if (series.length === width) return series;
  if (series.length > width) return series.slice(-width);
  return [...Array<number | null>(width - series.length).fill(null), ...series];
}

function notesFromDeltas(deltas: RankDelta[], blocked: boolean, wikiChanged: boolean): { he: string; en: string } {
  if (blocked && deltas.length === 0 && !wikiChanged) {
    return {
      he: "אין דירוגים חדשים מהסריקה. העלו צילום של טבלת FlixPatrol או חכו לסריקה השבועית.",
      en: "No new ranks from the scan. Upload a FlixPatrol table screenshot, or wait for the weekly scan.",
    };
  }
  if (deltas.length === 0 && !wikiChanged) {
    return {
      he: "אין שינוי משמעותי בצפייה או בשיח.",
      en: "No significant change in viewing or talk.",
    };
  }
  const fauda = deltas.filter((d) => d.work === "fauda").slice(0, 4);
  const partsHe = fauda.map((d) => {
    if (d.kind === "enter") return `${d.id} נכנסה לטופ 10 (#${d.to})`;
    if (d.kind === "leave") return `${d.id} יצאה מהטופ 10`;
    if (d.kind === "first") return `${d.id} עלתה למקום 1`;
    return `${d.id} ${d.from ?? "–"}→${d.to ?? "–"}`;
  });
  const partsEn = fauda.map((d) => {
    if (d.kind === "enter") return `${d.id} entered top 10 (#${d.to})`;
    if (d.kind === "leave") return `${d.id} left the top 10`;
    if (d.kind === "first") return `${d.id} hit No. 1`;
    return `${d.id} ${d.from ?? "–"}→${d.to ?? "–"}`;
  });
  if (wikiChanged) {
    partsHe.push("עדכון בערך נז״א בוויקיפדיה");
    partsEn.push("NAZA Wikipedia entry updated");
  }
  return {
    he: `שינוי משמעותי: ${partsHe.join(" · ")}`,
    en: `Significant change: ${partsEn.join(" · ")}`,
  };
}

async function fetchNazaWiki(): Promise<{ timestamp: string | null; extract: string }> {
  try {
    const url =
      "https://en.wikipedia.org/w/api.php?action=query&titles=NAZA_(film)&prop=revisions|extracts&rvprop=timestamp&exintro=1&explaintext=1&format=json";
    const res = await fetch(url, {
      headers: { "user-agent": "FaudaNazaMap/1.0 (discourse ingest)" },
    });
    if (!res.ok) return { timestamp: null, extract: "" };
    const json = (await res.json()) as {
      query?: { pages?: Record<string, { extract?: string; revisions?: { timestamp?: string }[] }> };
    };
    const page = Object.values(json.query?.pages ?? {})[0];
    return { timestamp: page?.revisions?.[0]?.timestamp ?? null, extract: page?.extract ?? "" };
  } catch {
    return { timestamp: null, extract: "" };
  }
}

function mapRun(row: Record<string, unknown>): LiveRun {
  const deltas = (typeof row.deltas === "string" ? JSON.parse(row.deltas) : row.deltas) as RankDelta[];
  const fauda = row.fauda
    ? ((typeof row.fauda === "string" ? JSON.parse(row.fauda as string) : row.fauda) as LiveFile)
    : null;
  return {
    id: Number(row.id),
    lastRunAt: row.ran_at instanceof Date ? row.ran_at.toISOString() : String(row.ran_at ?? ""),
    slot: (row.slot as IngestSlot) ?? "manual",
    significant: Boolean(row.significant),
    noteHe: String(row.note_he ?? ""),
    noteEn: String(row.note_en ?? ""),
    wikiAt: row.wiki_at ? String(row.wiki_at) : null,
    deltas: Array.isArray(deltas) ? deltas : [],
    timezone: TZ,
    morning: "08:00",
    evening: "21:00",
    source: String(row.source ?? ""),
    fauda,
    version: row.version != null && Number.isFinite(Number(row.version)) ? Number(row.version) : undefined,
  };
}

export const getLatestLiveRun = createServerFn({ method: "GET" }).handler(async (): Promise<LiveRun | null> => {
  const sql = await getSql();
  const rows = await sql.query<Record<string, unknown>>(
    "select * from live_runs order by ran_at desc limit 1",
  );
  return rows[0] ? mapRun(rows[0]) : null;
});

export const listLiveRuns = createServerFn({ method: "GET" }).handler(async (): Promise<LiveRun[]> => {
  const sql = await getSql();
  const rows = await sql.query<Record<string, unknown>>(
    "select * from live_runs order by ran_at desc limit 12",
  );
  return rows.map(mapRun);
});

const ingestInput = z.object({
  slot: z.enum(["morning", "evening", "manual", "weekly"]).optional(),
});

export const runLiveIngest = createServerFn({ method: "POST" })
  .validator(ingestInput)
  .handler(async ({ data }): Promise<LiveRun> => {
    const sql = await getSql();
    const clock = jerusalemNow();
    const slot = data.slot ?? slotForHour(clock.hour);

    const recent = await sql.query<{ n: number }>(
      "select count(*)::int as n from live_runs where ran_at > now() - interval '20 minutes'",
    );
    if ((recent[0]?.n ?? 0) > 0) {
      const last = await sql.query<Record<string, unknown>>(
        "select * from live_runs order by ran_at desc limit 1",
      );
      if (last[0]) return mapRun(last[0]);
    }

    const prevRun = await sql.query<Record<string, unknown>>(
      "select * from live_runs order by ran_at desc limit 1",
    );
    const prev = prevRun[0] ? mapRun(prevRun[0]) : null;
    const prevFauda = richerLive(prev?.fauda, LIVE);
    const prevWiki = prev?.wikiAt ?? BUNDLED_CHANGES.wikiAt;

    const [faudaFetch, wiki] = await Promise.all([fetchFaudaRanks(), fetchNazaWiki()]);
    const wikiChanged = Boolean(wiki.timestamp && wiki.timestamp !== prevWiki);

    // Cloudflare challenge (403 + "Just a moment") is normal from Vercel IPs.
    // Keep the last good run on the public banner instead of overwriting it.
    if (faudaFetch.blocked && !wikiChanged && prev) {
      return prev;
    }

    const deltas = faudaFetch.blocked ? [] : diffLatest(prevFauda.ranks, faudaFetch.latestByCountry);
    if (wikiChanged) {
      deltas.push({ work: "naza", id: "IT", from: null, to: null, kind: "discourse" });
    }
    const nextFauda = faudaFetch.blocked
      ? { ...prevFauda, fetchedAt: clock.iso }
      : mergeFaudaDay(prevFauda, clock.dayLabel, faudaFetch.latestByCountry, clock.iso);
    const significant = isSignificant(deltas, prevFauda.global.latest, nextFauda.global.latest) || wikiChanged;
    const notes = notesFromDeltas(deltas, faudaFetch.blocked, wikiChanged);

    const inserted = await sql.query<Record<string, unknown>>(
      `insert into live_runs (slot, significant, note_he, note_en, source, wiki_at, fauda, naza, deltas)
       values ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9::jsonb)
       returning *`,
      [
        slot,
        significant,
        notes.he,
        notes.en,
        faudaFetch.blocked ? `${faudaFetch.source} (blocked)` : faudaFetch.source,
        wiki.timestamp,
        JSON.stringify(nextFauda),
        JSON.stringify({ wikiAt: wiki.timestamp, extract: wiki.extract.slice(0, 400) }),
        JSON.stringify(deltas),
      ],
    );
    return mapRun(inserted[0]!);
  });

const imageIngestInput = z.object({
  image: z.string().min(32).max(2_800_000),
});

export const runImageIngest = createServerFn({ method: "POST" })
  .validator(imageIngestInput)
  .handler(async ({ data }): Promise<LiveRun> => {
    const { isOfficeUnlocked } = await import("@/lib/office-lock.server");
    if (!(await isOfficeUnlocked())) {
      throw new Error("office locked");
    }
    if (!data.image.startsWith("data:image/")) {
      throw new Error("need image");
    }
    const { ranksFromScreenshot } = await import("@/lib/scan-ranks");
    const sql = await getSql();
    const clock = jerusalemNow();
    const prevRun = await sql.query<Record<string, unknown>>(
      "select * from live_runs order by ran_at desc limit 1",
    );
    const prev = prevRun[0] ? mapRun(prevRun[0]) : null;
    const prevFauda = richerLive(prev?.fauda, LIVE);
    const prevWiki = prev?.wikiAt ?? BUNDLED_CHANGES.wikiAt;
    const [faudaFetch, wiki] = await Promise.all([ranksFromScreenshot(data.image), fetchNazaWiki()]);
    const wikiChanged = Boolean(wiki.timestamp && wiki.timestamp !== prevWiki);
    if (faudaFetch.blocked && !wikiChanged && prev) {
      const notes = notesFromDeltas([], true, false);
      const inserted = await sql.query<Record<string, unknown>>(
        `insert into live_runs (slot, significant, note_he, note_en, source, wiki_at, fauda, naza, deltas)
         values ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9::jsonb)
         returning *`,
        [
          "weekly",
          false,
          notes.he,
          notes.en,
          "weekly-scan (empty)",
          wiki.timestamp,
          JSON.stringify(prevFauda),
          JSON.stringify({ wikiAt: wiki.timestamp, extract: wiki.extract.slice(0, 400) }),
          "[]",
        ],
      );
      return mapRun(inserted[0]!);
    }
    const deltas = faudaFetch.blocked ? [] : diffLatest(prevFauda.ranks, faudaFetch.latestByCountry);
    if (wikiChanged) {
      deltas.push({ work: "naza", id: "IT", from: null, to: null, kind: "discourse" });
    }
    const nextFauda = faudaFetch.blocked
      ? { ...prevFauda, fetchedAt: clock.iso }
      : mergeFaudaDay(prevFauda, clock.dayLabel, faudaFetch.latestByCountry, clock.iso);
    if (faudaFetch.globalLatest != null) {
      nextFauda.global = { ...nextFauda.global, latest: faudaFetch.globalLatest };
    }
    const significant = isSignificant(deltas, prevFauda.global.latest, nextFauda.global.latest) || wikiChanged;
    const notes = notesFromDeltas(deltas, faudaFetch.blocked, wikiChanged);
    const inserted = await sql.query<Record<string, unknown>>(
      `insert into live_runs (slot, significant, note_he, note_en, source, wiki_at, fauda, naza, deltas)
       values ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9::jsonb)
       returning *`,
      [
        "weekly",
        significant,
        notes.he,
        notes.en,
        `weekly-scan (${Object.keys(faudaFetch.latestByCountry).length} countries)`,
        wiki.timestamp,
        JSON.stringify(nextFauda),
        JSON.stringify({ wikiAt: wiki.timestamp, extract: wiki.extract.slice(0, 400) }),
        JSON.stringify(deltas),
      ],
    );
    return mapRun(inserted[0]!);
  });
