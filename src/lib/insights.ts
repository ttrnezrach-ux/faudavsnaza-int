import { LIVE, type LiveFile } from "@/lib/live";
import type { Country } from "@/lib/data";

export type InsightGroupId = "trends" | "findings" | "outliers";

export type InsightRow = {
  iso: string;
  rank?: string;
  titleKey?: string;
};

export type InsightDay = {
  day: string;
  count: number;
};

export type InsightCard = {
  id: string;
  flags: string[];
  textKey: string;
  detailKey: string;
  vars?: Record<string, string | number>;
  rows: InsightRow[];
  days?: InsightDay[];
};

export type InsightBoardData = {
  snapshot: string;
  groups: { id: InsightGroupId; cards: InsightCard[] }[];
};

function inTop10(rank: number | null): rank is number {
  return rank != null && rank <= 10;
}

export function rankSeries(arr: (number | null)[] | undefined): string {
  if (!arr?.length) return "—";
  return arr.map((r) => (r == null ? "—" : `#${r}`)).join(" · ");
}

export function faudaInsightBoard(live: LiveFile = LIVE): InsightBoardData {
  const { days, ranks, global } = live;
  const last = Math.max(0, days.length - 1);
  const top10PerDay = days.map((_, i) => Object.values(ranks).filter((arr) => inTop10(arr[i] ?? null)).length);
  const peakSpread = Math.max(0, ...top10PerDay);
  const peakIdx = top10PerDay.indexOf(peakSpread);
  const nowSpread = top10PerDay[last] ?? 0;
  const alwaysFirst = Object.entries(ranks)
    .filter(([, arr]) => arr.length === days.length && arr.every((r) => r === 1))
    .map(([iso]) => iso);
  const jumpers = Object.entries(ranks)
    .map(([iso, arr]) => {
      let best = 0;
      for (let i = 1; i < arr.length; i += 1) {
        const a = arr[i - 1];
        const b = arr[i];
        if (a != null && b != null && a - b > best) best = a - b;
      }
      return { iso, jump: best, series: rankSeries(arr) };
    })
    .filter((r) => r.jump >= 3)
    .sort((a, b) => b.jump - a.jump);
  const jumpFlags = jumpers.slice(0, 2).map((r) => r.iso);
  const jumpSize = jumpers[0]?.jump ?? 3;
  const oneDay = Object.entries(ranks)
    .filter(([, arr]) => arr.filter((r) => inTop10(r)).length === 1)
    .map(([iso, arr]) => ({ iso, series: rankSeries(arr) }));
  const lb = ranks.LB?.[last] ?? 1;
  const jo = ranks.JO?.[last] ?? 3;
  const cyLatest = ranks.CY?.[last] ?? 3;
  const firstIsos = alwaysFirst.length ? alwaysFirst : ["IL", "LB"];

  return {
    snapshot: live.snapshot,
    groups: [
      {
        id: "trends",
        cards: [
          {
            id: "spread",
            flags: [],
            textKey: "insightTrendSpread",
            detailKey: "insightTrendSpreadDetail",
            vars: { day: days[peakIdx] ?? days[0] ?? "", peak: peakSpread, now: nowSpread },
            rows: [],
            days: days.map((day, i) => ({ day, count: top10PerDay[i] ?? 0 })),
          },
          {
            id: "first",
            flags: firstIsos,
            textKey: "insightTrendFirst",
            detailKey: "insightTrendFirstDetail",
            rows: firstIsos.map((iso) => ({ iso, rank: rankSeries(ranks[iso]) })),
          },
          {
            id: "jumps",
            flags: jumpFlags,
            textKey: "insightTrendJumps",
            detailKey: "insightTrendJumpsDetail",
            vars: { n: jumpSize, count: jumpers.length },
            rows: jumpers.map((r) => ({ iso: r.iso, rank: `+${r.jump} · ${r.series}` })),
          },
        ],
      },
      {
        id: "findings",
        cards: [
          {
            id: "peak",
            flags: [],
            textKey: "insightFindPeak",
            detailKey: "insightFindPeakDetail",
            vars: { peak: global.peak, peakDate: global.peakDate, latest: global.latest },
            rows: [],
          },
          {
            id: "me",
            flags: ["LB", "JO"],
            textKey: "insightFindMe",
            detailKey: "insightFindMeDetail",
            vars: { lb, jo },
            rows: ["LB", "JO", "AE", "QA", "EG", "IL"].filter((iso) => ranks[iso]).map((iso) => ({
              iso,
              rank: rankSeries(ranks[iso]),
            })),
          },
          {
            id: "flash",
            flags: oneDay.slice(0, 3).map((r) => r.iso),
            textKey: "insightFindFlash",
            detailKey: "insightFindFlashDetail",
            vars: { n: oneDay.length },
            rows: oneDay.map((r) => ({ iso: r.iso, rank: r.series })),
          },
        ],
      },
      {
        id: "outliers",
        cards: [
          {
            id: "lb",
            flags: ["LB"],
            textKey: "insightOutLb",
            detailKey: "insightOutLbDetail",
            rows: [
              { iso: "LB", rank: rankSeries(ranks.LB) },
              { iso: "IL", rank: rankSeries(ranks.IL) },
            ],
          },
          {
            id: "anglo",
            flags: ["GB", "US"],
            textKey: "insightOutAnglo",
            detailKey: "insightOutAngloDetail",
            rows: [
              { iso: "US", titleKey: "workFaudaShort", rank: "—" },
              { iso: "GB", titleKey: "workFaudaShort", rank: "—" },
            ],
          },
          {
            id: "cy",
            flags: ["CY"],
            textKey: "insightOutCy",
            detailKey: "insightOutCyDetail",
            vars: { cy: cyLatest },
            rows: [{ iso: "CY", rank: rankSeries(ranks.CY) }],
          },
        ],
      },
    ],
  };
}

