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

export type HourVisit = {
  /** UTC hour key `YYYY-MM-DDTHH`. */
  hour: string;
  visits: number;
};

export type TrafficAnomaly = {
  today: number;
  average: number;
  stddev: number;
  zScore: number | null;
  deviationPct: number | null;
  spike: boolean;
};

export type TrafficSnapshot = {
  total: number;
  baseline: number;
  counted: number;
  lastHour: number;
  last24h: number;
  typicalDay: number;
  days: DayVisit[];
  hours: HourVisit[];
  anomaly: TrafficAnomaly;
  durable: boolean;
};

/** Full IP addresses in the office are cleared after this many days. */
export const IP_RETENTION_DAYS = 90;

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
function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function fillHourSeries(rows: HourVisit[], now = new Date()): HourVisit[] {
  const map = new Map(rows.map((row) => [row.hour.slice(0, 13), row.visits]));
  const start = new Date(now);
  start.setUTCMinutes(0, 0, 0);
  const out: HourVisit[] = [];
  for (let i = 23; i >= 0; i -= 1) {
    const d = new Date(start.getTime() - i * 3600_000);
    const hour = d.toISOString().slice(0, 13);
    out.push({ hour, visits: map.get(hour) ?? 0 });
  }
  return out;
}

/** Today versus the mean and population standard deviation of the prior 13 days. */
export function trafficAnomaly(days: DayVisit[]): TrafficAnomaly {
  const today = days.length ? days[days.length - 1]!.visits : 0;
  const prior = days.slice(0, -1).map((day) => day.visits);
  const n = prior.length;
  const average = n ? prior.reduce((sum, value) => sum + value, 0) / n : 0;
  const variance = n ? prior.reduce((sum, value) => sum + (value - average) ** 2, 0) / n : 0;
  const stddev = Math.sqrt(variance);
  const zScore = stddev > 0 ? (today - average) / stddev : null;
  const deviationPct = average > 0 ? ((today - average) / average) * 100 : null;
  const spike =
    today >= 3 && ((zScore != null && zScore >= 2) || (average > 0 && today >= average * 2));
  return {
    today,
    average: round1(average),
    stddev: round1(stddev),
    zScore: zScore == null ? null : round1(zScore),
    deviationPct: deviationPct == null ? null : Math.round(deviationPct),
    spike,
  };
}

/** A bar is a spike when it sits at least two standard deviations above its series, and is at least 3. */
export function isSeriesSpike(visits: number, series: number[]): boolean {
  if (visits < 3 || series.length < 2) return false;
  const n = series.length;
  const average = series.reduce((sum, value) => sum + value, 0) / n;
  const variance = series.reduce((sum, value) => sum + (value - average) ** 2, 0) / n;
  const stddev = Math.sqrt(variance);
  return stddev > 0 && visits >= average + 2 * stddev;
}

export function trafficPace(last24h: number, typicalDay: number): TrafficPace {
  if (last24h <= 0 && typicalDay <= 0) return "quiet";
  if (typicalDay > 0 && last24h >= typicalDay * 2 && last24h >= 3) return "above";
  if (typicalDay > 0 && last24h * 2 <= typicalDay) return "below";
  return "normal";
}
