import liveFile from "@/data/live.json";

type QuoteLike = {
  text: string;
  by: string;
  tone: "positive" | "critical" | "emotional";
  source: string;
};

type CountryLike = {
  id: string;
  ranks: (number | null)[];
  quotes?: QuoteLike[];
};

export type LiveQuote = QuoteLike & { country: string };

export type LiveFile = {
  fetchedAt: string;
  source: string;
  snapshot: string;
  days: string[];
  global: {
    latest: number;
    peak: number;
    peakDate: string;
    points: number;
    top10Countries: number;
    firstPlaces: number;
  };
  ranks: Record<string, (number | null)[]>;
  quotes: LiveQuote[];
  chart?: {
    days: string[];
    points: number[];
    avgRank: number[];
    source?: string;
  };
};

export const LIVE = liveFile as LiveFile;

/** Official Netflix Tudum week of 7–13 September 2026. Not FlixPatrol points. */
export const FAUDA_WEEK = {
  viewsM: "2.1",
  hoursM: "15.9",
  nonEnglishTv: 4,
  runtime: "7:27",
  source: "https://www.netflix.com/tudum/top10/tv-non-english",
} as const;

export function applyLiveFile<T extends CountryLike>(base: T[], live: LiveFile): T[] {
  const extraQuotes = new Map<string, QuoteLike[]>();
  for (const q of live.quotes ?? []) {
    const list = extraQuotes.get(q.country) ?? [];
    list.push({ text: q.text, by: q.by, tone: q.tone, source: q.source });
    extraQuotes.set(q.country, list);
  }
  return base.map((country) => {
    const ranks = live.ranks[country.id];
    const added = extraQuotes.get(country.id);
    if (!ranks && !added) return country;
    return {
      ...country,
      ranks: ranks && ranks.length === live.days.length ? ranks : country.ranks,
      quotes: added ? [...(country.quotes ?? []), ...added] : country.quotes,
    };
  });
}

export function applyLiveRanks<T extends CountryLike>(base: T[]): T[] {
  return applyLiveFile(base, LIVE);
}

export function recomputeGlobal(ranks: Record<string, (number | null)[]>, days: string[]): LiveFile["global"] {
  let peak = 99;
  let peakDay = days[0] ?? "";
  let latest = 99;
  let firstPlaces = 0;
  let top10Countries = 0;
  let points = 0;
  for (const series of Object.values(ranks)) {
    const last = series[series.length - 1] ?? null;
    if (last != null) {
      top10Countries += 1;
      latest = Math.min(latest, last);
      if (last === 1) firstPlaces += 1;
      points += 11 - last;
    }
    series.forEach((r, i) => {
      if (r != null && r < peak) {
        peak = r;
        peakDay = days[i] ?? peakDay;
      }
    });
  }
  return {
    latest: latest === 99 ? 0 : latest,
    peak: peak === 99 ? 0 : peak,
    peakDate: peakDay,
    points,
    top10Countries,
    firstPlaces,
  };
}
