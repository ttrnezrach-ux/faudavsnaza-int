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

export type NetflixCountryWeeks = {
  /** Week ending 20 Sep 2026 — official Netflix Tudum country top 10. */
  weekEnding2026_09_20: Record<string, number>;
  /** Week ending 13 Sep 2026 — only countries the Tudum pair actually listed. */
  weekEnding2026_09_13: Record<string, number>;
};

export type LiveFile = {
  fetchedAt: string;
  source: string;
  snapshot: string;
  /** Manual Netflix Tudum note. Daily `ranks` stay FlixPatrol. */
  snapshotNote?: string;
  days: string[];
  global: {
    latest: number;
    peak: number;
    peakDate: string;
    points: number;
    top10Countries: number;
    firstPlaces: number;
    /** This block is FlixPatrol chart position, not Netflix hours. */
    metric?: "flixpatrol";
  };
  netflix?: {
    source: string;
    note: string;
    top10Countries: number;
    firstPlaces: number;
    firstPlaceCountries: string[];
    views: {
      opening: { from: string; to: string; viewsM: string; hoursM: string; nonEnglishTv: number; runtime: string; weeksInTop10: number };
      latest: { from: string; to: string; viewsM: string; hoursM: string; nonEnglishTv: number; runtime: string; weeksInTop10: number };
    };
    countryRanks: NetflixCountryWeeks;
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

/** Official Netflix Tudum opening week, 7–13 September 2026. Not FlixPatrol points. */
export const FAUDA_WEEK = {
  viewsM: "2.1",
  hoursM: "15.9",
  nonEnglishTv: 4,
  runtime: "7:27",
  from: "2026-09-07",
  to: "2026-09-13",
  weeksInTop10: 2,
  source: "https://www.netflix.com/tudum/top10/tv-non-english",
} as const;

/** Official Netflix Tudum week of 14–20 September 2026. Not FlixPatrol points. */
export const FAUDA_WEEK_LATEST = {
  viewsM: "1.6",
  hoursM: "11.6",
  nonEnglishTv: 9,
  runtime: "7:27",
  from: "2026-09-14",
  to: "2026-09-20",
  weeksInTop10: 2,
  top10Countries: 42,
  firstPlaces: 2,
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
