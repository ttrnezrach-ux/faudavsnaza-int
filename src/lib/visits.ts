import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { countryFromTimezone, normalizeCountry } from "@/lib/geo";
import { clientAddr, isBotRequest } from "@/lib/client-ip";

export type VisitStats = {
  total: number;
  unique: number;
  recent: number;
};

export type CountryStat = {
  code: string;
  visitors: number;
  views: number;
  clicks: number;
};

export type ClickStat = {
  target: string;
  count: number;
};

export type RecentClick = {
  target: string;
  country: string | null;
  at: string;
};

export type NamedCount = {
  name: string;
  count: number;
};

export type HourPoint = {
  hour: string;
  count: number;
};

export type DualHour = {
  hour: string;
  visits: number;
  clicks: number;
};

export type OfficeRange = "day" | "week" | "month" | "year";

export type IpTraffic = {
  id: string;
  hint: string;
  country: string | null;
  visits: number;
  clicks: number;
  lastAt?: string;
};

export type IpHit = {
  hint: string;
  country: string | null;
  at: string;
  page: string;
};

export type CountryTraffic = {
  code: string;
  visitors: number;
  views: number;
  clicks: number;
};

export type PublicTraffic = {
  total: number;
  recent: number;
  clicks: number;
  countries: CountryTraffic[];
  hourly: DualHour[];
};

export type GoogleArrival = {
  sessions: number;
  products: NamedCount[];
  hosts: NamedCount[];
  countries: NamedCount[];
  landings: NamedCount[];
  campaigns: NamedCount[];
};

export type GoalStat = {
  id: string;
  completions: number;
};

export type OfficeStats = {
  total: number;
  recent: number;
  views: number;
  clicks: number;
  countries: CountryStat[];
  clickLeaders: ClickStat[];
  recentClicks: RecentClick[];
  sessions: number;
  bounceRate: number;
  pagesPerSession: number;
  avgSeconds: number;
  newUsers: number;
  returning: number;
  pages: NamedCount[];
  devices: NamedCount[];
  sources: NamedCount[];
  google: GoogleArrival;
  hourly: HourPoint[];
  hourlyDual: DualHour[];
  ipLeaders: IpTraffic[];
  ipHits: IpHit[];
  allTimeVisits: number;
  allTimeUnique: number;
  periodVisits: number;
  periodUnique: number;
  funnel: { land: number; explore: number; share: number; office: number };
  goals: GoalStat[];
  durationBuckets: NamedCount[];
  works: NamedCount[];
  tabs: NamedCount[];
  langs: NamedCount[];
  prior: { visits: number; unique: number };
};

const visitorInput = z.object({
  visitorKey: z.string().regex(/^[a-zA-Z0-9-]{8,64}$/),
  timezone: z.string().max(64).optional(),
});

const clickInput = z.object({
  visitorKey: z.string().regex(/^[a-zA-Z0-9-]{8,64}$/),
  target: z.string().regex(/^[a-z0-9:_-]{1,64}$/),
  timezone: z.string().max(64).optional(),
});

const behaviorInput = z.object({
  visitorKey: z.string().regex(/^[a-zA-Z0-9-]{8,64}$/),
  sessionKey: z.string().regex(/^[a-zA-Z0-9-]{8,64}$/),
  kind: z.enum(["page", "event"]),
  name: z.string().regex(/^[a-z0-9:_/-]{1,64}$/),
  device: z.enum(["mobile", "tablet", "desktop"]).optional(),
  source: z.enum(["direct", "google", "internal", "referral"]).optional(),
  locale: z.string().regex(/^[a-z]{2}$/).optional(),
  timezone: z.string().max(64).optional(),
  referrerHost: z.string().regex(/^[a-z0-9.-]{1,80}$/).optional(),
  landing: z.string().regex(/^\/[a-z0-9/_-]{0,63}$/).optional(),
  googleProduct: z.enum(["search", "news", "images", "ads", "maps", "other"]).optional(),
  campaign: z.string().regex(/^[a-zA-Z0-9._-]{1,64}$/).optional(),
  work: z.enum(["fauda", "naza", "compare"]).optional(),
  contentTab: z.enum(["map", "social", "algo", "concl"]).optional(),
});

