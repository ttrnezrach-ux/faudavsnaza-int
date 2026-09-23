import { t as createServerFn } from "./ssr.mjs";
import { i as recomputeGlobal, r as changes_default, t as LIVE } from "./changes-BqFL2XkB.mjs";
import { i as object, t as _enum } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { t as getSql } from "./db-pb99grkE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ingest-Bu2JqvVc.js
/** FlixPatrol URL slug → ISO 3166-1 alpha-2 used in live.json. */
var SLUG_ISO = {
	israel: "IL",
	lebanon: "LB",
	jordan: "JO",
	"united-arab-emirates": "AE",
	uae: "AE",
	bahrain: "BH",
	qatar: "QA",
	oman: "OM",
	kuwait: "KW",
	egypt: "EG",
	morocco: "MA",
	"saudi-arabia": "SA",
	turkey: "TR",
	france: "FR",
	germany: "DE",
	netherlands: "NL",
	italy: "IT",
	greece: "GR",
	cyprus: "CY",
	romania: "RO",
	czechia: "CZ",
	"czech-republic": "CZ",
	slovakia: "SK",
	hungary: "HU",
	serbia: "RS",
	croatia: "HR",
	bulgaria: "BG",
	poland: "PL",
	belgium: "BE",
	finland: "FI",
	austria: "AT",
	luxembourg: "LU",
	switzerland: "CH",
	sweden: "SE",
	norway: "NO",
	denmark: "DK",
	spain: "ES",
	portugal: "PT",
	slovenia: "SI",
	lithuania: "LT",
	ireland: "IE",
	"united-kingdom": "GB",
	uk: "GB",
	"great-britain": "GB",
	india: "IN",
	"sri-lanka": "LK",
	pakistan: "PK",
	bangladesh: "BD",
	kenya: "KE",
	nigeria: "NG",
	argentina: "AR",
	brazil: "BR",
	chile: "CL",
	panama: "PA",
	"united-states": "US",
	usa: "US",
	libya: "LY",
	palestine: "PS",
	canada: "CA",
	australia: "AU",
	"new-zealand": "NZ",
	mexico: "MX",
	colombia: "CO",
	peru: "PE",
	japan: "JP",
	"south-korea": "KR",
	korea: "KR",
	philippines: "PH",
	thailand: "TH",
	indonesia: "ID",
	malaysia: "MY",
	tunisia: "TN",
	algeria: "DZ",
	iraq: "IQ",
	syria: "SY",
	iran: "IR",
	"south-africa": "ZA",
	ukraine: "UA",
	"costa-rica": "CR",
	uruguay: "UY",
	venezuela: "VE",
	"el-salvador": "SV",
	estonia: "EE",
	latvia: "LV",
	iceland: "IS",
	malta: "MT"
};
var FAUDA_URL = "https://flixpatrol.com/title/fauda/";
function parseRankToken(raw) {
	const t = raw.replace(/[–—−]/g, "-").trim();
	if (!t || t === "-" || t === "–") return null;
	const n = Number.parseInt(t, 10);
	return n >= 1 && n <= 10 ? n : null;
}
/** Last numeric rank (1–10) in a country row; dashes ignored. */
function parseFlixpatrolHtml(html) {
	const out = {};
	const rowRe = /\/top10\/netflix\/([a-z-]+)\/[^<]{0,400}/gi;
	let m;
	while (m = rowRe.exec(html)) {
		const iso = SLUG_ISO[m[1]];
		if (!iso) continue;
		const last = [...[...m[0].matchAll(/>\s*([0-9]{1,2}|[-–—])\s*</g)].map((x) => parseRankToken(x[1]))].reverse().find((n) => n != null) ?? null;
		if (last != null) out[iso] = last;
	}
	return out;
}
async function fetchFaudaRanks() {
	try {
		const res = await fetch(FAUDA_URL, { headers: {
			accept: "text/html,application/xhtml+xml",
			"user-agent": "FaudaNazaMap/1.0 (public rank ingest; +https://faudaint.grok.me)"
		} });
		if (!res.ok) return {
			latestByCountry: {},
			globalLatest: null,
			blocked: true,
			source: FAUDA_URL
		};
		const html = await res.text();
		if (html.includes("Just a moment") || html.length < 2e3) return {
			latestByCountry: {},
			globalLatest: null,
			blocked: true,
			source: FAUDA_URL
		};
		const latestByCountry = parseFlixpatrolHtml(html);
		const worldwide = html.match(/worldwide[^0-9]{0,40}([1-9]|10)/i);
		return {
			latestByCountry,
			globalLatest: worldwide ? Number.parseInt(worldwide[1], 10) : null,
			blocked: false,
			source: FAUDA_URL
		};
	} catch {
		return {
			latestByCountry: {},
			globalLatest: null,
			blocked: true,
			source: FAUDA_URL
		};
	}
}
var BUNDLED_CHANGES = changes_default;
var TZ = "Asia/Jerusalem";
function jerusalemNow(d = /* @__PURE__ */ new Date()) {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: TZ,
		day: "numeric",
		month: "numeric",
		hour: "2-digit",
		hour12: false,
		year: "numeric",
		minute: "2-digit",
		second: "2-digit"
	}).formatToParts(d);
	const get = (type) => parts.find((p) => p.type === type)?.value ?? "";
	const day = Number(get("day"));
	const month = Number(get("month"));
	const hour = Number(get("hour"));
	const iso = `${get("year")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${get("hour")}:${get("minute")}:${get("second")}+03:00`;
	return {
		dayLabel: `${day}.${month}`,
		hour,
		iso
	};
}
function slotForHour(hour) {
	if (hour < 12) return "morning";
	if (hour >= 18) return "evening";
	return "manual";
}
function lastColumn(ranks) {
	if (!ranks?.length) return null;
	return ranks[ranks.length - 1] ?? null;
}
function diffLatest(prev, nextLatest) {
	const ids = /* @__PURE__ */ new Set([...Object.keys(prev), ...Object.keys(nextLatest)]);
	const deltas = [];
	for (const id of ids) {
		const from = lastColumn(prev[id]);
		const to = nextLatest[id] ?? null;
		if (from === to) continue;
		let kind = "jump";
		if (from == null && to != null) kind = "enter";
		else if (from != null && to == null) kind = "leave";
		else if (to === 1 && from !== 1) kind = "first";
		else if (from != null && to != null && Math.abs(from - to) < 2) continue;
		deltas.push({
			work: "fauda",
			id,
			from,
			to,
			kind
		});
	}
	return deltas;
}
function isSignificant(deltas, globalFrom, globalTo) {
	if (globalTo != null && globalTo !== globalFrom) return true;
	return deltas.some((d) => d.kind === "enter" || d.kind === "leave" || d.kind === "first" || d.kind === "discourse" || d.kind === "jump");
}
function mergeFaudaDay(base, dayLabel, latest, fetchedAt) {
	const replace = base.days[base.days.length - 1] === dayLabel;
	const days = replace ? [...base.days] : [...base.days, dayLabel].slice(-7);
	const width = days.length;
	const ranks = {};
	const ids = /* @__PURE__ */ new Set([...Object.keys(base.ranks), ...Object.keys(latest)]);
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
	if (latest && Object.keys(latest).length === 0) return {
		...base,
		fetchedAt
	};
	const snapshot = `${days[0]}–${days[days.length - 1]}`;
	return {
		...base,
		fetchedAt,
		days,
		ranks,
		global,
		snapshot
	};
}
function padSeries(series, width) {
	if (series.length === width) return series;
	if (series.length > width) return series.slice(-width);
	return [...Array(width - series.length).fill(null), ...series];
}
function notesFromDeltas(deltas, blocked, wikiChanged) {
	if (blocked && deltas.length === 0 && !wikiChanged) return {
		he: "לא הצלחנו לשאוב מ־FlixPatrol (הדף חסום מהשרת). השיח של נז״א לא השתנה. הריצה הבאה באוטומציה.",
		en: "FlixPatrol was blocked from the server. NAZA talk unchanged. Next pull is the scheduled automation."
	};
	if (deltas.length === 0 && !wikiChanged) return {
		he: "אין שינוי משמעותי בצפייה או בשיח.",
		en: "No significant change in viewing or talk."
	};
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
		en: `Significant change: ${partsEn.join(" · ")}`
	};
}
async function fetchNazaWiki() {
	try {
		const res = await fetch("https://en.wikipedia.org/w/api.php?action=query&titles=NAZA_(film)&prop=revisions|extracts&rvprop=timestamp&exintro=1&explaintext=1&format=json", { headers: { "user-agent": "FaudaNazaMap/1.0 (discourse ingest)" } });
		if (!res.ok) return {
			timestamp: null,
			extract: ""
		};
		const json = await res.json();
		const page = Object.values(json.query?.pages ?? {})[0];
		return {
			timestamp: page?.revisions?.[0]?.timestamp ?? null,
			extract: page?.extract ?? ""
		};
	} catch {
		return {
			timestamp: null,
			extract: ""
		};
	}
}
function mapRun(row) {
	const deltas = typeof row.deltas === "string" ? JSON.parse(row.deltas) : row.deltas;
	const fauda = row.fauda ? typeof row.fauda === "string" ? JSON.parse(row.fauda) : row.fauda : null;
	return {
		id: Number(row.id),
		lastRunAt: row.ran_at instanceof Date ? row.ran_at.toISOString() : String(row.ran_at ?? ""),
		slot: row.slot ?? "manual",
		significant: Boolean(row.significant),
		noteHe: String(row.note_he ?? ""),
		noteEn: String(row.note_en ?? ""),
		wikiAt: row.wiki_at ? String(row.wiki_at) : null,
		deltas: Array.isArray(deltas) ? deltas : [],
		timezone: TZ,
		morning: "08:00",
		evening: "21:00",
		source: String(row.source ?? ""),
		fauda
	};
}
var getLatestLiveRun_createServerFn_handler = createServerRpc({
	id: "413702012a4684922e72665b95cb8f3dc6a549e9e0988c68a34428562d060691",
	name: "getLatestLiveRun",
	filename: "src/lib/ingest.ts"
}, (opts) => getLatestLiveRun.__executeServer(opts));
var getLatestLiveRun = createServerFn({ method: "GET" }).handler(getLatestLiveRun_createServerFn_handler, async () => {
	const rows = await (await getSql()).query("select * from live_runs order by ran_at desc limit 1");
	return rows[0] ? mapRun(rows[0]) : null;
});
var listLiveRuns_createServerFn_handler = createServerRpc({
	id: "c439fee5beda7a0c4ba45cb99d83a0543879a87a5b0d3646b68ab920190fcfda",
	name: "listLiveRuns",
	filename: "src/lib/ingest.ts"
}, (opts) => listLiveRuns.__executeServer(opts));
var listLiveRuns = createServerFn({ method: "GET" }).handler(listLiveRuns_createServerFn_handler, async () => {
	return (await (await getSql()).query("select * from live_runs order by ran_at desc limit 12")).map(mapRun);
});
var ingestInput = object({ slot: _enum([
	"morning",
	"evening",
	"manual"
]).optional() });
var runLiveIngest_createServerFn_handler = createServerRpc({
	id: "42049040f4361b4245cd4607456283f9774592a24b054025ee436acaeebf9c62",
	name: "runLiveIngest",
	filename: "src/lib/ingest.ts"
}, (opts) => runLiveIngest.__executeServer(opts));
var runLiveIngest = createServerFn({ method: "POST" }).validator(ingestInput).handler(runLiveIngest_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const clock = jerusalemNow();
	const slot = data.slot ?? slotForHour(clock.hour);
	if (((await sql.query("select count(*)::int as n from live_runs where ran_at > now() - interval '20 minutes'"))[0]?.n ?? 0) > 0) {
		const last = await sql.query("select * from live_runs order by ran_at desc limit 1");
		if (last[0]) return mapRun(last[0]);
	}
	const prevRun = await sql.query("select * from live_runs order by ran_at desc limit 1");
	const prev = prevRun[0] ? mapRun(prevRun[0]) : null;
	const prevFauda = prev?.fauda ?? LIVE;
	const prevWiki = prev?.wikiAt ?? BUNDLED_CHANGES.wikiAt;
	const [faudaFetch, wiki] = await Promise.all([fetchFaudaRanks(), fetchNazaWiki()]);
	const deltas = faudaFetch.blocked ? [] : diffLatest(prevFauda.ranks, faudaFetch.latestByCountry);
	const wikiChanged = Boolean(wiki.timestamp && wiki.timestamp !== prevWiki);
	if (wikiChanged) deltas.push({
		work: "naza",
		id: "IT",
		from: null,
		to: null,
		kind: "discourse"
	});
	const nextFauda = faudaFetch.blocked ? {
		...prevFauda,
		fetchedAt: clock.iso
	} : mergeFaudaDay(prevFauda, clock.dayLabel, faudaFetch.latestByCountry, clock.iso);
	const significant = isSignificant(deltas, prevFauda.global.latest, nextFauda.global.latest) || wikiChanged;
	const notes = notesFromDeltas(deltas, faudaFetch.blocked, wikiChanged);
	return mapRun((await sql.query(`insert into live_runs (slot, significant, note_he, note_en, source, wiki_at, fauda, naza, deltas)
       values ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9::jsonb)
       returning *`, [
		slot,
		significant,
		notes.he,
		notes.en,
		faudaFetch.blocked ? `${faudaFetch.source} (blocked)` : faudaFetch.source,
		wiki.timestamp,
		JSON.stringify(nextFauda),
		JSON.stringify({
			wikiAt: wiki.timestamp,
			extract: wiki.extract.slice(0, 400)
		}),
		JSON.stringify(deltas)
	]))[0]);
});
//#endregion
export { getLatestLiveRun_createServerFn_handler, listLiveRuns_createServerFn_handler, runLiveIngest_createServerFn_handler };
