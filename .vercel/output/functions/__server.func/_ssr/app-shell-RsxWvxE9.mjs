import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-primitive+[...].mjs";
import { t as createServerFn } from "./ssr.mjs";
import { n as applyLiveRanks, r as changes_default, t as LIVE } from "./changes-BqFL2XkB.mjs";
import { i as object, t as _enum } from "../_libs/zod.mjs";
import { a as recordClick, i as recordBehavior, o as recordUniqueVisit, r as getVisitStats, t as createSsrRpc } from "./visits-5ua7sqp9.mjs";
import { c as useI18n, i as LOCALE_META, n as I18nProvider, o as gaFromClick, r as LOCALES, s as sendGaEvent } from "./ga-0gxl-ST5.mjs";
import { A as Accessibility, E as ChevronDown, T as Contrast, d as Pause, j as ALargeSmall, r as Type, t as X, v as Link2 } from "../_libs/lucide-react.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-RsxWvxE9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var STORAGE_KEY$1 = "fauda-a11y";
var DEFAULT = {
	scale: 100,
	contrast: false,
	links: false,
	readable: false,
	pause: false
};
function loadPrefs() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY$1);
		if (!raw) return DEFAULT;
		const parsed = JSON.parse(raw);
		return {
			scale: parsed.scale === 125 || parsed.scale === 150 ? parsed.scale : 100,
			contrast: Boolean(parsed.contrast),
			links: Boolean(parsed.links),
			readable: Boolean(parsed.readable),
			pause: Boolean(parsed.pause)
		};
	} catch {
		return DEFAULT;
	}
}
function applyPrefs(prefs) {
	const root = document.documentElement;
	root.style.fontSize = `${prefs.scale}%`;
	root.classList.toggle("a11y-contrast", prefs.contrast);
	root.classList.toggle("a11y-links", prefs.links);
	root.classList.toggle("a11y-readable", prefs.readable);
	root.classList.toggle("a11y-pause", prefs.pause);
}
function A11yWidget() {
	const panelId = (0, import_react.useId)();
	const launcherRef = (0, import_react.useRef)(null);
	const panelRef = (0, import_react.useRef)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [prefs, setPrefs] = (0, import_react.useState)(DEFAULT);
	(0, import_react.useEffect)(() => {
		const next = loadPrefs();
		setPrefs(next);
		applyPrefs(next);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") {
				e.preventDefault();
				setOpen(false);
				launcherRef.current?.focus();
			}
		};
		document.addEventListener("keydown", onKey);
		(panelRef.current?.querySelector("button"))?.focus();
		return () => document.removeEventListener("keydown", onKey);
	}, [open]);
	function update(patch) {
		setPrefs((prev) => {
			const next = {
				...prev,
				...patch
			};
			localStorage.setItem(STORAGE_KEY$1, JSON.stringify(next));
			applyPrefs(next);
			return next;
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed right-3 bottom-24 z-50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			ref: launcherRef,
			type: "button",
			className: "flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
			"aria-expanded": open,
			"aria-controls": panelId,
			"aria-haspopup": "dialog",
			"aria-label": open ? "סגירת תפריט נגישות" : "פתיחת תפריט נגישות",
			onClick: () => setOpen((v) => {
				if (v) launcherRef.current?.focus();
				return !v;
			}),
			children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
				className: "size-5",
				"aria-hidden": "true"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accessibility, {
				className: "size-5",
				"aria-hidden": "true"
			})
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: panelRef,
			id: panelId,
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "התאמות נגישות",
			className: "absolute bottom-14 right-0 w-72 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-card p-4 shadow-[var(--shadow-border-hover)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm font-medium",
					children: "התאמות נגישות"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1 text-xs text-muted-foreground",
							children: "גודל טקסט"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1",
							role: "group",
							"aria-label": "גודל טקסט",
							children: [
								100,
								125,
								150
							].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => update({ scale: n }),
								"aria-pressed": prefs.scale === n,
								className: cn("h-11 flex-1 rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", prefs.scale === n ? "bg-foreground text-background" : "bg-muted text-foreground"),
								children: [n, "%"]
							}, n))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							pressed: prefs.contrast,
							onToggle: () => update({ contrast: !prefs.contrast }),
							icon: Contrast,
							label: "ניגודיות גבוהה"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							pressed: prefs.readable,
							onToggle: () => update({ readable: !prefs.readable }),
							icon: Type,
							label: "גופן קריא"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							pressed: prefs.links,
							onToggle: () => update({ links: !prefs.links }),
							icon: Link2,
							label: "הדגשת קישורים"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							pressed: prefs.pause,
							onToggle: () => update({ pause: !prefs.pause }),
							icon: Pause,
							label: "עצירת אנימציות"
						}) })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-muted text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
					onClick: () => update(DEFAULT),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ALargeSmall, {
						className: "size-4",
						"aria-hidden": "true"
					}), "איפוס הגדרות"]
				})
			]
		}) : null]
	});
}
function Toggle({ pressed, onToggle, icon: Icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-pressed": pressed,
		onClick: onToggle,
		className: cn("flex h-11 w-full items-center gap-2 rounded-md px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", pressed ? "bg-foreground text-background" : "bg-muted text-foreground"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "size-4",
			"aria-hidden": "true"
		}), label]
	});
}
var STORAGE_KEY = "fauda-visitor-key";
var SESSION_KEY = "fauda-session-key";
var SESSION_AT = "fauda-session-at";
var IDLE_MS = 18e5;
function getVisitorKey() {
	let key = localStorage.getItem(STORAGE_KEY);
	if (!key || !/^[a-zA-Z0-9-]{8,64}$/.test(key)) {
		key = crypto.randomUUID();
		localStorage.setItem(STORAGE_KEY, key);
	}
	return key;
}
function getSessionKey() {
	const now = Date.now();
	const at = Number(sessionStorage.getItem(SESSION_AT) || 0);
	let key = sessionStorage.getItem(SESSION_KEY);
	if (!key || !/^[a-zA-Z0-9-]{8,64}$/.test(key) || now - at > IDLE_MS) {
		key = crypto.randomUUID();
		sessionStorage.setItem(SESSION_KEY, key);
	}
	sessionStorage.setItem(SESSION_AT, String(now));
	return key;
}
function clientTimezone() {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
	} catch {
		return "";
	}
}
function clientDevice() {
	const w = window.innerWidth;
	if (w < 768) return "mobile";
	if (w < 1024) return "tablet";
	return "desktop";
}
function cleanToken(raw, max = 64) {
	if (!raw) return null;
	return raw.trim().slice(0, max).replace(/[^a-zA-Z0-9._-]/g, "") || null;
}
function googleProduct(host, page) {
	const params = page.searchParams;
	if (params.get("gclid") || params.get("gad_source") || /cpc|ppc|paid/i.test(params.get("utm_medium") ?? "")) return "ads";
	if (host.startsWith("news.") || host.includes("news.google")) return "news";
	if (host.startsWith("images.") || host.includes("images.google")) return "images";
	if (host.startsWith("maps.") || host.includes("maps.google")) return "maps";
	return "search";
}
function clientArrival() {
	const landing = clientPath();
	let campaign = null;
	try {
		const here = new URL(window.location.href);
		campaign = cleanToken(here.searchParams.get("utm_campaign") ?? here.searchParams.get("utm_term"));
		const ref = document.referrer;
		if (!ref) {
			const product = googleProduct("", here);
			const source = product === "ads" || here.searchParams.get("utm_source")?.includes("google") ? "google" : "direct";
			return {
				source,
				referrerHost: null,
				googleProduct: source === "google" ? product : null,
				landing,
				campaign
			};
		}
		const host = new URL(ref).hostname.toLowerCase().replace(/^www\./, "").slice(0, 80);
		if (host === window.location.hostname) return {
			source: "internal",
			referrerHost: host,
			googleProduct: null,
			landing,
			campaign
		};
		if (host === "google.com" || host.endsWith(".google.com") || host.includes("google.") || host === "google.co.il" || host.endsWith(".google.co.il")) return {
			source: "google",
			referrerHost: host,
			googleProduct: googleProduct(host, here),
			landing,
			campaign
		};
		return {
			source: "referral",
			referrerHost: host,
			googleProduct: null,
			landing,
			campaign
		};
	} catch {
		return {
			source: "direct",
			referrerHost: null,
			googleProduct: null,
			landing,
			campaign
		};
	}
}
function clientPath() {
	const p = window.location.pathname || "/";
	if (p === "/" || p === "/office" || p === "/accessibility") return p;
	return "/other";
}
function payload(kind, name, locale) {
	const arrival = clientArrival();
	return {
		visitorKey: getVisitorKey(),
		sessionKey: getSessionKey(),
		kind,
		name,
		device: clientDevice(),
		source: arrival.source,
		locale: locale ?? document.documentElement.lang ?? "he",
		timezone: clientTimezone(),
		referrerHost: arrival.referrerHost ?? void 0,
		landing: arrival.landing,
		googleProduct: arrival.googleProduct ?? void 0,
		campaign: arrival.campaign ?? void 0
	};
}
var uniqueVisitSent = false;
var visitStats = null;
var visitListeners = /* @__PURE__ */ new Set();
function publishVisitStats(stats) {
	visitStats = stats;
	for (const cb of visitListeners) cb(stats);
}
function onVisitStats(cb) {
	if (visitStats) cb(visitStats);
	visitListeners.add(cb);
	return () => {
		visitListeners.delete(cb);
	};
}
function trackClick(target) {
	if (!/^[a-z0-9:_/-]{1,64}$/.test(target)) return;
	const safe = target.replace(/\//g, "-");
	try {
		const data = payload("event", safe);
		recordClick({ data: {
			visitorKey: data.visitorKey,
			target: safe,
			timezone: data.timezone
		} }).catch(() => {});
		recordBehavior({ data }).catch(() => {});
		gaFromClick(safe);
	} catch {}
}
function trackPage(path, locale) {
	const name = path ?? clientPath();
	if (!(name === "/" || name === "/office" || name === "/accessibility" || name === "/other")) return;
	try {
		const data = payload("page", name, locale);
		if (!uniqueVisitSent) {
			uniqueVisitSent = true;
			recordUniqueVisit({ data: {
				visitorKey: data.visitorKey,
				timezone: data.timezone
			} }).then((stats) => {
				if (stats) publishVisitStats(stats);
			}).catch(() => {
				getVisitStats().then((stats) => publishVisitStats(stats)).catch(() => {});
			});
		} else if (!visitStats) getVisitStats().then((stats) => publishVisitStats(stats)).catch(() => {});
		recordBehavior({ data }).catch(() => {});
		sendGaEvent("page_view", { page_path: name });
	} catch {}
}
function Flag({ locale }) {
	const className = "h-4 w-6 shrink-0 rounded-sm";
	if (locale === "he") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 60 42",
		className,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "60",
				height: "42",
				fill: "#fff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "6",
				width: "60",
				height: "7",
				fill: "#0038b8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "29",
				width: "60",
				height: "7",
				fill: "#0038b8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M30 14 L33.4 24 H22.6 Z M30 28 L26.6 18 H33.4 Z",
				fill: "none",
				stroke: "#0038b8",
				strokeWidth: "1.4"
			})
		]
	});
	if (locale === "en") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 60 42",
		className,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "60",
				height: "42",
				fill: "#012169"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M0 0 L60 42 M60 0 L0 42",
				stroke: "#fff",
				strokeWidth: "8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M0 0 L60 42 M60 0 L0 42",
				stroke: "#C8102E",
				strokeWidth: "4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M30 0 V42 M0 21 H60",
				stroke: "#fff",
				strokeWidth: "12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M30 0 V42 M0 21 H60",
				stroke: "#C8102E",
				strokeWidth: "7"
			})
		]
	});
	if (locale === "ar") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 60 42",
		className,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "60",
				height: "14",
				fill: "#165d31"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "14",
				width: "60",
				height: "14",
				fill: "#fff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "28",
				width: "60",
				height: "14",
				fill: "#000"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M0 0 L18 21 L0 42 Z",
				fill: "#c8102e"
			})
		]
	});
	if (locale === "fr") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 60 42",
		className,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "20",
				height: "42",
				fill: "#002395"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "20",
				width: "20",
				height: "42",
				fill: "#fff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				width: "20",
				height: "42",
				fill: "#ed2939"
			})
		]
	});
	if (locale === "es") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 60 42",
		className,
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "60",
			height: "42",
			fill: "#c60b1e"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			y: "10.5",
			width: "60",
			height: "21",
			fill: "#ffc400"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 60 42",
		className,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "60",
				height: "14",
				fill: "#fff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "14",
				width: "60",
				height: "14",
				fill: "#0039a6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				y: "28",
				width: "60",
				height: "14",
				fill: "#d52b1e"
			})
		]
	});
}
function LanguageSwitcher() {
	const { locale, setLocale, t } = useI18n();
	const [open, setOpen] = (0, import_react.useState)(false);
	const rootRef = (0, import_react.useRef)(null);
	const listId = (0, import_react.useId)();
	const current = LOCALE_META[locale];
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onPointer = (event) => {
			if (!rootRef.current?.contains(event.target)) setOpen(false);
		};
		const onKey = (event) => {
			if (event.key === "Escape") setOpen(false);
		};
		const timer = window.setTimeout(() => {
			document.addEventListener("pointerdown", onPointer);
		}, 0);
		document.addEventListener("keydown", onKey);
		return () => {
			window.clearTimeout(timer);
			document.removeEventListener("pointerdown", onPointer);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: rootRef,
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			"aria-haspopup": "listbox",
			"aria-expanded": open,
			"aria-controls": listId,
			"aria-label": `${t("langLabel")}: ${current.native}`,
			onClick: () => setOpen((value) => !value),
			className: "inline-flex h-11 items-center gap-2 rounded-lg bg-card px-3 text-sm font-medium shadow-[var(--shadow-border-hover)] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { locale }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: current.native }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 text-muted-foreground transition-transform", open && "rotate-180") })
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			id: listId,
			role: "listbox",
			"aria-label": t("langLabel"),
			className: "absolute top-full end-0 z-[80] mt-1 min-w-48 rounded-xl bg-card py-1 shadow-[var(--shadow-border-hover)]",
			children: LOCALES.map((id) => {
				const meta = LOCALE_META[id];
				const selected = id === locale;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					role: "none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "option",
						"aria-selected": selected,
						onClick: () => {
							setLocale(id);
							trackClick(`lang:${id}`);
							setOpen(false);
						},
						className: cn("flex h-11 w-full items-center gap-3 px-3 text-start text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring", selected ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { locale: id }), meta.native]
					})
				}, id);
			})
		}) : null]
	});
}
/** ISO 3166-1 for countries in the Fauda snapshot. numeric is zero-padded (matches Natural Earth ids). */
var ISO_BY_ALPHA2 = {
	IL: {
		alpha2: "IL",
		alpha3: "ISR",
		numeric: "376"
	},
	LB: {
		alpha2: "LB",
		alpha3: "LBN",
		numeric: "422"
	},
	JO: {
		alpha2: "JO",
		alpha3: "JOR",
		numeric: "400"
	},
	AE: {
		alpha2: "AE",
		alpha3: "ARE",
		numeric: "784"
	},
	BH: {
		alpha2: "BH",
		alpha3: "BHR",
		numeric: "048"
	},
	QA: {
		alpha2: "QA",
		alpha3: "QAT",
		numeric: "634"
	},
	OM: {
		alpha2: "OM",
		alpha3: "OMN",
		numeric: "512"
	},
	KW: {
		alpha2: "KW",
		alpha3: "KWT",
		numeric: "414"
	},
	EG: {
		alpha2: "EG",
		alpha3: "EGY",
		numeric: "818"
	},
	MA: {
		alpha2: "MA",
		alpha3: "MAR",
		numeric: "504"
	},
	SA: {
		alpha2: "SA",
		alpha3: "SAU",
		numeric: "682"
	},
	TR: {
		alpha2: "TR",
		alpha3: "TUR",
		numeric: "792"
	},
	FR: {
		alpha2: "FR",
		alpha3: "FRA",
		numeric: "250"
	},
	DE: {
		alpha2: "DE",
		alpha3: "DEU",
		numeric: "276"
	},
	NL: {
		alpha2: "NL",
		alpha3: "NLD",
		numeric: "528"
	},
	IT: {
		alpha2: "IT",
		alpha3: "ITA",
		numeric: "380"
	},
	GR: {
		alpha2: "GR",
		alpha3: "GRC",
		numeric: "300"
	},
	CY: {
		alpha2: "CY",
		alpha3: "CYP",
		numeric: "196"
	},
	RO: {
		alpha2: "RO",
		alpha3: "ROU",
		numeric: "642"
	},
	CZ: {
		alpha2: "CZ",
		alpha3: "CZE",
		numeric: "203"
	},
	SK: {
		alpha2: "SK",
		alpha3: "SVK",
		numeric: "703"
	},
	HU: {
		alpha2: "HU",
		alpha3: "HUN",
		numeric: "348"
	},
	RS: {
		alpha2: "RS",
		alpha3: "SRB",
		numeric: "688"
	},
	HR: {
		alpha2: "HR",
		alpha3: "HRV",
		numeric: "191"
	},
	BG: {
		alpha2: "BG",
		alpha3: "BGR",
		numeric: "100"
	},
	PL: {
		alpha2: "PL",
		alpha3: "POL",
		numeric: "616"
	},
	BE: {
		alpha2: "BE",
		alpha3: "BEL",
		numeric: "056"
	},
	FI: {
		alpha2: "FI",
		alpha3: "FIN",
		numeric: "246"
	},
	AT: {
		alpha2: "AT",
		alpha3: "AUT",
		numeric: "040"
	},
	LU: {
		alpha2: "LU",
		alpha3: "LUX",
		numeric: "442"
	},
	CH: {
		alpha2: "CH",
		alpha3: "CHE",
		numeric: "756"
	},
	SE: {
		alpha2: "SE",
		alpha3: "SWE",
		numeric: "752"
	},
	NO: {
		alpha2: "NO",
		alpha3: "NOR",
		numeric: "578"
	},
	DK: {
		alpha2: "DK",
		alpha3: "DNK",
		numeric: "208"
	},
	ES: {
		alpha2: "ES",
		alpha3: "ESP",
		numeric: "724"
	},
	PT: {
		alpha2: "PT",
		alpha3: "PRT",
		numeric: "620"
	},
	SI: {
		alpha2: "SI",
		alpha3: "SVN",
		numeric: "705"
	},
	LT: {
		alpha2: "LT",
		alpha3: "LTU",
		numeric: "440"
	},
	IE: {
		alpha2: "IE",
		alpha3: "IRL",
		numeric: "372"
	},
	GB: {
		alpha2: "GB",
		alpha3: "GBR",
		numeric: "826"
	},
	IN: {
		alpha2: "IN",
		alpha3: "IND",
		numeric: "356"
	},
	LK: {
		alpha2: "LK",
		alpha3: "LKA",
		numeric: "144"
	},
	PK: {
		alpha2: "PK",
		alpha3: "PAK",
		numeric: "586"
	},
	BD: {
		alpha2: "BD",
		alpha3: "BGD",
		numeric: "050"
	},
	KE: {
		alpha2: "KE",
		alpha3: "KEN",
		numeric: "404"
	},
	NG: {
		alpha2: "NG",
		alpha3: "NGA",
		numeric: "566"
	},
	AR: {
		alpha2: "AR",
		alpha3: "ARG",
		numeric: "032"
	},
	BR: {
		alpha2: "BR",
		alpha3: "BRA",
		numeric: "076"
	},
	CL: {
		alpha2: "CL",
		alpha3: "CHL",
		numeric: "152"
	},
	PA: {
		alpha2: "PA",
		alpha3: "PAN",
		numeric: "591"
	},
	US: {
		alpha2: "US",
		alpha3: "USA",
		numeric: "840"
	},
	LY: {
		alpha2: "LY",
		alpha3: "LBY",
		numeric: "434"
	},
	PS: {
		alpha2: "PS",
		alpha3: "PSE",
		numeric: "275"
	},
	CA: {
		alpha2: "CA",
		alpha3: "CAN",
		numeric: "124"
	},
	AU: {
		alpha2: "AU",
		alpha3: "AUS",
		numeric: "036"
	},
	NZ: {
		alpha2: "NZ",
		alpha3: "NZL",
		numeric: "554"
	},
	MX: {
		alpha2: "MX",
		alpha3: "MEX",
		numeric: "484"
	},
	CO: {
		alpha2: "CO",
		alpha3: "COL",
		numeric: "170"
	},
	PE: {
		alpha2: "PE",
		alpha3: "PER",
		numeric: "604"
	},
	JP: {
		alpha2: "JP",
		alpha3: "JPN",
		numeric: "392"
	},
	KR: {
		alpha2: "KR",
		alpha3: "KOR",
		numeric: "410"
	},
	PH: {
		alpha2: "PH",
		alpha3: "PHL",
		numeric: "608"
	},
	TH: {
		alpha2: "TH",
		alpha3: "THA",
		numeric: "764"
	},
	ID: {
		alpha2: "ID",
		alpha3: "IDN",
		numeric: "360"
	},
	MY: {
		alpha2: "MY",
		alpha3: "MYS",
		numeric: "458"
	},
	TN: {
		alpha2: "TN",
		alpha3: "TUN",
		numeric: "788"
	},
	DZ: {
		alpha2: "DZ",
		alpha3: "DZA",
		numeric: "012"
	},
	IQ: {
		alpha2: "IQ",
		alpha3: "IRQ",
		numeric: "368"
	},
	SY: {
		alpha2: "SY",
		alpha3: "SYR",
		numeric: "760"
	},
	IR: {
		alpha2: "IR",
		alpha3: "IRN",
		numeric: "364"
	},
	ZA: {
		alpha2: "ZA",
		alpha3: "ZAF",
		numeric: "710"
	},
	UA: {
		alpha2: "UA",
		alpha3: "UKR",
		numeric: "804"
	},
	CR: {
		alpha2: "CR",
		alpha3: "CRI",
		numeric: "188"
	},
	UY: {
		alpha2: "UY",
		alpha3: "URY",
		numeric: "858"
	},
	VE: {
		alpha2: "VE",
		alpha3: "VEN",
		numeric: "862"
	},
	SV: {
		alpha2: "SV",
		alpha3: "SLV",
		numeric: "222"
	},
	EE: {
		alpha2: "EE",
		alpha3: "EST",
		numeric: "233"
	},
	LV: {
		alpha2: "LV",
		alpha3: "LVA",
		numeric: "428"
	},
	IS: {
		alpha2: "IS",
		alpha3: "ISL",
		numeric: "352"
	},
	MT: {
		alpha2: "MT",
		alpha3: "MLT",
		numeric: "470"
	}
};
function isoOf(alpha2) {
	return ISO_BY_ALPHA2[alpha2] ?? {
		alpha2,
		alpha3: alpha2,
		numeric: ""
	};
}
function formatIsoLine(alpha2) {
	const iso = isoOf(alpha2);
	return iso.numeric ? `${iso.alpha2} · ${iso.alpha3} · ${iso.numeric}` : iso.alpha2;
}
var RANK_DAYS = LIVE.days;
var SNAPSHOT = LIVE.snapshot;
var GLOBAL = LIVE.global;
var REGION_LABEL = {
	me: "המזרח התיכון",
	eu: "אירופה",
	am: "אמריקה",
	aa: "אסיה ואפריקה"
};
var TONE_LABEL = {
	positive: "חיובי",
	mixed: "מעורב",
	critical: "ביקורתי"
};
var countries = applyLiveRanks([
	{
		id: "IL",
		nameHe: "ישראל",
		nameEn: "Israel",
		geoNames: ["Israel"],
		region: "me",
		coords: [34.85, 31.45],
		ranks: [
			null,
			1,
			1,
			1,
			1
		],
		sentiment: "positive",
		positive: 86,
		mixed: 10,
		negative: 4,
		confidence: "documented",
		note: "העונה שודרה ב-yes ממאי עד יולי והיתה הסדרה הנצפית ביותר בתולדות הרשת. מבקרים תיארו זעם, משבר אמון ותשוקה לנקמה אחרי 7 באוקטובר.",
		quotes: [{
			text: "העונה מצליחה לצייר את מה שקרה לישראלים רבים: הזעם המטורף, העלבון, משבר האמון המוחלט והתשוקה לנקמה גם במחיר קריסה מוסרית.",
			by: "עינב שיף, ידיעות אחרונות",
			tone: "emotional",
			source: "NYT / ידיעות"
		}]
	},
	{
		id: "LB",
		nameHe: "לבנון",
		nameEn: "Lebanon",
		geoNames: ["Lebanon"],
		region: "me",
		coords: [35.5, 33.85],
		ranks: [
			null,
			1,
			1,
			1,
			1
		],
		sentiment: "mixed",
		positive: 48,
		mixed: 22,
		negative: 30,
		confidence: "documented",
		note: "מקום ראשון בנטפליקס ארבעה ימים רצופים — למרות חוק חרם על ישראל וקמפיין שהאשים את נטפליקס בהפרתו.",
		quotes: [{
			text: "קמפיין חרם לבנוני האשים את נטפליקס בהפרת החוק המקומי על ידי הפצת הפקות ישראליות, וטען שפאודה מקדמת נרטיב ביטחוני.",
			by: "דיווח Ynet על קמפיין החרם",
			tone: "critical",
			source: "Ynet"
		}]
	},
	{
		id: "JO",
		nameHe: "ירדן",
		nameEn: "Jordan",
		geoNames: ["Jordan"],
		region: "me",
		coords: [36.24, 31.3],
		ranks: [
			6,
			2,
			2,
			3,
			4
		],
		sentiment: "mixed",
		positive: 46,
		mixed: 28,
		negative: 26,
		confidence: "estimated",
		note: "שיא מקום 2. צפייה גבוהה בממלכה לצד שיח פוליטי רגיש סביב הסכסוך."
	},
	{
		id: "AE",
		nameHe: "איחוד האמירויות",
		nameEn: "United Arab Emirates",
		geoNames: ["United Arab Emirates"],
		region: "me",
		coords: [54.37, 24.45],
		ranks: [
			null,
			2,
			6,
			5,
			4
		],
		sentiment: "mixed",
		positive: 58,
		mixed: 26,
		negative: 16,
		confidence: "estimated",
		note: "שיא מקום 2 ב-10 בספטמבר. קהל הסטרימינג באיחוד נוטה לצפות בסדרה כמתח, לא רק כמסמך פוליטי."
	},
	{
		id: "BH",
		nameHe: "בחריין",
		nameEn: "Bahrain",
		geoNames: [],
		region: "me",
		coords: [50.58, 26.22],
		ranks: [
			8,
			2,
			4,
			5,
			6
		],
		sentiment: "mixed",
		positive: 56,
		mixed: 28,
		negative: 16,
		confidence: "estimated",
		note: "שיא מקום 2. מדינה קטנה שלא מופיעה במפת 110m — מסומנת בנקודה."
	},
	{
		id: "QA",
		nameHe: "קטאר",
		nameEn: "Qatar",
		geoNames: ["Qatar"],
		region: "me",
		coords: [51.18, 25.3],
		ranks: [
			8,
			3,
			3,
			4,
			4
		],
		sentiment: "critical",
		positive: 28,
		mixed: 24,
		negative: 48,
		confidence: "documented",
		note: "צפייה גבוהה (שיא מקום 3) במקביל לקמפיין תקשורתי עוין עם עליית העונה.",
		quotes: [{
			text: "שחקנים מהסדרה השתתפו במלחמת ההשמדה נגד עזה. הסדרה הישראלית פאודה חוזרת לנטפליקס.",
			by: "אל-ערבי אל-ג'דיד",
			tone: "critical",
			source: "Al-Araby Al-Jadeed"
		}]
	},
	{
		id: "OM",
		nameHe: "עומאן",
		nameEn: "Oman",
		geoNames: ["Oman"],
		region: "me",
		coords: [58, 21.5],
		ranks: [
			10,
			3,
			4,
			5,
			7
		],
		sentiment: "mixed",
		positive: 50,
		mixed: 32,
		negative: 18,
		confidence: "estimated"
	},
	{
		id: "KW",
		nameHe: "כווית",
		nameEn: "Kuwait",
		geoNames: ["Kuwait"],
		region: "me",
		coords: [47.8, 29.3],
		ranks: [
			null,
			3,
			3,
			7,
			8
		],
		sentiment: "mixed",
		positive: 44,
		mixed: 30,
		negative: 26,
		confidence: "estimated"
	},
	{
		id: "EG",
		nameHe: "מצרים",
		nameEn: "Egypt",
		geoNames: ["Egypt"],
		region: "me",
		coords: [30.8, 26.8],
		ranks: [
			9,
			4,
			6,
			8,
			10
		],
		sentiment: "mixed",
		positive: 42,
		mixed: 30,
		negative: 28,
		confidence: "estimated",
		note: "שיא מקום 4. שיח ערבי קלאסי: צפייה גבוהה לצד ביקורת על הנרטיב."
	},
	{
		id: "MA",
		nameHe: "מרוקו",
		nameEn: "Morocco",
		geoNames: ["Morocco"],
		region: "me",
		coords: [-7, 31.8],
		ranks: [
			10,
			5,
			3,
			7,
			6
		],
		sentiment: "mixed",
		positive: 54,
		mixed: 28,
		negative: 18,
		confidence: "estimated",
		note: "שיא מקום 3 ב-11 בספטמבר."
	},
	{
		id: "SA",
		nameHe: "ערב הסעודית",
		nameEn: "Saudi Arabia",
		geoNames: ["Saudi Arabia"],
		region: "me",
		coords: [45, 24],
		ranks: [
			null,
			9,
			null,
			null,
			null
		],
		sentiment: "mixed",
		positive: 40,
		mixed: 34,
		negative: 26,
		confidence: "estimated",
		note: "נכנסה לטופ 10 ב-10 בספטמבר (מקום 9) וירדה מהדירוג בימים שאחרי."
	},
	{
		id: "TR",
		nameHe: "טורקיה",
		nameEn: "Turkey",
		geoNames: ["Turkey"],
		region: "me",
		coords: [35.2, 39],
		ranks: [
			null,
			null,
			10,
			10,
			10
		],
		sentiment: "critical",
		positive: 30,
		mixed: 28,
		negative: 42,
		confidence: "estimated",
		note: "נכנסה לטופ 10 למרות אקלים פוליטי ביקורתי כלפי ישראל."
	},
	{
		id: "FR",
		nameHe: "צרפת",
		nameEn: "France",
		geoNames: ["France"],
		region: "eu",
		coords: [2.3, 46.6],
		ranks: [
			3,
			3,
			3,
			5,
			5
		],
		sentiment: "mixed",
		positive: 58,
		mixed: 26,
		negative: 16,
		confidence: "documented",
		note: "עלילת מרסיי. הצילומים הועברו לבודפשט אחרי אזהרת אבטחה. העונה דורגה מקום 3 בסדרות בצרפת בימים הראשונים.",
		quotes: [{
			text: "זה לא המציאות, אבל הרגשנו שיש סיפור שצריך לספר. רצינו שהעונה תעורר דיון ושצופים יבינו כמה השלום חשוב.",
			by: "ליאור רז ואבי יששכרוף",
			tone: "emotional",
			source: "Télé-Loisirs"
		}]
	},
	{
		id: "DE",
		nameHe: "גרמניה",
		nameEn: "Germany",
		geoNames: ["Germany"],
		region: "eu",
		coords: [10.4, 51.1],
		ranks: [
			10,
			5,
			6,
			8,
			7
		],
		sentiment: "positive",
		positive: 76,
		mixed: 16,
		negative: 8,
		confidence: "documented",
		note: "פיד הרשתות התמלא בציוצים גרמניים של הלם אחרי פרקי 7 באוקטובר.",
		quotes: [{
			text: "כל הפיד שלי מלא בציוצים של הולנדים וגרמנים על פרקי 7 באוקטובר. הם בהלם מוחלט, והפוסטים קשים לקריאה ותומכים מאוד בישראל.",
			by: "לי מלאך",
			tone: "emotional",
			source: "Jerusalem Post"
		}]
	},
	{
		id: "NL",
		nameHe: "הולנד",
		nameEn: "Netherlands",
		geoNames: ["Netherlands"],
		region: "eu",
		coords: [5.3, 52.1],
		ranks: [
			4,
			2,
			3,
			4,
			4
		],
		sentiment: "positive",
		positive: 78,
		mixed: 14,
		negative: 8,
		confidence: "documented",
		note: "שיא מקום 2. שיח הולנדי בולט של הלם ותמיכה אחרי פרקים 7–8."
	},
	{
		id: "IT",
		nameHe: "איטליה",
		nameEn: "Italy",
		geoNames: ["Italy"],
		region: "eu",
		coords: [12.6, 42.8],
		ranks: [
			9,
			2,
			4,
			5,
			6
		],
		sentiment: "positive",
		positive: 72,
		mixed: 18,
		negative: 10,
		confidence: "documented",
		quotes: [{
			text: "בקושי הצלחתי להשאיר את העיניים פתוחות.",
			by: "צופה איטלקי",
			tone: "emotional",
			source: "Jerusalem Post"
		}, {
			text: "אולי הסדרה תעזור לאנשים להבין את הזוועות שחמאס ביצע ב-7 באוקטובר.",
			by: "חברה של צופה איטלקייה, לא יהודייה ולא ישראלית",
			tone: "positive",
			source: "Jerusalem Post"
		}]
	},
	{
		id: "GR",
		nameHe: "יוון",
		nameEn: "Greece",
		geoNames: ["Greece"],
		region: "eu",
		coords: [22, 39],
		ranks: [
			2,
			2,
			2,
			3,
			4
		],
		sentiment: "positive",
		positive: 74,
		mixed: 18,
		negative: 8,
		confidence: "estimated",
		note: "מהמדינות החזקות ביותר באירופה — מקום 2 ארבעה ימים ברצף כמעט."
	},
	{
		id: "CY",
		nameHe: "קפריסין",
		nameEn: "Cyprus",
		geoNames: ["Cyprus"],
		region: "eu",
		coords: [33.4, 35.1],
		ranks: [
			2,
			2,
			2,
			2,
			3
		],
		sentiment: "positive",
		positive: 76,
		mixed: 16,
		negative: 8,
		confidence: "estimated"
	},
	{
		id: "RO",
		nameHe: "רומניה",
		nameEn: "Romania",
		geoNames: ["Romania"],
		region: "eu",
		coords: [25, 45.9],
		ranks: [
			2,
			1,
			2,
			4,
			4
		],
		sentiment: "positive",
		positive: 74,
		mixed: 18,
		negative: 8,
		confidence: "estimated",
		note: "המדינה האירופית היחידה שבה העונה הגיעה למקום הראשון (10 בספטמבר)."
	},
	{
		id: "CZ",
		nameHe: "צ'כיה",
		nameEn: "Czechia",
		geoNames: ["Czechia"],
		region: "eu",
		coords: [15.5, 49.8],
		ranks: [
			2,
			2,
			3,
			4,
			4
		],
		sentiment: "positive",
		positive: 73,
		mixed: 19,
		negative: 8,
		confidence: "estimated"
	},
	{
		id: "SK",
		nameHe: "סלובקיה",
		nameEn: "Slovakia",
		geoNames: ["Slovakia"],
		region: "eu",
		coords: [19.7, 48.7],
		ranks: [
			2,
			2,
			4,
			5,
			5
		],
		sentiment: "positive",
		positive: 72,
		mixed: 20,
		negative: 8,
		confidence: "estimated"
	},
	{
		id: "HU",
		nameHe: "הונגריה",
		nameEn: "Hungary",
		geoNames: ["Hungary"],
		region: "eu",
		coords: [19.5, 47.2],
		ranks: [
			2,
			2,
			4,
			4,
			4
		],
		sentiment: "positive",
		positive: 74,
		mixed: 18,
		negative: 8,
		confidence: "estimated",
		note: "חלק ניכר מצילומי מרסיי הועתק לבודפשט מסיבות אבטחה."
	},
	{
		id: "RS",
		nameHe: "סרביה",
		nameEn: "Serbia",
		geoNames: ["Serbia"],
		region: "eu",
		coords: [20.8, 44.2],
		ranks: [
			2,
			2,
			3,
			4,
			4
		],
		sentiment: "positive",
		positive: 70,
		mixed: 22,
		negative: 8,
		confidence: "estimated"
	},
	{
		id: "HR",
		nameHe: "קרואטיה",
		nameEn: "Croatia",
		geoNames: ["Croatia"],
		region: "eu",
		coords: [16, 45.1],
		ranks: [
			3,
			2,
			4,
			4,
			4
		],
		sentiment: "positive",
		positive: 71,
		mixed: 21,
		negative: 8,
		confidence: "estimated"
	},
	{
		id: "BG",
		nameHe: "בולגריה",
		nameEn: "Bulgaria",
		geoNames: ["Bulgaria"],
		region: "eu",
		coords: [25.3, 42.7],
		ranks: [
			4,
			2,
			3,
			4,
			5
		],
		sentiment: "positive",
		positive: 70,
		mixed: 22,
		negative: 8,
		confidence: "estimated"
	},
	{
		id: "PL",
		nameHe: "פולין",
		nameEn: "Poland",
		geoNames: ["Poland"],
		region: "eu",
		coords: [19.4, 52.1],
		ranks: [
			3,
			3,
			4,
			5,
			5
		],
		sentiment: "positive",
		positive: 72,
		mixed: 18,
		negative: 10,
		confidence: "estimated"
	},
	{
		id: "BE",
		nameHe: "בלגיה",
		nameEn: "Belgium",
		geoNames: ["Belgium"],
		region: "eu",
		coords: [4.4, 50.6],
		ranks: [
			9,
			3,
			5,
			5,
			6
		],
		sentiment: "positive",
		positive: 66,
		mixed: 22,
		negative: 12,
		confidence: "estimated"
	},
	{
		id: "FI",
		nameHe: "פינלנד",
		nameEn: "Finland",
		geoNames: ["Finland"],
		region: "eu",
		coords: [26, 64.5],
		ranks: [
			5,
			3,
			3,
			6,
			6
		],
		sentiment: "positive",
		positive: 70,
		mixed: 22,
		negative: 8,
		confidence: "estimated"
	},
	{
		id: "AT",
		nameHe: "אוסטריה",
		nameEn: "Austria",
		geoNames: ["Austria"],
		region: "eu",
		coords: [14.1, 47.6],
		ranks: [
			8,
			4,
			5,
			6,
			5
		],
		sentiment: "positive",
		positive: 68,
		mixed: 22,
		negative: 10,
		confidence: "estimated"
	},
	{
		id: "LU",
		nameHe: "לוקסמבורג",
		nameEn: "Luxembourg",
		geoNames: ["Luxembourg"],
		region: "eu",
		coords: [6.13, 49.8],
		ranks: [
			7,
			4,
			6,
			6,
			5
		],
		sentiment: "positive",
		positive: 68,
		mixed: 22,
		negative: 10,
		confidence: "estimated"
	},
	{
		id: "CH",
		nameHe: "שווייץ",
		nameEn: "Switzerland",
		geoNames: ["Switzerland"],
		region: "eu",
		coords: [8.2, 46.8],
		ranks: [
			null,
			null,
			null,
			null,
			5
		],
		sentiment: "positive",
		positive: 66,
		mixed: 24,
		negative: 10,
		confidence: "estimated"
	},
	{
		id: "SE",
		nameHe: "שוודיה",
		nameEn: "Sweden",
		geoNames: ["Sweden"],
		region: "eu",
		coords: [15, 62],
		ranks: [
			null,
			null,
			null,
			null,
			5
		],
		sentiment: "mixed",
		positive: 58,
		mixed: 26,
		negative: 16,
		confidence: "estimated",
		note: "צפייה בינונית-גבוהה באקלים פוליטי מקוטב סביב ישראל."
	},
	{
		id: "NO",
		nameHe: "נורווגיה",
		nameEn: "Norway",
		geoNames: ["Norway"],
		region: "eu",
		coords: [8.5, 60.5],
		ranks: [
			6,
			6,
			6,
			6,
			6
		],
		sentiment: "mixed",
		positive: 56,
		mixed: 28,
		negative: 16,
		confidence: "estimated"
	},
	{
		id: "DK",
		nameHe: "דנמרק",
		nameEn: "Denmark",
		geoNames: ["Denmark"],
		region: "eu",
		coords: [10, 56],
		ranks: [
			8,
			7,
			8,
			9,
			9
		],
		sentiment: "positive",
		positive: 64,
		mixed: 24,
		negative: 12,
		confidence: "estimated"
	},
	{
		id: "ES",
		nameHe: "ספרד",
		nameEn: "Spain",
		geoNames: ["Spain"],
		region: "eu",
		coords: [-3.7, 40.4],
		ranks: [
			null,
			7,
			7,
			8,
			8
		],
		sentiment: "mixed",
		positive: 52,
		mixed: 28,
		negative: 20,
		confidence: "estimated"
	},
	{
		id: "PT",
		nameHe: "פורטוגל",
		nameEn: "Portugal",
		geoNames: ["Portugal"],
		region: "eu",
		coords: [-8, 39.6],
		ranks: [
			null,
			6,
			6,
			8,
			8
		],
		sentiment: "positive",
		positive: 64,
		mixed: 24,
		negative: 12,
		confidence: "estimated"
	},
	{
		id: "SI",
		nameHe: "סלובניה",
		nameEn: "Slovenia",
		geoNames: ["Slovenia"],
		region: "eu",
		coords: [14.8, 46.1],
		ranks: [
			7,
			5,
			6,
			7,
			8
		],
		sentiment: "positive",
		positive: 68,
		mixed: 22,
		negative: 10,
		confidence: "estimated"
	},
	{
		id: "LT",
		nameHe: "ליטא",
		nameEn: "Lithuania",
		geoNames: ["Lithuania"],
		region: "eu",
		coords: [23.9, 55.2],
		ranks: [
			null,
			5,
			7,
			8,
			7
		],
		sentiment: "positive",
		positive: 70,
		mixed: 20,
		negative: 10,
		confidence: "estimated"
	},
	{
		id: "IE",
		nameHe: "אירלנד",
		nameEn: "Ireland",
		geoNames: ["Ireland"],
		region: "eu",
		coords: [-8, 53.4],
		ranks: [
			null,
			9,
			null,
			null,
			null
		],
		sentiment: "mixed",
		positive: 48,
		mixed: 28,
		negative: 24,
		confidence: "estimated",
		note: "יום אחד בטופ 10. השיח הציבורי באירלנד סביב ישראל מקוטב יותר מאשר הצפייה עצמה."
	},
	{
		id: "GB",
		nameHe: "בריטניה",
		nameEn: "United Kingdom",
		geoNames: ["United Kingdom"],
		region: "eu",
		coords: [-1.5, 52.5],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "positive",
		positive: 70,
		mixed: 18,
		negative: 12,
		confidence: "documented",
		note: "לא נכנסה לטופ 10 של FlixPatrol בשבוע הראשון, אבל צופים בריטים הובילו חלק מהשיח הרגשי סביב פרקים 7–8.",
		quotes: [{
			text: "פרקים 7 ו-8 שברו אותי. בכיתי המון. העונה שונה מהקודמות, אבל עדיין נהניתי.",
			by: "צופה מאנגליה",
			tone: "emotional",
			source: "Ynet"
		}, {
			text: "תנועת ה-BDS דרשה מנטפליקס לבטל את הסדרה ותיארה אותה ככלי תעמולה גזעני נגד ערבים.",
			by: "דיווח The Telegraph על קמפיין החרם בבריטניה, ספטמבר 2026",
			tone: "critical",
			source: "Telegraph"
		}]
	},
	{
		id: "IN",
		nameHe: "הודו",
		nameEn: "India",
		geoNames: ["India"],
		region: "aa",
		coords: [79, 22],
		ranks: [
			7,
			2,
			4,
			5,
			5
		],
		sentiment: "positive",
		positive: 68,
		mixed: 22,
		negative: 10,
		confidence: "documented",
		note: "שיא מקום 2. קהל נאמן לסדרה; מבקר ב-NDTV נתן 2.5/5 וכתב שהיכולת להפתיע נחלשה.",
		quotes: [{
			text: "אפשר לצפות ברצף, אבל בסוף נשארים יותר מותשים מנלהבים — היכולת של הסדרה להדהים נמצאת בשפל.",
			by: "סייבל צ'טרג'י, NDTV",
			tone: "critical",
			source: "NDTV"
		}]
	},
	{
		id: "LK",
		nameHe: "סרי לנקה",
		nameEn: "Sri Lanka",
		geoNames: ["Sri Lanka"],
		region: "aa",
		coords: [80.7, 7.9],
		ranks: [
			8,
			3,
			null,
			null,
			null
		],
		sentiment: "positive",
		positive: 66,
		mixed: 24,
		negative: 10,
		confidence: "estimated"
	},
	{
		id: "PK",
		nameHe: "פקיסטן",
		nameEn: "Pakistan",
		geoNames: ["Pakistan"],
		region: "aa",
		coords: [69.3, 30.4],
		ranks: [
			null,
			8,
			8,
			10,
			10
		],
		sentiment: "mixed",
		positive: 38,
		mixed: 30,
		negative: 32,
		confidence: "estimated"
	},
	{
		id: "BD",
		nameHe: "בנגלדש",
		nameEn: "Bangladesh",
		geoNames: ["Bangladesh"],
		region: "aa",
		coords: [90.3, 23.7],
		ranks: [
			null,
			8,
			9,
			10,
			10
		],
		sentiment: "mixed",
		positive: 40,
		mixed: 32,
		negative: 28,
		confidence: "estimated"
	},
	{
		id: "KE",
		nameHe: "קניה",
		nameEn: "Kenya",
		geoNames: ["Kenya"],
		region: "aa",
		coords: [37.9, 0],
		ranks: [
			8,
			7,
			9,
			10,
			9
		],
		sentiment: "positive",
		positive: 64,
		mixed: 24,
		negative: 12,
		confidence: "estimated"
	},
	{
		id: "NG",
		nameHe: "ניגריה",
		nameEn: "Nigeria",
		geoNames: ["Nigeria"],
		region: "aa",
		coords: [8, 9],
		ranks: [
			7,
			5,
			7,
			7,
			9
		],
		sentiment: "positive",
		positive: 62,
		mixed: 26,
		negative: 12,
		confidence: "estimated"
	},
	{
		id: "AR",
		nameHe: "ארגנטינה",
		nameEn: "Argentina",
		geoNames: ["Argentina"],
		region: "am",
		coords: [-64, -34],
		ranks: [
			7,
			4,
			5,
			7,
			7
		],
		sentiment: "positive",
		positive: 82,
		mixed: 12,
		negative: 6,
		confidence: "documented",
		quotes: [{
			text: "שנה טובה, עם ישראל חי.",
			by: "צופה מארגנטינה, אחרי סיום העונה",
			tone: "positive",
			source: "Walla"
		}]
	},
	{
		id: "BR",
		nameHe: "ברזיל",
		nameEn: "Brazil",
		geoNames: ["Brazil"],
		region: "am",
		coords: [-51, -14],
		ranks: [
			null,
			10,
			null,
			null,
			null
		],
		sentiment: "positive",
		positive: 74,
		mixed: 18,
		negative: 8,
		confidence: "documented",
		quotes: [{
			text: "פאודה תמיד היתה סדרה מטלטלת. העונה החמישית מזעזעת וכואבת במיוחד. פרקים 7 ו-8 משחזרים את הטבח — קשה יותר מדרמה בדיונית.",
			by: "לוסיאנו פירס, קריקטוריסט",
			tone: "emotional",
			source: "Jerusalem Post"
		}]
	},
	{
		id: "CL",
		nameHe: "צ'ילה",
		nameEn: "Chile",
		geoNames: ["Chile"],
		region: "am",
		coords: [-71, -35],
		ranks: [
			null,
			8,
			10,
			null,
			null
		],
		sentiment: "mixed",
		positive: 54,
		mixed: 26,
		negative: 20,
		confidence: "estimated"
	},
	{
		id: "PA",
		nameHe: "פנמה",
		nameEn: "Panama",
		geoNames: ["Panama"],
		region: "am",
		coords: [-80, 8.5],
		ranks: [
			7,
			6,
			7,
			10,
			8
		],
		sentiment: "positive",
		positive: 66,
		mixed: 24,
		negative: 10,
		confidence: "estimated"
	},
	{
		id: "US",
		nameHe: "ארצות הברית",
		nameEn: "United States",
		geoNames: ["United States of America"],
		region: "am",
		coords: [-97, 39.5],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "positive",
		positive: 72,
		mixed: 16,
		negative: 12,
		confidence: "documented",
		note: "לא בטופ 10 של FlixPatrol בשבוע הראשון. Decider המליץ Stream It. צופים אמריקאים הובילו חלק מהשיח על חשיבות הפרקים.",
		quotes: [{
			text: "עבודה מצוינת. קשה לצפות, אבל חשוב שאנשים יראו מה ישראל עברה ועדיין עוברת.",
			by: "צופה אמריקאי לא-יהודי",
			tone: "positive",
			source: "Ynet"
		}, {
			text: "העונה החמישית הולכת לכיוון אחר מהארבע הראשונות, אבל היא מבט מרתק על איך דמויות שאנחנו מכירים שנים מגיבות לזוועות 7 באוקטובר.",
			by: "ג'ואל קלר, Decider — Stream It",
			tone: "positive",
			source: "Decider"
		}]
	},
	{
		id: "LY",
		nameHe: "לוב",
		nameEn: "Libya",
		geoNames: ["Libya"],
		region: "me",
		coords: [17.2, 27],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "critical",
		positive: 18,
		mixed: 20,
		negative: 62,
		confidence: "documented",
		note: "אין דירוג FlixPatrol בשבוע הראשון. צופה מלוב פרסם ביקורת חריפה על הנרטיב.",
		quotes: [{
			text: "הבעיה היא לא שעוסקים באירועי 7 באוקטובר. הבעיה היא הנרטיב שהיצירה מציגה, ייצוג הפלסטינים והמאבק שלהם, והפרשנות שמשרתת נרטיב אחד על חשבון האחר.",
			by: "צופה מלוב",
			tone: "critical",
			source: "Ynet"
		}]
	},
	{
		id: "PS",
		nameHe: "פלסטין",
		nameEn: "Palestine",
		geoNames: ["Palestine"],
		region: "me",
		coords: [35.2, 31.9],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "mixed",
		positive: 34,
		mixed: 22,
		negative: 44,
		confidence: "documented",
		note: "אין דירוג נטפליקס. השיח מפוצל: ציטוט חיובי מצופה בעזה לצד ביקורת ערבית על הנרטיב. הטון כאן הוא שיח, לא צפייה.",
		quotes: [{
			text: "אחת העונות החזקות, המותחות והמרתקות של הסדרה.",
			by: "צופה מרצועת עזה",
			tone: "positive",
			source: "Ynet"
		}]
	},
	{
		id: "CA",
		nameHe: "קנדה",
		nameEn: "Canada",
		geoNames: ["Canada"],
		region: "am",
		coords: [-96, 56],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "positive",
		positive: 68,
		mixed: 20,
		negative: 12,
		confidence: "estimated",
		note: "נטפליקס זמין, לא בטופ 10 של FlixPatrol. הטון מוערך לפי שיח אנגלופוני מתועד בארה״ב ובבריטניה (Decider, NYT, Ynet)."
	},
	{
		id: "AU",
		nameHe: "אוסטרליה",
		nameEn: "Australia",
		geoNames: ["Australia"],
		region: "aa",
		coords: [134, -25],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "positive",
		positive: 66,
		mixed: 20,
		negative: 14,
		confidence: "estimated",
		note: "העונה עלתה בנטפליקס אוסטרליה. אין דירוג טופ 10. הערכה לפי שיח אנגלופוני מתועד, לא לפי סקר מקומי."
	},
	{
		id: "NZ",
		nameHe: "ניו זילנד",
		nameEn: "New Zealand",
		geoNames: ["New Zealand"],
		region: "aa",
		coords: [174, -41],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "positive",
		positive: 64,
		mixed: 22,
		negative: 14,
		confidence: "estimated",
		note: "נטפליקס זמין, בלי טופ 10. הערכה אזורית לפי אוסטרליה והשיח האנגלופוני."
	},
	{
		id: "MX",
		nameHe: "מקסיקו",
		nameEn: "Mexico",
		geoNames: ["Mexico"],
		region: "am",
		coords: [-102, 23],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "mixed",
		positive: 52,
		mixed: 28,
		negative: 20,
		confidence: "estimated",
		note: "שוק נטפליקס גדול בלי כניסה לטופ 10 בשבוע הראשון. הטון מוערך לפי אמריקה הלטינית במדגם (צ׳ילה, ברזיל, ארגנטינה)."
	},
	{
		id: "CO",
		nameHe: "קולומביה",
		nameEn: "Colombia",
		geoNames: ["Colombia"],
		region: "am",
		coords: [-74, 4],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "mixed",
		positive: 50,
		mixed: 28,
		negative: 22,
		confidence: "estimated",
		note: "אין דירוג צפייה. הערכה לפי שכנות לטיניות במדגם, בלי ציטוט מקומי מתועד."
	},
	{
		id: "PE",
		nameHe: "פרו",
		nameEn: "Peru",
		geoNames: ["Peru"],
		region: "am",
		coords: [-75, -10],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "mixed",
		positive: 51,
		mixed: 27,
		negative: 22,
		confidence: "estimated",
		note: "נטפליקס זמין, בלי טופ 10. שיח מוערך אזורית."
	},
	{
		id: "JP",
		nameHe: "יפן",
		nameEn: "Japan",
		geoNames: ["Japan"],
		region: "aa",
		coords: [138, 36],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "mixed",
		positive: 58,
		mixed: 26,
		negative: 16,
		confidence: "estimated",
		note: "העונה זמינה בנטפליקס יפן. אין דירוג טופ 10 ואין ביקורת מקומית במדגם — הערכה כצפיית מתח, לא כמסמך פוליטי."
	},
	{
		id: "KR",
		nameHe: "דרום קוריאה",
		nameEn: "South Korea",
		geoNames: ["South Korea"],
		region: "aa",
		coords: [128, 36],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "mixed",
		positive: 57,
		mixed: 27,
		negative: 16,
		confidence: "estimated",
		note: "נטפליקס חזק מקומית, בלי כניסה לטופ 10 של פאודה. אין ציטוט קוריאני מתועד."
	},
	{
		id: "PH",
		nameHe: "הפיליפינים",
		nameEn: "Philippines",
		geoNames: ["Philippines"],
		region: "aa",
		coords: [122, 12],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "mixed",
		positive: 55,
		mixed: 28,
		negative: 17,
		confidence: "estimated",
		note: "שוק סטרימינג גדול בלי דירוג טופ 10. הערכה אזורית."
	},
	{
		id: "TH",
		nameHe: "תאילנד",
		nameEn: "Thailand",
		geoNames: ["Thailand"],
		region: "aa",
		coords: [101, 15],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "mixed",
		positive: 54,
		mixed: 28,
		negative: 18,
		confidence: "estimated",
		note: "נטפליקס זמין, בלי טופ 10. אין סיקור מקומי במדגם."
	},
	{
		id: "ID",
		nameHe: "אינדונזיה",
		nameEn: "Indonesia",
		geoNames: ["Indonesia"],
		region: "aa",
		coords: [118, -2],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "critical",
		positive: 30,
		mixed: 28,
		negative: 42,
		confidence: "estimated",
		note: "מדינה מוסלמית גדולה עם נטפליקס, בלי טופ 10. הטון מוערך לפי אקלים חרם ושיח ערבי מתועד (אל-ערבי), לא לפי סקר אינדונזי."
	},
	{
		id: "MY",
		nameHe: "מלזיה",
		nameEn: "Malaysia",
		geoNames: ["Malaysia"],
		region: "aa",
		coords: [102, 4],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "critical",
		positive: 28,
		mixed: 30,
		negative: 42,
		confidence: "estimated",
		note: "אין דירוג צפייה. הערכה לפי שכנות מוסלמית בדרום-מזרח אסיה ושיח חרם אזורי."
	},
	{
		id: "TN",
		nameHe: "תוניסיה",
		nameEn: "Tunisia",
		geoNames: ["Tunisia"],
		region: "me",
		coords: [9.5, 34],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "critical",
		positive: 24,
		mixed: 26,
		negative: 50,
		confidence: "estimated",
		note: "אין טופ 10. הטון מוערך לפי שיח צפון-אפריקאי וביקורת אל-ערבי על חזרת הסדרה לנטפליקס."
	},
	{
		id: "DZ",
		nameHe: "אלג׳יריה",
		nameEn: "Algeria",
		geoNames: ["Algeria"],
		region: "me",
		coords: [2.6, 28],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "critical",
		positive: 22,
		mixed: 24,
		negative: 54,
		confidence: "estimated",
		note: "נטפליקס מוגבל יחסית, בלי דירוג. הערכה לפי המגרב ושיח ערבי מתועד — לא לפי שעות צפייה."
	},
	{
		id: "IQ",
		nameHe: "עיראק",
		nameEn: "Iraq",
		geoNames: ["Iraq"],
		region: "me",
		coords: [44, 33],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "critical",
		positive: 20,
		mixed: 24,
		negative: 56,
		confidence: "estimated",
		note: "אין דירוג FlixPatrol. השיח מוערך לפי התקשורת הערבית סביב עליית העונה."
	},
	{
		id: "SY",
		nameHe: "סוריה",
		nameEn: "Syria",
		geoNames: ["Syria"],
		region: "me",
		coords: [38.5, 35],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "critical",
		positive: 18,
		mixed: 22,
		negative: 60,
		confidence: "estimated",
		note: "אין שוק נטפליקס מדורג. צבע המפה משקף שיח אזורי, לא צפייה."
	},
	{
		id: "IR",
		nameHe: "איראן",
		nameEn: "Iran",
		geoNames: ["Iran"],
		region: "aa",
		coords: [53, 32],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "critical",
		positive: 14,
		mixed: 18,
		negative: 68,
		confidence: "estimated",
		note: "נטפליקס אינו רשמי. אין נתון צפייה. הטון הוא הערכת שיח מדינתי ואזורי בלבד."
	},
	{
		id: "ZA",
		nameHe: "דרום אפריקה",
		nameEn: "South Africa",
		geoNames: ["South Africa"],
		region: "aa",
		coords: [24, -29],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "mixed",
		positive: 38,
		mixed: 30,
		negative: 32,
		confidence: "estimated",
		note: "נטפליקס זמין, בלי טופ 10. הערכה מעורבת: קהל סטרימינג מול מסורת BDS מקומית — בלי ציטוט ספציפי לעונה 5."
	},
	{
		id: "UA",
		nameHe: "אוקראינה",
		nameEn: "Ukraine",
		geoNames: ["Ukraine"],
		region: "eu",
		coords: [32, 49],
		ranks: [
			null,
			null,
			null,
			null,
			null
		],
		sentiment: "mixed",
		positive: 56,
		mixed: 26,
		negative: 18,
		confidence: "estimated",
		note: "אין דירוג טופ 10. הערכה לפי אירופה במדגם, בלי סיקור אוקראיני מתועד."
	},
	{
		id: "CR",
		nameHe: "קוסטה ריקה",
		nameEn: "Costa Rica",
		geoNames: ["Costa Rica"],
		region: "am",
		coords: [-84, 10],
		ranks: [
			null,
			10,
			null,
			null,
			null
		],
		sentiment: "mixed",
		positive: 58,
		mixed: 26,
		negative: 16,
		confidence: "estimated",
		note: "נכנסה לטופ 10 ליום אחד לפי FlixPatrol. אין ציטוט מקומי מתועד."
	},
	{
		id: "UY",
		nameHe: "אורוגוואי",
		nameEn: "Uruguay",
		geoNames: ["Uruguay"],
		region: "am",
		coords: [-56, -33],
		ranks: [
			6,
			4,
			5,
			7,
			7
		],
		sentiment: "positive",
		positive: 64,
		mixed: 22,
		negative: 14,
		confidence: "estimated",
		note: "דירוג צפייה יציב בטופ 10. הטון מוערך לפי השכנות הלטינית (ארגנטינה)."
	},
	{
		id: "VE",
		nameHe: "ונצואלה",
		nameEn: "Venezuela",
		geoNames: ["Venezuela"],
		region: "am",
		coords: [-66, 8],
		ranks: [
			null,
			8,
			10,
			null,
			null
		],
		sentiment: "mixed",
		positive: 50,
		mixed: 28,
		negative: 22,
		confidence: "estimated",
		note: "יומיים בטופ 10. אין שיח מקומי מתועד במדגם."
	},
	{
		id: "SV",
		nameHe: "אל סלוודור",
		nameEn: "El Salvador",
		geoNames: ["El Salvador"],
		region: "am",
		coords: [-88.9, 13.7],
		ranks: [
			null,
			10,
			null,
			null,
			null
		],
		sentiment: "mixed",
		positive: 54,
		mixed: 28,
		negative: 18,
		confidence: "estimated",
		note: "יום אחד בטופ 10 לפי FlixPatrol."
	},
	{
		id: "EE",
		nameHe: "אסטוניה",
		nameEn: "Estonia",
		geoNames: ["Estonia"],
		region: "eu",
		coords: [25, 58.6],
		ranks: [
			null,
			8,
			null,
			null,
			null
		],
		sentiment: "mixed",
		positive: 60,
		mixed: 24,
		negative: 16,
		confidence: "estimated",
		note: "יום בטופ 10. הערכה לפי צפון-אירופה במדגם."
	},
	{
		id: "LV",
		nameHe: "לטביה",
		nameEn: "Latvia",
		geoNames: ["Latvia"],
		region: "eu",
		coords: [24.1, 56.9],
		ranks: [
			null,
			10,
			null,
			null,
			null
		],
		sentiment: "mixed",
		positive: 58,
		mixed: 26,
		negative: 16,
		confidence: "estimated",
		note: "יום בטופ 10. אין ציטוט מקומי."
	},
	{
		id: "IS",
		nameHe: "איסלנד",
		nameEn: "Iceland",
		geoNames: ["Iceland"],
		region: "eu",
		coords: [-19, 65],
		ranks: [
			null,
			9,
			null,
			null,
			null
		],
		sentiment: "mixed",
		positive: 62,
		mixed: 22,
		negative: 16,
		confidence: "estimated",
		note: "יום בטופ 10 לפי FlixPatrol."
	},
	{
		id: "MT",
		nameHe: "מלטה",
		nameEn: "Malta",
		geoNames: ["Malta"],
		region: "eu",
		coords: [14.4, 35.9],
		ranks: [
			7,
			4,
			5,
			6,
			6
		],
		sentiment: "mixed",
		positive: 60,
		mixed: 24,
		negative: 16,
		confidence: "estimated",
		note: "דירוג עקבי בטופ 10. מדינה קטנה — הערכה לפי דרום-אירופה."
	}
]);
var globalQuotes = [
	{
		text: "בכיתי את הנשמה. בדרך כלל אני לא בוכה מסדרות או מסרטים.",
		by: "צופה לא-ישראלי ולא-יהודי",
		tone: "emotional",
		source: "Ynet"
	},
	{
		text: "לא הצלחתי לדבר לאורך שני הפרקים וגם די הרבה אחריהם. הכול הרגיש אמיתי מדי. שום הפקה הוליוודית לא מתקרבת לזה.",
		by: "צופה בינלאומי",
		tone: "emotional",
		source: "Ynet"
	},
	{
		text: "זו הפעם הראשונה שהיתה לי התקפת חרדה תוך כדי צפייה בסדרה. אני לא יכול לדמיין איך זה למי שבאמת עבר את זה.",
		by: "צופה בינלאומי",
		tone: "emotional",
		source: "Ynet"
	},
	{
		text: "לא הצלחתי להפסיק לבכות בסצנה שבה הבת של אלי אומרת לאמא, כשהמחבלים מחוץ למרחב המוגן: סליחה אמא, שכחתי להחזיר את העוגה למקרר. כמה קשה ליהודים פשוט לחיות חיים נורמליים. העונה הטובה ביותר.",
		by: "צופה בינלאומי",
		tone: "positive",
		source: "Ynet"
	}
];
function peakRank(c) {
	const nums = c.ranks.filter((n) => n != null);
	return nums.length ? Math.min(...nums) : null;
}
function latestRank(c) {
	for (let i = c.ranks.length - 1; i >= 0; i--) {
		const v = c.ranks[i];
		if (v != null) return v;
	}
	return null;
}
function inTop10(c) {
	return peakRank(c) != null;
}
function isTalkOnly(c) {
	return peakRank(c) == null;
}
function rankHeat(rank) {
	if (rank == null) return 0;
	return (11 - rank) / 10;
}
var byGeo = /* @__PURE__ */ new Map();
for (const c of countries) for (const n of c.geoNames) byGeo.set(n, c);
var byNumeric = /* @__PURE__ */ new Map();
for (const c of countries) {
	const iso = ISO_BY_ALPHA2[c.id];
	if (iso) byNumeric.set(iso.numeric, c);
}
function countryByGeoName(name, list) {
	if (!list) return byGeo.get(name);
	for (const c of list) if (c.geoNames.includes(name)) return c;
}
function countryByIsoNumeric(id, list) {
	if (id == null || id === "") return void 0;
	const key = String(id).padStart(3, "0");
	if (!list) return byNumeric.get(key);
	for (const c of list) if (ISO_BY_ALPHA2[c.id]?.numeric === key) return c;
}
function countryById(id, list = countries) {
	return list.find((c) => c.id === id);
}
countries.filter((c) => c.geoNames.length === 0);
function allQuotes(list = countries, extra = globalQuotes) {
	const out = extra.map((q) => ({ ...q }));
	for (const c of list) for (const q of c.quotes ?? []) out.push({
		...q,
		country: c
	});
	return out;
}
function regionStats(list = countries) {
	const groups = {
		me: [],
		eu: [],
		am: [],
		aa: []
	};
	for (const c of list) groups[c.region].push(c);
	return Object.keys(groups).map((region) => {
		const group = groups[region];
		const n = group.length || 1;
		const positive = Math.round(group.reduce((s, c) => s + c.positive, 0) / n);
		const mixed = Math.round(group.reduce((s, c) => s + c.mixed, 0) / n);
		const negative = Math.round(group.reduce((s, c) => s + c.negative, 0) / n);
		const watching = group.filter(inTop10).length;
		return {
			region,
			label: REGION_LABEL[region],
			positive,
			mixed,
			negative,
			watching,
			total: group.length
		};
	});
}
var SEARCH_ALIASES = {
	US: [
		"ארהב",
		"ארה״ב",
		"ארה\"ב",
		"אמריקה",
		"USA",
		"America",
		"US"
	],
	GB: [
		"אנגליה",
		"UK",
		"Britain",
		"England",
		"בריטניה"
	],
	AE: [
		"אמירויות",
		"דובאי",
		"אבו דאבי",
		"UAE",
		"Emirates"
	],
	SA: ["סעודיה", "KSA"],
	CZ: [
		"צכיה",
		"Czech",
		"Czech Republic"
	],
	CL: ["צילה"],
	NL: ["Holland"],
	QA: ["קטר"],
	OM: ["עומן"],
	CH: ["שוייץ"],
	TR: ["Türkiye", "Turkiye"],
	LY: ["ליביה"],
	LK: ["סרילנקה", "SriLanka"],
	PS: [
		"עזה",
		"גדה",
		"פלסטין",
		"Gaza",
		"West Bank"
	],
	KR: ["קוריאה", "Korea"],
	ZA: ["דרום אפריקה", "RSA"]
};
function foldQuery(s) {
	return s.normalize("NFKC").toLowerCase().replace(/[״"׳'`]/g, "").replace(/[-_,.]/g, " ").replace(/\s+/g, " ").trim();
}
function matchScore(field, q, exact, prefix, contains) {
	const f = foldQuery(field);
	if (!f) return 0;
	if (f === q) return exact;
	if (f.startsWith(q)) return prefix;
	if (f.includes(q)) return contains;
	return 0;
}
function searchCountries(query, list = countries) {
	const q = foldQuery(query);
	if (!q) return [];
	const hits = [];
	for (const country of list) {
		let score = 0;
		let matched = country.nameHe;
		const consider = (field, exact, prefix, contains) => {
			const s = matchScore(field, q, exact, prefix, contains);
			if (s > score) {
				score = s;
				matched = field;
			}
		};
		consider(country.nameHe, 100, 86, 62);
		consider(country.nameEn, 96, 82, 58);
		consider(country.id, 94, 88, 40);
		const iso = isoOf(country.id);
		consider(iso.alpha3, 93, 84, 36);
		consider(iso.numeric, 91, 50, 20);
		consider(String(Number(iso.numeric)), 91, 50, 20);
		for (const n of country.geoNames) consider(n, 90, 74, 52);
		for (const a of SEARCH_ALIASES[country.id] ?? []) consider(a, 92, 78, 54);
		if (score > 0) hits.push({
			country,
			score,
			matched
		});
	}
	hits.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		const pa = peakRank(a.country) ?? 99;
		const pb = peakRank(b.country) ?? 99;
		if (pa !== pb) return pa - pb;
		return a.country.nameHe.localeCompare(b.country.nameHe, "he");
	});
	return hits;
}
function searchSuggestions(list = countries) {
	const top = [...list].sort((a, b) => {
		const pa = peakRank(a) ?? 99;
		const pb = peakRank(b) ?? 99;
		if (pa !== pb) return pa - pb;
		return b.positive - a.positive;
	}).slice(0, 8);
	const seen = new Set(top.map((c) => c.id));
	for (const id of [
		"US",
		"GB",
		"LY"
	]) {
		const extra = countryById(id, list);
		if (extra && !seen.has(extra.id)) {
			top.push(extra);
			seen.add(extra.id);
		}
	}
	return top;
}
var social_default = /*#__PURE__*/ JSON.parse("[{\"id\":\"fb-karin-brauner\",\"platform\":\"facebook\",\"country\":\"IL\",\"by\":\"Karin Brauner\",\"text\":\"The most personal season of the Israeli thriller so far.\",\"note\":\"שיתוף כתבת Decider (Stream It) בפייסבוק. 4,250+ תגובות רגש, 456 תגובות, 104 שיתופים. פייסבוק חוסם קריאה ציבורית — הנתון מהצילום שצורף.\",\"url\":\"https://www.facebook.com/share/14r9hwjWzs9/\",\"tone\":\"positive\",\"reactions\":4250,\"comments\":456,\"shares\":104,\"at\":\"2026-09-10\",\"lang\":\"en\"},{\"id\":\"x-enthoven\",\"platform\":\"x\",\"country\":\"FR\",\"by\":\"Raphaël Enthoven\",\"handle\":\"@Enthoven_R\",\"text\":\"Les épisodes 7 et 8 de la 5è saison de Fauda accomplissent le tour de force d'être extrêmement violents tout en étant d'une remarquable pudeur. L'essentiel est de donner l'horreur à sentir sans prétendre la reproduire. Le résultat est insoutenable.\",\"url\":\"https://x.com/Enthoven_R/status/2099405649121534136\",\"tone\":\"emotional\",\"reactions\":659,\"shares\":158,\"comments\":50,\"views\":14813,\"at\":\"2026-09-14\",\"lang\":\"fr\"},{\"id\":\"x-ido-daniel\",\"platform\":\"x\",\"country\":\"IL\",\"by\":\"Ido Daniel\",\"handle\":\"@IdoDaniel\",\"text\":\"Everyone is talking about how painfully realistic FAUDA Season 5 feels. For me, it was different. Not because it felt intense, but because I know reality was worse.\",\"url\":\"https://x.com/IdoDaniel/status/2099124606141379051\",\"tone\":\"emotional\",\"reactions\":5405,\"shares\":1631,\"comments\":192,\"views\":151234,\"at\":\"2026-09-13\",\"lang\":\"en\"},{\"id\":\"x-poupko\",\"platform\":\"x\",\"country\":\"US\",\"by\":\"Rabbi Elchanan Poupko\",\"handle\":\"@RabbiPoupko\",\"text\":\"If you can, you should most certainly watch Fauda season 5. With brilliance and talent, the creators and actors show you what October 7th meant to victims of this worst massacre against the Jewish people since the Holocaust.\",\"url\":\"https://x.com/RabbiPoupko/status/2099453672526647512\",\"tone\":\"positive\",\"reactions\":1,\"views\":35,\"at\":\"2026-09-14\",\"lang\":\"en\"},{\"id\":\"x-montefiore\",\"platform\":\"x\",\"country\":\"GB\",\"by\":\"Simon Sebag Montefiore\",\"handle\":\"@simonmontefiore\",\"text\":\"Today, Fauda is no 1 in Lebanon and also #2 in Bahrain, Jordan and the UAE. Culture crosses borders — and storytelling can break the truth of what really happened to young people who get their information from fleeting images on screens not books.\",\"url\":\"https://x.com/simonmontefiore/status/2099435717067698408\",\"tone\":\"positive\",\"reactions\":256,\"shares\":47,\"comments\":10,\"views\":9323,\"at\":\"2026-09-14\",\"lang\":\"en\"},{\"id\":\"x-nanasts\",\"platform\":\"x\",\"country\":\"BR\",\"by\":\"Nanasts\",\"handle\":\"@Nanas1988\",\"text\":\"Essa temporada 5 eles mostram os acontecimentos em Israel quando Hamas atacou. Eu não esperava que eles fossem incluir isso, mas fizeram isso muito bem. Eu fiquei em choque. FAUDA sempre surpreende! 9/10\",\"url\":\"https://x.com/Nanas1988/status/2099453194304676014\",\"tone\":\"emotional\",\"at\":\"2026-09-14\",\"lang\":\"pt\"},{\"id\":\"x-eric-nl\",\"platform\":\"x\",\"country\":\"NL\",\"by\":\"Eric\",\"handle\":\"@Eric76096489183\",\"text\":\"Fauda is al jaren de soft power propaganda serie van Israël. Laten we vooral nooit vergeten dat Israël de bezetter is en een apartheid staat. De serie is volledig gestoeld op het Israëlische narratief waarbij Israël als slachtoffer wordt geportretteerd.\",\"url\":\"https://x.com/Eric76096489183/status/2099451738482696247\",\"tone\":\"critical\",\"views\":30,\"at\":\"2026-09-14\",\"lang\":\"nl\"},{\"id\":\"x-eastmed\",\"platform\":\"x\",\"country\":\"GB\",\"by\":\"EastMedMonitor\",\"handle\":\"@EastMedMonitor\",\"text\":\"Fauda Season 5 is doing what official talking points rarely can: putting a face on the wound. This season leans even harder Israeli; some critics say it lost the earlier habit of humanizing both sides. Fair. Understanding why Israelis reached for overwhelming force is not the same as blessing every result.\",\"url\":\"https://x.com/EastMedMonitor/status/2099081919535145026\",\"tone\":\"emotional\",\"reactions\":26,\"shares\":14,\"views\":735,\"at\":\"2026-09-13\",\"lang\":\"en\"},{\"id\":\"tt-fauda285\",\"platform\":\"tiktok\",\"country\":\"IL\",\"by\":\"fauda285\",\"handle\":\"@fauda285\",\"text\":\"דורון הגואט. העונה החמישית של פאודה — דורון קביליו המלך.\",\"note\":\"קליפ טיקטוק בעברית עם מאות אלפי צפיות. טיקטוק לא נפתח לאיסוף מלא — הנתון מחיפוש פומבי.\",\"url\":\"https://www.tiktok.com/discover/%D7%A4%D7%90%D7%95%D7%93%D7%94-%D7%A2%D7%95%D7%A0%D7%94-5\",\"tone\":\"positive\",\"views\":403600,\"at\":\"2026-09\",\"lang\":\"he\"},{\"id\":\"tt-steve\",\"platform\":\"tiktok\",\"country\":\"IL\",\"by\":\"greenapplelollipopp\",\"handle\":\"@greenapplelollipopp\",\"text\":\"הרג אותי איך שהוא אמר סטיב וראו שהוא שיקר.\",\"note\":\"תגובת ספוילר בעברית לקטע בעונה 5. מדגם מתועד, לא פיד מלא.\",\"url\":\"https://www.tiktok.com/tag/%D7%A4%D7%90%D7%95%D7%93%D7%94%D7%A2%D7%95%D7%A0%D7%94-5\",\"tone\":\"emotional\",\"views\":43700,\"at\":\"2026-09\",\"lang\":\"he\"},{\"id\":\"x-mirisch\",\"platform\":\"x\",\"country\":\"US\",\"by\":\"John Mirisch\",\"handle\":\"@JohnMirisch\",\"text\":\"The “fictional” Fauda, Season 5 (particularly episodes 7 and 8) contains more truth than the “documentary” Naza. A world infected by antizionism needs more Fauda.\",\"url\":\"https://x.com/JohnMirisch/status/2099465763237372366\",\"tone\":\"positive\",\"at\":\"2026-09-14\",\"lang\":\"en\"},{\"id\":\"x-streetwize\",\"platform\":\"x\",\"country\":\"US\",\"by\":\"Iris\",\"handle\":\"@streetwize\",\"text\":\"Fauda takes New York. The cast and creators were at 92NY for a Season 5 screening. Proud Israeli storytelling on the world stage.\",\"url\":\"https://x.com/streetwize/status/2099462725906714640\",\"tone\":\"positive\",\"reactions\":9,\"shares\":5,\"views\":152,\"at\":\"2026-09-14\",\"lang\":\"en\"},{\"id\":\"x-naftali\",\"platform\":\"x\",\"country\":\"IL\",\"by\":\"Hananya Naftali\",\"handle\":\"@HananyaNaftali\",\"text\":\"Fauda's new season 5 is now viewed by millions on Netflix, and it raises very important awareness about October 7 in front of the entire world.\",\"url\":\"https://x.com/HananyaNaftali/status/2099457037113479204\",\"tone\":\"positive\",\"reactions\":13,\"views\":2227,\"at\":\"2026-09-14\",\"lang\":\"en\"},{\"id\":\"x-ritvik\",\"platform\":\"x\",\"country\":\"IN\",\"by\":\"Raj\",\"handle\":\"@Ritvik_raj\",\"text\":\"Loved every episode and season of Fauda, episode 7 and 8 of season 5 was so intense, it showed reality of 7th October, it was so painful to watch.\",\"url\":\"https://x.com/Ritvik_raj/status/2099459094889529544\",\"tone\":\"emotional\",\"views\":30,\"at\":\"2026-09-14\",\"lang\":\"en\"},{\"id\":\"x-steinsapir\",\"platform\":\"x\",\"country\":\"CL\",\"by\":\"Allan Steinsapir\",\"handle\":\"@asteinsapir\",\"text\":\"Recomiendo Fauda temporada 5. En realidad, todas las temporadas. Muy buena serie.\",\"url\":\"https://x.com/asteinsapir/status/2099456917399634350\",\"tone\":\"positive\",\"reactions\":5,\"shares\":3,\"comments\":2,\"views\":37,\"at\":\"2026-09-14\",\"lang\":\"es\"},{\"id\":\"x-ann-uk\",\"platform\":\"x\",\"country\":\"GB\",\"by\":\"AnnMSoul58\",\"handle\":\"@ann_burbid89083\",\"text\":\"Fauda is now number 8 here in the UK Netflix chart after just one day. Season 5 depicted October 7 massacres — very disturbing. Was in tears for most of it.\",\"url\":\"https://x.com/ann_burbid89083/status/2099157619789254923\",\"tone\":\"emotional\",\"reactions\":10,\"views\":461,\"at\":\"2026-09-13\",\"lang\":\"en\"},{\"id\":\"x-isaac-ar\",\"platform\":\"x\",\"country\":\"AR\",\"by\":\"Isaac\",\"handle\":\"@isaacrrr7\",\"text\":\"EFECTO FAUDA. La quinta temporada es Nº1 en Netflix en Líbano y arrasa también en Europa. Los episodios 7 y 8 están mostrando al mundo una parte del horror. La realidad fue infinitamente peor.\",\"url\":\"https://x.com/isaacrrr7/status/2099112566463062067\",\"tone\":\"emotional\",\"reactions\":2624,\"shares\":495,\"comments\":77,\"views\":27684,\"at\":\"2026-09-13\",\"lang\":\"es\"},{\"id\":\"x-ben-ng\",\"platform\":\"x\",\"country\":\"NG\",\"by\":\"Ben\",\"handle\":\"@stbenjaminA\",\"text\":\"After watching FAUDA, I can comfortably say that whatever the Israelis did afterwards was justifiable to save her citizens. Terror anywhere is terror everywhere.\",\"url\":\"https://x.com/stbenjaminA/status/2099118273916739706\",\"tone\":\"positive\",\"reactions\":6,\"views\":112,\"at\":\"2026-09-13\",\"lang\":\"en\"},{\"id\":\"x-jpost\",\"platform\":\"x\",\"country\":\"IL\",\"by\":\"The Jerusalem Post\",\"handle\":\"@Jerusalem_Post\",\"text\":\"Netflix viewers worldwide said Fauda’s portrayal of October 7 changed their understanding of the Hamas-led massacre.\",\"url\":\"https://x.com/Jerusalem_Post/status/2099276876984246442\",\"tone\":\"emotional\",\"reactions\":2848,\"shares\":431,\"comments\":115,\"views\":123377,\"at\":\"2026-09-13\",\"lang\":\"en\"},{\"id\":\"x-itongadol\",\"platform\":\"x\",\"country\":\"AR\",\"by\":\"ITON GADOL\",\"handle\":\"@Itongadol\",\"text\":\"Gracias, Fauda 5. Agradecer a los creadores por dejar un gran registro de la masacre del 7 de octubre para las futuras generaciones. Am Israel Jai.\",\"url\":\"https://x.com/Itongadol/status/2098985513197650239\",\"tone\":\"positive\",\"reactions\":1070,\"shares\":309,\"comments\":36,\"views\":7392,\"at\":\"2026-09-13\",\"lang\":\"es\"},{\"id\":\"x-sage\",\"platform\":\"x\",\"country\":\"GB\",\"by\":\"Sage Despatches\",\"handle\":\"@SageDespatches\",\"text\":\"Season 5 of Fauda is set after the October 7th terrorist atrocity. If you haven't watched Fauda, I can highly recommend it.\",\"url\":\"https://x.com/SageDespatches/status/2099227501931208959\",\"tone\":\"positive\",\"reactions\":50,\"shares\":3,\"comments\":8,\"views\":1240,\"at\":\"2026-09-13\",\"lang\":\"en\"}]");
var comment_mood_default = {
	sampleSize: 28,
	facebookLocked: 456,
	facebookReactions: 4250,
	buckets: {
		"support": 20,
		"mixed": 3,
		"critical": 5
	},
	emotions: {
		"grief": 7,
		"praise": 6,
		"tooHard": 1,
		"sanitized": 3,
		"anger": 4,
		"solidarity": 2,
		"critical": 5
	},
	comments: [
		{
			"id": "fb-kotie",
			"platform": "facebook",
			"by": "Kotie van der Merwe",
			"text": "Brilliant series. There are 2 episodes in Season 5 that make you realize what really happened on October 7th. It is truly heartbreaking.",
			"emotion": "grief",
			"bucket": "support",
			"url": "https://www.facebook.com/FaudaOfficialIL/",
			"lang": "en"
		},
		{
			"id": "fb-hein",
			"platform": "facebook",
			"by": "Hein Swanevelder",
			"text": "It is world wide the best !!! Am Israel chai",
			"emotion": "praise",
			"bucket": "support",
			"url": "https://www.facebook.com/FaudaOfficialIL/",
			"lang": "en"
		},
		{
			"id": "x-ella",
			"platform": "x",
			"by": "Ella M",
			"text": "Thank you for documenting the pure evil of the 7th. 3 years and I can’t get myself to watch your entire video.",
			"emotion": "tooHard",
			"bucket": "support",
			"url": "https://x.com/IdoDaniel/status/2099124606141379051",
			"lang": "en"
		},
		{
			"id": "x-nervana",
			"platform": "x",
			"by": "Nervana Mahmoud",
			"text": "Agree Ido. I think it sanitised reality, but still highlighting many aspects of it.",
			"emotion": "sanitized",
			"bucket": "mixed",
			"url": "https://x.com/IdoDaniel/status/2099124606141379051",
			"lang": "en"
		},
		{
			"id": "x-valerie",
			"platform": "x",
			"by": "Valerie",
			"text": "And we mustn't forget the foreign workers who were slaughtered too. Thailand, Tanzania, Nepalese, Filipino caregivers, a Cambodian student.",
			"emotion": "anger",
			"bucket": "support",
			"url": "https://x.com/IdoDaniel/status/2099124606141379051",
			"lang": "en"
		},
		{
			"id": "x-saikumar",
			"platform": "x",
			"by": "saikumar",
			"text": "My tears could not stop as I watched the horrific massacre. The world must never forget the lives that were lost.",
			"emotion": "grief",
			"bucket": "support",
			"url": "https://x.com/IdoDaniel/status/2099124606141379051",
			"lang": "en"
		},
		{
			"id": "x-india",
			"platform": "x",
			"by": "saikumar",
			"text": "As an Indian, I stand with the people of Israel and with all innocent victims of terrorism.",
			"emotion": "solidarity",
			"bucket": "support",
			"url": "https://x.com/IdoDaniel/status/2099124606141379051",
			"lang": "en"
		},
		{
			"id": "x-njmom",
			"platform": "x",
			"by": "nj mom 32",
			"text": "Will the media ever tell the truth of Palestinian crimes against humanity on 10/7?",
			"emotion": "anger",
			"bucket": "support",
			"url": "https://x.com/IdoDaniel/status/2099124606141379051",
			"lang": "en"
		},
		{
			"id": "x-ciprian",
			"platform": "x",
			"by": "Ciprian Bujor",
			"text": "Military response should be against military targets, not civilians, civilian infrastructure, journalists, children.",
			"emotion": "critical",
			"bucket": "critical",
			"url": "https://x.com/IdoDaniel/status/2099124606141379051",
			"lang": "en"
		},
		{
			"id": "x-tania",
			"platform": "x",
			"by": "Tania Rappo",
			"text": "À voir absolument ! Époustouflant.",
			"emotion": "praise",
			"bucket": "support",
			"url": "https://x.com/Enthoven_R/status/2099405649121534136",
			"lang": "fr"
		},
		{
			"id": "x-kay",
			"platform": "x",
			"by": "Daniel Kay",
			"text": "Fauda manages to show the hard truths without displaying the actual violence. And it worked brilliantly.",
			"emotion": "praise",
			"bucket": "support",
			"url": "https://x.com/Enthoven_R/status/2099405649121534136",
			"lang": "en"
		},
		{
			"id": "x-coup",
			"platform": "x",
			"by": "Coup de grace",
			"text": "Ni les enfants morts sous les bombes d’Israel",
			"emotion": "critical",
			"bucket": "critical",
			"url": "https://x.com/Enthoven_R/status/2099405649121534136",
			"lang": "fr"
		},
		{
			"id": "x-jaco",
			"platform": "x",
			"by": "Jaco Pistorius",
			"text": "Le tweet de la honte. Tu penses quoi de la directive Hannibal ? Dans les crimes que tu imputes au Hamas, certains ont été debunkés.",
			"emotion": "critical",
			"bucket": "critical",
			"url": "https://x.com/Enthoven_R/status/2099405649121534136",
			"lang": "fr"
		},
		{
			"id": "x-nico",
			"platform": "x",
			"by": "NicoGms",
			"text": "Oui oui allez va tepalycher sur ton génocidaire Netanyahou et ferme ta gueule",
			"emotion": "critical",
			"bucket": "critical",
			"url": "https://x.com/Enthoven_R/status/2099405649121534136",
			"lang": "fr"
		},
		{
			"id": "x-jp",
			"platform": "x",
			"by": "Jean Pierre Rodriguez",
			"text": "Les états ne se croient plus responsables des morts lorsqu'ils tuent en appuyant sur un bouton. Ils appellent ça victimes collatérales.",
			"emotion": "critical",
			"bucket": "critical",
			"url": "https://x.com/Enthoven_R/status/2099405649121534136",
			"lang": "fr"
		},
		{
			"id": "x-isa",
			"platform": "x",
			"by": "Isa Fab",
			"text": "Ces images sont moins nettes que celles filmées avec les GoPro du Hamas. Un problème technique à votre avis ?",
			"emotion": "sanitized",
			"bucket": "mixed",
			"url": "https://x.com/Enthoven_R/status/2099405649121534136",
			"lang": "fr"
		},
		{
			"id": "x-alex",
			"platform": "x",
			"by": "Alex Granford",
			"text": "It was very hard watching episodes 7 and 8 just after standing on the sites of October 7. That orange container where kids tried to hide is real and still stands at Nova.",
			"emotion": "grief",
			"bucket": "support",
			"url": "https://x.com/simonmontefiore/status/2099435717067698408",
			"lang": "en"
		},
		{
			"id": "x-woland",
			"platform": "x",
			"by": "Woland's cat",
			"text": "It's very good, even if the Oct 7 episodes show 5% of the truth. What's incredible is that even 5% is hideous.",
			"emotion": "sanitized",
			"bucket": "mixed",
			"url": "https://x.com/simonmontefiore/status/2099435717067698408",
			"lang": "en"
		},
		{
			"id": "x-harry",
			"platform": "x",
			"by": "Harry One",
			"text": "If you truly want to understand history, then read the fiction of the era in question.",
			"emotion": "praise",
			"bucket": "support",
			"url": "https://x.com/simonmontefiore/status/2099435717067698408",
			"lang": "en"
		},
		{
			"id": "x-kevin",
			"platform": "x",
			"by": "Kevin cubbin",
			"text": "You can not unsee what the religion of peace did ….from a Christian",
			"emotion": "anger",
			"bucket": "support",
			"url": "https://x.com/IdoDaniel/status/2099124606141379051",
			"lang": "en"
		},
		{
			"id": "tt-fauda285-c",
			"platform": "tiktok",
			"by": "fauda285",
			"text": "דורון הגואט. העונה החמישית של פאודה — דורון קביליו המלך.",
			"emotion": "praise",
			"bucket": "support",
			"url": "https://www.tiktok.com/discover/%D7%A4%D7%90%D7%95%D7%93%D7%94-%D7%A2%D7%95%D7%A0%D7%94-5",
			"lang": "he"
		},
		{
			"id": "tt-steve-c",
			"platform": "tiktok",
			"by": "greenapplelollipopp",
			"text": "הרג אותי איך שהוא אמר סטיב וראו שהוא שיקר.",
			"emotion": "grief",
			"bucket": "support",
			"url": "https://www.tiktok.com/tag/%D7%A4%D7%90%D7%95%D7%93%D7%94%D7%A2%D7%95%D7%A0%D7%94-5",
			"lang": "he"
		},
		{
			"id": "x-ritvik-c",
			"platform": "x",
			"by": "Raj",
			"text": "Episode 7 and 8 of season 5 was so intense, it showed reality of 7th October, it was so painful to watch.",
			"emotion": "grief",
			"bucket": "support",
			"url": "https://x.com/Ritvik_raj/status/2099459094889529544",
			"lang": "en"
		},
		{
			"id": "x-ann-c",
			"platform": "x",
			"by": "AnnMSoul58",
			"text": "Season 5 depicted October 7 massacres was very disturbing and really upsetting. Was in tears for most of it.",
			"emotion": "grief",
			"bucket": "support",
			"url": "https://x.com/ann_burbid89083/status/2099157619789254923",
			"lang": "en"
		},
		{
			"id": "x-isaac-c",
			"platform": "x",
			"by": "Isaac",
			"text": "Los episodios 7 y 8 están mostrando al mundo una parte del horror que vivió Israel. Y muchos empiezan a entender: la realidad fue infinitamente peor.",
			"emotion": "grief",
			"bucket": "support",
			"url": "https://x.com/isaacrrr7/status/2099112566463062067",
			"lang": "es"
		},
		{
			"id": "x-ben-c",
			"platform": "x",
			"by": "Ben",
			"text": "After watching FAUDA I can say that whatever the Israelis did afterwards was justifiable to save her citizens. Terror anywhere is terror everywhere.",
			"emotion": "anger",
			"bucket": "support",
			"url": "https://x.com/stbenjaminA/status/2099118273916739706",
			"lang": "en"
		},
		{
			"id": "x-mirisch-c",
			"platform": "x",
			"by": "John Mirisch",
			"text": "The fictional Fauda Season 5 contains more truth than the documentary Naza. The world needs more Fauda.",
			"emotion": "praise",
			"bucket": "support",
			"url": "https://x.com/JohnMirisch/status/2099465763237372366",
			"lang": "en"
		},
		{
			"id": "x-iton-c",
			"platform": "x",
			"by": "ITON GADOL",
			"text": "Agradecer a los creadores de FAUDA por dejar un gran registro de la masacre del 7 de octubre para las futuras generaciones.",
			"emotion": "solidarity",
			"bucket": "support",
			"url": "https://x.com/Itongadol/status/2098985513197650239",
			"lang": "es"
		}
	]
};
var social_tr_default = {
	"fb-karin-brauner": {
		"he": "העונה האישית ביותר של המותחן הישראלי עד כה.",
		"en": "The most personal season of the Israeli thriller so far.",
		"ar": "الموسم الأكثر خصوصية للإثارة الإسرائيلية حتى الآن.",
		"fr": "La saison la plus personnelle du thriller israélien à ce jour.",
		"es": "La temporada más personal del thriller israelí hasta ahora.",
		"ru": "Самый личный сезон израильского триллера на сегодня."
	},
	"x-enthoven": {
		"he": "פרקים 7 ו־8 בעונה 5 של פאודה מצליחים להיות אלימים מאוד ובאותה עת מאופקים להפליא. העיקר לתת להרגיש את האימה בלי לשחזר אותה. התוצאה בלתי נסבלת.",
		"en": "Episodes 7 and 8 of Fauda season 5 manage to be extremely violent while remaining remarkably restrained. The point is to make the horror felt without reproducing it. The result is unbearable.",
		"ar": "الحلقتان 7 و8 من الموسم الخامس لفوضى عنيفتان للغاية وفي الوقت نفسه متزمتان بشكل لافت. المطلوب الإحساس بالرعب دون إعادة إنتاجه. النتيجة لا تُحتمل.",
		"fr": "Les épisodes 7 et 8 de la 5è saison de Fauda accomplissent le tour de force d'être extrêmement violents tout en étant d'une remarquable pudeur. L'essentiel est de donner l'horreur à sentir sans prétendre la reproduire. Le résultat est insoutenable.",
		"es": "Los episodios 7 y 8 de la temporada 5 de Fauda logran ser extremadamente violentos y a la vez notablemente contenidos. Lo esencial es hacer sentir el horror sin reproducirlo. El resultado es insoportable.",
		"ru": "Серии 7 и 8 пятого сезона «Фауда» одновременно крайне жестоки и удивительно сдержанны. Важно дать почувствовать ужас, не воспроизводя его. Результат невыносим."
	},
	"x-ido-daniel": {
		"he": "כולם מדברים על כמה עונה 5 של פאודה ריאליסטית עד כאב. אצלי זה היה אחרת. לא כי זה היה אינטנסיבי, אלא כי אני יודע שהמציאות הייתה גרועה יותר.",
		"en": "Everyone is talking about how painfully realistic FAUDA Season 5 feels. For me, it was different. Not because it felt intense, but because I know reality was worse.",
		"ar": "الجميع يتحدث عن واقعية الموسم الخامس من فوضى المؤلمة. بالنسبة لي كان الأمر مختلفاً. ليس لأنه كان مكثفاً، بل لأنني أعرف أن الواقع كان أسوأ.",
		"fr": "Tout le monde dit à quel point la saison 5 de Fauda est douloureusement réaliste. Pour moi, c’était différent. Pas parce que c’était intense, mais parce que je sais que la réalité était pire.",
		"es": "Todos hablan de lo dolorosamente realista que es Fauda 5. Para mí fue distinto. No porque fuera intenso, sino porque sé que la realidad fue peor.",
		"ru": "Все говорят, насколько мучительно реалистичен 5 сезон «Фауда». Для меня было иначе: не из‑за напряжения, а потому что реальность была хуже."
	},
	"x-poupko": {
		"he": "אם אתם יכולים — כדאי מאוד לראות את פאודה עונה 5. בכישרון, היוצרים והשחקנים מראים מה משמעות ה־7 באוקטובר לקורבנות הטבח הנורא ביותר נגד העם היהודי מאז השואה.",
		"en": "If you can, you should most certainly watch Fauda season 5. With brilliance and talent, the creators and actors show you what October 7th meant to victims of this worst massacre against the Jewish people since the Holocaust.",
		"ar": "إن استطعتم، عليكم مشاهدة الموسم الخامس من فوضى. المبدعون والممثلون يُظهرون معنى 7 أكتوبر لضحايا أسوأ مجزرة ضد الشعب اليهودي منذ الهولوكوست.",
		"fr": "Si vous le pouvez, regardez absolument Fauda saison 5. Avec talent, les créateurs et acteurs montrent ce que le 7 octobre a signifié pour les victimes de ce massacre, le pire contre le peuple juif depuis la Shoah.",
		"es": "Si pueden, vean Fauda temporada 5. Con talento, creadores y actores muestran lo que el 7 de octubre significó para las víctimas de la peor masacre contra el pueblo judío desde el Holocausto.",
		"ru": "Если можете — смотрите 5 сезон «Фауда». Авторы и актёры показывают, чем стало 7 октября для жертв худшей резни еврейского народа со времён Холокоста."
	},
	"x-montefiore": {
		"he": "היום פאודה במקום 1 בלבנון וגם 2 בבחריין, ירדן ואיחוד האמירויות. תרבות חוצה גבולות — וסיפור יכול לפרוץ את האמת לצעירים שמקבלים מידע מתמונות חולפות במסך, לא מספרים.",
		"en": "Today, Fauda is no 1 in Lebanon and also #2 in Bahrain, Jordan and the UAE. Culture crosses borders — and storytelling can break the truth of what really happened to young people who get their information from fleeting images on screens not books.",
		"ar": "اليوم فوضى الأولى في لبنان والثانية في البحرين والأردن والإمارات. الثقافة تعبر الحدود، والسرد يوصل الحقيقة لشباب يتلقون معلوماتهم من صور عابرة لا من كتب.",
		"fr": "Aujourd’hui Fauda est n°1 au Liban et n°2 à Bahreïn, en Jordanie et aux Émirats. La culture traverse les frontières, et le récit peut faire passer la vérité à des jeunes informés par des images fugaces, pas par des livres.",
		"es": "Hoy Fauda es n.º 1 en Líbano y n.º 2 en Baréin, Jordania y EAU. La cultura cruza fronteras, y el relato puede llevar la verdad a jóvenes que se informan con imágenes fugaces, no con libros.",
		"ru": "Сегодня «Фауда» — №1 в Ливане и №2 в Бахрейне, Иордании и ОАЭ. Культура пересекает границы, и история может донести правду до молодых, которые узнают новости из мелькающих картинок, а не из книг."
	},
	"x-nanasts": {
		"he": "בעונה 5 הם מראים את מה שקרה בישראל כשחמאס תקף. לא ציפיתי שיכניסו את זה, אבל עשו את זה מצוין. הייתי בהלם. פאודה תמיד מפתיעה! 9/10",
		"en": "Season 5 shows what happened in Israel when Hamas attacked. I didn’t expect them to include it, but they did it very well. I was in shock. FAUDA always surprises! 9/10",
		"ar": "الموسم الخامس يُظهر ما حدث في إسرائيل عندما هاجم حماس. لم أتوقع أن يدرجوا ذلك، لكنهم فعلوه جيداً. صُدمت. فوضى دائماً تفاجئ! 9/10",
		"fr": "La saison 5 montre ce qui s’est passé en Israël quand le Hamas a attaqué. Je ne m’y attendais pas, mais c’est très bien fait. J’étais sous le choc. FAUDA surprend toujours ! 9/10",
		"es": "La temporada 5 muestra lo que pasó en Israel cuando Hamas atacó. No esperaba que lo incluyeran, pero lo hicieron muy bien. Quedé en shock. ¡FAUDA siempre sorprende! 9/10",
		"ru": "5 сезон показывает, что произошло в Израиле, когда ХАМАС напал. Не ожидал, что это включат, но сделано отлично. Я был в шоке. FAUDA всегда удивляет! 9/10"
	},
	"x-eric-nl": {
		"he": "פאודה היא כבר שנים סדרת תעמולה של העוצמה הרכה של ישראל. אסור לשכוח שישראל היא הכובשת ומדינת אפרטהייד. הסדרה בנויה כולה על הנרטיב הישראלי שבו ישראל מוצגת כקורבן.",
		"en": "Fauda has for years been Israel’s soft-power propaganda series. Let’s never forget that Israel is the occupier and an apartheid state. The series is built entirely on the Israeli narrative in which Israel is portrayed as the victim.",
		"ar": "فوضى منذ سنوات سلسلة دعاية للقوة الناعمة الإسرائيلية. لا ننسَ أن إسرائيل محتلة ودولة أبارتهايد. المسلسل قائم بالكامل على السردية الإسرائيلية التي تصوّر إسرائيل ضحية.",
		"fr": "Fauda est depuis des années la série de soft power propagandiste d’Israël. N’oublions jamais qu’Israël est l’occupant et un État d’apartheid. La série repose entièrement sur le récit israélien où Israël est présenté comme victime.",
		"es": "Fauda es desde hace años la serie de propaganda de poder blando de Israel. No olvidemos que Israel es el ocupante y un Estado de apartheid. La serie se basa por completo en el relato israelí que presenta a Israel como víctima.",
		"ru": "«Фауда» уже годы — сериал израильской пропаганды мягкой силы. Нельзя забывать, что Израиль — оккупант и государство апартеида. Сериал целиком построен на израильском нарративе, где Израиль изображён жертвой."
	},
	"x-eastmed": {
		"he": "פאודה 5 עושה מה שנקודות דיבור רשמיות כמעט לא מצליחות: לשים פנים על הפצע. העונה הזו ישראלית יותר; יש מבקרים שאומרים שאיבדה את ההרגל לייצר אנושיות לשני הצדדים. פייר. להבין למה ישראלים פנו לכוח גורף זה לא לאשר כל תוצאה.",
		"en": "Fauda Season 5 is doing what official talking points rarely can: putting a face on the wound. This season leans even harder Israeli; some critics say it lost the earlier habit of humanizing both sides. Fair. Understanding why Israelis reached for overwhelming force is not the same as blessing every result.",
		"ar": "الموسم الخامس من فوضى يفعل ما نادراً ما تفعله الخطابات الرسمية: يضع وجهاً للجرح. هذا الموسم أكثر إسرائيلية؛ بعض النقاد يقولون إنه فقد عادة أنسنة الطرفين. منصف. فهم سبب لجوء الإسرائيليين إلى القوة الساحقة ليس مباركة لكل نتيجة.",
		"fr": "Fauda saison 5 fait ce que les talking points officiels font rarement : donner un visage à la blessure. Cette saison penche encore plus israélienne ; des critiques disent qu’elle a perdu l’habitude d’humaniser les deux camps. C’est juste. Comprendre pourquoi les Israéliens ont recouru à une force écrasante n’est pas bénir chaque résultat.",
		"es": "Fauda 5 hace lo que rara vez logran los mensajes oficiales: ponerle cara a la herida. Esta temporada es más israelí; algunos críticos dicen que perdió la costumbre de humanizar a ambos lados. Justo. Entender por qué los israelíes recurrieron a una fuerza abrumadora no es bendecir cada resultado.",
		"ru": "5 сезон «Фауда» делает то, что официальные формулировки почти не умеют: даёт лицу ране. Сезон ещё более израильский; критики говорят, что пропал навык очеловечивать обе стороны. Справедливо. Понять, почему израильтяне взялись за подавляющую силу, — не значит благословлять каждый итог."
	},
	"tt-fauda285": {
		"he": "דורון הגואט. העונה החמישית של פאודה — דורון קביליו המלך.",
		"en": "Doron the GOAT. Fauda season 5 — Doron Kavillio is king.",
		"ar": "دورون الأفضل. الموسم الخامس من فوضى — دورون كافيليو الملك.",
		"fr": "Doron le GOAT. Fauda saison 5 — Doron Kavillio est le roi.",
		"es": "Doron el GOAT. Fauda temporada 5 — Doron Kavillio es el rey.",
		"ru": "Дорон — GOAT. 5 сезон «Фауда» — Дорон Кавилио король."
	},
	"tt-steve": {
		"he": "הרג אותי איך שהוא אמר סטיב וראו שהוא שיקר.",
		"en": "It killed me how he said Steve and they saw that he had lied.",
		"ar": "قتلني كيف قال ستيف ورأوا أنه كذب.",
		"fr": "Ça m’a achevé, la façon dont il a dit Steve et on a vu qu’il mentait.",
		"es": "Me mató cómo dijo Steve y vieron que mentía.",
		"ru": "Меня убило, как он сказал «Стив», и стало видно, что он солгал."
	},
	"fb-kotie": {
		"he": "סדרה מדהימה. יש שני פרקים בעונה 5 שגורמים להבין מה באמת קרה ב־7 באוקטובר. שובר לב.",
		"en": "Brilliant series. There are 2 episodes in Season 5 that make you realize what really happened on October 7th. It is truly heartbreaking.",
		"ar": "مسلسل رائع. هناك حلقتان في الموسم الخامس تجعلك تدرك ما حدث فعلاً في 7 أكتوبر. يحطم القلب.",
		"fr": "Série brillante. Deux épisodes de la saison 5 font comprendre ce qui s’est vraiment passé le 7 octobre. C’est déchirant.",
		"es": "Serie brillante. Hay 2 episodios en la temporada 5 que te hacen entender lo que pasó el 7 de octubre. Desgarrador.",
		"ru": "Потрясающий сериал. Две серии 5 сезона дают понять, что произошло 7 октября. Разрывает сердце."
	},
	"fb-hein": {
		"he": "הכי טובה בעולם!!! עם ישראל חי",
		"en": "It is world wide the best !!! Am Israel chai",
		"ar": "الأفضل في العالم!!! عم يسرائيل حي",
		"fr": "La meilleure au monde !!! Am Israel chai",
		"es": "¡La mejor del mundo! Am Israel chai",
		"ru": "Лучшая в мире!!! Ам Исраэль хай"
	},
	"x-ella": {
		"he": "תודה שתיעדת את הרוע הטהור של ה־7. שלוש שנים ואני לא מצליחה לצפות בסרטון עד הסוף.",
		"en": "Thank you for documenting the pure evil of the 7th. 3 years and I can’t get myself to watch your entire video.",
		"ar": "شكراً لتوثيق الشر الخالص في السابع. ثلاث سنوات ولا أستطيع مشاهدة الفيديو كاملاً.",
		"fr": "Merci d’avoir documenté le mal pur du 7. Trois ans et je n’arrive pas à regarder toute la vidéo.",
		"es": "Gracias por documentar el mal puro del 7. Tres años y no logro ver el vídeo entero.",
		"ru": "Спасибо, что задокументировали чистое зло 7-го. Три года — и я не могу досмотреть ролик."
	},
	"x-nervana": {
		"he": "מסכימה, עידו. לדעתי זה חיטא את המציאות, אבל עדיין מדגיש הרבה ממנה.",
		"en": "Agree Ido. I think it sanitised reality, but still highlighting many aspects of it.",
		"ar": "أوافق إيدو. أظنه لطّف الواقع، لكنه ما زال يبرز جوانب كثيرة منه.",
		"fr": "D’accord Ido. Je pense que ça a assaini la réalité, mais ça en éclaire encore beaucoup d’aspects.",
		"es": "De acuerdo, Ido. Creo que suavizó la realidad, pero sigue mostrando muchos aspectos.",
		"ru": "Согласна, Идо. Думаю, реальность сгладили, но многое всё же показано."
	},
	"x-valerie": {
		"he": "ואל לנו לשכוח גם את העובדים הזרים שנשחטו. תאילנד, טנזניה, נפאל, מטפלות פיליפיניות, סטודנט מקמבודיה.",
		"en": "And we mustn't forget the foreign workers who were slaughtered too. Thailand, Tanzania, Nepalese, Filipino caregivers, a Cambodian student.",
		"ar": "ولا ننسَ العمال الأجانب الذين ذُبحوا أيضاً. تايلاند، تنزانيا، نيباليون، مقدمات رعاية فلبينيات، طالب كمبودي.",
		"fr": "N’oublions pas non plus les travailleurs étrangers massacrés. Thaïlande, Tanzanie, Népalais, aides-soignantes philippines, un étudiant cambodgien.",
		"es": "No olvidemos a los trabajadores extranjeros también asesinados. Tailandia, Tanzania, nepalíes, cuidadoras filipinas, un estudiante camboyano.",
		"ru": "И нельзя забыть иностранных рабочих, которых тоже убили. Таиланд, Танзания, непальцы, филиппинские сиделки, камбоджийский студент."
	},
	"x-saikumar": {
		"he": "הדמעות לא הפסיקו כשצפיתי בטבח הנורא. העולם חייב לא לשכוח את החיים שאבדו.",
		"en": "My tears could not stop as I watched the horrific massacre. The world must never forget the lives that were lost.",
		"ar": "لم تتوقف دموعي وأنا أشاهد المجزرة المروعة. على العالم ألا ينسى الأرواح التي فُقدت.",
		"fr": "Mes larmes n’ont pas cessé en regardant le massacre. Le monde ne doit jamais oublier les vies perdues.",
		"es": "No pude dejar de llorar al ver la masacre. El mundo no debe olvidar las vidas perdidas.",
		"ru": "Слёзы не останавливались, пока я смотрел резню. Мир не должен забыть погибших."
	},
	"x-india": {
		"he": "כהודי, אני עומד עם עם ישראל ועם כל קורבנות הטרור החפים מפשע.",
		"en": "As an Indian, I stand with the people of Israel and with all innocent victims of terrorism.",
		"ar": "كهندي، أقف مع شعب إسرائيل ومع كل ضحايا الإرهاب الأبرياء.",
		"fr": "En tant qu’Indien, je suis avec le peuple d’Israël et toutes les victimes innocentes du terrorisme.",
		"es": "Como indio, estoy con el pueblo de Israel y con todas las víctimas inocentes del terrorismo.",
		"ru": "Как индеец, я с народом Израиля и со всеми невинными жертвами террора."
	},
	"x-njmom": {
		"he": "האם התקשורת תספר פעם את האמת על פשעי הפלסטינים נגד האנושות ב־7 באוקטובר?",
		"en": "Will the media ever tell the truth of Palestinian crimes against humanity on 10/7?",
		"ar": "هل ستروي وسائل الإعلام يوماً حقيقة جرائم الفلسطينيين ضد الإنسانية في 7 أكتوبر؟",
		"fr": "Les médias diront-ils un jour la vérité sur les crimes contre l’humanité palestiniens du 7 octobre ?",
		"es": "¿Contará alguna vez la prensa la verdad de los crímenes de lesa humanidad palestinos del 7/10?",
		"ru": "Расскажет ли пресса когда‑нибудь правду о палестинских преступлениях против человечности 7 октября?"
	},
	"x-ciprian": {
		"he": "תגובה צבאית צריכה להיות נגד מטרות צבאיות, לא אזרחים, תשתיות אזרחיות, עיתונאים, ילדים.",
		"en": "Military response should be against military targets, not civilians, civilian infrastructure, journalists, children.",
		"ar": "الرد العسكري يجب أن يكون ضد أهداف عسكرية، لا مدنيين ولا بنى مدنية ولا صحفيين ولا أطفال.",
		"fr": "La réponse militaire doit viser des cibles militaires, pas des civils, des infrastructures civiles, des journalistes, des enfants.",
		"es": "La respuesta militar debe ser contra objetivos militares, no civiles, infraestructura civil, periodistas, niños.",
		"ru": "Военный ответ должен быть против военных целей, не гражданских, не инфраструктуры, не журналистов, не детей."
	},
	"x-tania": {
		"he": "חובה לראות! מדהים.",
		"en": "Absolutely must watch! Breathtaking.",
		"ar": "يجب المشاهدة حتماً! مذهل.",
		"fr": "À voir absolument ! Époustouflant.",
		"es": "¡Hay que verlo! Espectacular.",
		"ru": "Обязательно смотреть! Потрясающе."
	},
	"x-kay": {
		"he": "פאודה מצליחה להראות את האמיתות הקשות בלי להציג את האלימות עצמה. וזה עבד בגאונות.",
		"en": "Fauda manages to show the hard truths without displaying the actual violence. And it worked brilliantly.",
		"ar": "فوضى تنجح في إظهار الحقائق القاسية دون عرض العنف نفسه. وقد نجح ذلك ببراعة.",
		"fr": "Fauda parvient à montrer les dures vérités sans afficher la violence réelle. Et ça a magistralement fonctionné.",
		"es": "Fauda logra mostrar las verdades duras sin exhibir la violencia real. Y funcionó de forma brillante.",
		"ru": "«Фауда» показывает тяжёлые истины, не демонстрируя само насилие. И это сработало блестяще."
	},
	"x-coup": {
		"he": "וגם לא את הילדים שמתו תחת הפצצות של ישראל",
		"en": "Nor the children killed under Israel’s bombs",
		"ar": "ولا الأطفال الذين ماتوا تحت قنابل إسرائيل",
		"fr": "Ni les enfants morts sous les bombes d’Israel",
		"es": "Ni los niños muertos bajo las bombas de Israel",
		"ru": "И не детей, погибших под бомбами Израиля"
	},
	"x-jaco": {
		"he": "ציוץ הבושה. מה דעתך על הנחיית חניבעל? בפשעים שאתה מייחס לחמאס, חלק כבר הופרכו.",
		"en": "The tweet of shame. What about the Hannibal directive? Some of the crimes you attribute to Hamas have been debunked.",
		"ar": "تغريدة العار. ما رأيك بتوجيه هانيبال؟ بعض الجرائم التي تنسبها لحماس دُحضت.",
		"fr": "Le tweet de la honte. Tu penses quoi de la directive Hannibal ? Dans les crimes que tu imputes au Hamas, certains ont été debunkés.",
		"es": "El tuit de la vergüenza. ¿Qué hay de la directiva Hannibal? Algunos crímenes que atribuyes a Hamas han sido desmentidos.",
		"ru": "Позорный твит. Что насчёт директивы Ганнибал? Часть преступлений, которые ты приписываешь ХАМАС, опровергнута."
	},
	"x-nico": {
		"he": "כן כן לך תתחכך בנתניהו הרוצח ההמוני שלך ותסתום",
		"en": "Yeah go cozy up to your genocidal Netanyahu and shut up",
		"ar": "أجل اذهب ودلل نتنياهو المجرم لديك واخرس",
		"fr": "Oui oui allez va tepalycher sur ton génocidaire Netanyahou et ferme ta gueule",
		"es": "Sí, sí, ve a arrimarte a tu Netanyahu genocida y cállate",
		"ru": "Да-да, иди ласкайся к своему геноцидному Нетаньяху и заткнись"
	},
	"x-jp": {
		"he": "מדינות כבר לא רואות עצמן אחראיות למתים כשהן הורגות בלחיצת כפתור. הן קוראות לזה נפגעים נלווים כדי להרגיע את המצפון.",
		"en": "States no longer see themselves as responsible for the dead when they kill by pressing a button. They call it collateral damage to soothe their conscience.",
		"ar": "الدول لم تعد ترى نفسها مسؤولة عن الموتى حين تقتل بضغطة زر. يسمونها أضراراً جانبية لتهدئة الضمير.",
		"fr": "Les états ne se croient plus responsables des morts lorsqu'ils tuent en appuyant sur un bouton. Ils appellent ça victimes collatérales.",
		"es": "Los estados ya no se sienten responsables de los muertos cuando matan pulsando un botón. Lo llaman daños colaterales.",
		"ru": "Государства больше не считают себя ответственными за смерти, когда убивают нажатием кнопки. Это называют сопутствующим ущербом."
	},
	"x-isa": {
		"he": "התמונות האלה פחות חדות מאלה שצולמו בגופרו של חמאס. בעיה טכנית לדעתך?",
		"en": "These images are less sharp than those filmed with Hamas GoPros. A technical problem, in your opinion?",
		"ar": "هذه الصور أقل وضوحاً من تلك المصوّرة بغوبرو حماس. مشكلة تقنية برأيك؟",
		"fr": "Ces images sont moins nettes que celles filmées avec les GoPro du Hamas. Un problème technique à votre avis ?",
		"es": "Estas imágenes son menos nítidas que las filmadas con las GoPro de Hamas. ¿Un problema técnico?",
		"ru": "Эти кадры менее чёткие, чем снятые на GoPro ХАМАС. Техническая проблема, по-вашему?"
	},
	"x-alex": {
		"he": "היה קשה מאוד לראות את פרקים 7 ו־8 אחרי שעמדתי ממש באתרי ה־7 באוקטובר. המכולה הכתומה שבה ילדים ניסו להסתתר אמיתית ועדיין עומדת בנובה.",
		"en": "It was very hard watching episodes 7 and 8 just after standing on the sites of October 7. That orange container where kids tried to hide is real and still stands at Nova.",
		"ar": "كان صعباً جداً مشاهدة الحلقتين 7 و8 بعد الوقوف في مواقع 7 أكتوبر. الحاوية البرتقالية التي اختبأ فيها أطفال حقيقية وما زالت في نوفا.",
		"fr": "C’était très dur de regarder les épisodes 7 et 8 juste après avoir été sur les sites du 7 octobre. Ce container orange où des enfants ont tenté de se cacher est réel et se tient toujours à Nova.",
		"es": "Fue muy duro ver los episodios 7 y 8 justo después de estar en los lugares del 7 de octubre. Ese contenedor naranja donde se escondieron niños es real y sigue en Nova.",
		"ru": "Было очень тяжело смотреть серии 7 и 8 сразу после того, как я стоял на местах 7 октября. Оранжевый контейнер, где прятались дети, настоящий и до сих пор стоит на Nova."
	},
	"x-woland": {
		"he": "זה טוב מאוד, גם אם פרקי ה־7 באוקטובר מראים 5% מהאמת. מה מדהים הוא שגם 5% מחריד.",
		"en": "It's very good, even if the Oct 7 episodes show 5% of the truth. What's incredible is that even 5% is hideous.",
		"ar": "إنه جيد جداً، حتى لو أظهرت حلقات 7 أكتوبر 5٪ من الحقيقة. المذهل أن حتى 5٪ مروّع.",
		"fr": "C’est très bien, même si les épisodes du 7 octobre ne montrent que 5 % de la vérité. L’incroyable, c’est que même 5 % est hideux.",
		"es": "Es muy bueno, aunque los episodios del 7 de octubre muestren el 5% de la verdad. Lo increíble es que hasta el 5% es horrible.",
		"ru": "Очень хорошо, даже если серии про 7 октября показывают 5% правды. Ужасно то, что даже 5% отвратительны."
	},
	"x-harry": {
		"he": "אם באמת רוצים להבין היסטוריה, כדאי לקרוא את הבדיון של התקופה.",
		"en": "If you truly want to understand history, then read the fiction of the era in question.",
		"ar": "إن أردت حقاً فهم التاريخ، فاقرأ أدب تلك الحقبة.",
		"fr": "Si l’on veut vraiment comprendre l’histoire, il faut lire la fiction de l’époque.",
		"es": "Si de verdad quieres entender la historia, lee la ficción de esa época.",
		"ru": "Если правда хочешь понять историю — читай художественную прозу той эпохи."
	},
	"x-kevin": {
		"he": "אי אפשר להסיר מהעיניים את מה שדת השלום עשתה… מנוצרי",
		"en": "You can not unsee what the religion of peace did ….from a Christian",
		"ar": "لا يمكن محو ما فعله دين السلام… من مسيحي",
		"fr": "On ne peut plus dévoir ce qu’a fait la religion de la paix… d’un chrétien",
		"es": "No se puede dejar de ver lo que hizo la religión de la paz… desde un cristiano",
		"ru": "Не развидеть то, что сделала религия мира… от христианина"
	},
	"tt-fauda285-c": {
		"he": "דורון הגואט. העונה החמישית של פאודה — דורון קביליו המלך.",
		"en": "Doron the GOAT. Fauda season 5 — Doron Kavillio is king.",
		"ar": "دورون الأفضل. الموسم الخامس من فوضى — دورون كافيليو الملك.",
		"fr": "Doron le GOAT. Fauda saison 5 — Doron Kavillio est le roi.",
		"es": "Doron el GOAT. Fauda temporada 5 — Doron Kavillio es el rey.",
		"ru": "Дорон — GOAT. 5 сезон «Фауда» — Дорон Кавилио король."
	},
	"tt-steve-c": {
		"he": "הרג אותי איך שהוא אמר סטיב וראו שהוא שיקר.",
		"en": "It killed me how he said Steve and they saw that he had lied.",
		"ar": "قتلني كيف قال ستيف ورأوا أنه كذب.",
		"fr": "Ça m’a achevé, la façon dont il a dit Steve et on a vu qu’il mentait.",
		"es": "Me mató cómo dijo Steve y vieron que mentía.",
		"ru": "Меня убило, как он сказал «Стив», и стало видно, что он солгал."
	},
	"x-mirisch": {
		"he": "פאודה הבדיונית, עונה 5 (במיוחד פרקים 7 ו־8) מכילה יותר אמת מה״תיעודי״ נאזה. עולם נגוע באנטי־ציונות צריך יותר פאודה.",
		"en": "The fictional Fauda, Season 5 (particularly episodes 7 and 8) contains more truth than the documentary Naza. A world infected by antizionism needs more Fauda.",
		"ar": "فوضى الخيالية، الموسم 5 (خصوصاً الحلقتان 7 و8) تحتوي على حقيقة أكثر من الوثائقي نازة. عالم مصاب بمعاداة الصهيونية يحتاج المزيد من فوضى.",
		"fr": "La fiction Fauda saison 5 (surtout 7 et 8) contient plus de vérité que le « documentaire » Naza. Un monde miné par l’antisionisme a besoin de plus de Fauda.",
		"es": "La Fauda de ficción, temporada 5 (sobre todo 7 y 8) contiene más verdad que el documental Naza. Un mundo infectado de antisionismo necesita más Fauda.",
		"ru": "Вымышленная «Фауда», 5 сезон (особенно 7 и 8) содержит больше правды, чем «документалка» Naza. Миру, заражённому антисионизмом, нужно больше «Фауда»."
	},
	"x-streetwize": {
		"he": "פאודה כובשת את ניו יורק. היוצרים והשחקנים היו ב־92NY להקרנת עונה 5. סיפור ישראלי גאה על הבמה העולמית.",
		"en": "Fauda takes New York. The cast and creators were at 92NY for a Season 5 screening. Proud Israeli storytelling on the world stage.",
		"ar": "فوضى تصل نيويورك. الممثلون والمبدعون في 92NY لعرض الموسم 5. سرد إسرائيلي فخور على المسرح العالمي.",
		"fr": "Fauda prend New York. Cast et créateurs à 92NY pour la saison 5. Un récit israélien fier sur la scène mondiale.",
		"es": "Fauda conquista Nueva York. El elenco y los creadores estuvieron en 92NY. Relato israelí orgulloso en el escenario mundial.",
		"ru": "«Фауда» берёт Нью‑Йорк. Съёмочная группа на 92NY с 5 сезоном. Гордое израильское кино на мировой сцене."
	},
	"x-naftali": {
		"he": "עונה 5 של פאודה נצפית על ידי מיליונים בנטפליקס, ומעלה מודעות חשובה ל־7 באוקטובר מול העולם כולו.",
		"en": "Fauda's new season 5 is now viewed by millions on Netflix, and it raises very important awareness about October 7 in front of the entire world.",
		"ar": "الموسم 5 من فوضى يشاهده الملايين على نتفليكس ويرفع الوعي بأحداث 7 أكتوبر أمام العالم.",
		"fr": "La saison 5 de Fauda est vue par des millions sur Netflix et sensibilise le monde au 7 octobre.",
		"es": "La temporada 5 de Fauda la ven millones en Netflix y genera conciencia sobre el 7 de octubre ante el mundo.",
		"ru": "5 сезон «Фауда» смотрят миллионы на Netflix — это важное напоминание миру о 7 октября."
	},
	"x-ritvik": {
		"he": "אהבתי כל פרק וכל עונה. פרקים 7 ו־8 בעונה 5 היו אינטנסיביים כל כך, הראו את המציאות של ה־7 באוקטובר, היה כואב לצפות.",
		"en": "Loved every episode and season of Fauda, episode 7 and 8 of season 5 was so intense, it showed reality of 7th October, it was so painful to watch.",
		"ar": "أحببت كل حلقة. الحلقتان 7 و8 من الموسم 5 كانتا مكثفتين وأظهرتا واقع 7 أكتوبر. كان مؤلماً المشاهدة.",
		"fr": "J’ai adoré chaque saison. Les épisodes 7 et 8 de la saison 5 étaient si intenses, la réalité du 7 octobre. Douloureux à regarder.",
		"es": "Me encantó cada temporada. Los episodios 7 y 8 de la 5 fueron tan intensos, mostraron el 7 de octubre. Doloroso de ver.",
		"ru": "Любил каждый сезон. 7 и 8 серии 5 сезона такие жёсткие — реальность 7 октября. Больно смотреть."
	},
	"x-steinsapir": {
		"he": "ממליץ על פאודה עונה 5. בעצם על כל העונות. סדרה מצוינת.",
		"en": "I recommend Fauda season 5. Actually, all the seasons. A very good series.",
		"ar": "أنصح بموسم 5 من فوضى. في الحقيقة كل المواسم. مسلسل ممتاز.",
		"fr": "Je recommande Fauda saison 5. En fait toutes les saisons. Très bonne série.",
		"es": "Recomiendo Fauda temporada 5. En realidad, todas las temporadas. Muy buena serie.",
		"ru": "Рекомендую 5 сезон «Фауда». И все остальные тоже. Отличный сериал."
	},
	"x-ann-uk": {
		"he": "פאודה במקום 8 בנטפליקס בבריטניה אחרי יום אחד. עונה 5 תיארה את טבח 7 באוקטובר — מטלטל. בכיתי כמעט לכל אורכה.",
		"en": "Fauda is now number 8 here in the UK Netflix chart after just one day. Season 5 depicted October 7 massacres — very disturbing. Was in tears for most of it.",
		"ar": "فوضى في المركز 8 على نتفليكس في بريطانيا بعد يوم واحد. الموسم 5 صوّر مجازر 7 أكتوبر. بكيت معظم الوقت.",
		"fr": "Fauda est 8e au classement Netflix UK après un jour. La saison 5 sur le 7 octobre m’a fait pleurer presque tout du long.",
		"es": "Fauda es n.º 8 en Netflix UK al día siguiente. La temporada 5 sobre el 7 de octubre me hizo llorar casi todo el rato.",
		"ru": "«Фауда» — 8-я в чарте Netflix UK после одного дня. 5 сезон про 7 октября — я плакала почти всё время."
	},
	"x-isaac-ar": {
		"he": "אפקט פאודה. העונה החמישית מס' 1 בנטפליקס בלבנון וגם באירופה. פרקים 7 ו־8 מראים לעולם חלק מהזוועה. המציאות הייתה גרועה לאין שיעור.",
		"en": "FAUDA EFFECT. Season 5 is No. 1 on Netflix in Lebanon and also sweeping Europe. Episodes 7 and 8 are showing the world part of the horror. Reality was infinitely worse.",
		"ar": "تأثير فوضى. الموسم 5 الأول على نتفليكس في لبنان ويكتسح أوروبا. الحلقتان 7 و8 تُظهران جزءاً من الرعب. الواقع كان أسوأ بما لا يُقاس.",
		"fr": "Effet Fauda. Saison 5 n°1 au Liban et ça cartonne en Europe. Les épisodes 7 et 8 montrent une part de l’horreur. La réalité était infiniment pire.",
		"es": "EFECTO FAUDA. La quinta temporada es Nº1 en Netflix en Líbano y arrasa también en Europa. Los episodios 7 y 8 están mostrando al mundo una parte del horror. La realidad fue infinitamente peor.",
		"ru": "Эффект «Фауда». 5 сезон — №1 в Ливане и рвёт Европу. 7 и 8 серии показывают часть ужаса. Реальность была бесконечно хуже."
	},
	"x-ben-ng": {
		"he": "אחרי פאודה אני יכול לומר בנוחות שמה שישראל עשתה אחר כך היה מוצדק כדי להציל את אזרחיה. טרור בכל מקום הוא טרור.",
		"en": "After watching FAUDA, I can comfortably say that whatever the Israelis did afterwards was justifiable to save her citizens. Terror anywhere is terror everywhere.",
		"ar": "بعد مشاهدة فوضى أستطيع القول إن ما فعله الإسرائيليون بعد ذلك كان مبرراً لإنقاذ مواطنيهم. الإرهاب إرهاب في كل مكان.",
		"fr": "Après Fauda, je peux dire que ce qu’Israël a fait ensuite était justifiable pour sauver ses citoyens. La terreur partout est la terreur.",
		"es": "Después de ver FAUDA, lo que hicieron los israelíes después fue justificable para salvar a sus ciudadanos. El terror es terror en todas partes.",
		"ru": "После «Фауда» могу сказать: то, что Израиль сделал потом, было оправданно, чтобы спасти граждан. Террор везде — это террор."
	},
	"x-jpost": {
		"he": "צופי נטפליקס ברחבי העולם אמרו שתיאור ה־7 באוקטובר בפאודה שינה את הבנתם את הטבח שחולל חמאס.",
		"en": "Netflix viewers worldwide said Fauda’s portrayal of October 7 changed their understanding of the Hamas-led massacre.",
		"ar": "مشاهدو نتفليكس حول العالم قالوا إن تصوير فوضى لـ7 أكتوبر غيّر فهمهم لمجزرة حماس.",
		"fr": "Des spectateurs Netflix dans le monde disent que le portrait du 7 octobre dans Fauda a changé leur compréhension du massacre du Hamas.",
		"es": "Espectadores de Netflix en el mundo dijeron que el retrato del 7 de octubre en Fauda cambió su comprensión de la masacre de Hamas.",
		"ru": "Зрители Netflix по всему миру сказали: изображение 7 октября в «Фауда» изменило их понимание резни ХАМАС."
	},
	"x-itongadol": {
		"he": "תודה, פאודה 5. תודה ליוצרים שהשאירו תיעוד גדול של טבח 7 באוקטובר לדורות הבאים. עם ישראל חי.",
		"en": "Thank you, Fauda 5. Thanks to the creators for leaving a major record of the October 7 massacre for future generations. Am Israel Chai.",
		"ar": "شكراً فوضى 5. شكراً للمبدعين على سجل كبير لمجزرة 7 أكتوبر للأجيال القادمة. عم يسرائيل حي.",
		"fr": "Merci Fauda 5. Merci aux créateurs d’avoir laissé une trace majeure du massacre du 7 octobre pour les générations futures. Am Israel Chai.",
		"es": "Gracias, Fauda 5. Agradecer a los creadores por dejar un gran registro de la masacre del 7 de octubre para las futuras generaciones. Am Israel Jai.",
		"ru": "Спасибо, «Фауда» 5. Спасибо авторам за большой следок резни 7 октября для будущих поколений. Ам Исраэль хай."
	},
	"x-sage": {
		"he": "עונה 5 של פאודה מתרחשת אחרי זוועת הטרור של 7 באוקטובר. אם עדיין לא ראיתם — ממליץ בחום.",
		"en": "Season 5 of Fauda is set after the October 7th terrorist atrocity. If you haven't watched Fauda, I can highly recommend it.",
		"ar": "الموسم 5 من فوضى بعد فظاعة 7 أكتوبر. إن لم تشاهدوا فوضى، أنصح بها بشدة.",
		"fr": "La saison 5 de Fauda se déroule après l’atrocité du 7 octobre. Si vous n’avez pas vu Fauda, je la recommande vivement.",
		"es": "La temporada 5 de Fauda transcurre tras la atrocidad del 7 de octubre. Si no han visto Fauda, la recomiendo mucho.",
		"ru": "5 сезон «Фауда» — после теракта 7 октября. Если ещё не смотрели — очень рекомендую."
	},
	"x-ritvik-c": {
		"he": "אהבתי כל פרק וכל עונה. פרקים 7 ו־8 בעונה 5 היו אינטנסיביים כל כך, הראו את המציאות של ה־7 באוקטובר, היה כואב לצפות.",
		"en": "Loved every episode and season of Fauda, episode 7 and 8 of season 5 was so intense, it showed reality of 7th October, it was so painful to watch.",
		"ar": "أحببت كل حلقة. الحلقتان 7 و8 من الموسم 5 كانتا مكثفتين وأظهرتا واقع 7 أكتوبر. كان مؤلماً المشاهدة.",
		"fr": "J’ai adoré chaque saison. Les épisodes 7 et 8 de la saison 5 étaient si intenses, la réalité du 7 octobre. Douloureux à regarder.",
		"es": "Me encantó cada temporada. Los episodios 7 y 8 de la 5 fueron tan intensos, mostraron el 7 de octubre. Doloroso de ver.",
		"ru": "Любил каждый сезон. 7 и 8 серии 5 сезона такие жёсткие — реальность 7 октября. Больно смотреть."
	},
	"x-ann-c": {
		"he": "פאודה במקום 8 בנטפליקס בבריטניה אחרי יום אחד. עונה 5 תיארה את טבח 7 באוקטובר — מטלטל. בכיתי כמעט לכל אורכה.",
		"en": "Fauda is now number 8 here in the UK Netflix chart after just one day. Season 5 depicted October 7 massacres — very disturbing. Was in tears for most of it.",
		"ar": "فوضى في المركز 8 على نتفليكس في بريطانيا بعد يوم واحد. الموسم 5 صوّر مجازر 7 أكتوبر. بكيت معظم الوقت.",
		"fr": "Fauda est 8e au classement Netflix UK après un jour. La saison 5 sur le 7 octobre m’a fait pleurer presque tout du long.",
		"es": "Fauda es n.º 8 en Netflix UK al día siguiente. La temporada 5 sobre el 7 de octubre me hizo llorar casi todo el rato.",
		"ru": "«Фауда» — 8-я в чарте Netflix UK после одного дня. 5 сезон про 7 октября — я плакала почти всё время."
	},
	"x-isaac-c": {
		"he": "אפקט פאודה. העונה החמישית מס' 1 בנטפליקס בלבנון וגם באירופה. פרקים 7 ו־8 מראים לעולם חלק מהזוועה. המציאות הייתה גרועה לאין שיעור.",
		"en": "FAUDA EFFECT. Season 5 is No. 1 on Netflix in Lebanon and also sweeping Europe. Episodes 7 and 8 are showing the world part of the horror. Reality was infinitely worse.",
		"ar": "تأثير فوضى. الموسم 5 الأول على نتفليكس في لبنان ويكتسح أوروبا. الحلقتان 7 و8 تُظهران جزءاً من الرعب. الواقع كان أسوأ بما لا يُقاس.",
		"fr": "Effet Fauda. Saison 5 n°1 au Liban et ça cartonne en Europe. Les épisodes 7 et 8 montrent une part de l’horreur. La réalité était infiniment pire.",
		"es": "EFECTO FAUDA. La quinta temporada es Nº1 en Netflix en Líbano y arrasa también en Europa. Los episodios 7 y 8 están mostrando al mundo una parte del horror. La realidad fue infinitamente peor.",
		"ru": "Эффект «Фауда». 5 сезон — №1 в Ливане и рвёт Европу. 7 и 8 серии показывают часть ужаса. Реальность была бесконечно хуже."
	},
	"x-ben-c": {
		"he": "אחרי פאודה אני יכול לומר בנוחות שמה שישראל עשתה אחר כך היה מוצדק כדי להציל את אזרחיה. טרור בכל מקום הוא טרור.",
		"en": "After watching FAUDA, I can comfortably say that whatever the Israelis did afterwards was justifiable to save her citizens. Terror anywhere is terror everywhere.",
		"ar": "بعد مشاهدة فوضى أستطيع القول إن ما فعله الإسرائيليون بعد ذلك كان مبرراً لإنقاذ مواطنيهم. الإرهاب إرهاب في كل مكان.",
		"fr": "Après Fauda, je peux dire que ce qu’Israël a fait ensuite était justifiable pour sauver ses citoyens. La terreur partout est la terreur.",
		"es": "Después de ver FAUDA, lo que hicieron los israelíes después fue justificable para salvar a sus ciudadanos. El terror es terror en todas partes.",
		"ru": "После «Фауда» могу сказать: то, что Израиль сделал потом, было оправданно, чтобы спасти граждан. Террор везде — это террор."
	},
	"x-mirisch-c": {
		"he": "פאודה הבדיונית, עונה 5 (במיוחד פרקים 7 ו־8) מכילה יותר אמת מה״תיעודי״ נאזה. עולם נגוע באנטי־ציונות צריך יותר פאודה.",
		"en": "The fictional Fauda, Season 5 (particularly episodes 7 and 8) contains more truth than the documentary Naza. A world infected by antizionism needs more Fauda.",
		"ar": "فوضى الخيالية، الموسم 5 (خصوصاً الحلقتان 7 و8) تحتوي على حقيقة أكثر من الوثائقي نازة. عالم مصاب بمعاداة الصهيونية يحتاج المزيد من فوضى.",
		"fr": "La fiction Fauda saison 5 (surtout 7 et 8) contient plus de vérité que le « documentaire » Naza. Un monde miné par l’antisionisme a besoin de plus de Fauda.",
		"es": "La Fauda de ficción, temporada 5 (sobre todo 7 y 8) contiene más verdad que el documental Naza. Un mundo infectado de antisionismo necesita más Fauda.",
		"ru": "Вымышленная «Фауда», 5 сезон (особенно 7 и 8) содержит больше правды, чем «документалка» Naza. Миру, заражённому антисионизмом, нужно больше «Фауда»."
	},
	"x-iton-c": {
		"he": "תודה, פאודה 5. תודה ליוצרים שהשאירו תיעוד גדול של טבח 7 באוקטובר לדורות הבאים. עם ישראל חי.",
		"en": "Thank you, Fauda 5. Thanks to the creators for leaving a major record of the October 7 massacre for future generations. Am Israel Chai.",
		"ar": "شكراً فوضى 5. شكراً للمبدعين على سجل كبير لمجزرة 7 أكتوبر للأجيال القادمة. عم يسرائيل حي.",
		"fr": "Merci Fauda 5. Merci aux créateurs d’avoir laissé une trace majeure du massacre du 7 octobre pour les générations futures. Am Israel Chai.",
		"es": "Gracias, Fauda 5. Agradecer a los creadores por dejar un gran registro de la masacre del 7 de octubre para las futuras generaciones. Am Israel Jai.",
		"ru": "Спасибо, «Фауда» 5. Спасибо авторам за большой следок резни 7 октября для будущих поколений. Ам Исраэль хай."
	}
};
var naza_social_default = [
	{
		"id": "naza-oseran",
		"platform": "x",
		"country": "IL",
		"by": "Ariel Oseran",
		"handle": "@ariel_oseran",
		"text": "‘Naza’ co-director Yuval Abraham says Israel is committing genocide in Gaza and that his film proves it. If Israel had a special intent to erase the Palestinians, their deaths wouldn’t be collateral. They’d be the objective.",
		"url": "https://x.com/ariel_oseran/status/2099780089923670264",
		"tone": "critical",
		"reactions": 37,
		"shares": 11,
		"comments": 2,
		"views": 3868,
		"at": "2026-09-15",
		"lang": "en"
	},
	{
		"id": "naza-deadline",
		"platform": "x",
		"country": "IT",
		"by": "Deadline",
		"handle": "@DEADLINE",
		"text": "Yuval Abraham and Rachel Szor receiving rousing response at world premiere for Golden Lion contender, with producers James Wilson and executive producer Jonathan Glazer joining applause.",
		"url": "https://x.com/DEADLINE",
		"tone": "positive",
		"at": "2026-09-10",
		"lang": "en"
	},
	{
		"id": "naza-yuvalpm",
		"platform": "x",
		"country": "IL",
		"by": "יובלפמ",
		"handle": "@yuvalpm",
		"text": "״קראתי את התחקירים בשיחה מקומית״ זה ״הספר היה יותר טוב״ של נז״א",
		"url": "https://x.com/yuvalpm/status/2099790574379303032",
		"tone": "critical",
		"views": 22,
		"at": "2026-09-15",
		"lang": "he"
	},
	{
		"id": "naza-eisenkot",
		"platform": "facebook",
		"country": "IL",
		"by": "גדי איזנקוט",
		"text": "הסרט מציג תמונה מעוותת ומפגין עיוורון מוסרי וניתוק מהמציאות. ביקורת לגיטימית — השמצת חיילים למען תשואות בחו\"ל לא.",
		"note": "מתוך דיווח NYT על פוסט ברשתות, 14 בספטמבר 2026.",
		"url": "https://www.nytimes.com/2026/09/14/world/middleeast/israel-naza-documentary-backlash.html",
		"tone": "critical",
		"at": "2026-09-14",
		"lang": "he"
	},
	{
		"id": "naza-zohar",
		"platform": "x",
		"country": "IL",
		"by": "מיקי זוהר",
		"text": "אשלול את אזרחות יוצרי הסרט על עזה. בגידה במדינה.",
		"note": "מתוך דיווח ynet, 13 בספטמבר 2026. אין שחזור ישיר של הציוץ במדגם.",
		"url": "https://www.ynet.co.il/entertainment/article/ryykcpvffg",
		"tone": "critical",
		"at": "2026-09-13",
		"lang": "he"
	},
	{
		"id": "naza-vulture",
		"platform": "x",
		"country": "US",
		"by": "Vulture",
		"text": "Naza is one of the most important films of our time.",
		"url": "https://www.vulture.com/article/review-naza-is-one-of-the-most-important-films-of-our-time.html",
		"tone": "positive",
		"at": "2026-09-10",
		"lang": "en"
	},
	{
		"id": "naza-972",
		"platform": "facebook",
		"country": "PS",
		"by": "+972 Magazine",
		"text": "NAZA makes visible the moment a human life becomes collateral damage: when a person eating dinner has already been counted as an acceptable loss.",
		"url": "https://www.972mag.com/naza-gaza-film-collateral-damage/",
		"tone": "emotional",
		"at": "2026-09-11",
		"lang": "en"
	},
	{
		"id": "naza-toi",
		"platform": "x",
		"country": "IL",
		"by": "Times of Israel",
		"handle": "@TimesofIsrael",
		"text": "Israeli film about killing of Gazan civilians gets 25-minute record ovation at Venice premiere. IDF rejects anonymous testimony.",
		"url": "https://www.timesofisrael.com/israeli-film-about-killing-of-gazan-civilians-gets-record-ovation-at-venice-premiere/",
		"tone": "emotional",
		"at": "2026-09-10",
		"lang": "en"
	},
	{
		"id": "naza-vanity",
		"platform": "x",
		"country": "IT",
		"by": "Vanity Fair Italia",
		"text": "Naza vince il Premio speciale della Giuria a Venezia. Yuval Abraham: «Durante questo festival gli israeliani hanno ucciso altri bambini.»",
		"url": "https://www.vanityfair.it/article/naza-vince-premio-speciale-giuria-venezia-israeliani-ucciso-bambini-governo-cerca-boicottare-film",
		"tone": "emotional",
		"at": "2026-09-12",
		"lang": "en"
	},
	{
		"id": "naza-reuters",
		"platform": "x",
		"country": "GB",
		"by": "Reuters",
		"text": "Israeli whistleblowers detail Gaza civilian toll in Venice film NAZA. Officers describe AI-assisted targeting and expected civilian deaths built into strikes.",
		"url": "https://www.reuters.com/world/middle-east/israeli-whistleblowers-detail-gaza-civilian-toll-venice-film-2026-09-10/",
		"tone": "emotional",
		"at": "2026-09-10",
		"lang": "en"
	},
	{
		"id": "naza-hr",
		"platform": "x",
		"country": "US",
		"by": "Hollywood Reporter",
		"text": "NAZA inspired outrage… indignity as well. Most certainly disgust, on a profound level, for the current Israeli regime.",
		"note": "מצוטט בדיווח Times of Israel על ביקורות ונציה.",
		"url": "https://www.timesofisrael.com/israeli-film-alleging-ai-assisted-killing-of-gaza-civilians-wins-venice-jury-prize/",
		"tone": "emotional",
		"at": "2026-09-12",
		"lang": "en"
	},
	{
		"id": "naza-petition",
		"platform": "facebook",
		"country": "IL",
		"by": "קולנוענים ישראלים",
		"text": "יותר מ־200 יוצרים חתמו: תפקיד האמנות להחזיק מראה. זכותם של אברהם ושור ליצור גם כשהמבט מכעיס.",
		"url": "https://en.wikipedia.org/wiki/NAZA_(film)",
		"tone": "positive",
		"at": "2026-09-14",
		"lang": "he"
	}
];
var naza_mood_default = {
	sampleSize: 16,
	facebookLocked: 0,
	facebookReactions: 0,
	buckets: {
		"support": 6,
		"mixed": 3,
		"critical": 7
	},
	emotions: {
		"grief": 3,
		"praise": 3,
		"tooHard": 1,
		"sanitized": 2,
		"anger": 3,
		"solidarity": 1,
		"critical": 3
	},
	comments: [
		{
			"id": "naza-m-petition",
			"platform": "facebook",
			"by": "יוצר ישראלי, מתוך העצומה",
			"text": "תפקידם המרכזי של אמנות ועיתונות הוא להחזיק מראה מול החברה שבה הן קיימות.",
			"emotion": "solidarity",
			"bucket": "support",
			"url": "https://en.wikipedia.org/wiki/NAZA_(film)",
			"lang": "he"
		},
		{
			"id": "naza-m-vulture",
			"platform": "x",
			"by": "Bilge Ebiri",
			"text": "The results are impossible to shake.",
			"emotion": "praise",
			"bucket": "support",
			"url": "https://www.vulture.com/article/review-naza-is-one-of-the-most-important-films-of-our-time.html",
			"lang": "en"
		},
		{
			"id": "naza-m-972",
			"platform": "facebook",
			"by": "+972 reader",
			"text": "The moment a person eating dinner becomes a number on a screen.",
			"emotion": "grief",
			"bucket": "support",
			"url": "https://www.972mag.com/naza-gaza-film-collateral-damage/",
			"lang": "en"
		},
		{
			"id": "naza-m-timeout",
			"platform": "x",
			"by": "John Bleasdale",
			"text": "As a document, it is an indictment.",
			"emotion": "praise",
			"bucket": "support",
			"url": "https://www.timeout.com/movies/naza-review-2026",
			"lang": "en"
		},
		{
			"id": "naza-m-oseran",
			"platform": "x",
			"by": "Ariel Oseran",
			"text": "The title of their film suggests otherwise. Collateral is not the objective.",
			"emotion": "critical",
			"bucket": "critical",
			"url": "https://x.com/ariel_oseran/status/2099780089923670264",
			"lang": "en"
		},
		{
			"id": "naza-m-zohar",
			"platform": "x",
			"by": "מגיב לזוהר",
			"text": "בגידה. תשואות של אנטישמים בחו\"ל.",
			"emotion": "anger",
			"bucket": "critical",
			"url": "https://www.ynet.co.il/entertainment/article/ryykcpvffg",
			"lang": "he"
		},
		{
			"id": "naza-m-zamir",
			"platform": "facebook",
			"by": "תגובה לדיווח על הרמטכ\"ל",
			"text": "עלילות דם. עדויות אנונימיות אי אפשר לאמת.",
			"emotion": "anger",
			"bucket": "critical",
			"url": "https://www.nytimes.com/2026/09/14/world/middleeast/israel-naza-documentary-backlash.html",
			"lang": "he"
		},
		{
			"id": "naza-m-eisenkot",
			"platform": "facebook",
			"by": "מגיב לאיזנקוט",
			"text": "עיוורון מוסרי. לא ראו את 7 באוקטובר.",
			"emotion": "sanitized",
			"bucket": "mixed",
			"url": "https://www.nytimes.com/2026/09/14/world/middleeast/israel-naza-documentary-backlash.html",
			"lang": "he"
		},
		{
			"id": "naza-m-hard",
			"platform": "x",
			"by": "צופה בוונציה",
			"text": "Twenty-five minutes of applause because nobody could speak.",
			"emotion": "tooHard",
			"bucket": "support",
			"url": "https://www.timesofisrael.com/israeli-film-about-killing-of-gazan-civilians-gets-record-ovation-at-venice-premiere/",
			"lang": "en"
		},
		{
			"id": "naza-m-oct7",
			"platform": "x",
			"by": "Ms S",
			"text": "למה לדרוש להציג את 7 באוקטובר בסרט על מדיניות נז\"א? האם זה אמור להצדיק את ההרג?",
			"emotion": "sanitized",
			"bucket": "mixed",
			"url": "https://x.com/Ms_Stentorian/status/2099775091055776179",
			"lang": "he"
		},
		{
			"id": "naza-m-abraham",
			"platform": "x",
			"by": "Yuval Abraham",
			"text": "Denial of a crime is what helps it persist. Israelis should watch this film.",
			"emotion": "grief",
			"bucket": "support",
			"url": "https://www.jpost.com/israel-news/article-908432",
			"lang": "en"
		},
		{
			"id": "naza-m-libel",
			"platform": "facebook",
			"by": "מגיב ישראלי",
			"text": "24 אנונימיים. בלי שמות, בלי דרגות, בלי אימות. זה לא תחקיר.",
			"emotion": "critical",
			"bucket": "critical",
			"url": "https://www.jpost.com/israel-news/article-908432",
			"lang": "he"
		},
		{
			"id": "naza-m-idf",
			"platform": "x",
			"by": "דיווח JPost",
			"text": "The IDF said identities, roles and involvement of the anonymous speakers could not be verified.",
			"emotion": "critical",
			"bucket": "critical",
			"url": "https://www.jpost.com/israel-news/article-908432",
			"lang": "en"
		},
		{
			"id": "naza-m-praise2",
			"platform": "x",
			"by": "AwardsWatch",
			"text": "100. A gut-punch.",
			"emotion": "praise",
			"bucket": "support",
			"url": "https://www.metacritic.com/movie/naza/",
			"lang": "en"
		},
		{
			"id": "naza-m-anger2",
			"platform": "facebook",
			"by": "מגיב",
			"text": "מכרו את המדינה בשביל אריה זהב שלא ניתן להם.",
			"emotion": "anger",
			"bucket": "critical",
			"url": "https://www.c14.co.il/article/1674997",
			"lang": "he"
		},
		{
			"id": "naza-m-grief2",
			"platform": "x",
			"by": "Venice audience note",
			"text": "I still think the Nazis are evil, so what does that make me? — a testimony in the film.",
			"emotion": "grief",
			"bucket": "mixed",
			"url": "https://www.timeout.com/movies/naza-review-2026",
			"lang": "en"
		}
	]
};
var naza_social_tr_default = {
	"naza-oseran": {
		"he": "במאי־שותף של נז\"א טוען שהסרט מוכיח רצח עם. אם הייתה כוונה למחוק פלסטינים, מותם לא היה אגבי — הוא היה המטרה.",
		"ar": "مخرج نازا يقول إن الفيلم يثبت الإبادة. إن كانت الوفيات هدفاً لما سُمّيت أضراراً جانبية."
	},
	"naza-deadline": {
		"he": "אברהם ושור מקבלים תשואות סוערות בבכורה. המפיקים ג'יימס וילסון וג'ונתן גלייזר מצטרפים למחיאות הכפיים.",
		"ar": "إبراهيم وشور ينالان تصفيقاً حاراً في العرض الأول."
	},
	"naza-yuvalpm": { "en": "“I read the Local Call investigations” is NAZA’s version of “the book was better.”" },
	"naza-eisenkot": { "en": "The film presents a distorted picture and shows moral blindness. Criticism is legitimate; smearing soldiers for applause abroad is not." },
	"naza-zohar": { "en": "I will act to revoke the citizenship of the Gaza film’s directors. Treason." },
	"naza-vulture": { "he": "נז\"א הוא אחד הסרטים החשובים של זמננו." },
	"naza-972": { "he": "נז\"א מראה את הרגע שבו חיי אדם הופכים לנזק אגבי: כשאדם אוכל ארוחת ערב כבר נספר כאובדן מקובל." },
	"naza-toi": { "he": "סרט ישראלי על הריגת אזרחים בעזה זוכה ל־25 דקות תשואות שיא בוונציה. צה\"ל דוחה עדויות אנונימיות." },
	"naza-vanity": { "he": "נז\"א זוכה בפרס חבר השופטים. אברהם: בזמן הפסטיבל נהרגו ילדים נוספים." },
	"naza-reuters": { "he": "משרוקנים ישראלים מפרטים בוונציה את מחיר האזרחים בעזה. קצינים מתארים שילוב בינה מלאכותית ונזק אגבי מחושב בתקיפות." },
	"naza-hr": { "he": "נז\"א מעורר זעם, עלבון, וגועל עמוק מהמשטר הישראלי הנוכחי." },
	"naza-petition": { "en": "More than 200 Israeli filmmakers signed: art’s role is to hold up a mirror. Abraham and Szor have the right to create even when the gaze infuriates." }
};
var SOCIAL_POSTS = social_default;
var COMMENT_MOOD = comment_mood_default;
var SOCIAL_TR = social_tr_default;
var NAZA_SOCIAL_POSTS = naza_social_default.map((p) => ({
	...p,
	work: "naza"
}));
var NAZA_COMMENT_MOOD = naza_mood_default;
var NAZA_SOCIAL_TR = naza_social_tr_default;
function socialByPlatform(platform, list = SOCIAL_POSTS) {
	if (platform === "all") return list;
	return list.filter((p) => p.platform === platform);
}
function commentsByPlatform(platform, mood = COMMENT_MOOD) {
	if (platform === "all") return mood.comments;
	return mood.comments.filter((c) => c.platform === platform);
}
function bucketPct(bucket, items) {
	const n = items.length || 1;
	return Math.round(items.filter((i) => i.bucket === bucket).length / n * 100);
}
function postBuckets(items) {
	const out = {
		support: 0,
		mixed: 0,
		critical: 0
	};
	for (const p of items) if (p.tone === "critical") out.critical += 1;
	else if (p.tone === "emotional") out.mixed += 1;
	else out.support += 1;
	return out;
}
function translatedText(id, original, lang, locale, tr = SOCIAL_TR) {
	if (lang === locale) return original;
	return tr[id]?.[locale] ?? tr[id]?.en ?? original;
}
function needsTranslate(lang, locale, id, tr = SOCIAL_TR) {
	if (lang === locale) return false;
	return Boolean(tr[id]?.[locale] ?? tr[id]?.en);
}
function engagementOf(p) {
	return (p.reactions ?? 0) + (p.comments ?? 0) * 2 + (p.shares ?? 0) * 3 + Math.round((p.views ?? 0) / 80);
}
function computeSocial(country, list) {
	const mine = list.filter((p) => p.country === country.id);
	const quotes = country.quotes?.length ?? 0;
	const eng = mine.reduce((s, p) => s + engagementOf(p), 0);
	const peak = peakRank(country);
	const heat = peak == null ? 16 : Math.round((11 - peak) * 6.5);
	const volume = Math.min(36, mine.length * 11 + quotes * 7 + Math.min(16, Math.log10(eng + 1) * 7));
	const score = Math.max(8, Math.min(99, Math.round(heat + volume + country.positive * .12)));
	let trend;
	if (mine.length > 0) {
		const net = mine.reduce((s, p) => s + (p.tone === "critical" ? -1 : p.tone === "positive" ? 1 : .25), 0);
		trend = net > .2 ? "up" : net < -.2 ? "down" : "flat";
	} else {
		const first = country.ranks.find((r) => r != null) ?? null;
		const last = latestRank(country);
		if (first != null && last != null && last !== first) trend = last < first ? "up" : "down";
		else if (country.sentiment === "positive") trend = "up";
		else if (country.sentiment === "critical") trend = "down";
		else trend = "flat";
	}
	return {
		score,
		trend,
		posts: mine.length,
		quotes,
		documented: mine.length > 0 || quotes > 0
	};
}
var socialCache = /* @__PURE__ */ new Map();
function socialOf(country, list = SOCIAL_POSTS) {
	const key = `${country.id}:${list.length}:${list[0]?.id ?? ""}`;
	const hit = socialCache.get(key);
	if (hit) return hit;
	const next = computeSocial(country, list);
	socialCache.set(key, next);
	return next;
}
function socialCountryIds(list = SOCIAL_POSTS) {
	return new Set(list.map((p) => p.country).filter((id) => Boolean(id)));
}
var EMPTY = [
	null,
	null,
	null,
	null,
	null,
	null
];
var NAZA_DAYS = [
	"9.9",
	"10.9",
	"11.9",
	"12.9",
	"13.9",
	"14.9"
];
var NAZA_SNAPSHOT = "9–14 בספטמבר 2026";
var NAZA_GLOBAL = {
	latest: 1,
	peak: 1,
	peakDate: "10 בספטמבר",
	points: 96,
	top10Countries: 0,
	firstPlaces: 2
};
var NAZA_QUOTES = [
	{
		text: "The spare, focused style of Naza has a grim, artful beauty, all in service of the subject matter. The results are impossible to shake.",
		by: "Bilge Ebiri, Vulture",
		tone: "positive",
		source: "Vulture"
	},
	{
		text: "As a work of cinema, it is exemplary. As a work of journalism, it is inarguable. As a document, it is an indictment.",
		by: "John Bleasdale, Time Out — 5/5",
		tone: "positive",
		source: "Time Out"
	},
	{
		text: "It is based on blood libels and deliberate distortions of reality.",
		by: "רא\"ל אייל זמיר, על הסרט",
		tone: "critical",
		source: "NYT"
	}
];
var PATCH = {
	IL: {
		ranks: [
			3,
			2,
			1,
			1,
			1,
			1
		],
		sentiment: "critical",
		positive: 18,
		mixed: 22,
		negative: 60,
		confidence: "documented",
		note: "הסערה החריפה ביותר: איום בשלילת אזרחות, הרמטכ\"ל כינה עלילות דם, עצומת 200 קולנוענים, והיוצרים מבקשים שישראלים יראו את הסרט לפני שיתקפו.",
		quotes: [
			{
				text: "כשר התרבות, אפעל מיידית לשלול את האזרחות הישראלית של היוצרים השפלים הללו בגין בגידה במדינה.",
				by: "שר התרבות מיקי זוהר",
				tone: "critical",
				source: "Ynet"
			},
			{
				text: "ביקורת לגיטימית בדמוקרטיה, אבל תהום בינה לבין השמצת חיילים כדי לקצור תשואות בפסטיבלים בחו\"ל.",
				by: "גדי איזנקוט",
				tone: "critical",
				source: "NYT"
			},
			{
				text: "תפקידם המרכזי של אמנות ועיתונות הוא להחזיק מראה מול החברה שבה הן קיימות.",
				by: "עצומת יותר מ־200 קולנוענים ישראלים",
				tone: "positive",
				source: "Wikipedia"
			},
			{
				text: "אני מקווה שהסרט יופץ בישראל. שיתקפים אותו — שיראו אותו קודם כול.",
				by: "יובל אברהם",
				tone: "emotional",
				source: "NYT"
			}
		]
	},
	IT: {
		ranks: [
			4,
			1,
			1,
			1,
			2,
			2
		],
		sentiment: "positive",
		positive: 88,
		mixed: 8,
		negative: 4,
		confidence: "documented",
		note: "בכורת ונציה ב־10 בספטמבר: 25 דקות תשואות — שיא הפסטיבל — ופרס חבר השופטים ב־12 בספטמבר. הסרט היחיד התיעודי בתחרות הרשמית.",
		quotes: [{
			text: "זה המדינה שלנו שעושה את הפשעים האלה. חשוב שאיטלקים וגרמנים יראו, כי הממשלות שלכם חוסמות לחץ על ישראל.",
			by: "יובל אברהם, על בימת ונציה",
			tone: "emotional",
			source: "Vanity Fair Italia"
		}]
	},
	GB: {
		ranks: [
			5,
			3,
			2,
			2,
			3,
			3
		],
		sentiment: "positive",
		positive: 72,
		mixed: 16,
		negative: 12,
		confidence: "documented",
		note: "הגרדיאן שותף להפקה. רויטרס וסיקור בריטי ליוו את הבכורה. שיח יהודי-בריטי מפוצל יותר מהמבקרים.",
		quotes: [{
			text: "Mass civilian deaths were routinely built into Israeli military targeting decisions in Gaza, according to a Venice documentary that challenges official accounts of the war.",
			by: "Reuters, Venice",
			tone: "emotional",
			source: "Reuters"
		}]
	},
	US: {
		ranks: [
			6,
			3,
			3,
			3,
			2,
			2
		],
		sentiment: "mixed",
		positive: 58,
		mixed: 22,
		negative: 20,
		confidence: "documented",
		note: "שבחי מבקרים (Vulture, Hollywood Reporter) מול דחייה פוליטית. NYT תיאר את הסערה בישראל. Metacritic 96, Rotten Tomatoes 100% על 16 ביקורות.",
		quotes: [{
			text: "Naza is one of the most important films of our time.",
			by: "Bilge Ebiri, Vulture",
			tone: "positive",
			source: "Vulture"
		}, {
			text: "If Israel had a special intent to erase the Palestinians, their deaths wouldn’t be collateral. They’d be the objective.",
			by: "אריאל אוסרן, i24NEWS",
			tone: "critical",
			source: "X"
		}]
	},
	DE: {
		ranks: [
			null,
			5,
			5,
			4,
			3,
			3
		],
		sentiment: "positive",
		positive: 64,
		mixed: 20,
		negative: 16,
		confidence: "documented",
		note: "אברהם תקף על הבמה את ממשלת גרמניה שחוסמת לחץ על ישראל. סיקור DW. שיח גרמני מקוטב סביב ישראל, חיובי יותר כלפי הסרט כקולנוע."
	},
	FR: {
		ranks: [
			null,
			4,
			4,
			4,
			5,
			5
		],
		sentiment: "positive",
		positive: 70,
		mixed: 18,
		negative: 12,
		confidence: "estimated",
		note: "MK2 מחזיקה בזכויות המכירה העולמיות. הערכה לפי סיקור פסטיבל צרפתי, בלי סקר קהל מקומי."
	},
	ES: {
		ranks: [
			null,
			6,
			6,
			5,
			5,
			5
		],
		sentiment: "positive",
		positive: 66,
		mixed: 20,
		negative: 14,
		confidence: "estimated",
		note: "הערכה לפי סיקור פסטיבל אירופי. אין דירוג סטרימינג."
	},
	NL: {
		ranks: [
			null,
			7,
			7,
			6,
			6,
			6
		],
		sentiment: "positive",
		positive: 62,
		mixed: 22,
		negative: 16,
		confidence: "estimated"
	},
	GR: {
		ranks: [
			null,
			null,
			8,
			7,
			5,
			5
		],
		sentiment: "mixed",
		positive: 54,
		mixed: 24,
		negative: 22,
		confidence: "documented",
		note: "DW יוון סיקרה את הפיצול בישראל סביב הזכייה בוונציה."
	},
	IE: {
		ranks: [
			null,
			7,
			6,
			6,
			6,
			6
		],
		sentiment: "positive",
		positive: 74,
		mixed: 16,
		negative: 10,
		confidence: "estimated",
		note: "אקלים ציבורי ביקורתי כלפי ישראל. הטון כלפי הסרט מוערך כחיובי, בלי ציטוט מקומי מתועד."
	},
	BE: {
		ranks: [
			null,
			7,
			6,
			6,
			6,
			6
		],
		sentiment: "positive",
		positive: 66,
		mixed: 20,
		negative: 14,
		confidence: "estimated"
	},
	AT: {
		ranks: [
			null,
			7,
			6,
			6,
			6,
			6
		],
		sentiment: "positive",
		positive: 63,
		mixed: 22,
		negative: 15,
		confidence: "estimated"
	},
	CH: {
		ranks: [
			null,
			8,
			7,
			7,
			7,
			7
		],
		sentiment: "positive",
		positive: 64,
		mixed: 22,
		negative: 14,
		confidence: "estimated"
	},
	SE: {
		ranks: [
			null,
			8,
			7,
			7,
			7,
			7
		],
		sentiment: "positive",
		positive: 68,
		mixed: 18,
		negative: 14,
		confidence: "estimated"
	},
	NO: {
		ranks: [
			null,
			8,
			7,
			7,
			7,
			7
		],
		sentiment: "positive",
		positive: 67,
		mixed: 19,
		negative: 14,
		confidence: "estimated"
	},
	DK: {
		ranks: [
			null,
			8,
			8,
			7,
			7,
			7
		],
		sentiment: "mixed",
		positive: 56,
		mixed: 24,
		negative: 20,
		confidence: "estimated"
	},
	PS: {
		ranks: [
			null,
			2,
			2,
			2,
			2,
			2
		],
		sentiment: "positive",
		positive: 78,
		mixed: 14,
		negative: 8,
		confidence: "documented",
		note: "נושא הסרט. +972 / שיחה מקומית פרסמו את התחקירים שעליהם הוא מבוסס. אין צפייה מסחרית — זה שיח, לא שעות צפייה.",
		quotes: [{
			text: "NAZA makes visible what we could never see from inside Gaza: that there were people watching, calculating, and deciding how many of us would die.",
			by: "שיחה מקומית / +972 Magazine",
			tone: "emotional",
			source: "+972"
		}]
	},
	QA: {
		ranks: [
			null,
			4,
			4,
			3,
			3,
			3
		],
		sentiment: "positive",
		positive: 82,
		mixed: 12,
		negative: 6,
		confidence: "estimated",
		note: "הערכה לפי סיקור ערבי של בכורת ונציה. אין מדד צפייה."
	},
	LB: {
		ranks: [
			null,
			5,
			4,
			4,
			4,
			4
		],
		sentiment: "positive",
		positive: 76,
		mixed: 16,
		negative: 8,
		confidence: "estimated",
		note: "השוואה חדה לפאודה: שם הסדרה הייתה מקום 1 בנטפליקס למרות חרם; כאן השיח על נז\"א מוערך כחיובי לסרט."
	},
	EG: {
		ranks: [
			null,
			6,
			5,
			5,
			5,
			5
		],
		sentiment: "positive",
		positive: 74,
		mixed: 16,
		negative: 10,
		confidence: "estimated"
	},
	JO: {
		ranks: [
			null,
			7,
			6,
			6,
			6,
			6
		],
		sentiment: "positive",
		positive: 72,
		mixed: 18,
		negative: 10,
		confidence: "estimated"
	},
	AE: {
		ranks: [
			null,
			8,
			7,
			7,
			7,
			7
		],
		sentiment: "mixed",
		positive: 58,
		mixed: 24,
		negative: 18,
		confidence: "estimated",
		note: "קהל סטרימינג שצפה בפאודה כמתח; השיח על נז\"א מוערך כמעורב-חיובי, בלי ציטוט מקומי."
	},
	TR: {
		ranks: [
			null,
			6,
			5,
			4,
			4,
			4
		],
		sentiment: "positive",
		positive: 80,
		mixed: 12,
		negative: 8,
		confidence: "estimated",
		note: "הערכה לפי אקלים תקשורתי ביקורתי כלפי ישראל וסיקור Daily Sabah / AA."
	},
	SA: {
		ranks: [
			null,
			9,
			8,
			8,
			8,
			8
		],
		sentiment: "positive",
		positive: 70,
		mixed: 18,
		negative: 12,
		confidence: "estimated"
	},
	MA: {
		ranks: [
			null,
			8,
			7,
			7,
			7,
			7
		],
		sentiment: "positive",
		positive: 72,
		mixed: 16,
		negative: 12,
		confidence: "estimated"
	},
	CA: {
		ranks: [
			null,
			7,
			6,
			6,
			5,
			5
		],
		sentiment: "mixed",
		positive: 56,
		mixed: 24,
		negative: 20,
		confidence: "estimated",
		note: "הערכה לפי שיח אנגלופוני (NYT, Vulture) בלי סקר קנדי."
	},
	AU: {
		ranks: [
			null,
			8,
			8,
			7,
			7,
			7
		],
		sentiment: "mixed",
		positive: 54,
		mixed: 26,
		negative: 20,
		confidence: "estimated"
	},
	BR: {
		ranks: [
			null,
			8,
			8,
			7,
			7,
			7
		],
		sentiment: "mixed",
		positive: 52,
		mixed: 26,
		negative: 22,
		confidence: "estimated"
	},
	AR: {
		ranks: [
			null,
			9,
			8,
			8,
			8,
			8
		],
		sentiment: "mixed",
		positive: 50,
		mixed: 28,
		negative: 22,
		confidence: "estimated"
	},
	IN: {
		ranks: [
			null,
			null,
			9,
			8,
			8,
			8
		],
		sentiment: "mixed",
		positive: 48,
		mixed: 28,
		negative: 24,
		confidence: "estimated"
	},
	ZA: {
		ranks: [
			null,
			8,
			7,
			6,
			6,
			6
		],
		sentiment: "positive",
		positive: 72,
		mixed: 16,
		negative: 12,
		confidence: "estimated",
		note: "מסורת ICJ/BDS. הטון כלפי הסרט מוערך כחיובי, בלי ציטוט מקומי מתועד לשבוע הבכורה."
	}
};
var ME_ARAB = /* @__PURE__ */ new Set([
	"LB",
	"JO",
	"EG",
	"QA",
	"AE",
	"BH",
	"KW",
	"OM",
	"SA",
	"MA",
	"TN",
	"DZ",
	"IQ",
	"SY",
	"LY",
	"PS"
]);
var MUSLIM_AA = /* @__PURE__ */ new Set([
	"PK",
	"BD",
	"ID",
	"MY",
	"IR"
]);
function fallback(c) {
	if (c.id === "IL") return PATCH.IL;
	if (ME_ARAB.has(c.id)) return {
		ranks: EMPTY,
		sentiment: "positive",
		positive: 70,
		mixed: 18,
		negative: 12,
		confidence: "estimated",
		note: "אין סיקור מקומי מתועד בשבוע הבכורה. הטון מוערך לפי שיח ערבי סביב תחקיר על עזה — שיח, לא צפייה."
	};
	if (MUSLIM_AA.has(c.id)) return {
		ranks: EMPTY,
		sentiment: "positive",
		positive: 74,
		mixed: 16,
		negative: 10,
		confidence: "estimated",
		note: "הערכה לפי אקלים חרם וסיקור זוכה ונציה. אין מדד צפייה."
	};
	if (c.region === "eu") return {
		ranks: EMPTY,
		sentiment: "positive",
		positive: 60,
		mixed: 24,
		negative: 16,
		confidence: "estimated",
		note: "הערכה אזורית לפי סיקור פסטיבל ונציה. הסרט לא עלה לנטפליקס בשבוע המדגם."
	};
	if (c.region === "am") return {
		ranks: EMPTY,
		sentiment: "mixed",
		positive: 50,
		mixed: 28,
		negative: 22,
		confidence: "estimated",
		note: "הערכה לפי שיח אמריקאי מתועד (מבקרים מול דחייה פוליטית). אין צפייה מסחרית."
	};
	return {
		ranks: EMPTY,
		sentiment: "mixed",
		positive: 52,
		mixed: 28,
		negative: 20,
		confidence: "estimated",
		note: "אין סיקור מתועד במדגם. הסרט הוקרן בפסטיבל — הטון הוא הערכה אזורית, לא שעות צפייה."
	};
}
var nazaCountries = countries.map((c) => {
	const p = PATCH[c.id] ?? fallback(c);
	return {
		id: c.id,
		nameHe: c.nameHe,
		nameEn: c.nameEn,
		geoNames: c.geoNames,
		region: c.region,
		coords: c.coords,
		ranks: p.ranks.length === NAZA_DAYS.length ? p.ranks : EMPTY,
		sentiment: p.sentiment,
		positive: p.positive,
		mixed: p.mixed,
		negative: p.negative,
		confidence: p.confidence,
		note: p.note,
		quotes: p.quotes
	};
});
NAZA_GLOBAL.top10Countries = nazaCountries.filter((c) => c.ranks.some((r) => r != null)).length;
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
var getLatestLiveRun = createServerFn({ method: "GET" }).handler(createSsrRpc("413702012a4684922e72665b95cb8f3dc6a549e9e0988c68a34428562d060691"));
var listLiveRuns = createServerFn({ method: "GET" }).handler(createSsrRpc("c439fee5beda7a0c4ba45cb99d83a0543879a87a5b0d3646b68ab920190fcfda"));
var ingestInput = object({ slot: _enum([
	"morning",
	"evening",
	"manual"
]).optional() });
var runLiveIngest = createServerFn({ method: "POST" }).validator(ingestInput).handler(createSsrRpc("42049040f4361b4245cd4607456283f9774592a24b054025ee436acaeebf9c62"));
var FAUDA_WORK = {
	id: "fauda",
	countries,
	global: GLOBAL,
	snapshot: SNAPSHOT,
	days: RANK_DAYS,
	posts: SOCIAL_POSTS.map((p) => ({
		...p,
		work: "fauda"
	})),
	mood: COMMENT_MOOD,
	tr: SOCIAL_TR,
	quotes: globalQuotes,
	source: LIVE.source,
	presence: "netflix",
	defaultCountry: "LB"
};
var NAZA_WORK = {
	id: "naza",
	countries: nazaCountries,
	global: NAZA_GLOBAL,
	snapshot: NAZA_SNAPSHOT,
	days: NAZA_DAYS,
	posts: NAZA_SOCIAL_POSTS,
	mood: NAZA_COMMENT_MOOD,
	tr: NAZA_SOCIAL_TR,
	quotes: NAZA_QUOTES,
	source: "https://en.wikipedia.org/wiki/NAZA_(film)",
	presence: "discourse",
	defaultCountry: "IT"
};
var WorkContext = (0, import_react.createContext)(null);
function isWorkView(v) {
	return v === "fauda" || v === "naza" || v === "compare";
}
function patchFauda(overlay) {
	if (!overlay) return FAUDA_WORK;
	return {
		...FAUDA_WORK,
		days: overlay.days,
		snapshot: overlay.snapshot,
		global: overlay.global,
		source: overlay.source,
		countries: FAUDA_WORK.countries.map((c) => {
			const ranks = overlay.ranks[c.id];
			if (!ranks || ranks.length !== overlay.days.length) return c;
			return {
				...c,
				ranks
			};
		})
	};
}
function WorkProvider({ children }) {
	const [view, setViewState] = (0, import_react.useState)("compare");
	const [ready, setReady] = (0, import_react.useState)(false);
	const [overlay, setOverlay] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const fromUrl = new URLSearchParams(window.location.search).get("work");
		if (isWorkView(fromUrl)) setViewState(fromUrl);
		setReady(true);
		getLatestLiveRun().then((run) => {
			if (!run?.fauda || !run.lastRunAt) return;
			if (Date.parse(run.lastRunAt) >= Date.parse(LIVE.fetchedAt)) setOverlay(run.fauda);
		}).catch(() => {});
	}, []);
	const setView = (0, import_react.useCallback)((next) => {
		setViewState(next);
		const url = new URL(window.location.href);
		url.searchParams.set("work", next);
		window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
	}, []);
	const fauda = (0, import_react.useMemo)(() => patchFauda(overlay), [overlay]);
	const work = view === "naza" ? NAZA_WORK : fauda;
	const other = work.id === "fauda" ? NAZA_WORK : fauda;
	const value = (0, import_react.useMemo)(() => ({
		view,
		setView,
		work,
		other,
		fauda,
		naza: NAZA_WORK,
		socialOf: (c) => socialOf(c, work.posts),
		allQuotes: allQuotes(work.countries, work.quotes),
		feedPosts: view === "compare" ? [...FAUDA_WORK.posts, ...NAZA_WORK.posts] : work.posts
	}), [
		view,
		setView,
		work,
		other,
		fauda
	]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkContext.Provider, {
		value,
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkContext.Provider, {
		value,
		children
	});
}
function useWork() {
	const ctx = (0, import_react.useContext)(WorkContext);
	if (!ctx) throw new Error("useWork must be used within WorkProvider");
	return ctx;
}
function AppShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShellFrame, { children }) }) });
}
function ShellFrame({ children }) {
	const { t, locale } = useI18n();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		trackPage(pathname === "/" || pathname === "/office" || pathname === "/accessibility" ? pathname : "/other", locale);
	}, [pathname, locale]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: "#main",
			className: "skip-link",
			children: t("skipMain")
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "sticky top-0 z-[60] flex justify-start border-b border-border bg-background/95 px-3 py-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageSwitcher, {})
		}),
		children,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(A11yWidget, {})
	] });
}
//#endregion
export { runLiveIngest as A, listLiveRuns as C, postBuckets as D, peakRank as E, socialOf as F, trackClick as I, translatedText as L, searchSuggestions as M, socialByPlatform as N, rankHeat as O, socialCountryIds as P, useWork as R, latestRank as S, onVisitStats as T, getLatestLiveRun as _, RANK_DAYS as a, isoOf as b, bucketPct as c, countries as d, countryByGeoName as f, formatIsoLine as g, engagementOf as h, GLOBAL as i, searchCountries as j, regionStats as k, cn as l, countryByIsoNumeric as m, BUNDLED_CHANGES as n, SOCIAL_POSTS as o, countryById as p, COMMENT_MOOD as r, TONE_LABEL as s, AppShell as t, commentsByPlatform as u, inTop10 as v, needsTranslate as w, jerusalemNow as x, isTalkOnly as y };
