import { r as __exportAll } from "../_runtime.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as string, i as object, t as _enum } from "../_libs/zod.mjs";
import { p as __exportAll$1 } from "./router-D9oKIoCN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/visits-5ua7sqp9.js
var visits_5ua7sqp9_exports = /* @__PURE__ */ __exportAll({
	a: () => recordUniqueVisit,
	i: () => recordClick,
	n: () => getVisitStats,
	o: () => visits_exports,
	r: () => recordBehavior,
	s: () => createSsrRpc,
	t: () => getOfficeStats
});
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var visits_exports = /* @__PURE__ */ __exportAll$1({
	getOfficeStats: () => getOfficeStats,
	getVisitStats: () => getVisitStats,
	recordBehavior: () => recordBehavior,
	recordClick: () => recordClick,
	recordRequestVisit: () => recordRequestVisit,
	recordUniqueVisit: () => recordUniqueVisit
});
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
var getVisitStats = createServerFn({ method: "GET" }).handler(createSsrRpc("418c6550bb1d6dacfb2355adc7104d31f0fb5aed99f7b3ad67afe4aaba13ccc5"));
var recordRequestVisit = createServerFn({ method: "POST" }).handler(createSsrRpc("705f067f2c9117d055da5505335096f3f8f911a5744fa9a064a4ded87c697a31"));
var recordUniqueVisit = createServerFn({ method: "POST" }).validator((input) => visitorInput.parse(input)).handler(createSsrRpc("42a07f0e3d92bd68d28066c335325869484969eca6790138a507f64289445432"));
var recordClick = createServerFn({ method: "POST" }).validator((input) => clickInput.parse(input)).handler(createSsrRpc("f7b9ea1d1e8fb0f0570d6e8067247e7a20eda79e16a30f3c17c5554c821ddbe3"));
var recordBehavior = createServerFn({ method: "POST" }).validator((input) => behaviorInput.parse(input)).handler(createSsrRpc("1924d10e64125cea46bacd3a1409b0ca012dc3d469fc96797e07099f8cd6cec2"));
createServerFn({ method: "GET" }).validator((input) => {
	return { range: object({ range: _enum([
		"day",
		"week",
		"month"
	]).optional() }).parse(input ?? {}).range ?? "week" };
}).handler(createSsrRpc("f9daf2261cd98122f4cd242b39ffd82d4f8b562227276340928585125aa8dc19"));
var getOfficeStats = createServerFn({ method: "GET" }).validator((input) => {
	return { range: object({ range: _enum([
		"day",
		"week",
		"month"
	]).optional() }).parse(input ?? {}).range ?? "day" };
}).handler(createSsrRpc("934207d0f214d57393f9d9dc9117989fd2196d098401b93d939df471d71360c0"));
//#endregion
export { recordClick as a, recordBehavior as i, getOfficeStats as n, recordUniqueVisit as o, getVisitStats as r, visits_5ua7sqp9_exports as s, createSsrRpc as t };