function countryFromHeaders(timezone?: string): string | null {
  const request = getRequest();
  const headers = request?.headers;
  const raw =
    headers?.get("x-vercel-ip-country") ||
    headers?.get("cf-ipcountry") ||
    headers?.get("x-country-code") ||
    headers?.get("cloudfront-viewer-country") ||
    "";
  return normalizeCountry(raw) ?? countryFromTimezone(timezone);
}

async function readStats(): Promise<VisitStats> {
  const sql = await getSql();
  const [row] = await sql<{ total: number; unique: number }>`
    select
      coalesce(sum(visit_count), 0)::int as total,
      count(*)::int as unique
    from unique_ips
  `;
  return { total: row?.total ?? 0, unique: row?.unique ?? 0, recent: row?.unique ?? 0 };
}

export const getVisitStats = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return await readStats();
  } catch {
    return { total: 0, unique: 0, recent: 0 };
  }
});

export const recordRequestVisit = createServerFn({ method: "POST" }).handler(async () => {
  try {
    if (isBotRequest()) return { ok: true as const };
    const addr = clientAddr();
    if (!addr.ok) return { ok: true as const };
    const sql = await getSql();
    const country = countryFromHeaders();
    await sql`
      insert into unique_ips (ip_hash, ip_hint, country_code, first_seen, last_seen, visit_count)
      values (${addr.hash}, ${addr.hint}, ${country}, now(), now(), 1)
      on conflict (ip_hash) do update set
        last_seen = now(),
        visit_count = unique_ips.visit_count + case
          when unique_ips.last_seen < now() - interval '30 minutes' then 1
          else 0
        end,
        country_code = coalesce(excluded.country_code, unique_ips.country_code),
        ip_hint = coalesce(excluded.ip_hint, unique_ips.ip_hint)
    `;
    return { ok: true as const };
  } catch {
    return { ok: false as const };
  }
});

export const recordUniqueVisit = createServerFn({ method: "POST" })
  .validator((input: unknown) => visitorInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      const country = countryFromHeaders(data.timezone);
      const addr = clientAddr();
      const bot = isBotRequest();
      await sql`
      insert into unique_visitors (visitor_key, first_seen, last_seen, country_code, visit_count, ip_hash, ip_hint)
      values (${data.visitorKey}, now(), now(), ${country}, 1, ${addr.ok ? addr.hash : null}, ${addr.ok ? addr.hint : null})
      on conflict (visitor_key) do update set
        last_seen = now(),
        visit_count = unique_visitors.visit_count + case
          when unique_visitors.last_seen < now() - interval '30 minutes' then 1
          else 0
        end,
        country_code = coalesce(excluded.country_code, unique_visitors.country_code),
        ip_hash = coalesce(excluded.ip_hash, unique_visitors.ip_hash),
        ip_hint = coalesce(excluded.ip_hint, unique_visitors.ip_hint)
    `;
      if (addr.ok && !bot) {
        await sql`
      insert into unique_ips (ip_hash, ip_hint, country_code, first_seen, last_seen, visit_count)
      values (${addr.hash}, ${addr.hint}, ${country}, now(), now(), 1)
      on conflict (ip_hash) do update set
        last_seen = now(),
        visit_count = unique_ips.visit_count + case
          when unique_ips.last_seen < now() - interval '30 minutes' then 1
          else 0
        end,
        country_code = coalesce(excluded.country_code, unique_ips.country_code),
        ip_hint = coalesce(excluded.ip_hint, unique_ips.ip_hint)
    `;
      }
      return await readStats();
    } catch {
      return { total: 0, unique: 0, recent: 0 };
    }
  });

