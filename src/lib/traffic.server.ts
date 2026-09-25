import { dbSource, getSql } from "@/lib/db";
import {
  VISIT_BASELINE,
  fillDaySeries,
  fillHourSeries,
  trafficAnomaly,
  typicalDayVisits,
  withBaseline,
  type DayVisit,
  type TrafficSnapshot,
} from "@/lib/visit-counter";

/**
 * Visit totals for the office and the monitor endpoint.
 * Durable only when `DATABASE_URL` points at Postgres. Otherwise the rows live
 * in the in-memory PGLite fallback (or the query fails on Vercel, where that
 * fallback cannot open) and are lost on deploy or cold start.
 */
export async function loadTrafficSnapshot(now = new Date()): Promise<TrafficSnapshot> {
  const durable = dbSource === "neon";
  const days = fillDaySeries([], now);
  const hours = fillHourSeries([], now);
  const blank = (): TrafficSnapshot => ({
    total: withBaseline(0),
    baseline: VISIT_BASELINE,
    counted: 0,
    lastHour: 0,
    last24h: 0,
    typicalDay: typicalDayVisits(days),
    days,
    hours,
    anomaly: trafficAnomaly(days),
    durable,
  });

  try {
    const sql = await getSql();
    const [row] = await sql<{ counted: number; last_hour: number; last_24h: number }>`
      select
        (select coalesce(sum(visit_count), 0)::int from unique_ips) as counted,
        (
          select count(*)::int from (
            select 1
            from behavior_events
            where kind = 'page' and created_at > now() - interval '1 hour'
            group by coalesce(ip_hash, visitor_key), floor(extract(epoch from created_at) / 1800)
          ) hour_windows
        ) as last_hour,
        (
          select count(*)::int from (
            select 1
            from behavior_events
            where kind = 'page' and created_at > now() - interval '24 hours'
            group by coalesce(ip_hash, visitor_key), floor(extract(epoch from created_at) / 1800)
          ) day_windows
        ) as last_24h
    `;
    const dayRows = await sql<{ date: string; visits: number }>`
      select day::text as date, count(*)::int as visits
      from (
        select
          (created_at at time zone 'utc')::date as day,
          coalesce(ip_hash, visitor_key) as who,
          floor(extract(epoch from created_at) / 1800) as win
        from behavior_events
        where kind = 'page'
          and created_at >= ((date_trunc('day', now() at time zone 'utc') - interval '13 days') at time zone 'utc')
        group by 1, 2, 3
      ) buckets
      group by day
      order by day
    `;
    const hourRows = await sql<{ hour: string; visits: number }>`
      select hour, count(*)::int as visits
      from (
        select
          to_char(date_trunc('hour', created_at at time zone 'utc'), 'YYYY-MM-DD"T"HH24') as hour,
          coalesce(ip_hash, visitor_key) as who,
          floor(extract(epoch from created_at) / 1800) as win
        from behavior_events
        where kind = 'page'
          and created_at > now() - interval '24 hours'
        group by 1, 2, 3
      ) buckets
      group by hour
      order by hour
    `;
    const series = fillDaySeries(
      dayRows.map((r) => ({ date: String(r.date).slice(0, 10), visits: r.visits })),
      now,
    );
    const hourSeries = fillHourSeries(
      hourRows.map((r) => ({ hour: String(r.hour).slice(0, 13), visits: r.visits })),
      now,
    );
    const counted = row?.counted ?? 0;
    return {
      total: withBaseline(counted),
      baseline: VISIT_BASELINE,
      counted,
      lastHour: row?.last_hour ?? 0,
      last24h: row?.last_24h ?? 0,
      typicalDay: typicalDayVisits(series),
      days: series,
      hours: hourSeries,
      anomaly: trafficAnomaly(series),
      durable,
    };
  } catch (err) {
    console.error("[traffic] snapshot failed:", err);
    return blank();
  }
}

export function monitorBody(snapshot: TrafficSnapshot): {
  total: number;
  baseline: number;
  counted: number;
  lastHour: number;
  last24h: number;
  days: DayVisit[];
  anomaly: TrafficSnapshot["anomaly"];
  durable: boolean;
} {
  return {
    total: snapshot.total,
    baseline: snapshot.baseline,
    counted: snapshot.counted,
    lastHour: snapshot.lastHour,
    last24h: snapshot.last24h,
    days: snapshot.days,
    anomaly: snapshot.anomaly,
    durable: snapshot.durable,
  };
}
