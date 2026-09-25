/**
 * Public footer counter.
 *
 * `false` hides it on the public site (no markup, no layout gap).
 * Counting in `src/lib/track.ts` / `src/lib/visits.ts` keeps running.
 * Set this to `true` to show the footer counter again. See AGENTS.md.
 */
export const SHOW_PUBLIC_VISIT_COUNTER = false;

/**
 * Visits already recorded on the previous host before this Vercel deploy.
 *
 * Not a source literal. On 2026-09-25 two headless loads of
 * https://faudavsnaza-int.grok.me both hydrated the footer counter to 133
 * (`סה״כ כניסות מאז ומתמיד`). The server-rendered shell only shows an em dash;
 * git history, migrations, and the original `vivik2-cell/faudavsnaza-int`
 * export do not contain another visit total. 133 is the only number actually
 * observed on that counter.
 *
 * Displayed total = this baseline + visits counted in the current store.
 */
export const VISIT_BASELINE = 133;

export const VISIT_WINDOW_DAYS = 14;

export type DayVisit = {
  date: string;
  visits: number;
};

export type TrafficSnapshot = {
  total: number;
  baseline: number;
  counted: number;
  lastHour: number;
  last24h: number;
  typicalDay: number;
  days: DayVisit[];
  durable: boolean;
};

export type TrafficPace = "quiet" | "normal" | "above" | "below";

export function recentDayKeys(now = new Date()): string[] {
  const start = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const keys: string[] = [];
  for (let i = VISIT_WINDOW_DAYS - 1; i >= 0; i -= 1) {
    keys.push(new Date(start - i * 86_400_000).toISOString().slice(0, 10));
  }
  return keys;
}

export function fillDaySeries(rows: DayVisit[], now = new Date()): DayVisit[] {
  const map = new Map(rows.map((row) => [row.date.slice(0, 10), row.visits]));
  return recentDayKeys(now).map((date) => ({ date, visits: map.get(date) ?? 0 }));
}

/** Mean of the days before the latest day in the 14-day series. */
export function typicalDayVisits(days: DayVisit[]): number {
  if (days.length < 2) return 0;
  const prior = days.slice(0, -1);
  const sum = prior.reduce((n, day) => n + day.visits, 0);
  return Math.round((sum / prior.length) * 10) / 10;
}

export function withBaseline(counted: number): number {
  return Math.max(0, counted) + VISIT_BASELINE;
}

/**
 * Last 24h compared with the typical earlier day in the window.
 * "Above" means at least double a non-zero typical day, and at least 3 visits,
 * so a single extra hit on a quiet site is not an alarm.
 */
export function trafficPace(last24h: number, typicalDay: number): TrafficPace {
  if (last24h <= 0 && typicalDay <= 0) return "quiet";
  if (typicalDay > 0 && last24h >= typicalDay * 2 && last24h >= 3) return "above";
  if (typicalDay > 0 && last24h * 2 <= typicalDay) return "below";
  return "normal";
}