export const recordClick = createServerFn({ method: "POST" })
  .validator((input: unknown) => clickInput.parse(input))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const country = countryFromHeaders(data.timezone);
    if (isBotRequest()) return { ok: true as const };
    const addr = clientAddr();
    await sql`
      insert into click_events (visitor_key, target, country_code, ip_hash, ip_hint, created_at)
      values (${data.visitorKey}, ${data.target}, ${country}, ${addr.ok ? addr.hash : null}, ${addr.ok ? addr.hint : null}, now())
    `;
    return { ok: true as const };
  });

export const recordBehavior = createServerFn({ method: "POST" })
  .validator((input: unknown) => behaviorInput.parse(input))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const country = countryFromHeaders(data.timezone);
    const addr = clientAddr();
    const ipHash = addr.ok ? addr.hash : null;
    const ipHint = addr.ok ? addr.hint : null;
    const device = data.device ?? null;
    const source = data.source ?? null;
    const locale = data.locale ?? null;
    const referrerHost = data.referrerHost ?? null;
    const landing = data.landing ?? null;
    const googleProduct = data.googleProduct ?? null;
    const campaign = data.campaign ?? null;
    await sql`
      insert into sessions (session_key, visitor_key, country_code, device, source, locale, referrer_host, landing, google_product, campaign, started_at, last_seen, pageviews, events)
      values (${data.sessionKey}, ${data.visitorKey}, ${country}, ${device}, ${source}, ${locale}, ${referrerHost}, ${landing}, ${googleProduct}, ${campaign}, now(), now(), ${data.kind === "page" ? 1 : 0}, ${data.kind === "event" ? 1 : 0})
      on conflict (session_key) do update set
        last_seen = now(),
        country_code = coalesce(excluded.country_code, sessions.country_code),
        device = coalesce(sessions.device, excluded.device),
        source = coalesce(sessions.source, excluded.source),
        locale = coalesce(sessions.locale, excluded.locale),
        referrer_host = coalesce(sessions.referrer_host, excluded.referrer_host),
        landing = coalesce(sessions.landing, excluded.landing),
        google_product = coalesce(sessions.google_product, excluded.google_product),
        campaign = coalesce(sessions.campaign, excluded.campaign),
        pageviews = sessions.pageviews + ${data.kind === "page" ? 1 : 0},
        events = sessions.events + ${data.kind === "event" ? 1 : 0}
    `;
    const work = data.work ?? null;
    const contentTab = data.contentTab ?? null;
    await sql`
      insert into behavior_events (visitor_key, session_key, kind, name, device, source, locale, country_code, ip_hash, ip_hint, work, content_tab, created_at)
      values (${data.visitorKey}, ${data.sessionKey}, ${data.kind}, ${data.name}, ${device}, ${source}, ${locale}, ${country}, ${ipHash}, ${ipHint}, ${work}, ${contentTab}, now())
    `;
    return { ok: true as const };
  });

function isoHour(v: string | Date): string {
  return typeof v === "string" ? v : v.toISOString();
}

function fillDualHours(rows: DualHour[]): DualHour[] {
  const map = new Map<string, DualHour>();
  for (const r of rows) {
    const key = new Date(r.hour).toISOString().slice(0, 13);
    map.set(key, r);
  }
  const now = new Date();
  now.setMinutes(0, 0, 0);
  const out: DualHour[] = [];
  for (let i = 23; i >= 0; i -= 1) {
    const d = new Date(now.getTime() - i * 3600_000);
    const key = d.toISOString().slice(0, 13);
    const hit = map.get(key);
    out.push({
      hour: String(d.getHours()).padStart(2, "0"),
      visits: hit?.visits ?? 0,
      clicks: hit?.clicks ?? 0,
    });
  }
  return out;
}

function fillDualDays(rows: DualHour[], days: number): DualHour[] {
  const map = new Map<string, DualHour>();
  for (const r of rows) {
    map.set(new Date(r.hour).toISOString().slice(0, 10), r);
  }
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const out: DualHour[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now.getTime() - i * 86_400_000);
    const key = d.toISOString().slice(0, 10);
    const hit = map.get(key);
    out.push({
      hour: `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`,
      visits: hit?.visits ?? 0,
      clicks: hit?.clicks ?? 0,
    });
  }
  return out;
}

