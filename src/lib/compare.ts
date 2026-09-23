import {
  GLOBAL,
  RANK_DAYS,
  countries as FAUDA_COUNTRIES,
  inTop10,
  isTalkOnly,
  regionStats,
  type Country,
  type Region,
} from "@/lib/data";
import { SOCIAL_POSTS, socialOf, type SocialPost } from "@/lib/social";

export type CompareInput = {
  countries: Country[];
  posts: SocialPost[];
  days: string[];
  global: {
    latest: number;
    peak: number;
    points: number;
    firstPlaces: number;
    top10Countries: number;
  };
};

const DEFAULT_INPUT: CompareInput = {
  countries: FAUDA_COUNTRIES,
  posts: SOCIAL_POSTS,
  days: RANK_DAYS,
  global: GLOBAL,
};

export function globalCompare(input: CompareInput = DEFAULT_INPUT) {
  const { countries, posts, days, global } = input;
  const watching = countries.filter(inTop10).length;
  const talk = countries.filter(isTalkOnly).length;
  const n = countries.length || 1;
  const avgPositive = Math.round(countries.reduce((s, c) => s + c.positive, 0) / n);
  const avgMixed = Math.round(countries.reduce((s, c) => s + c.mixed, 0) / n);
  const avgCritical = Math.round(countries.reduce((s, c) => s + c.negative, 0) / n);
  const documentedTalk = countries.filter((c) => c.confidence === "documented").length;
  const socials = countries.map((c) => socialOf(c, posts));
  const avgScore = Math.round(socials.reduce((s, x) => s + x.score, 0) / n);
  const documentedSocial = socials.filter((x) => x.documented).length;
  const trendUp = socials.filter((x) => x.trend === "up").length;
  const trendDown = socials.filter((x) => x.trend === "down").length;
  const trendFlat = socials.filter((x) => x.trend === "flat").length;
  const byDay = days.map((day, i) => ({
    day,
    count: countries.filter((c) => c.ranks[i] != null).length,
  }));
  const maxDay = Math.max(1, ...byDay.map((d) => d.count));
  const regions = regionStats(countries).map((r) => {
    const list = countries.filter((c) => c.region === r.region);
    const avgSocial = Math.round(list.reduce((s, c) => s + socialOf(c, posts).score, 0) / (list.length || 1));
    return { ...r, avgSocial };
  });
  return {
    watching,
    talk,
    sample: n,
    avgPositive,
    avgMixed,
    avgCritical,
    documentedTalk,
    avgScore,
    documentedSocial,
    trendUp,
    trendDown,
    trendFlat,
    posts: posts.length,
    byDay,
    maxDay,
    regions,
    world: global.latest,
    peak: global.peak,
    points: global.points,
    firstPlaces: global.firstPlaces,
    top10: global.top10Countries,
  };
}

export type RankMover = {
  id: string;
  from: number | null;
  to: number | null;
  delta: number;
};

export function rankDailyTrend(input: CompareInput = DEFAULT_INPUT) {
  const { countries, days } = input;
  const last = days.length - 1;
  const prev = Math.max(0, last - 1);
  const byDay = days.map((day, i) => ({
    day,
    count: countries.filter((c) => c.ranks[i] != null).length,
    firsts: countries.filter((c) => c.ranks[i] === 1).length,
  }));
  const movers: RankMover[] = countries
    .map((c) => {
      const from = c.ranks[prev] ?? null;
      const to = c.ranks[last] ?? null;
      if (from == null && to == null) return null;
      if (from === to) return null;
      let delta = 0;
      if (from != null && to != null) delta = from - to;
      else if (from == null && to != null) delta = 11 - to;
      else if (from != null && to == null) delta = from - 11;
      if (delta === 0) return null;
      return { id: c.id, from, to, delta };
    })
    .filter((x): x is RankMover => x != null);
  const climbed = [...movers].filter((m) => m.delta > 0).sort((a, b) => b.delta - a.delta);
  const fell = [...movers].filter((m) => m.delta < 0).sort((a, b) => a.delta - b.delta);
  const today = byDay[last]?.count ?? 0;
  const yesterday = byDay[prev]?.count ?? 0;
  return {
    byDay,
    climbed,
    fell,
    today,
    yesterday,
    deltaTop10: today - yesterday,
    prevDay: days[prev],
    lastDay: days[last],
  };
}

export type CompareRegion = {
  region: Region;
  label: string;
  positive: number;
  mixed: number;
  negative: number;
  watching: number;
  total: number;
  avgSocial: number;
};
