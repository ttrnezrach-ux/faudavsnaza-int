import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-primitive+[...].mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as LIVE } from "./changes-BqFL2XkB.mjs";
import { a as string, i as object } from "../_libs/zod.mjs";
import { n as getOfficeStats, t as createSsrRpc } from "./visits-5ua7sqp9.mjs";
import { c as useI18n, i as LOCALE_META } from "./ga-0gxl-ST5.mjs";
import { A as runLiveIngest, C as listLiveRuns, I as trackClick, l as cn, t as AppShell } from "./app-shell-RsxWvxE9.mjs";
import { i as googleHostCountry, r as flagEmoji, t as countryDisplayName } from "./geo-CQ-q3xHM.mjs";
import { n as Input, t as Button } from "./input-Clwls7nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/office-DFGwbq3j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getOfficeLockState = createServerFn({ method: "GET" }).handler(createSsrRpc("43fe37502218b3234107fd7a03e204251002d478d9606e5a3bdf98f72a830376"));
var verifyOfficeLock = createServerFn({ method: "POST" }).validator((input) => object({
	code: string().max(8),
	password: string().min(1).max(128)
}).parse(input)).handler(createSsrRpc("a3556e15e7eb50cb6ec926d87552b21c87d1ec7ef68df3eab6cd65351586ca99"));
var lockOfficeSession = createServerFn({ method: "POST" }).handler(createSsrRpc("b623f7d635b5f9d5b37a95d1020c0f984f65c2a99ab40783659c39a5d948b097"));
function OfficeGate({ children }) {
	const { t } = useI18n();
	const [state, setState] = (0, import_react.useState)(null);
	const [password, setPassword] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [wrong, setWrong] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getOfficeLockState().then(setState).catch(() => setState({ status: "locked" }));
	}, []);
	async function submit(e) {
		e.preventDefault();
		if (code.replace(/\s/g, "").length !== 6 || password.length < 8 || busy) return;
		setBusy(true);
		setWrong(false);
		try {
			const next = await verifyOfficeLock({ data: {
				code,
				password
			} });
			setState(next);
			if (next.status === "unlocked") {
				setCode("");
				setPassword("");
			} else setWrong(true);
		} catch {
			setWrong(true);
		} finally {
			setBusy(false);
		}
	}
	async function logout() {
		const next = await lockOfficeSession();
		setState(next);
		setCode("");
		setPassword("");
	}
	if (!state) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-dvh bg-background" });
	if (state.status === "unlocked") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-end px-4 pt-3 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			variant: "secondary",
			className: "h-11",
			onClick: () => void logout(),
			children: t("officeLockOut")
		})
	}), children] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-background px-4 text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "w-full max-w-md rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.18em] text-muted-foreground",
					children: t("office")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-2xl font-medium",
					children: t("officeLockTitle")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted-foreground",
					children: state.status === "setup" ? t("officeLockHint") : state.status === "wait" ? t("officeLockWait") : t("officeLockLocked")
				}),
				state.status === "setup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center rounded-xl bg-heat p-3",
							dangerouslySetInnerHTML: { __html: state.qr }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-xs text-muted-foreground",
							children: t("officeLockSecret")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center font-mono text-sm tracking-widest text-foreground",
							dir: "ltr",
							children: state.secret
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: state.otpauth,
							className: "flex min-h-11 items-center justify-center rounded-lg bg-muted text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							children: t("officeLockOpenApp")
						})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 space-y-3",
					onSubmit: (e) => void submit(e),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium",
							htmlFor: "office-password",
							children: t("officeLockPassword")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "office-password",
							type: "password",
							autoComplete: state.status === "setup" ? "new-password" : "current-password",
							minLength: 8,
							maxLength: 128,
							value: password,
							onChange: (e) => setPassword(e.target.value),
							className: "h-12"
						}),
						state.status === "setup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: t("officeLockPasswordHint")
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium",
							htmlFor: "office-code",
							children: t("officeLockCode")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "office-code",
							inputMode: "numeric",
							autoComplete: "one-time-code",
							pattern: "[0-9]*",
							maxLength: 6,
							value: code,
							onChange: (e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6)),
							className: "h-12 text-center font-mono text-xl tracking-[0.4em]",
							dir: "ltr"
						}),
						wrong ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-negative",
							children: t("officeLockWrong")
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "h-11 w-full",
							disabled: busy || code.length !== 6 || password.length < 8 || state.status === "wait",
							children: state.status === "setup" ? t("officeLockSetup") : t("officeLockUnlock")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-3 inline-flex min-h-11 w-full items-center justify-center text-sm text-muted-foreground underline-offset-4 hover:underline",
					children: t("officeBack")
				})
			]
		})
	});
}
var SLICE = [
	"#d8d2c8",
	"#7d9b84",
	"#c4a574",
	"#c47a7a",
	"#8aa0b8",
	"#b89a7a",
	"#9a8ab8",
	"#7aa8a0"
];
function HoverTip({ show, x, y, children }) {
	if (!show) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute z-20 min-w-36 rounded-lg bg-foreground px-3 py-2 text-xs text-background shadow-lg",
		style: {
			left: x,
			top: y,
			transform: "translate(-50%, calc(-100% - 8px))"
		},
		children
	});
}
function DualHourChart({ points }) {
	const { t, locale } = useI18n();
	const [tip, setTip] = (0, import_react.useState)(null);
	if (points.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-3 text-sm text-muted-foreground",
		children: t("noData")
	});
	const max = Math.max(1, ...points.flatMap((p) => [p.visits, p.clicks]));
	const w = 720;
	const h = 188;
	const pad = {
		t: 28,
		r: 8,
		b: 28,
		l: 8
	};
	const innerW = w - pad.l - pad.r;
	const innerH = h - pad.t - pad.b;
	const gap = innerW / points.length;
	const barW = Math.max(3, gap * .32);
	function x(i) {
		return pad.l + i * gap + gap / 2;
	}
	function y(n) {
		return pad.t + innerH - n / max * innerH;
	}
	const visitLine = points.map((p, i) => `${x(i)},${y(p.visits)}`).join(" ");
	const clickLine = points.map((p, i) => `${x(i)},${y(p.clicks)}`).join(" ");
	const active = tip ? points[tip.i] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		dir: "ltr",
		onMouseLeave: () => setTip(null),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: `0 0 ${w} ${h}`,
				className: "h-44 w-full",
				role: "img",
				"aria-label": t("trafficHourly"),
				children: [
					points.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: x(i) - gap / 2,
							y: pad.t,
							width: gap,
							height: innerH,
							className: tip?.i === i ? "fill-muted/60" : "fill-transparent",
							onMouseEnter: (e) => {
								const box = e.currentTarget.ownerSVGElement.getBoundingClientRect();
								if (!e.currentTarget.ownerSVGElement.parentElement?.getBoundingClientRect()) return;
								setTip({
									i,
									x: x(i) / w * box.width,
									y: 12
								});
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: x(i) - barW - 1,
							y: y(p.visits),
							width: barW,
							height: Math.max(2, pad.t + innerH - y(p.visits)),
							rx: "1.5",
							className: "fill-heat"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: x(i) + 1,
							y: y(p.clicks),
							width: barW,
							height: Math.max(2, pad.t + innerH - y(p.clicks)),
							rx: "1.5",
							className: "fill-positive"
						}),
						tip?.i === i ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: x(i) - barW,
							y: y(p.visits) - 6,
							textAnchor: "middle",
							className: "fill-foreground",
							fontSize: "12",
							fontWeight: "700",
							children: p.visits
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: x(i) + barW,
							y: y(p.clicks) - 6,
							textAnchor: "middle",
							className: "fill-positive",
							fontSize: "12",
							fontWeight: "700",
							children: p.clicks
						})] }) : null,
						i % (points.length > 16 ? 4 : points.length > 8 ? 2 : 1) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: x(i),
							y: 180,
							textAnchor: "middle",
							className: "fill-muted-foreground",
							fontSize: "11",
							children: p.hour
						}) : null
					] }, p.hour + i)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
						points: visitLine,
						fill: "none",
						className: "stroke-heat",
						strokeWidth: "1.5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
						points: clickLine,
						fill: "none",
						className: "stroke-positive",
						strokeWidth: "1.5"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoverTip, {
				show: !!active && !!tip,
				x: tip?.x ?? 0,
				y: tip?.y ?? 0,
				children: active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-0.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: active.hour
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							t("trafficVisits"),
							": ",
							active.visits.toLocaleString(locale)
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							t("trafficClicks"),
							": ",
							active.clicks.toLocaleString(locale)
						] })
					]
				}) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-sm bg-heat" }), t("trafficVisits")]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-sm bg-positive" }), t("trafficClicks")]
				})]
			})
		]
	});
}
function FlagColumnChart({ rows }) {
	const { t, locale } = useI18n();
	const data = rows.slice(0, 14);
	if (data.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-3 text-sm text-muted-foreground",
		children: t("noData")
	});
	const max = Math.max(1, ...data.flatMap((r) => [r.visits, r.clicks]));
	const showClicks = data.some((r) => r.clicks > 0);
	const w = 720;
	const h = 260;
	const pad = {
		t: 16,
		r: 8,
		b: 56,
		l: 8
	};
	const innerW = w - pad.l - pad.r;
	const innerH = h - pad.t - pad.b;
	const slot = innerW / data.length;
	const barW = Math.max(7, slot * .3);
	function x(i) {
		return pad.l + i * slot + slot / 2;
	}
	function y(n) {
		return pad.t + innerH - n / max * innerH;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		dir: "ltr",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: `0 0 ${w} ${h}`,
			className: "h-64 w-full",
			role: "img",
			"aria-label": t("countriesByIp"),
			children: data.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: `${r.name}: ${r.visits} / ${r.clicks}` }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: x(i) - (showClicks ? barW + 1 : barW / 2),
					y: y(r.visits),
					width: barW,
					height: Math.max(4, pad.t + innerH - y(r.visits)),
					rx: "2",
					className: "fill-heat"
				}),
				showClicks ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: x(i) + 1,
					y: y(r.clicks),
					width: barW,
					height: Math.max(4, pad.t + innerH - y(r.clicks)),
					rx: "2",
					className: "fill-positive"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: x(i),
					y: 228,
					textAnchor: "middle",
					fontSize: "20",
					children: r.flag
				})
			] }, r.id))
		})
	});
}
function IpVisitChart({ rows }) {
	const { t, locale } = useI18n();
	const [tip, setTip] = (0, import_react.useState)(null);
	const data = rows.slice(0, 16);
	if (data.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-3 text-sm text-muted-foreground",
		children: t("noData")
	});
	const max = Math.max(1, ...data.flatMap((r) => [r.visits, r.clicks]));
	const w = 720;
	const h = 280;
	const pad = {
		t: 28,
		r: 8,
		b: 64,
		l: 8
	};
	const innerW = w - pad.l - pad.r;
	const innerH = h - pad.t - pad.b;
	const slot = innerW / data.length;
	const barW = Math.max(8, slot * .32);
	function x(i) {
		return pad.l + i * slot + slot / 2;
	}
	function y(n) {
		return pad.t + innerH - n / max * innerH;
	}
	const active = tip ? data[tip.i] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		dir: "ltr",
		onMouseLeave: () => setTip(null),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				viewBox: `0 0 ${w} ${h}`,
				className: "h-72 w-full",
				role: "img",
				"aria-label": t("ipVisits"),
				children: data.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					onMouseEnter: (e) => {
						const svg = e.currentTarget.ownerSVGElement;
						if (!svg) return;
						const box = svg.getBoundingClientRect();
						setTip({
							i,
							x: x(i) / w * box.width,
							y: 8
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: x(i) - slot / 2,
							y: pad.t,
							width: slot,
							height: innerH,
							className: tip?.i === i ? "fill-muted/70" : "fill-transparent"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: x(i) - barW - 1,
							y: y(r.visits),
							width: barW,
							height: Math.max(4, pad.t + innerH - y(r.visits)),
							rx: "2",
							className: "fill-heat"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: x(i) + 1,
							y: y(r.clicks),
							width: barW,
							height: Math.max(4, pad.t + innerH - y(r.clicks)),
							rx: "2",
							className: "fill-positive"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: x(i),
							y: y(r.visits) - 6,
							textAnchor: "middle",
							className: "fill-foreground",
							fontSize: "11",
							fontWeight: "600",
							children: r.visits
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: x(i),
							y: 244,
							textAnchor: "middle",
							fontSize: "16",
							children: flagEmoji(r.country)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: x(i),
							y: 264,
							textAnchor: "middle",
							className: "fill-muted-foreground",
							fontSize: "9",
							children: r.hint
						})
					]
				}, r.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoverTip, {
				show: !!active && !!tip,
				x: tip?.x ?? 0,
				y: tip?.y ?? 0,
				children: active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-0.5",
					dir: "auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-medium",
							children: [
								flagEmoji(active.country),
								" ",
								countryDisplayName(active.country ?? "", locale)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							dir: "ltr",
							children: [
								t("ipAddress"),
								": ",
								active.hint
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							t("trafficVisits"),
							": ",
							active.visits.toLocaleString(locale)
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							t("trafficClicks"),
							": ",
							active.clicks.toLocaleString(locale)
						] })
					]
				}) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-sm bg-heat" }), t("trafficVisits")]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-sm bg-positive" }), t("trafficClicks")]
				})]
			})
		]
	});
}
function ClickDonut({ slices }) {
	const { t, locale } = useI18n();
	const data = slices.slice(0, 8).filter((s) => s.count > 0);
	if (data.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-3 text-sm text-muted-foreground",
		children: t("noData")
	});
	const total = data.reduce((n, s) => n + s.count, 0);
	const r = 54;
	const c = 2 * Math.PI * r;
	let acc = 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-4 sm:flex-row sm:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 160 160",
			className: "size-44 shrink-0",
			role: "img",
			"aria-label": t("clicksTitle"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "80",
					cy: "80",
					r,
					fill: "none",
					className: "stroke-muted",
					strokeWidth: "22"
				}),
				data.map((s, i) => {
					const dash = s.count / total * c;
					const gap = c - dash;
					const rot = acc / total * 360 - 90;
					acc += s.count;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "80",
						cy: "80",
						r,
						fill: "none",
						stroke: SLICE[i % SLICE.length],
						strokeWidth: "22",
						strokeDasharray: `${dash} ${gap}`,
						transform: `rotate(${rot} 80 80)`,
						strokeLinecap: "butt",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: `${s.label}: ${s.count}` })
					}, s.id);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "80",
					y: "76",
					textAnchor: "middle",
					className: "fill-foreground",
					fontSize: "22",
					fontWeight: "600",
					children: total.toLocaleString(locale)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "80",
					y: "96",
					textAnchor: "middle",
					className: "fill-muted-foreground",
					fontSize: "11",
					children: t("trafficClicks")
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid min-w-0 flex-1 grid-cols-1 gap-2",
			children: data.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-2.5 shrink-0 rounded-sm",
						style: { background: SLICE[i % SLICE.length] }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 truncate font-medium",
						children: s.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ms-auto shrink-0 tabular-nums text-muted-foreground",
						children: [
							s.count.toLocaleString(locale),
							" · ",
							Math.round(s.count / total * 100),
							"%"
						]
					})
				]
			}, s.id))
		})]
	});
}
function FlagBubbles({ rows }) {
	const { t, locale } = useI18n();
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-3 text-sm text-muted-foreground",
		children: t("noData")
	});
	const max = Math.max(1, ...rows.map((r) => r.count));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap items-end justify-center gap-3 py-2",
		role: "img",
		"aria-label": t("recentClicks"),
		children: rows.map((r) => {
			const size = 36 + r.count / max * 44;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex items-center justify-center rounded-full bg-muted",
					style: {
						width: size,
						height: size,
						fontSize: size * .42
					},
					title: `${countryDisplayName(r.code, locale)} · ${r.count}`,
					children: flagEmoji(r.code)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs tabular-nums text-muted-foreground",
					children: r.count.toLocaleString(locale)
				})]
			}, r.code);
		})
	});
}
function OfficeVisuals({ countries, hourly, clickLeaders, recentClicks, ipLeaders, labelClick, seriesTitle, hideHourly = false }) {
	const { t, locale } = useI18n();
	const byCountry = /* @__PURE__ */ new Map();
	for (const c of recentClicks) {
		const code = c.country ?? "ZZ";
		byCountry.set(code, (byCountry.get(code) ?? 0) + 1);
	}
	const bubbles = [...byCountry.entries()].map(([code, count]) => ({
		code,
		count
	})).sort((a, b) => b.count - a.count);
	const shares = clickLeaders.filter((c) => c.target.startsWith("share:"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			hideHourly ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-medium",
					children: seriesTitle ?? t("trafficHourly")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DualHourChart, { points: hourly })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-medium",
						children: t("ipVisits")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: t("ipVisitsHint")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IpVisitChart, { rows: ipLeaders })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-medium",
						children: t("countriesByIp")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: t("trafficHint")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlagColumnChart, { rows: countries.map((c) => ({
						id: c.code,
						flag: flagEmoji(c.code),
						name: countryDisplayName(c.code, locale),
						visits: c.visitors,
						clicks: c.clicks
					})) })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-medium",
						children: t("clicksTitle")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClickDonut, { slices: clickLeaders.map((c) => ({
							id: c.target,
							label: labelClick(c.target),
							count: c.count
						})) })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-medium",
							children: t("recentClicks")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: t("countriesByIp")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlagBubbles, { rows: bubbles })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-medium",
						children: t("shareByNetwork")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: t("shareByNetworkHint")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClickDonut, { slices: shares.map((c) => ({
							id: c.target,
							label: labelClick(c.target),
							count: c.count
						})) })
					})
				]
			})
		]
	});
}
function productLabel(name, t) {
	if (name === "news") return t("googleNews");
	if (name === "images") return t("googleImages");
	if (name === "ads") return t("googleAds");
	if (name === "maps") return t("googleMaps");
	if (name === "other") return t("googleOther");
	return t("googleSearch");
}
function landingLabel(name, t) {
	if (name === "/") return t("title");
	if (name === "/office") return t("office");
	if (name === "/accessibility") return t("accessibility");
	return name;
}
function GoogleArrivalCharts({ data }) {
	const { t, locale } = useI18n();
	const hostRows = data.hosts.map((h) => {
		const code = googleHostCountry(h.name);
		return {
			id: h.name,
			flag: flagEmoji(code),
			name: code ? `${flagEmoji(code)} ${countryDisplayName(code, locale)}` : h.name,
			visits: h.count,
			clicks: 0
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-4",
		"aria-labelledby": "google-heading",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: "google-heading",
				className: "font-display text-xl font-medium",
				children: t("googleTitle")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: t("googleHint")
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted-foreground",
						children: t("googleSessions")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-2xl font-medium tabular-nums",
						children: data.sessions.toLocaleString(locale)
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-medium",
							children: t("googleProduct")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClickDonut, { slices: data.products.map((p) => ({
								id: p.name,
								label: productLabel(p.name, t),
								count: p.count
							})) })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-medium",
							children: t("googleFromCountry")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlagBubbles, { rows: data.countries.map((c) => ({
							code: c.name,
							count: c.count
						})) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-medium",
							children: t("googleFromHost")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlagColumnChart, { rows: hostRows })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-medium",
							children: t("googleLanding")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClickDonut, { slices: data.landings.map((p) => ({
								id: p.name,
								label: landingLabel(p.name, t),
								count: p.count
							})) })
						})]
					})
				]
			}),
			data.campaigns.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg font-medium",
					children: t("googleCampaign")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClickDonut, { slices: data.campaigns.map((p) => ({
						id: p.name,
						label: p.name,
						count: p.count
					})) })
				})]
			}) : null
		]
	});
}
var GOAL_KEYS = {
	land: "goalLand",
	explore: "goalExplore",
	share: "goalShare",
	office: "goalOffice",
	google: "goalGoogle",
	googleShare: "goalGoogleShare",
	duration: "goalDuration",
	engaged: "goalEngaged"
};
function AnalyticsGoals({ goals, sessions }) {
	const { t, locale } = useI18n();
	const denom = Math.max(1, sessions);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-4",
		"aria-labelledby": "goals-heading",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			id: "goals-heading",
			className: "font-display text-xl font-medium",
			children: t("goalsTitle")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: t("goalsHint")
		})] }), goals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: t("noData")
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: goals.map((g) => {
				const rate = Math.min(100, Math.round(g.completions / denom * 1e3) / 10);
				const circ = 2 * Math.PI * 28;
				const dash = rate / 100 * circ;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
					className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 72 72",
							className: "size-16 shrink-0",
							"aria-hidden": "true",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: "36",
									cy: "36",
									r: "28",
									fill: "none",
									className: "stroke-muted",
									strokeWidth: "8"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: "36",
									cy: "36",
									r: "28",
									fill: "none",
									className: "stroke-positive",
									strokeWidth: "8",
									strokeDasharray: `${dash} ${circ - dash}`,
									strokeLinecap: "round",
									transform: "rotate(-90 36 36)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
									x: "36",
									y: "40",
									textAnchor: "middle",
									className: "fill-foreground",
									fontSize: "12",
									fontWeight: "600",
									children: [rate, "%"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-medium leading-snug",
								children: t(GOAL_KEYS[g.id] ?? g.id)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									t("goalCompletions"),
									":",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums text-foreground",
										children: g.completions.toLocaleString(locale)
									})
								]
							})]
						})]
					})
				}, g.id);
			})
		})]
	});
}
var DURATION_ORDER = [
	"lt10",
	"lt30",
	"lt2m",
	"lt5m",
	"gt5m"
];
function durationLabel(id, t) {
	if (id === "lt10") return t("durLt10");
	if (id === "lt30") return t("durLt30");
	if (id === "lt2m") return t("durLt2m");
	if (id === "lt5m") return t("durLt5m");
	return t("durGt5m");
}
function InsightOpens({ leaders, labelClick }) {
	const { t, locale } = useI18n();
	const rows = leaders.filter((c) => c.target.startsWith("insight:"));
	const max = Math.max(1, ...rows.map((r) => r.count));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-medium",
				children: t("insightOpens")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: t("insightOpensHint")
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: t("noData")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: labelClick(r.target)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-muted-foreground",
						children: r.count.toLocaleString(locale)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 h-2 overflow-hidden rounded-full bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block h-full bg-heat",
						style: { width: `${Math.max(8, r.count / max * 100)}%` }
					})
				})] }, r.target))
			})
		]
	});
}
function BounceRing({ rate, sessions }) {
	const { t, locale } = useI18n();
	const r = 52;
	const c = 2 * Math.PI * r;
	const bounce = Math.min(100, Math.max(0, rate));
	const dash = bounce / 100 * c;
	const stayed = 100 - bounce;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-medium",
				children: t("bounceTitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: t("bounceHint")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-col items-center gap-4 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 140 140",
					className: "size-40 shrink-0",
					role: "img",
					"aria-label": t("bounce"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "70",
							cy: "70",
							r,
							fill: "none",
							className: "stroke-positive",
							strokeWidth: "18"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "70",
							cy: "70",
							r,
							fill: "none",
							className: "stroke-negative",
							strokeWidth: "18",
							strokeDasharray: `${dash} ${c - dash}`,
							transform: "rotate(-90 70 70)",
							strokeLinecap: "butt"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
							x: "70",
							y: "66",
							textAnchor: "middle",
							className: "fill-foreground",
							fontSize: "28",
							fontWeight: "600",
							children: [bounce, "%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: "70",
							y: "86",
							textAnchor: "middle",
							className: "fill-muted-foreground",
							fontSize: "11",
							children: t("bounce")
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "grid flex-1 gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-sm bg-negative" }), t("bounce")]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums text-muted-foreground",
								children: [bounce, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-sm bg-positive" }), t("stayRate")]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums text-muted-foreground",
								children: [stayed, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-3 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("sessions") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: sessions.toLocaleString(locale)
							})]
						})
					]
				})]
			})
		]
	});
}
function DurationChart({ buckets, avgSeconds }) {
	const { t, locale } = useI18n();
	const byName = new Map(buckets.map((b) => [b.name, b.count]));
	const rows = DURATION_ORDER.map((id) => ({
		id,
		count: byName.get(id) ?? 0
	}));
	const max = Math.max(1, ...rows.map((r) => r.count));
	const m = Math.floor(avgSeconds / 60);
	const s = avgSeconds % 60;
	const clock = `${m}:${String(s).padStart(2, "0")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-medium",
				children: t("durationTitle")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: t("durationHint")
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl font-medium tabular-nums leading-none",
				children: clock
			})]
		}), rows.every((r) => r.count === 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted-foreground",
			children: t("noData")
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 space-y-2",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: durationLabel(r.id, t)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums text-muted-foreground",
					children: r.count.toLocaleString(locale)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 h-2 overflow-hidden rounded-full bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block h-full bg-heat",
					style: { width: `${Math.max(r.count ? 8 : 0, r.count / max * 100)}%` }
				})
			})] }, r.id))
		})]
	});
}
function CommonCard({ label, value, share }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-card px-4 py-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 truncate font-display text-xl font-medium leading-tight",
				children: value
			}),
			share ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs tabular-nums text-muted-foreground",
				children: share
			}) : null
		]
	});
}
function OfficeOverview({ stats, hourlyTitle, labelClick }) {
	const { t, locale } = useI18n();
	const device = stats.devices[0];
	const source = stats.sources[0];
	const country = stats.countries[0];
	const click = stats.clickLeaders[0];
	const deviceTotal = stats.devices.reduce((n, d) => n + d.count, 0);
	const sourceTotal = stats.sources.reduce((n, d) => n + d.count, 0);
	const countryTotal = stats.countries.reduce((n, d) => n + d.visitors, 0);
	const clickTotal = stats.clickLeaders.reduce((n, d) => n + d.count, 0);
	function pct(part, total) {
		if (!total) return void 0;
		return `${Math.round(part / total * 100)}%`;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-medium",
						children: hourlyTitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: t("trafficHint")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DualHourChart, { points: stats.hourlyDual })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-medium",
					children: t("mostCommon")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: t("mostCommonHint")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommonCard, {
							label: t("mostCommonDevice"),
							value: device ? device.name === "mobile" ? t("deviceMobile") : device.name === "tablet" ? t("deviceTablet") : t("deviceDesktop") : "—",
							share: device ? pct(device.count, deviceTotal) : void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommonCard, {
							label: t("mostCommonSource"),
							value: source ? source.name === "google" ? t("sourceGoogle") : source.name === "internal" ? t("sourceInternal") : source.name === "referral" ? t("sourceReferral") : t("sourceDirect") : "—",
							share: source ? pct(source.count, sourceTotal) : void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommonCard, {
							label: t("mostCommonCountry"),
							value: country ? `${flagEmoji(country.code)} ${countryDisplayName(country.code, locale)}` : "—",
							share: country ? pct(country.visitors, countryTotal) : void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommonCard, {
							label: t("mostCommonClick"),
							value: click ? labelClick(click.target) : "—",
							share: click ? pct(click.count, clickTotal) : void 0
						})
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsightOpens, {
				leaders: stats.clickLeaders,
				labelClick
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("grid gap-4 lg:grid-cols-2"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BounceRing, {
					rate: stats.bounceRate,
					sessions: stats.sessions
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DurationChart, {
					buckets: stats.durationBuckets,
					avgSeconds: stats.avgSeconds
				})]
			})
		]
	});
}
function clickLabel(target, locale, t) {
	const [kind, rest] = target.split(":");
	if (kind === "share") return {
		whatsapp: t("netWhatsapp"),
		facebook: t("netFacebook"),
		x: t("netX"),
		telegram: t("netTelegram"),
		linkedin: t("netLinkedin"),
		mail: t("netMail"),
		copy: t("shareCopy"),
		native: t("shareNative"),
		card: t("sharePreview")
	}[rest] ?? target;
	if (kind === "tab") return {
		list: t("tabCountries"),
		search: t("tabSearch"),
		iso: t("tabIso"),
		quotes: t("tabQuotes"),
		social: t("tabSocial"),
		regions: t("tabRegions")
	}[rest] ?? target;
	if (kind === "lang") return LOCALE_META[rest]?.native ?? rest.toUpperCase();
	if (kind === "country") return `${flagEmoji(rest)} ${countryDisplayName(rest, locale)}`;
	if (kind === "nav") {
		if (rest === "office") return t("office");
		if (rest === "map") return t("navMap");
		if (rest === "social") return t("tabSocial");
		if (rest === "share") return t("navShare");
		if (rest === "algo") return t("navAlgo");
		if (rest === "concl") return t("navConcl");
		return target;
	}
	if (kind === "insight") {
		const key = `insightClick_${rest}`;
		const label = t(key);
		return label === key ? rest : label;
	}
	if (kind === "source") return rest;
	if (kind === "social") {
		if (rest === "facebook") return t("netFacebook");
		if (rest === "x") return t("netX");
		if (rest === "tiktok") return t("netTiktok");
		return t("netInstagram");
	}
	return target;
}
function pageLabel(name, t) {
	if (name === "/") return t("title");
	if (name === "/office") return t("office");
	if (name === "/accessibility") return t("accessibility");
	return name;
}
function deviceLabel(name, t) {
	if (name === "mobile") return t("deviceMobile");
	if (name === "tablet") return t("deviceTablet");
	return t("deviceDesktop");
}
function sourceLabel(name, t) {
	if (name === "google") return t("sourceGoogle");
	if (name === "internal") return t("sourceInternal");
	if (name === "referral") return t("sourceReferral");
	return t("sourceDirect");
}
function formatTime(sec) {
	const m = Math.floor(sec / 60);
	const s = sec % 60;
	return `${m}:${String(s).padStart(2, "0")}`;
}
function OfficePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfficeGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfficeBody, {}) }) });
}
function OfficeBody() {
	const { t, locale } = useI18n();
	const [range, setRange] = (0, import_react.useState)("day");
	const [stats, setStats] = (0, import_react.useState)(null);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(() => {
		setFailed(false);
		getOfficeStats({ data: { range } }).then(setStats).catch(() => setFailed(true));
	}, [range]);
	(0, import_react.useEffect)(() => {
		trackClick("nav:office");
		load();
	}, [load]);
	const funnelMax = Math.max(1, stats?.funnel.land ?? 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.18em] text-muted-foreground",
						children: t("kicker")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl font-medium tracking-tight",
						children: t("officeTitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground",
						children: t("anonymousNote")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: [
							t("liveUpdated"),
							" · ",
							LIVE.fetchedAt.slice(0, 10),
							" ·",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: LIVE.source,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "underline-offset-4 hover:underline",
								children: "FlixPatrol"
							})
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex rounded-lg bg-muted p-1",
							role: "group",
							"aria-label": t("rangeAria"),
							children: [
								"day",
								"week",
								"month"
							].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": range === r,
								className: range === r ? "h-11 rounded-md bg-foreground px-3 text-sm font-medium text-background" : "h-11 rounded-md px-3 text-sm font-medium text-foreground",
								onClick: () => setRange(r),
								children: r === "day" ? t("rangeDay") : r === "week" ? t("rangeWeek") : t("rangeMonth")
							}, r))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							className: "h-11",
							onClick: load,
							children: t("refresh")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "inline-flex h-11 items-center rounded-md px-4 text-sm font-medium shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							children: t("officeBack")
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			id: "main",
			tabIndex: -1,
			className: "mx-auto w-full max-w-7xl space-y-6 px-4 py-6 outline-none sm:px-6",
			children: [
				failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: t("noData")
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
					"aria-label": t("officeTitle"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: t("uniqueVisits"),
							value: stats?.total,
							locale
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: range === "week" ? t("last7d") : range === "month" ? t("last30d") : t("last24h"),
							value: stats?.recent,
							locale
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: t("views"),
							value: stats?.views,
							locale
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: t("clicksKpi"),
							value: stats?.clicks,
							locale
						})
					]
				}),
				stats ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfficeOverview, {
					stats,
					hourlyTitle: range === "week" ? t("trafficHourlyWeek") : range === "month" ? t("trafficHourlyMonth") : t("trafficHourly"),
					labelClick: (target) => clickLabel(target, locale, t)
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-4",
					"aria-labelledby": "behavior-heading",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "behavior-heading",
							className: "font-display text-xl font-medium",
							children: t("behaviorTitle")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: t("behaviorHint")
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
									label: t("sessions"),
									value: stats?.sessions,
									locale
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
									label: t("bounce"),
									value: stats?.bounceRate,
									locale,
									suffix: "%"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
									label: t("pagesPerSession"),
									value: stats?.pagesPerSession,
									locale
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
									label: t("avgTime"),
									display: stats ? formatTime(stats.avgSeconds) : void 0,
									locale
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
									label: t("newUsers"),
									value: stats?.newUsers,
									locale
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
									label: t("returning"),
									value: stats?.returning,
									locale
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 lg:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarCard, {
									title: t("devicesTitle"),
									rows: (stats?.devices ?? []).map((d) => ({
										name: deviceLabel(d.name, t),
										count: d.count
									})),
									empty: t("noData"),
									color: "bg-heat"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarCard, {
									title: t("sourcesTitle"),
									rows: (stats?.sources ?? []).map((d) => ({
										name: sourceLabel(d.name, t),
										count: d.count
									})),
									empty: t("noData"),
									color: "bg-positive"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarCard, {
									title: t("pagesTitle"),
									rows: (stats?.pages ?? []).map((d) => ({
										name: pageLabel(d.name, t),
										count: d.count
									})),
									empty: t("noData"),
									color: "bg-mixed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-lg font-medium",
										children: t("funnelTitle")
									}), !stats || stats.funnel.land === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-sm text-muted-foreground",
										children: t("noData")
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-3 space-y-3",
										children: [
											["funnelLand", stats.funnel.land],
											["funnelExplore", stats.funnel.explore],
											["funnelShare", stats.funnel.share],
											["funnelOffice", stats.funnel.office]
										].map(([key, n]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-3 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: t(key)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "tabular-nums text-muted-foreground",
												children: [
													n.toLocaleString(locale),
													" · ",
													Math.round(n / funnelMax * 100),
													"%"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 h-2 overflow-hidden rounded-full bg-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block h-full bg-negative",
												style: { width: `${Math.max(6, n / funnelMax * 100)}%` }
											})
										})] }, key))
									})]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsGoals, {
					goals: stats?.goals ?? [],
					sessions: stats?.sessions ?? 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleArrivalCharts, { data: stats?.google ?? {
					sessions: 0,
					products: [],
					hosts: [],
					countries: [],
					landings: [],
					campaigns: []
				} }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfficeVisuals, {
					countries: stats?.countries ?? [],
					hourly: stats?.hourlyDual ?? [],
					clickLeaders: stats?.clickLeaders ?? [],
					recentClicks: stats?.recentClicks ?? [],
					ipLeaders: stats?.ipLeaders ?? [],
					labelClick: (target) => clickLabel(target, locale, t),
					seriesTitle: range === "week" ? t("trafficHourlyWeek") : range === "month" ? t("trafficHourlyMonth") : t("trafficHourly"),
					hideHourly: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IngestPanel, {})
			]
		})]
	});
}
function BarCard({ title, rows, empty, color }) {
	const max = Math.max(1, ...rows.map((r) => r.count));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-display text-lg font-medium",
			children: title
		}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted-foreground",
			children: empty
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-2",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate font-medium",
					children: r.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums text-muted-foreground",
					children: r.count
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 h-1.5 overflow-hidden rounded-full bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `block h-full ${color}`,
					style: { width: `${Math.max(8, r.count / max * 100)}%` }
				})
			})] }, r.name))
		})]
	});
}
function Kpi({ label, value, locale, suffix, display }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-2xl font-medium tabular-nums leading-tight",
			children: display ?? (value == null ? "—" : `${value.toLocaleString(locale)}${suffix ?? ""}`)
		})]
	});
}
function IngestPanel() {
	const { t, locale } = useI18n();
	const [runs, setRuns] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		listLiveRuns().then(setRuns).catch(() => {});
	}, []);
	async function pull() {
		setBusy(true);
		try {
			const run = await runLiveIngest({ data: { slot: "manual" } });
			setRuns((prev) => [run, ...prev.filter((r) => r.id !== run.id)].slice(0, 12));
		} catch {} finally {
			setBusy(false);
		}
	}
	const slotLabel = (slot) => slot === "morning" ? t("ingestSlotMorning") : slot === "evening" ? t("ingestSlotEvening") : t("ingestSlotManual");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl bg-card px-4 py-4 shadow-[var(--shadow-border)] sm:px-5",
		"aria-labelledby": "ingest-heading",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: "ingest-heading",
				className: "font-display text-lg font-medium tracking-tight",
				children: t("ingestRuns")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: t("ingestSchedule")
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "secondary",
				className: "h-11",
				disabled: busy,
				onClick: () => void pull(),
				children: t("ingestRunNow")
			})]
		}), runs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted-foreground",
			children: t("noData")
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-2",
			children: runs.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-xl bg-muted px-3 py-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-medium text-muted-foreground",
					children: [
						slotLabel(r.slot),
						r.significant ? ` · ${t("ingestSignificant")}` : "",
						r.lastRunAt ? ` · ${new Date(r.lastRunAt).toLocaleString(locale === "he" ? "he-IL" : locale, {
							timeZone: "Asia/Jerusalem",
							hour: "2-digit",
							minute: "2-digit",
							day: "numeric",
							month: "numeric"
						})}` : ""
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 leading-relaxed text-pretty",
					children: locale === "en" ? r.noteEn : r.noteHe
				})]
			}, r.id))
		})]
	});
}
//#endregion
export { OfficePage as component };