export function liveFromFauda(countries: Country[], days: string[], snapshot: string, global: LiveFile["global"]): LiveFile {
  const ranks = { ...LIVE.ranks };
  for (const c of countries) {
    if (c.ranks.length === days.length) ranks[c.id] = c.ranks;
  }
  return { ...LIVE, days, snapshot, global, ranks };
}

export function faudaWeekOf(day: string): number {
  const [d, m] = day.split(".").map(Number);
  if (!d || m !== 9) return 1;
  if (d <= 14) return 1;
  if (d <= 21) return 2;
  if (d <= 28) return 3;
  return 4;
}

export function weekRangeLabel(days: string[]): string {
  if (!days.length) return "";
  const a = days[0] ?? "";
  const b = days[days.length - 1] ?? a;
  return a === b ? a : `${a}–${b}`;
}

export type WorldWeek = {
  id: number;
  days: string[];
  top10Last: number;
  top10Peak: number;
  peakDay: string;
};

export type WorldAccum = {
  ever: number;
  weeks: WorldWeek[];
  week1: WorldWeek;
  week2: WorldWeek;
  worldwideLatest: number;
  worldwidePeak: number;
  peakDate: string;
  points: number;
  firstPlaces: number;
  nowTop10: number;
};

function top10OnDay(ranks: Record<string, (number | null)[]>, i: number): number {
  return Object.values(ranks).filter((s) => s[i] != null && s[i]! <= 10).length;
}

function weekSlice(live: LiveFile, id: number): WorldWeek {
  const idxs = live.days.map((d, i) => (faudaWeekOf(d) === id ? i : -1)).filter((i) => i >= 0);
  const days = idxs.map((i) => live.days[i]!);
  let top10Peak = 0;
  let peakDay = days[0] ?? "";
  for (const i of idxs) {
    const n = top10OnDay(live.ranks, i);
    if (n > top10Peak) {
      top10Peak = n;
      peakDay = live.days[i]!;
    }
  }
  const lastI = idxs[idxs.length - 1] ?? 0;
  return {
    id,
    days,
    top10Last: idxs.length ? top10OnDay(live.ranks, lastI) : 0,
    top10Peak,
    peakDay,
  };
}

export function worldAccum(live: LiveFile = LIVE): WorldAccum {
  const ever = Object.values(live.ranks).filter((s) => s.some((r) => r != null)).length;
  const last = Math.max(0, live.days.length - 1);
  const weekIds = [...new Set(live.days.map(faudaWeekOf))].sort((a, b) => a - b);
  const weeks = weekIds.map((id) => weekSlice(live, id)).filter((w) => w.days.length > 0);
  const empty: WorldWeek = { id: 0, days: [], top10Last: 0, top10Peak: 0, peakDay: "" };
  return {
    ever,
    weeks,
    week1: weeks.find((w) => w.id === 1) ?? empty,
    week2: weeks.find((w) => w.id === 2) ?? empty,
    worldwideLatest: live.global.latest,
    worldwidePeak: live.global.peak,
    peakDate: live.global.peakDate,
    points: live.global.points,
    firstPlaces: live.global.firstPlaces,
    nowTop10: top10OnDay(live.ranks, last),
  };
}

