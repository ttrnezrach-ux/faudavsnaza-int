import { a as getRequest, t as createServerFn } from "./ssr.mjs";
import { a as string, i as object, t as _enum } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { t as getSql } from "./db-pb99grkE.mjs";
import { a as normalizeCountry, n as countryFromTimezone } from "./geo-CQ-q3xHM.mjs";
import { createHash } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/visits-qVlazRcR.js
function rawIp() {
	const headers = getRequest()?.headers;
	if (!headers) return "";
	let ip = ((headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "") || headers.get("x-real-ip")?.trim() || headers.get("cf-connecting-ip")?.trim() || headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "").replace(/^\[([^\]]+)\](?::\d+)?$/, "$1");
	if (/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(ip)) ip = ip.replace(/:\d+$/, "");
	return ip;
}
function maskIp(ip) {
	if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(ip)) {
		const [a, b] = ip.split(".");
		return `${a}.${b}.x.x`;
	}
	if (ip.includes(":")) return `${ip.split(":").filter(Boolean).slice(0, 3).join(":")}::x`;
	return "";
}
function clientAddr() {
	const ip = rawIp();
	const hash = createHash("sha256").update(ip || "unknown").digest("hex").slice(0, 16);
	return {
		hash,
		hint: maskIp(ip) || hash.slice(0, 8)
	};
}
var visitorInput = object({
	visitorKey: string().regex(/^[a-zA-Z0-9-]{8,64}$/),
	timezone: string().max(64).optional()
});
var clickInput = object({
	visitorKey: string().regex(/^[a-zA-Z0-9-]{8,64}$/),
	target: string().regex(/^[a-z0-9:_-]{1,64}$/),
	timezone: string().max(64).optional()
});
var behaviorInput = object({
	visitorKey: string().regex(/^[a-zA-Z0-9-]{8,64}$/),
	sessionKey: string().regex(/^[a-zA-Z0-9-]{8,64}$/),
	kind: _enum(["page", "event"]),
	name: string().regex(/^[a-z0-9:_/-]{1,64}$/),
	device: _enum([
		"mobile",
		"tablet",
		"desktop"
	]).optional(),
	source: _enum([
		"direct",
		"google",
		"internal",
		"referral"
	]).optional(),
	locale: string().regex(/^[a-z]{2}$/).optional(),
	timezone: string().max(64).optional(),
	referrerHost: string().regex(/^[a-z0-9.-]{1,80}$/).optional(),
	landing: string().regex(/^\/[a-z0-9/_-]{0,63}$/).optional(),
	googleProduct: _enum([
		"search",
		"news",
		"images",
		"ads",
		"maps",
		"other"
	]).optional(),
	campaign: string().regex(/^[a-zA-Z0-9._-]{1,64}$/).optional()
});
function countryFromHeaders(timezone) {
	const headers = getRequest()?.headers;
	const raw = headers?.get("x-vercel-ip-country") || headers?.get("cf-ipcountry") || headers?.get("x-country-code") || headers?.get("cloudfront-viewer-country") || "";
	return normalizeCountry(raw) ?? countryFromTimezone(timezone);
}
async function readStats() {
	const [row] = await (await getSql())`
    select
      (select count(*)::int from unique_ips) as total,
      (select count(*)::int from unique_ips where last_seen > now() - interval '1 day') as recent
  `;
	return {
		total: row?.total ?? 0,
		recent: row?.recent ?? 0
	};
}
var getVisitStats_createServerFn_handler = createServerRpc({
	id: "418c6550bb1d6dacfb2355adc7104d31f0fb5aed99f7b3ad67afe4aaba13ccc5",
	name: "getVisitStats",
	filename: "src/lib/visits.ts"
}, (opts) => getVisitStats.__executeServer(opts));
var getVisitStats = createServerFn({ method: "GET" }).handler(getVisitStats_createServerFn_handler, async () => {
	try {
		return await readStats();
	} catch {
		return {
			total: 0,
			recent: 0
		};
	}
});
var recordRequestVisit_createServerFn_handler = createServerRpc({
	id: "705f067f2c9117d055da5505335096f3f8f911a5744fa9a064a4ded87c697a31",
	name: "recordRequestVisit",
	filename: "src/lib/visits.ts"
}, (opts) => recordRequestVisit.__executeServer(opts));
var recordRequestVisit = createServerFn({ method: "POST" }).handler(recordRequestVisit_createServerFn_handler, async () => {
	try {
		const sql = await getSql();
		const country = countryFromHeaders();
		const addr = clientAddr();
		await sql`
      insert into unique_ips (ip_hash, ip_hint, country_code, first_seen, last_seen, visit_count)
      values (${addr.hash}, ${addr.hint}, ${country}, now(), now(), 1)
      on conflict (ip_hash) do update set
        last_seen = now(),
        visit_count = unique_ips.visit_count + 1,
        country_code = coalesce(excluded.country_code, unique_ips.country_code),
        ip_hint = coalesce(excluded.ip_hint, unique_ips.ip_hint)
    `;
		return { ok: true };
	} catch {
		return { ok: false };
	}
});
var recordUniqueVisit_createServerFn_handler = createServerRpc({
	id: "42a07f0e3d92bd68d28066c335325869484969eca6790138a507f64289445432",
	name: "recordUniqueVisit",
	filename: "src/lib/visits.ts"
}, (opts) => recordUniqueVisit.__executeServer(opts));
var recordUniqueVisit = createServerFn({ method: "POST" }).validator((input) => visitorInput.parse(input)).handler(recordUniqueVisit_createServerFn_handler, async ({ data }) => {
	try {
		const sql = await getSql();
		const country = countryFromHeaders(data.timezone);
		const addr = clientAddr();
		await sql`
      insert into unique_visitors (visitor_key, first_seen, last_seen, country_code, visit_count, ip_hash, ip_hint)
      values (${data.visitorKey}, now(), now(), ${country}, 1, ${addr.hash}, ${addr.hint})
      on conflict (visitor_key) do update set
        last_seen = now(),
        visit_count = unique_visitors.visit_count + 1,
        country_code = coalesce(excluded.country_code, unique_visitors.country_code),
        ip_hash = coalesce(excluded.ip_hash, unique_visitors.ip_hash),
        ip_hint = coalesce(excluded.ip_hint, unique_visitors.ip_hint)
    `;
		await sql`
      insert into unique_ips (ip_hash, ip_hint, country_code, first_seen, last_seen, visit_count)
      values (${addr.hash}, ${addr.hint}, ${country}, now(), now(), 1)
      on conflict (ip_hash) do update set
        last_seen = now(),
        visit_count = unique_ips.visit_count + 1,
        country_code = coalesce(excluded.country_code, unique_ips.country_code),
        ip_hint = coalesce(excluded.ip_hint, unique_ips.ip_hint)
    `;
		return await readStats();
	} catch {
		return {
			total: 0,
			recent: 0
		};
	}
});
var recordClick_createServerFn_handler = createServerRpc({
	id: "f7b9ea1d1e8fb0f0570d6e8067247e7a20eda79e16a30f3c17c5554c821ddbe3",
	name: "recordClick",
	filename: "src/lib/visits.ts"
}, (opts) => recordClick.__executeServer(opts));
var recordClick = createServerFn({ method: "POST" }).validator((input) => clickInput.parse(input)).handler(recordClick_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const country = countryFromHeaders(data.timezone);
	const addr = clientAddr();
	await sql`
      insert into click_events (visitor_key, target, country_code, ip_hash, ip_hint, created_at)
      values (${data.visitorKey}, ${data.target}, ${country}, ${addr.hash}, ${addr.hint}, now())
    `;
	return { ok: true };
});
var recordBehavior_createServerFn_handler = createServerRpc({
	id: "1924d10e64125cea46bacd3a1409b0ca012dc3d469fc96797e07099f8cd6cec2",
	name: "recordBehavior",
	filename: "src/lib/visits.ts"
}, (opts) => recordBehavior.__executeServer(opts));
var recordBehavior = createServerFn({ method: "POST" }).validator((input) => behaviorInput.parse(input)).handler(recordBehavior_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const country = countryFromHeaders(data.timezone);
	const addr = clientAddr();
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
	await sql`
      insert into behavior_events (visitor_key, session_key, kind, name, device, source, locale, country_code, ip_hash, ip_hint, created_at)
      values (${data.visitorKey}, ${data.sessionKey}, ${data.kind}, ${data.name}, ${device}, ${source}, ${locale}, ${country}, ${addr.hash}, ${addr.hint}, now())
    `;
	return { ok: true };
});
function isoHour(v) {
	return typeof v === "string" ? v : v.toISOString();
}
function fillDualHours(rows) {
	const map = /* @__PURE__ */ new Map();
	for (const r of rows) {
		const key = new Date(r.hour).toISOString().slice(0, 13);
		map.set(key, r);
	}
	const now = /* @__PURE__ */ new Date();
	now.setMinutes(0, 0, 0);
	const out = [];
	for (let i = 23; i >= 0; i -= 1) {
		const d = /* @__PURE__ */ new Date(now.getTime() - i * 36e5);
		const key = d.toISOString().slice(0, 13);
		const hit = map.get(key);
		out.push({
			hour: String(d.getHours()).padStart(2, "0"),
			visits: hit?.visits ?? 0,
			clicks: hit?.clicks ?? 0
		});
	}
	return out;
}
function fillDualDays(rows, days) {
	const map = /* @__PURE__ */ new Map();
	for (const r of rows) map.set(new Date(r.hour).toISOString().slice(0, 10), r);
	const now = /* @__PURE__ */ new Date();
	now.setHours(0, 0, 0, 0);
	const out = [];
	for (let i = days - 1; i >= 0; i -= 1) {
		const d = /* @__PURE__ */ new Date(now.getTime() - i * 864e5);
		const key = d.toISOString().slice(0, 10);
		const hit = map.get(key);
		out.push({
			hour: `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`,
			visits: hit?.visits ?? 0,
			clicks: hit?.clicks ?? 0
		});
	}
	return out;
}
function sinceFor(range) {
	const d = /* @__PURE__ */ new Date();
	if (range === "day") d.setTime(d.getTime() - 864e5);
	else if (range === "week") d.setTime(d.getTime() - 6048e5);
	else d.setTime(d.getTime() - 2592e6);
	return d;
}
function fillSeries(range, rows) {
	if (range === "day") return fillDualHours(rows);
	return fillDualDays(rows, range === "week" ? 7 : 30);
}
var getPublicTraffic_createServerFn_handler = createServerRpc({
	id: "f9daf2261cd98122f4cd242b39ffd82d4f8b562227276340928585125aa8dc19",
	name: "getPublicTraffic",
	filename: "src/lib/visits.ts"
}, (opts) => getPublicTraffic.__executeServer(opts));
var getPublicTraffic = createServerFn({ method: "GET" }).validator((input) => {
	return { range: object({ range: _enum([
		"day",
		"week",
		"month"
	]).optional() }).parse(input ?? {}).range ?? "week" };
}).handler(getPublicTraffic_createServerFn_handler, async ({ data }) => {
	const range = data.range;
	const since = sinceFor(range);
	const empty = {
		total: 0,
		recent: 0,
		clicks: 0,
		countries: [],
		hourly: fillSeries(range, [])
	};
	try {
		const sql = await getSql();
		const [summary] = await sql`
      select
        (select count(*)::int from unique_ips) as total,
        (select count(*)::int from unique_ips where last_seen > ${since}) as recent,
        (select count(*)::int from click_events where created_at > ${since}) as clicks
    `;
		const countries = await sql`
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
		const hourlyRows = range === "day" ? await sql`
            select
              date_trunc('hour', created_at) as hour,
              count(*) filter (where kind = 'page')::int as visits,
              count(*) filter (where kind = 'event')::int as clicks
            from behavior_events
            where created_at > ${since}
            group by 1
            order by 1
          ` : await sql`
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
			hourly: fillSeries(range, hourlyRows.map((r) => ({
				hour: isoHour(r.hour),
				visits: r.visits,
				clicks: r.clicks
			})))
		};
	} catch {
		return empty;
	}
});
var getOfficeStats_createServerFn_handler = createServerRpc({
	id: "934207d0f214d57393f9d9dc9117989fd2196d098401b93d939df471d71360c0",
	name: "getOfficeStats",
	filename: "src/lib/visits.ts"
}, (opts) => getOfficeStats.__executeServer(opts));
var getOfficeStats = createServerFn({ method: "GET" }).validator((input) => {
	return { range: object({ range: _enum([
		"day",
		"week",
		"month"
	]).optional() }).parse(input ?? {}).range ?? "day" };
}).handler(getOfficeStats_createServerFn_handler, async ({ data }) => {
	const { isOfficeUnlocked } = await import("./office-lock.server-CkekrlXK.mjs");
	if (!await isOfficeUnlocked()) throw new Error("office locked");
	const range = data.range;
	const since = sinceFor(range);
	const sql = await getSql();
	const empty = {
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
		google: {
			sessions: 0,
			products: [],
			hosts: [],
			countries: [],
			landings: [],
			campaigns: []
		},
		funnel: {
			land: 0,
			explore: 0,
			share: 0,
			office: 0
		},
		goals: [],
		durationBuckets: []
	};
	try {
		const [summary] = await sql`
    select
      (select count(*)::int from unique_ips) as total,
      (select count(*)::int from unique_ips where last_seen > ${since}) as recent,
      (select count(*)::int from behavior_events where kind = 'page' and created_at > ${since}) as views,
      (select count(*)::int from click_events where created_at > ${since}) as clicks,
      (select count(*)::int from sessions where started_at > ${since}) as sessions,
      (select count(*)::int from sessions where started_at > ${since} and pageviews <= 1 and events = 0) as bounced,
      (select coalesce(avg(extract(epoch from (last_seen - started_at))), 0) from sessions where started_at > ${since}) as avg_seconds,
      (select count(*)::int from unique_visitors where last_seen > ${since} and visit_count = 1) as new_users,
      (select count(*)::int from unique_visitors where last_seen > ${since} and visit_count > 1) as returning
  `;
		const countries = await sql`
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
  `;
		const clickLeaders = await sql`
    select target, count(*)::int as count
    from click_events
    where created_at > ${since}
    group by target
    order by count desc
    limit 30
  `;
		const recentClicks = await sql`
    select target, country_code, created_at
    from click_events
    where created_at > ${since}
    order by created_at desc
    limit 25
  `;
		const pages = await sql`
    select name, count(*)::int as count
    from behavior_events
    where kind = 'page' and created_at > ${since}
    group by name
    order by count desc
  `;
		const devices = await sql`
    select coalesce(device, 'desktop') as name, count(*)::int as count
    from sessions
    where started_at > ${since}
    group by coalesce(device, 'desktop')
    order by count desc
  `;
		const sources = await sql`
    select coalesce(source, 'direct') as name, count(*)::int as count
    from sessions
    where started_at > ${since}
    group by coalesce(source, 'direct')
    order by count desc
  `;
		const googleProducts = await sql`
    select coalesce(google_product, 'search') as name, count(*)::int as count
    from sessions
    where started_at > ${since} and source = 'google'
    group by coalesce(google_product, 'search')
    order by count desc
  `;
		const googleHosts = await sql`
    select coalesce(referrer_host, 'google.com') as name, count(*)::int as count
    from sessions
    where started_at > ${since} and source = 'google'
    group by coalesce(referrer_host, 'google.com')
    order by count desc
    limit 12
  `;
		const googleCountries = await sql`
    select coalesce(country_code, 'ZZ') as name, count(*)::int as count
    from sessions
    where started_at > ${since} and source = 'google' and country_code is not null
    group by country_code
    order by count desc
    limit 16
  `;
		const googleLandings = await sql`
    select coalesce(landing, '/') as name, count(*)::int as count
    from sessions
    where started_at > ${since} and source = 'google'
    group by coalesce(landing, '/')
    order by count desc
    limit 8
  `;
		const googleCampaigns = await sql`
    select campaign as name, count(*)::int as count
    from sessions
    where started_at > ${since} and source = 'google' and campaign is not null
    group by campaign
    order by count desc
    limit 8
  `;
		const [googleCount] = await sql`
    select count(*)::int as n from sessions where started_at > ${since} and source = 'google'
  `;
		const hourlyRows = range === "day" ? await sql`
          select date_trunc('hour', created_at) as hour, count(*)::int as count
          from behavior_events
          where created_at > ${since}
          group by 1
          order by 1
        ` : await sql`
          select date_trunc('day', created_at) as hour, count(*)::int as count
          from behavior_events
          where created_at > ${since}
          group by 1
          order by 1
        `;
		const hourlyDualRows = range === "day" ? await sql`
          select
            date_trunc('hour', created_at) as hour,
            count(*) filter (where kind = 'page')::int as visits,
            count(*) filter (where kind = 'event')::int as clicks
          from behavior_events
          where created_at > ${since}
          group by 1
          order by 1
        ` : await sql`
          select
            date_trunc('day', created_at) as hour,
            count(*) filter (where kind = 'page')::int as visits,
            count(*) filter (where kind = 'event')::int as clicks
          from behavior_events
          where created_at > ${since}
          group by 1
          order by 1
        `;
		const ipLeaders = await sql`
    select
      i.ip_hash as id,
      i.ip_hint as hint,
      i.country_code as country,
      i.visit_count as visits,
      coalesce(c.clicks, 0)::int as clicks
    from unique_ips i
    left join (
      select ip_hash, count(*)::int as clicks from click_events
      where created_at > ${since} and ip_hash is not null
      group by ip_hash
    ) c on c.ip_hash = i.ip_hash
    where i.last_seen > ${since}
    order by i.visit_count desc, clicks desc
    limit 24
  `;
		const [funnel] = await sql`
    select
      (select count(distinct visitor_key)::int from behavior_events where kind = 'page' and name = '/' and created_at > ${since}) as land,
      (select count(distinct visitor_key)::int from behavior_events where (name like 'tab:%' or name like 'country:%') and created_at > ${since}) as explore,
      (select count(distinct visitor_key)::int from behavior_events where name like 'share:%' and created_at > ${since}) as share,
      (select count(distinct visitor_key)::int from behavior_events where name in ('nav:office', '/office') and created_at > ${since}) as office
  `;
		const [goalRow] = await sql`
    select
      (select count(*)::int from sessions where started_at > ${since} and source = 'google') as google_sess,
      (select count(*)::int from sessions s
        where s.started_at > ${since} and s.source = 'google'
          and exists (
            select 1 from behavior_events e
            where e.session_key = s.session_key and e.name like 'share:%' and e.created_at > ${since}
          )
      ) as google_share,
      (select count(*)::int from sessions where started_at > ${since} and extract(epoch from (last_seen - started_at)) >= 30) as duration,
      (select count(*)::int from sessions where started_at > ${since} and pageviews >= 2) as engaged
  `;
		const durationBuckets = await sql`
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
		return {
			total: summary?.total ?? 0,
			recent: summary?.recent ?? 0,
			views,
			clicks: summary?.clicks ?? 0,
			countries,
			clickLeaders,
			recentClicks: recentClicks.map((r) => ({
				target: r.target,
				country: r.country_code,
				at: isoHour(r.created_at)
			})),
			sessions: sessionCount,
			bounceRate: sessionCount ? Math.round(bounced / sessionCount * 100) : 0,
			pagesPerSession: sessionCount ? Math.round(pageviews / sessionCount * 10) / 10 : 0,
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
				campaigns: googleCampaigns
			},
			hourly: hourlyRows.map((r) => ({
				hour: isoHour(r.hour),
				count: r.count
			})),
			hourlyDual: fillSeries(range, hourlyDualRows.map((r) => ({
				hour: isoHour(r.hour),
				visits: r.visits,
				clicks: r.clicks
			}))),
			ipLeaders,
			funnel: {
				land: funnel?.land ?? 0,
				explore: funnel?.explore ?? 0,
				share: funnel?.share ?? 0,
				office: funnel?.office ?? 0
			},
			goals: [
				{
					id: "land",
					completions: funnel?.land ?? 0
				},
				{
					id: "explore",
					completions: funnel?.explore ?? 0
				},
				{
					id: "share",
					completions: funnel?.share ?? 0
				},
				{
					id: "office",
					completions: funnel?.office ?? 0
				},
				{
					id: "google",
					completions: goalRow?.google_sess ?? 0
				},
				{
					id: "googleShare",
					completions: goalRow?.google_share ?? 0
				},
				{
					id: "duration",
					completions: goalRow?.duration ?? 0
				},
				{
					id: "engaged",
					completions: goalRow?.engaged ?? 0
				}
			],
			durationBuckets
		};
	} catch {
		return empty;
	}
});
//#endregion
export { getOfficeStats_createServerFn_handler, getPublicTraffic_createServerFn_handler, getVisitStats_createServerFn_handler, recordBehavior_createServerFn_handler, recordClick_createServerFn_handler, recordRequestVisit_createServerFn_handler, recordUniqueVisit_createServerFn_handler };
