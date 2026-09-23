import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-primitive+[...].mjs";
import { a as string, i as object, n as literal, o as union, r as number } from "../_libs/zod.mjs";
import { a as UC_SETTINGS_ID, i as LOCALE_META, r as LOCALES, t as GA_ID } from "./ga-0gxl-ST5.mjs";
import { i as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rolldown-runtime-D7D4PA-g.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-D9oKIoCN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var COMMON_TAGS = [
	"Fauda",
	"Fauda 5",
	"Netflix",
	"FlixPatrol"
];
var SEO_BY_LOCALE = {
	he: {
		title: "פאודה 5 מול נז״א · מפת צפייה, שיח ופסטיבל",
		description: "אותה מתודולוגיה, שתי יצירות: פאודה 5 בנטפליקס מול הסרט התיעודי נז״א (נזק אגבי) מוונציה. דירוגים, טון שיח ורשתות לפי מדינה.",
		shareText: "פאודה 5 מול נז״א: אותה מפת מדינות, שלוש עדשות. צפייה, שיח, רשתות:",
		keywords: "פאודה, פאודה 5, Fauda, נטפליקס, Netflix, FlixPatrol, לבנון, ישראל",
		locale: "he_IL",
		tags: [
			"פאודה",
			"פאודה 5",
			"נטפליקס",
			"לבנון",
			"ישראל",
			...COMMON_TAGS
		],
		hashtags: [
			"#פאודה",
			"#פאודה5",
			"#Fauda",
			"#Fauda5",
			"#נטפליקס"
		],
		twitterHashtags: "Fauda,Fauda5,Netflix"
	},
	en: {
		title: "Fauda 5 vs NAZA · viewing, talk, festival",
		description: "Same method, two works: Fauda season 5 on Netflix versus the Venice documentary NAZA (collateral damage). Country map of ranks, discourse tone, and social posts.",
		shareText: "Fauda 5 vs NAZA: one country sample, three lenses. Viewing, talk, social:",
		keywords: "Fauda, Fauda 5, Netflix, FlixPatrol, rankings, Lebanon, Israel",
		locale: "en_US",
		tags: [
			"Fauda",
			"Fauda 5",
			"Netflix",
			"Lebanon",
			"Israel",
			...COMMON_TAGS
		],
		hashtags: [
			"#Fauda",
			"#Fauda5",
			"#Netflix",
			"#Lebanon"
		],
		twitterHashtags: "Fauda,Fauda5,Netflix"
	},
	ar: {
		title: "فودا 5 · خريطة المشاهدة والخطاب والشبكات",
		description: "ملخص وخريطة دول وتحليل مشاعر على الشبكات للموسم الخامس من فودا: تصنيفات نتفليكس، الخطاب حسب الدولة، ومنشورات فيسبوك وإكس.",
		shareText: "فودا 5: ضمن العشرة الأوائل في عشرات الدول، الأول في لبنان. خريطة المشاهدة والخطاب:",
		keywords: "فودا, فودا 5, نتفليكس, FlixPatrol, لبنان, إسرائيل",
		locale: "ar_AR",
		tags: [
			"فودا",
			"نتفليكس",
			"لبنان",
			"إسرائيل",
			...COMMON_TAGS
		],
		hashtags: [
			"#فودا",
			"#Fauda5",
			"#نتفليكس"
		],
		twitterHashtags: "Fauda,Fauda5,Netflix"
	},
	fr: {
		title: "Fauda 5 · Carte des audiences, du débat et des réseaux",
		description: "Résumé, carte des pays et sentiments sur les réseaux pour la saison 5 de Fauda : classements Netflix, débat par pays, posts Facebook et X.",
		shareText: "Fauda 5 : top 10 dans des dizaines de pays, n°1 au Liban. Carte des audiences et du débat :",
		keywords: "Fauda, Fauda 5, Netflix, FlixPatrol, Liban, Israël",
		locale: "fr_FR",
		tags: [
			"Fauda",
			"Netflix",
			"Liban",
			"Israël",
			...COMMON_TAGS
		],
		hashtags: [
			"#Fauda",
			"#Fauda5",
			"#Netflix",
			"#Liban"
		],
		twitterHashtags: "Fauda,Fauda5,Netflix"
	},
	es: {
		title: "Fauda 5 · Mapa de audiencia, debate y redes",
		description: "Resumen, mapa de países y sentimiento en redes de Fauda temporada 5: rankings de Netflix, debate por país y publicaciones de Facebook y X.",
		shareText: "Fauda 5: top 10 en decenas de países, n.º 1 en Líbano. Mapa de audiencia y debate:",
		keywords: "Fauda, Fauda 5, Netflix, FlixPatrol, Líbano, Israel",
		locale: "es_ES",
		tags: [
			"Fauda",
			"Netflix",
			"Líbano",
			"Israel",
			...COMMON_TAGS
		],
		hashtags: [
			"#Fauda",
			"#Fauda5",
			"#Netflix",
			"#Líbano"
		],
		twitterHashtags: "Fauda,Fauda5,Netflix"
	},
	ru: {
		title: "Фауда 5 · Карта просмотров, дискуссии и соцсетей",
		description: "Краткое содержание, карта стран и настроения в соцсетях по 5 сезону «Фауда»: рейтинги Netflix, дискуссия по странам, посты Facebook и X.",
		shareText: "Фауда 5: топ-10 в десятках стран, 1 место в Ливане. Карта просмотров и дискуссии:",
		keywords: "Фауда, Фауда 5, Netflix, FlixPatrol, Ливан, Израиль",
		locale: "ru_RU",
		tags: [
			"Фауда",
			"Netflix",
			"Ливан",
			"Израиль",
			...COMMON_TAGS
		],
		hashtags: [
			"#Фауда",
			"#Fauda5",
			"#Netflix"
		],
		twitterHashtags: "Fauda,Fauda5,Netflix"
	}
};
var SEO = {
	...SEO_BY_LOCALE.he,
	published: "2026-09-14",
	image: "/og.jpg"
};
function parseShareLang(raw) {
	const v = typeof raw === "string" ? raw : "";
	return LOCALES.includes(v) ? v : "he";
}
function seoFor(lang) {
	return SEO_BY_LOCALE[parseShareLang(lang)];
}
var FACEBOOK_SHARE_URL = "https://faudaint.grok.me/";
function sharePageUrl(lang = "he") {
	return lang === "he" ? FACEBOOK_SHARE_URL : `${FACEBOOK_SHARE_URL}?lang=${lang}`;
}
var SOURCE_HREF = {
	Ynet: "https://www.ynet.co.il/",
	"NYT / ידיעות": "https://www.nytimes.com/",
	"Jerusalem Post": "https://www.jpost.com/",
	Decider: "https://decider.com/",
	NDTV: "https://www.ndtv.com/",
	"Al-Araby Al-Jadeed": "https://www.alaraby.co.uk/",
	Walla: "https://news.walla.co.il/",
	"Télé-Loisirs": "https://www.programme-tv.net/",
	Telegraph: "https://www.telegraph.co.uk/",
	Wikipedia: "https://en.wikipedia.org/wiki/NAZA_(film)",
	Vulture: "https://www.vulture.com/article/review-naza-is-one-of-the-most-important-films-of-our-time.html",
	"Time Out": "https://www.timeout.com/movies/naza-review-2026",
	NYT: "https://www.nytimes.com/2026/09/14/world/middleeast/israel-naza-documentary-backlash.html",
	Reuters: "https://www.reuters.com/world/middle-east/israeli-whistleblowers-detail-gaza-civilian-toll-venice-film-2026-09-10/",
	"Vanity Fair Italia": "https://www.vanityfair.it/article/naza-vince-premio-speciale-giuria-venezia-israeliani-ucciso-bambini-governo-cerca-boicottare-film",
	X: "https://x.com/ariel_oseran/status/2099780089923670264",
	"+972": "https://www.972mag.com/naza-gaza-film-collateral-damage/"
};
var OUTLET_LINKS = [
	{
		label: "FlixPatrol",
		href: "https://flixpatrol.com/title/fauda/"
	},
	{
		label: "JustWatch",
		href: "https://www.justwatch.com/us/tv-show/fauda"
	},
	{
		label: "Netflix Top 10",
		href: "https://www.netflix.com/tudum/top10"
	},
	{
		label: "נטפליקס",
		href: "https://www.netflix.com/title/80149421"
	},
	{
		label: "Ynet",
		href: SOURCE_HREF.Ynet
	},
	{
		label: "Jerusalem Post",
		href: SOURCE_HREF["Jerusalem Post"]
	},
	{
		label: "NYT",
		href: SOURCE_HREF["NYT / ידיעות"]
	},
	{
		label: "Decider",
		href: SOURCE_HREF.Decider
	},
	{
		label: "NDTV",
		href: SOURCE_HREF.NDTV
	},
	{
		label: "אל־ערבי אל־ג׳דיד",
		href: SOURCE_HREF["Al-Araby Al-Jadeed"]
	}
];
function publicOrigin() {
	const raw = String(process.env.VITE_PUBLIC_HOSTNAME || "").split(",")[0].trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
	return raw && raw.includes(".") ? `https://${raw}` : "";
}
function articleJsonLd(pageUrl, lang = "he") {
	const seo = seoFor(lang);
	const origin = publicOrigin() || "https://faudaint.grok.me";
	const canonical = sharePageUrl(lang);
	const image = `${origin.replace(/\/$/, "")}/og.jpg`;
	return {
		"@context": "https://schema.org",
		"@type": "NewsArticle",
		headline: seo.title,
		description: seo.description,
		inLanguage: lang,
		datePublished: SEO.published,
		dateModified: SEO.published,
		image: [image],
		mainEntityOfPage: canonical,
		url: canonical,
		author: {
			"@type": "Organization",
			name: "מפת השיח"
		},
		publisher: {
			"@type": "Organization",
			name: "מפת השיח"
		},
		about: seo.tags,
		keywords: seo.tags.join(", ")
	};
}
var CONTENT_TABS = [
	"map",
	"social",
	"algo",
	"concl"
];
function isContentTab(v) {
	return v === "map" || v === "social" || v === "algo" || v === "concl";
}
function isWorkViewParam(v) {
	return v === "fauda" || v === "naza" || v === "compare";
}
var LIVE = "https://faudaint.grok.me";
var WORK_HOOK = {
	he: {
		compare: "פאודה 5 מול נז״א — אותה מתודולוגיה, שתי מכונות.",
		fauda: "פאודה 5: מפת הצפייה והשיח בנטפליקס.",
		naza: "נז״א (נזק אגבי): זוכה ונציה. שיח בלי שעות צפייה."
	},
	en: {
		compare: "Fauda 5 vs NAZA — same method, two machines.",
		fauda: "Fauda 5: Netflix viewing and the talk around it.",
		naza: "NAZA (collateral damage): Venice winner. Talk, not hours watched."
	},
	ar: {
		compare: "فودا 5 مقابل نازا — المنهج نفسه، آلتان.",
		fauda: "فودا 5: خريطة المشاهدة والخطاب على نتفليكس.",
		naza: "نازا (ضرر جانبي): جائزة البندقية. خطاب بلا ساعات مشاهدة."
	},
	fr: {
		compare: "Fauda 5 face à NAZA — même méthode, deux machines.",
		fauda: "Fauda 5 : audiences Netflix et le débat.",
		naza: "NAZA (dommages collatéraux) : prix à Venise. Le débat, pas les heures."
	},
	es: {
		compare: "Fauda 5 frente a NAZA — el mismo método, dos máquinas.",
		fauda: "Fauda 5: audiencia de Netflix y el debate.",
		naza: "NAZA (daño colateral): premio en Venecia. Debate, no horas vistas."
	},
	ru: {
		compare: "«Фауда 5» против NAZA — тот же метод, две машины.",
		fauda: "«Фауда 5»: просмотры Netflix и разговор вокруг сериала.",
		naza: "NAZA («сопутствующий ущерб»): приз Венеции. Разговор, не часы просмотра."
	}
};
var TAB_HOOK = {
	he: {
		map: "דירוג וטון לפי מדינה.",
		social: "מה אומרים בפיד — פוסטים, טון, מעורבות.",
		algo: "למה #1 אינו #1: נטפליקס מול אלגוריתם הסערה.",
		concl: "מסקנות השיח: הזדהות מול סערה, ולבנון שהאלגוריתם לא מחרים."
	},
	en: {
		map: "Rank and tone, country by country.",
		social: "What the feed says — posts, tone, engagement.",
		algo: "Why #1 is not #1: Netflix versus the storm algorithm.",
		concl: "Findings: identification versus a storm — and Lebanon, where the algorithm does not boycott."
	},
	ar: {
		map: "التصنيف والنبرة حسب البلد.",
		social: "ماذا يقول الشريط: منشورات ونبرة وتفاعل.",
		algo: "لماذا المركز 1 ليس المركز 1: نتفليكس مقابل خوارزمية العاصفة.",
		concl: "الخلاصات: تماهي مقابل عاصفة — ولبنان حيث الخوارزمية لا تقاطع."
	},
	fr: {
		map: "Classement et ton, pays par pays.",
		social: "Ce que dit le fil — posts, ton, engagement.",
		algo: "Pourquoi le n°1 n’est pas le n°1 : Netflix face à l’algorithme de la tempête.",
		concl: "Conclusions : identification contre tempête — et le Liban, où l’algorithme ne boycotte pas."
	},
	es: {
		map: "Puesto y tono, país por país.",
		social: "Lo que dice el feed: publicaciones, tono, engagement.",
		algo: "Por qué el n.º 1 no es el n.º 1: Netflix frente al algoritmo de la tormenta.",
		concl: "Conclusiones: identificación frente a tormenta — y Líbano, donde el algoritmo no boicotea."
	},
	ru: {
		map: "Рейтинг и тон по странам.",
		social: "Что говорит лента — посты, тон, вовлечённость.",
		algo: "Почему 1-е место — не 1-е: Netflix против алгоритма бури.",
		concl: "Выводы: отождествление против бури — и Ливан, где алгоритм не бойкотирует."
	}
};
var LI_TAIL = {
	he: "מפת מדינות, טון שיח ופיד ציבורי. לא סקר. לא פסק דין.",
	en: "A country map, discourse tone, and a public feed. Not a poll. Not a verdict.",
	ar: "خريطة دول ونبرة خطاب وشريط عام. ليس استطلاعاً. ليس حكماً.",
	fr: "Carte des pays, ton du débat, fil public. Pas un sondage. Pas un verdict.",
	es: "Mapa de países, tono del debate y un feed público. No es una encuesta. No es un veredicto.",
	ru: "Карта стран, тон дискуссии и открытая лента. Не опрос. Не приговор."
};
function hashtags(locale, work) {
	const seo = seoFor(locale);
	if (work === "naza") {
		if (locale === "he") return "#נזא #NAZA #ונציה #Fauda5";
		return "#NAZA #Venice #Fauda5";
	}
	if (work === "fauda") return seo.hashtags.join(" ");
	if (locale === "he") return "#פאודה5 #נזא #Fauda5 #NAZA";
	return "#Fauda5 #NAZA #Netflix #Venice";
}
function shareCore(locale, work, tab) {
	return `${WORK_HOOK[locale][work]} ${TAB_HOOK[locale][tab]}`.trim();
}
function shareText(locale, work, tab, network) {
	const core = shareCore(locale, work, tab);
	const tags = hashtags(locale, work);
	if (network === "x") {
		const short = `${core} ${tags}`;
		return short.length > 240 ? `${core.slice(0, 180).trim()}… ${tags}` : short;
	}
	if (network === "linkedin") return `${core} ${LI_TAIL[locale]}`;
	if (network === "facebook") return core;
	if (network === "mail") return `${core}\n\n${tags}`;
	return `${core}\n${tags}`;
}
function shareMailSubject(locale, work, tab) {
	return shareCore(locale, work, tab);
}
function shareOrigin() {
	return (publicOrigin() || LIVE).replace(/\/$/, "");
}
function deepShareUrl(lang = "he", opts) {
	const u = new URL(`${shareOrigin()}/`);
	if (lang !== "he") u.searchParams.set("lang", lang);
	const work = opts?.work ?? "compare";
	u.searchParams.set("work", work);
	const tab = opts?.tab ?? "map";
	if (tab !== "map") u.searchParams.set("tab", tab);
	return u.toString();
}
function shareCopyBlock(lang, work, tab) {
	return `${deepShareUrl(lang, {
		work,
		tab
	})}\n${shareText(lang, work, tab, "whatsapp")}`;
}
function shareHref(id, url, locale, work, tab) {
	const text = shareText(locale, work, tab, id);
	switch (id) {
		case "whatsapp": return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
		case "facebook": return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
		case "x": return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
		case "telegram": return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
		case "linkedin": return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
		case "mail": return `mailto:?subject=${encodeURIComponent(shareMailSubject(locale, work, tab))}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
		default: return url;
	}
}
var SHARE_COLLAGE = "/share-collage.jpg";
var styles_default = "/assets/styles-B-_dY2ha.css";
var origin = publicOrigin() || "https://faudaint.grok.me";
var Route$3 = createRootRoute({
	validateSearch: (raw) => {
		const out = {};
		if (typeof raw.lang === "string" && LOCALES.includes(raw.lang)) out.lang = raw.lang;
		if (typeof raw.work === "string" && isWorkViewParam(raw.work)) out.work = raw.work;
		if (typeof raw.tab === "string" && isContentTab(raw.tab)) out.tab = raw.tab;
		return out;
	},
	head: ({ match }) => {
		const lang = parseShareLang(match.search.lang);
		const seo = seoFor(lang);
		const page = sharePageUrl(lang);
		const imageAbs = `${origin.replace(/\/$/, "")}/og.jpg`;
		return {
			meta: [
				{ charSet: "utf-8" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1"
				},
				{ title: seo.title },
				{
					name: "description",
					content: seo.description
				},
				{
					name: "keywords",
					content: seo.keywords
				},
				{
					name: "author",
					content: "מפת השיח"
				},
				{
					name: "robots",
					content: "index, follow, max-image-preview:large"
				},
				{
					name: "theme-color",
					content: "#0c0d0e"
				},
				{
					httpEquiv: "Cache-Control",
					content: "no-store"
				},
				{
					property: "og:locale",
					content: seo.locale
				},
				{
					property: "og:type",
					content: "article"
				},
				{
					property: "og:url",
					content: page
				},
				{
					property: "og:site_name",
					content: seo.title
				},
				{
					property: "og:title",
					content: seo.title
				},
				{
					property: "og:description",
					content: seo.description
				},
				{
					property: "og:image",
					content: imageAbs
				},
				{
					property: "og:image:width",
					content: "1200"
				},
				{
					property: "og:image:height",
					content: "630"
				},
				{
					property: "og:image:alt",
					content: seo.title
				},
				{
					property: "og:image:type",
					content: "image/jpeg"
				},
				{
					property: "article:published_time",
					content: "2026-09-14"
				},
				{
					property: "article:section",
					content: "TV"
				},
				...seo.tags.map((tag) => ({
					property: "article:tag",
					content: tag
				})),
				{
					name: "twitter:card",
					content: "summary_large_image"
				},
				{
					name: "twitter:title",
					content: seo.title
				},
				{
					name: "twitter:description",
					content: seo.description
				},
				{
					name: "twitter:image",
					content: imageAbs
				},
				{
					name: "twitter:image:alt",
					content: seo.title
				}
			],
			links: [
				{
					rel: "icon",
					type: "image/png",
					sizes: "32x32",
					href: "/icon-32.png"
				},
				{
					rel: "icon",
					type: "image/png",
					sizes: "192x192",
					href: "/icon-192.png"
				},
				{
					rel: "icon",
					type: "image/png",
					sizes: "512x512",
					href: "/icon-512.png"
				},
				{
					rel: "icon",
					type: "image/svg+xml",
					href: "/favicon.svg"
				},
				{
					rel: "stylesheet",
					href: styles_default
				},
				{
					rel: "manifest",
					href: "/__grok/manifest.webmanifest"
				},
				{
					rel: "apple-touch-icon",
					sizes: "180x180",
					href: "/icon-180.png"
				},
				{
					rel: "apple-touch-icon",
					href: "/__grok/icon-180.png"
				},
				{
					rel: "canonical",
					href: page
				},
				{
					rel: "image_src",
					href: imageAbs
				}
			],
			scripts: [
				{ children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});` },
				{
					id: "usercentrics-cmp",
					async: true,
					src: "https://app.usercentrics.eu/browser-ui/latest/loader.js",
					"data-settings-id": UC_SETTINGS_ID
				},
				{
					async: true,
					src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
				},
				{ children: `gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});` }
			]
		};
	},
	component: RootShell
});
function RootShell() {
	const lang = parseShareLang(Route$3.useSearch().lang);
	const dir = LOCALE_META[lang].dir;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang,
		dir,
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$2 = () => import("./routes-BJZ8-tL-.mjs");
var Route$2 = createFileRoute("/")({
	beforeLoad: async () => {
		try {
			const { recordRequestVisit } = await import("./visits-5ua7sqp9.mjs").then((n) => n.s).then((n) => n.o);
			await recordRequestVisit();
		} catch {}
		return {};
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: ({ match }) => {
		const lang = parseShareLang(match.search.lang);
		const seo = seoFor(lang);
		return {
			meta: [{ title: seo.title }, {
				name: "description",
				content: seo.description
			}],
			scripts: [{
				type: "application/ld+json",
				children: JSON.stringify(articleJsonLd("/", lang))
			}]
		};
	}
});
var $$splitComponentImporter$1 = () => import("./accessibility-CY5UNMfl.mjs");
var Route$1 = createFileRoute("/accessibility")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./office-DFGwbq3j.mjs");
var Route = createFileRoute("/office")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$2.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	AccessibilityRoute: Route$1.update({
		id: "/accessibility",
		path: "/accessibility",
		getParentRoute: () => Route$3
	}),
	OfficeRoute: Route.update({
		id: "/office",
		path: "/office",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { isContentTab as a, shareHref as c, SOURCE_HREF as d, seoFor as f, deepShareUrl as i, shareText as l, CONTENT_TABS as n, shareCopyBlock as o, __exportAll as p, SHARE_COLLAGE as r, shareCore as s, router_exports as t, OUTLET_LINKS as u };