function fillDualMonths(rows: DualHour[]): DualHour[] {
  const map = new Map<string, DualHour>();
  for (const r of rows) {
    map.set(new Date(r.hour).toISOString().slice(0, 7), r);
  }
  const now = new Date();
  now.setDate(1);
  now.setHours(0, 0, 0, 0);
  const out: DualHour[] = [];
  for (let i = 11; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const hit = map.get(key);
    out.push({
      hour: `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getFullYear()).slice(2)}`,
      visits: hit?.visits ?? 0,
      clicks: hit?.clicks ?? 0,
    });
  }
  return out;
}

function windowMs(range: OfficeRange): number {
  if (range === "day") return 24 * 3600_000;
  if (range === "week") return 7 * 86_400_000;
  if (range === "month") return 30 * 86_400_000;
  return 365 * 86_400_000;
}

function sinceFor(range: OfficeRange): Date {
  return new Date(Date.now() - windowMs(range));
}

function fillSeries(range: OfficeRange, rows: DualHour[]): DualHour[] {
  if (range === "day") return fillDualHours(rows);
  if (range === "year") return fillDualMonths(rows);
  return fillDualDays(rows, range === "week" ? 7 : 30);
}

export const getPublicTraffic = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const parsed = z.object({ range: z.enum(["day", "week", "month", "year"]).optional() }).parse(input ?? {});
    return { range: (parsed.range ?? "week") as OfficeRange };
  })
  .handler(async ({ data }): Promise<PublicTraffic> => {
  const range = data.range;
  const since = sinceFor(range);
  const empty: PublicTraffic = { total: 0, recent: 0, clicks: 0, countries: [], hourly: fillSeries(range, []) };
  try {
    const sql = await getSql();
    const [summary] = await sql<{ total: number; recent: number; clicks: number }>`
      select
        (select count(*)::int from unique_ips) as total,
        (select count(*)::int from unique_ips where last_seen > ${since}) as recent,
        (select count(*)::int from click_events where created_at > ${since}) as clicks
    `;
    const countries = await sql<CountryTraffic>`
      select
        v.country_code as code,
        count(*)::int as visitors,
        coalesce(sum(v.visit_count), 0)::int as views,
        coalesce((
          select count(*)::int from click_events c
          where c.country_code = v.country_code and c.created_at > ${since}
        ), 0) as clicks
      from unique_visitors v
      where v.country_code is not null and v.last_seen > ${since}
      group by v.country_code
      order by visitors desc, clicks desc
      limit 16
    `;
    const hourlyRows =
      range === "day"
        ? await sql<{ hour: string | Date; visits: number; clicks: number }>`
            select
              date_trunc('hour', created_at) as hour,
              count(*) filter (where kind = 'page')::int as visits,
              count(*) filter (where kind = 'event')::int as clicks
            from behavior_events
            where created_at > ${since}
            group by 1
            order by 1
          `
        : range === "year"
          ? await sql<{ hour: string | Date; visits: number; clicks: number }>`
              select
                date_trunc('month', created_at) as hour,
                count(*) filter (where kind = 'page')::int as visits,
                count(*) filter (where kind = 'event')::int as clicks
              from behavior_events
              where created_at > ${since}
              group by 1
              order by 1
            `
          : await sql<{ hour: string | Date; visits: number; clicks: number }>`
              select
                date_trunc('day', created_at) as hour,
                count(*) filter (where kind = 'page')::int as visits,
                count(*) filter (where kind = 'event')::int as clicks
              from behavior_events
              where created_at > ${since}
              group by 1
              order by 1
            `;
    return {
      total: summary?.total ?? 0,
      recent: summary?.recent ?? 0,
      clicks: summary?.clicks ?? 0,
      countries,
      hourly: fillSeries(
        range,
        hourlyRows.map((r) => ({ hour: isoHour(r.hour), visits: r.visits, clicks: r.clicks })),
      ),
    };
  } catch {
    return empty;
  }
});

export const getOfficeStats = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const parsed = z.object({ range: z.enum(["day", "week", "month", "year"]).optional() }).parse(input ?? {});
    return { range: (parsed.range ?? "week") as OfficeRange };
  })
  .handler(async ({ data }) => {
  const { isOfficeUnlocked } = await import("@/lib/office-lock.server");
  if (!(await isOfficeUnlocked())) {
    throw new Error("office locked");
  }
  const range = data.range;
  const since = sinceFor(range);
  const priorSince = new Date(since.getTime() - windowMs(range));
  const sql = await getSql();
  const empty: OfficeStats = {
    total: 0,
    recent: 0,
    views: 0,
    clicks: 0,
    countries: [],
    clickLeaders: [],
    recentClicks: [],
    sessions: 0,
    bounceRate: 0,
    pagesPerSession: 0,
    avgSeconds: 0,
    newUsers: 0,
    returning: 0,
    pages: [],
    devices: [],
    sources: [],
    hourly: [],
    hourlyDual: [],
    ipLeaders: [],
    ipHits: [],
    allTimeVisits: 0,
    allTimeUnique: 0,
    periodVisits: 0,
    periodUnique: 0,
    google: { sessions: 0, products: [], hosts: [], countries: [], landings: [], campaigns: [] },
    funnel: { land: 0, explore: 0, share: 0, office: 0 },
    goals: [],
    durationBuckets: [],
    works: [],
    tabs: [],
    langs: [],
    prior: { visits: 0, unique: 0 },
  };
  try {
    const [summary] = await sql<{
      total: number;
      recent: number;
      views: number;
      clicks: number;
      sessions: number;
      bounced: number;
      avg_seconds: number | string;
      new_users: number;
      returning: number;
      all_time_visits: number;
      all_time_unique: number;
      period_visits: number;
      period_unique: number;
      prior_visits: number;
      prior_unique: number;
    }>`
    select
      (select count(*)::int from unique_ips) as total,
      (select count(*)::int from unique_ips where last_seen > ${since}) as recent,
      (select count(*)::int from behavior_events where kind = 'page' and created_at > ${since}) as views,
      (select count(*)::int from click_events where created_at > ${since}) as clicks,
      (select count(*)::int from sessions where started_at > ${since}) as sessions,
      (select count(*)::int from sessions where started_at > ${since} and pageviews <= 1 and events = 0) as bounced,
      (select coalesce(avg(extract(epoch from (last_seen - started_at))), 0) from sessions where started_at > ${since}) as avg_seconds,
      (select count(*)::int from unique_visitors where last_seen > ${since} and visit_count = 1) as new_users,
      (select count(*)::int from unique_visitors where last_seen > ${since} and visit_count > 1) as returning,
      (select coalesce(sum(visit_count), 0)::int from unique_ips) as all_time_visits,
      (select count(*)::int from unique_ips) as all_time_unique,
      (select count(*)::int from sessions where started_at > ${since}) as period_visits,
      (select count(distinct ip_hash)::int from unique_ips where last_seen > ${since}) as period_unique,
      (select count(*)::int from sessions where started_at > ${priorSince} and started_at <= ${since}) as prior_visits,
      (select count(*)::int from unique_ips where last_seen > ${priorSince} and last_seen <= ${since}) as prior_unique
  `;
  let countries = await sql<CountryStat>`
    select
      e.country_code as code,
      count(distinct e.ip_hash)::int as visitors,
      count(*)::int as views,
      coalesce((
        select count(*)::int from click_events c
        where c.country_code = e.country_code and c.created_at > ${since}
      ), 0) as clicks
    from behavior_events e
    where e.kind = 'page' and e.created_at > ${since} and e.country_code is not null
    group by e.country_code
    order by views desc, visitors desc
  `;
  if (countries.length === 0) {
    countries = await sql<CountryStat>`
      select
        i.country_code as code,
        count(*)::int as visitors,
        coalesce(sum(i.visit_count), 0)::int as views,
        coalesce((
          select count(*)::int from click_events c
          where c.country_code = i.country_code and c.created_at > ${since}
        ), 0) as clicks
      from unique_ips i
      where i.country_code is not null and i.last_seen > ${since}
      group by i.country_code
      order by views desc, visitors desc
    `;
  }
  const clickLeaders = await sql<ClickStat>`
    select target, count(*)::int as count
    from click_events
    where created_at > ${since}
    group by target
    order by count desc
    limit 30
  `;
  const recentClicks = await sql<{ target: string; country_code: string | null; created_at: string | Date }>`
    select target, country_code, created_at
    from click_events
    where created_at > ${since}
    order by created_at desc
    limit 25
  `;
  const pages = await sql<NamedCount>`
    select name, count(*)::int as count
    from behavior_events
    where kind = 'page' and created_at > ${since}
    group by name
    order by count desc
  `;
  const devices = await sql<NamedCount>`
    select coalesce(device, 'desktop') as name, count(*)::int as count
    from sessions
    where started_at > ${since}
    group by coalesce(device, 'desktop')
    order by count desc
  `;
  const sources = await sql<NamedCount>`
    select coalesce(source, 'direct') as name, count(*)::int as count
    from sessions
    where started_at > ${since}
    group by coalesce(source, 'direct')
    order by count desc
  `;
  const googleProducts = await sql<NamedCount>`
    select coalesce(google_product, 'search') as name, count(*)::int as count
    from sessions
    where started_at > ${since} and source = 'google'
    group by coalesce(google_product, 'search')
    order by count desc
  `;
  const googleHosts = await sql<NamedCount>`
    select coalesce(referrer_host, 'google.com') as name, count(*)::int as count
    from sessions
    where started_at > ${since} and source = 'google'
    group by coalesce(referrer_host, 'google.com')
    order by count desc
    limit 12
  `;
  const googleCountries = await sql<NamedCount>`
    select coalesce(country_code, 'ZZ') as name, count(*)::int as count
    from sessions
    where started_at > ${since} and source = 'google' and country_code is not null
    group by country_code
    order by count desc
    limit 16
  `;
  const googleLandings = await sql<NamedCount>`
    select coalesce(landing, '/') as name, count(*)::int as count
    from sessions
    where started_at > ${since} and source = 'google'
    group by coalesce(landing, '/')
    order by count desc
    limit 8
  `;
  const googleCampaigns = await sql<NamedCount>`
    select campaign as name, count(*)::int as count
    from sessions
    where started_at > ${since} and source = 'google' and campaign is not null
    group by campaign
    order by count desc
    limit 8
  `;
  const [googleCount] = await sql<{ n: number }>`
    select count(*)::int as n from sessions where started_at > ${since} and source = 'google'
  `;
  const hourlyRows =
    range === "day"
      ? await sql<{ hour: string | Date; count: number }>`
          select date_trunc('hour', created_at) as hour, count(*)::int as count
          from behavior_events
          where created_at > ${since}
          group by 1
          order by 1
        `
      : range === "year"
        ? await sql<{ hour: string | Date; count: number }>`
            select date_trunc('month', created_at) as hour, count(*)::int as count
            from behavior_events
            where created_at > ${since}
            group by 1
            order by 1
          `
        : await sql<{ hour: string | Date; count: number }>`
            select date_trunc('day', created_at) as hour, count(*)::int as count
            from behavior_events
            where created_at > ${since}
            group by 1
            order by 1
          `;
  const hourlyDualRows =
    range === "day"
      ? await sql<{ hour: string | Date; visits: number; clicks: number }>`
          select
            date_trunc('hour', created_at) as hour,
            count(*) filter (where kind = 'page')::int as visits,
            count(*) filter (where kind = 'event')::int as clicks
          from behavior_events
          where created_at > ${since}
          group by 1
          order by 1
        `
      : range === "year"
        ? await sql<{ hour: string | Date; visits: number; clicks: number }>`
            select
              date_trunc('month', created_at) as hour,
              count(*) filter (where kind = 'page')::int as visits,
              count(*) filter (where kind = 'event')::int as clicks
            from behavior_events
            where created_at > ${since}
            group by 1
            order by 1
          `
        : await sql<{ hour: string | Date; visits: number; clicks: number }>`
            select
              date_trunc('day', created_at) as hour,
              count(*) filter (where kind = 'page')::int as visits,
              count(*) filter (where kind = 'event')::int as clicks
            from behavior_events
            where created_at > ${since}
            group by 1
            order by 1
          `;
  const ipFromEvents = await sql<IpTraffic & { last_at?: string | Date }>`
    select
      e.ip_hash as id,
      coalesce(max(e.ip_hint), '—') as hint,
      max(e.country_code) as country,
      count(*) filter (where e.kind = 'page')::int as visits,
      count(*) filter (where e.kind = 'event')::int as clicks,
      max(e.created_at) as last_at
    from behavior_events e
    where e.created_at > ${since} and e.ip_hash is not null
    group by e.ip_hash
    order by visits desc, clicks desc
    limit 40
  `;
  const ipLeaders =
    ipFromEvents.length > 0
      ? ipFromEvents.map((r) => ({
          id: r.id,
          hint: r.hint,
          country: r.country,
          visits: r.visits,
          clicks: r.clicks,
          lastAt: r.last_at ? isoHour(r.last_at) : undefined,
        }))
      : (
          await sql<IpTraffic & { last_at?: string | Date }>`
            select
              i.ip_hash as id,
              i.ip_hint as hint,
              i.country_code as country,
              i.visit_count as visits,
              coalesce(c.clicks, 0)::int as clicks,
              i.last_seen as last_at
            from unique_ips i
            left join (
              select ip_hash, count(*)::int as clicks from click_events
              where created_at > ${since} and ip_hash is not null
              group by ip_hash
            ) c on c.ip_hash = i.ip_hash
            where i.last_seen > ${since}
            order by i.visit_count desc, clicks desc
            limit 40
          `
        ).map((r) => ({
          id: r.id,
          hint: r.hint,
          country: r.country,
          visits: r.visits,
          clicks: r.clicks,
          lastAt: r.last_at ? isoHour(r.last_at) : undefined,
        }));
  const ipHitRows = await sql<{ hint: string; country: string | null; at: string | Date; page: string }>`
    select
      coalesce(ip_hint, '—') as hint,
      country_code as country,
      created_at as at,
      name as page
    from behavior_events
    where kind = 'page' and created_at > ${since}
    order by created_at desc
    limit 80
  `;
  const ipHits: IpHit[] = ipHitRows.map((r) => ({
    hint: r.hint,
    country: r.country,
    at: isoHour(r.at),
    page: r.page,
  }));
  const [funnel] = await sql<{ land: number; explore: number; share: number; office: number }>`
    select
      (select count(distinct visitor_key)::int from behavior_events where kind = 'page' and name = '/' and created_at > ${since}) as land,
      (select count(distinct visitor_key)::int from behavior_events where (name like 'tab:%' or name like 'country:%') and created_at > ${since}) as explore,
      (select count(distinct visitor_key)::int from behavior_events where name like 'share:%' and name <> 'share:step:open' and created_at > ${since}) as share,
      (select count(distinct visitor_key)::int from behavior_events where name in ('nav:office', '/office') and created_at > ${since}) as office
  `;
  const [goalRow] = await sql<{
    google_sess: number;
    google_share: number;
    duration: number;
    engaged: number;
  }>`
    select
      (select count(*)::int from sessions where started_at > ${since} and source = 'google') as google_sess,
      (select count(*)::int from sessions s
        where s.started_at > ${since} and s.source = 'google'
          and exists (
            select 1 from behavior_events e
            where e.session_key = s.session_key and e.name like 'share:%' and e.name <> 'share:step:open' and e.created_at > ${since}
          )
      ) as google_share,
      (select count(*)::int from sessions where started_at > ${since} and extract(epoch from (last_seen - started_at)) >= 30) as duration,
      (select count(*)::int from sessions where started_at > ${since} and pageviews >= 2) as engaged
  `;
  const works = await sql<NamedCount>`
    select coalesce(nullif(work, ''), 'unknown') as name, count(*)::int as count
    from behavior_events
    where kind = 'page' and name = '/' and created_at > ${since}
    group by 1
    order by count desc
  `;
  const tabs = await sql<NamedCount>`
    select coalesce(nullif(content_tab, ''), 'unknown') as name, count(*)::int as count
    from behavior_events
    where kind = 'page' and name = '/' and created_at > ${since}
    group by 1
    order by count desc
  `;
  const langs = await sql<NamedCount>`
    select coalesce(nullif(locale, ''), 'unknown') as name, count(*)::int as count
    from behavior_events
    where kind = 'page' and name = '/' and created_at > ${since}
    group by 1
    order by count desc
  `;
  const durationBuckets = await sql<NamedCount>`
    select name, count(*)::int as count from (
      select
        case
          when extract(epoch from (last_seen - started_at)) < 10 then 'lt10'
          when extract(epoch from (last_seen - started_at)) < 30 then 'lt30'
          when extract(epoch from (last_seen - started_at)) < 120 then 'lt2m'
          when extract(epoch from (last_seen - started_at)) < 300 then 'lt5m'
          else 'gt5m'
        end as name
      from sessions
      where started_at > ${since}
    ) d
    group by name
  `;
  const bounced = summary?.bounced ?? 0;
  const views = summary?.views ?? 0;
  const pageviews = pages.reduce((n, p) => n + p.count, 0);
  const sessionCount = summary?.sessions ?? 0;
  const stats: OfficeStats = {
    total: summary?.all_time_unique ?? summary?.total ?? 0,
    recent: summary?.period_unique ?? summary?.recent ?? 0,
    views,
    clicks: summary?.clicks ?? 0,
    countries,
    clickLeaders,
    recentClicks: recentClicks.map((r) => ({
      target: r.target,
      country: r.country_code,
      at: isoHour(r.created_at),
    })),
    sessions: sessionCount,
    bounceRate: sessionCount ? Math.round((bounced / sessionCount) * 100) : 0,
    pagesPerSession: sessionCount ? Math.round((pageviews / sessionCount) * 10) / 10 : 0,
    avgSeconds: Math.max(0, Math.round(Number(summary?.avg_seconds ?? 0))),
    newUsers: summary?.new_users ?? 0,
    returning: summary?.returning ?? 0,
    pages,
    devices,
    sources,
    google: {
      sessions: googleCount?.n ?? 0,
      products: googleProducts,
      hosts: googleHosts,
      countries: googleCountries,
      landings: googleLandings,
      campaigns: googleCampaigns,
    },
    hourly: hourlyRows.map((r) => ({ hour: isoHour(r.hour), count: r.count })),
    hourlyDual: fillSeries(
      range,
      hourlyDualRows.map((r) => ({ hour: isoHour(r.hour), visits: r.visits, clicks: r.clicks })),
    ),
    ipLeaders,
    ipHits,
    allTimeVisits: summary?.all_time_visits ?? 0,
    allTimeUnique: summary?.all_time_unique ?? 0,
    periodVisits: summary?.period_visits ?? views,
    periodUnique: summary?.period_unique ?? (summary?.recent ?? 0),
    funnel: {
      land: funnel?.land ?? 0,
      explore: funnel?.explore ?? 0,
      share: funnel?.share ?? 0,
      office: funnel?.office ?? 0,
    },
    goals: [
      { id: "land", completions: funnel?.land ?? 0 },
      { id: "explore", completions: funnel?.explore ?? 0 },
      { id: "share", completions: funnel?.share ?? 0 },
      { id: "office", completions: funnel?.office ?? 0 },
      { id: "google", completions: goalRow?.google_sess ?? 0 },
      { id: "googleShare", completions: goalRow?.google_share ?? 0 },
      { id: "duration", completions: goalRow?.duration ?? 0 },
      { id: "engaged", completions: goalRow?.engaged ?? 0 },
    ],
    durationBuckets,
    works,
    tabs,
    langs,
    prior: {
      visits: Number(summary?.prior_visits ?? 0),
      unique: Number(summary?.prior_unique ?? 0),
    },
  };
  return stats;
  } catch {
    return empty;
  }
});

