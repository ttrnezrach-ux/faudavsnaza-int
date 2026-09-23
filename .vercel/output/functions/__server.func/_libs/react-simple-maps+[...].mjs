import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "./@radix-ui/react-compose-refs+[...].mjs";
import { n as graticule, t as src_exports } from "./d3-geo.mjs";
import { r as select_default } from "./d3-drag+d3-selection.mjs";
import { n as identity, t as zoom_default } from "./d3-zoom.mjs";
//#region node_modules/topojson-client/src/identity.js
function identity_default(x) {
	return x;
}
//#endregion
//#region node_modules/topojson-client/src/transform.js
function transform_default(transform) {
	if (transform == null) return identity_default;
	var x0, y0, kx = transform.scale[0], ky = transform.scale[1], dx = transform.translate[0], dy = transform.translate[1];
	return function(input, i) {
		if (!i) x0 = y0 = 0;
		var j = 2, n = input.length, output = new Array(n);
		output[0] = (x0 += input[0]) * kx + dx;
		output[1] = (y0 += input[1]) * ky + dy;
		while (j < n) output[j] = input[j], ++j;
		return output;
	};
}
//#endregion
//#region node_modules/topojson-client/src/reverse.js
function reverse_default(array, n) {
	var t, j = array.length, i = j - n;
	while (i < --j) t = array[i], array[i++] = array[j], array[j] = t;
}
//#endregion
//#region node_modules/topojson-client/src/feature.js
function feature_default(topology, o) {
	if (typeof o === "string") o = topology.objects[o];
	return o.type === "GeometryCollection" ? {
		type: "FeatureCollection",
		features: o.geometries.map(function(o) {
			return feature(topology, o);
		})
	} : feature(topology, o);
}
function feature(topology, o) {
	var id = o.id, bbox = o.bbox, properties = o.properties == null ? {} : o.properties, geometry = object(topology, o);
	return id == null && bbox == null ? {
		type: "Feature",
		properties,
		geometry
	} : bbox == null ? {
		type: "Feature",
		id,
		properties,
		geometry
	} : {
		type: "Feature",
		id,
		bbox,
		properties,
		geometry
	};
}
function object(topology, o) {
	var transformPoint = transform_default(topology.transform), arcs = topology.arcs;
	function arc(i, points) {
		if (points.length) points.pop();
		for (var a = arcs[i < 0 ? ~i : i], k = 0, n = a.length; k < n; ++k) points.push(transformPoint(a[k], k));
		if (i < 0) reverse_default(points, n);
	}
	function point(p) {
		return transformPoint(p);
	}
	function line(arcs) {
		var points = [];
		for (var i = 0, n = arcs.length; i < n; ++i) arc(arcs[i], points);
		if (points.length < 2) points.push(points[0]);
		return points;
	}
	function ring(arcs) {
		var points = line(arcs);
		while (points.length < 4) points.push(points[0]);
		return points;
	}
	function polygon(arcs) {
		return arcs.map(ring);
	}
	function geometry(o) {
		var type = o.type, coordinates;
		switch (type) {
			case "GeometryCollection": return {
				type,
				geometries: o.geometries.map(geometry)
			};
			case "Point":
				coordinates = point(o.coordinates);
				break;
			case "MultiPoint":
				coordinates = o.coordinates.map(point);
				break;
			case "LineString":
				coordinates = line(o.arcs);
				break;
			case "MultiLineString":
				coordinates = o.arcs.map(line);
				break;
			case "Polygon":
				coordinates = polygon(o.arcs);
				break;
			case "MultiPolygon":
				coordinates = o.arcs.map(polygon);
				break;
			default: return null;
		}
		return {
			type,
			coordinates
		};
	}
	return geometry(o);
}
//#endregion
//#region node_modules/topojson-client/src/stitch.js
function stitch_default(topology, arcs) {
	var stitchedArcs = {}, fragmentByStart = {}, fragmentByEnd = {}, fragments = [], emptyIndex = -1;
	arcs.forEach(function(i, j) {
		var arc = topology.arcs[i < 0 ? ~i : i], t;
		if (arc.length < 3 && !arc[1][0] && !arc[1][1]) t = arcs[++emptyIndex], arcs[emptyIndex] = i, arcs[j] = t;
	});
	arcs.forEach(function(i) {
		var e = ends(i), start = e[0], end = e[1], f, g;
		if (f = fragmentByEnd[start]) {
			delete fragmentByEnd[f.end];
			f.push(i);
			f.end = end;
			if (g = fragmentByStart[end]) {
				delete fragmentByStart[g.start];
				var fg = g === f ? f : f.concat(g);
				fragmentByStart[fg.start = f.start] = fragmentByEnd[fg.end = g.end] = fg;
			} else fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
		} else if (f = fragmentByStart[end]) {
			delete fragmentByStart[f.start];
			f.unshift(i);
			f.start = start;
			if (g = fragmentByEnd[start]) {
				delete fragmentByEnd[g.end];
				var gf = g === f ? f : g.concat(f);
				fragmentByStart[gf.start = g.start] = fragmentByEnd[gf.end = f.end] = gf;
			} else fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
		} else {
			f = [i];
			fragmentByStart[f.start = start] = fragmentByEnd[f.end = end] = f;
		}
	});
	function ends(i) {
		var arc = topology.arcs[i < 0 ? ~i : i], p0 = arc[0], p1;
		if (topology.transform) p1 = [0, 0], arc.forEach(function(dp) {
			p1[0] += dp[0], p1[1] += dp[1];
		});
		else p1 = arc[arc.length - 1];
		return i < 0 ? [p1, p0] : [p0, p1];
	}
	function flush(fragmentByEnd, fragmentByStart) {
		for (var k in fragmentByEnd) {
			var f = fragmentByEnd[k];
			delete fragmentByStart[f.start];
			delete f.start;
			delete f.end;
			f.forEach(function(i) {
				stitchedArcs[i < 0 ? ~i : i] = 1;
			});
			fragments.push(f);
		}
	}
	flush(fragmentByEnd, fragmentByStart);
	flush(fragmentByStart, fragmentByEnd);
	arcs.forEach(function(i) {
		if (!stitchedArcs[i < 0 ? ~i : i]) fragments.push([i]);
	});
	return fragments;
}
//#endregion
//#region node_modules/topojson-client/src/mesh.js
function mesh_default(topology) {
	return object(topology, meshArcs.apply(this, arguments));
}
function meshArcs(topology, object, filter) {
	var arcs, i, n;
	if (arguments.length > 1) arcs = extractArcs(topology, object, filter);
	else for (i = 0, arcs = new Array(n = topology.arcs.length); i < n; ++i) arcs[i] = i;
	return {
		type: "MultiLineString",
		arcs: stitch_default(topology, arcs)
	};
}
function extractArcs(topology, object, filter) {
	var arcs = [], geomsByArc = [], geom;
	function extract0(i) {
		var j = i < 0 ? ~i : i;
		(geomsByArc[j] || (geomsByArc[j] = [])).push({
			i,
			g: geom
		});
	}
	function extract1(arcs) {
		arcs.forEach(extract0);
	}
	function extract2(arcs) {
		arcs.forEach(extract1);
	}
	function extract3(arcs) {
		arcs.forEach(extract2);
	}
	function geometry(o) {
		switch (geom = o, o.type) {
			case "GeometryCollection":
				o.geometries.forEach(geometry);
				break;
			case "LineString":
				extract1(o.arcs);
				break;
			case "MultiLineString":
			case "Polygon":
				extract2(o.arcs);
				break;
			case "MultiPolygon": extract3(o.arcs);
		}
	}
	geometry(object);
	geomsByArc.forEach(filter == null ? function(geoms) {
		arcs.push(geoms[0].i);
	} : function(geoms) {
		if (filter(geoms[0].g, geoms[geoms.length - 1].g)) arcs.push(geoms[0].i);
	});
	return arcs;
}
//#endregion
//#region node_modules/react-simple-maps/dist/shared/JKVre3Xc.es.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var { geoPath: g, ...d$1 } = src_exports, f$1 = d$1;
var y$1 = (0, import_react.createContext)(void 0);
var b = ({ width: r = 800, height: a = 600, projection: n = "geoEqualEarth", projectionConfig: s = {}, children: i }) => {
	const [c, l] = s.center || [], [p, h, m] = s.rotate || [], [u, d] = s.parallels || [], b = s.scale || null, j = (0, import_react.useMemo)(() => (({ projectionConfig: e = {}, projection: r = "geoEqualEarth", width: t = 800, height: o = 600 }) => {
		if ("function" == typeof r) return r;
		const a = f$1[r]().translate([t / 2, o / 2]);
		if (e.center && a.center(e.center), e.rotate) {
			const [r, t, o] = e.rotate;
			a.rotate(void 0 === o ? [r, t] : [
				r,
				t,
				o
			]);
		}
		return e.scale && a.scale(e.scale), e.parallels && function(e) {
			return "parallels" in e;
		}(a) && a.parallels(e.parallels), a;
	})({
		projectionConfig: {
			center: "number" == typeof c && "number" == typeof l ? [c, l] : void 0,
			rotate: "number" == typeof p && "number" == typeof h ? [
				p,
				h,
				m
			] : void 0,
			parallels: "number" == typeof u && "number" == typeof d ? [u, d] : void 0,
			scale: b || void 0
		},
		projection: n,
		width: r,
		height: a
	}), [
		r,
		a,
		n,
		c,
		l,
		p,
		h,
		m,
		u,
		d,
		b
	]), N = (0, import_react.useCallback)(j, [j]), E = (0, import_react.useMemo)(() => ({
		width: r,
		height: a,
		projection: N,
		path: g().projection(N)
	}), [
		r,
		a,
		N
	]);
	return import_react.createElement(y$1.Provider, { value: E }, i);
};
var j = () => {
	const e = (0, import_react.useContext)(y$1);
	if (!e) throw new Error("useMapContext must be used within MapProvider");
	return e;
};
var N = (0, import_react.forwardRef)(({ width: r = 800, height: t = 600, projection: o = "geoEqualEarth", projectionConfig: a = {}, className: n = "", children: s, ...i }, c) => import_react.createElement(b, {
	width: r,
	height: t,
	projection: o,
	projectionConfig: a
}, import_react.createElement("svg", {
	ref: c,
	viewBox: `0 0 ${r} ${t}`,
	className: `rsm-svg ${n}`,
	...i,
	children: s
})));
function E$1(e, r) {
	if (!Array.isArray(e) && "type" in e && "Topology" === e.type) {
		const t = e.objects[Object.keys(e.objects)[0]], o = feature_default(e, t).features;
		return r ? r(o) : o;
	}
	const t = !Array.isArray(e) && "features" in e ? e.features : e;
	return r ? r(t) : t;
}
function v(e) {
	if (Array.isArray(e) || !("type" in e) || "Topology" !== e.type) return null;
	const r = e.objects[Object.keys(e.objects)[0]];
	return {
		outline: mesh_default(e, r, (e, r) => e === r),
		borders: mesh_default(e, r, (e, r) => e !== r)
	};
}
function $(e, r) {
	return e ? e.map((e, t) => ({
		...e,
		rsmKey: `geo-${t}`,
		svgPath: r(e)
	})) : [];
}
function w(e) {
	return "string" == typeof e;
}
function k$1({ geography: e, parseGeographies: r }) {
	const { path: o } = j(), [a, n] = (0, import_react.useState)({}), c = w(e) ? e : JSON.stringify(e);
	(0, import_react.useEffect)(() => {
		var t;
		"undefined" != typeof window && e && (w(e) ? (t = e, fetch(t).then((e) => {
			if (!e.ok) throw Error(e.statusText);
			return e.json();
		}).catch((e) => {
			console.log("There was a problem when fetching the data: ", e);
		})).then((e) => {
			e && n({
				geographies: E$1(e, r),
				mesh: v(e)
			});
		}) : n({
			geographies: E$1(e, r),
			mesh: v(e)
		}));
	}, [c, r]);
	const { geographies: l, outline: p, borders: h } = (0, import_react.useMemo)(() => {
		const e = function(e, r, t) {
			return e && r ? {
				outline: {
					...e,
					rsmKey: "outline",
					svgPath: t(e)
				},
				borders: {
					...r,
					rsmKey: "borders",
					svgPath: t(r)
				}
			} : {};
		}(a.mesh?.outline, a.mesh?.borders, o);
		return {
			geographies: $(a.geographies, o),
			outline: e.outline,
			borders: e.borders
		};
	}, [a, o]);
	return {
		geographies: l,
		outline: p,
		borders: h
	};
}
N.displayName = "ComposableMap";
var A = (0, import_react.forwardRef)(({ geography: r, children: t, parseGeographies: o, className: a = "", ...n }, s) => {
	const { path: i, projection: c } = j(), { geographies: l, outline: p, borders: h } = k$1({
		geography: r,
		parseGeographies: o
	});
	return import_react.createElement("g", {
		ref: s,
		className: `rsm-geographies ${a}`,
		...n
	}, l && l.length > 0 && t({
		geographies: l,
		outline: p,
		borders: h,
		path: i,
		projection: c
	}));
});
A.displayName = "Geographies";
var P = (0, import_react.forwardRef)(({ geography: r, className: t = "", ...o }, a) => import_react.createElement("path", {
	ref: a,
	tabIndex: 0,
	className: `rsm-geography ${t}`,
	d: r.svgPath,
	...o
}));
P.displayName = "Geography";
var C = (0, import_react.memo)(P);
var G = (0, import_react.forwardRef)(({ fill: r = "transparent", stroke: t = "currentcolor", step: o = [10, 10], className: a = "", ...n }, s) => {
	const { path: i } = j();
	return import_react.createElement("path", {
		ref: s,
		d: i(graticule().step(o)()),
		fill: r,
		stroke: t,
		className: `rsm-graticule ${a}`,
		...n
	});
});
G.displayName = "Graticule";
var x$1 = (0, import_react.memo)(G);
var M = (0, import_react.forwardRef)(({ id: r = "rsm-sphere", fill: o = "transparent", stroke: a = "currentcolor", className: n = "", ...s }, i) => {
	const { path: c } = j(), p = (0, import_react.useMemo)(() => c({ type: "Sphere" }), [c]);
	return import_react.createElement(import_react.Fragment, null, import_react.createElement("defs", null, import_react.createElement("clipPath", { id: r }, import_react.createElement("path", { d: p }))), import_react.createElement("path", {
		ref: i,
		d: p,
		fill: o,
		stroke: a,
		style: { pointerEvents: "none" },
		className: `rsm-sphere ${n}`,
		...s
	}));
});
M.displayName = "Sphere";
var S = (0, import_react.memo)(M);
var T = (0, import_react.forwardRef)(({ coordinates: r, children: t, className: o = "", ...a }, n) => {
	const { projection: s } = j(), i = s(r);
	if (!i) return null;
	const [c, l] = i;
	return import_react.createElement("g", {
		ref: n,
		transform: `translate(${c}, ${l})`,
		className: `rsm-marker ${o}`,
		...a
	}, t);
});
T.displayName = "Marker";
var q = (0, import_react.forwardRef)(({ from: r = [0, 0], to: t = [0, 0], coordinates: o, stroke: a = "currentcolor", strokeWidth: n = 3, fill: s = "transparent", className: i = "", ...c }, l) => {
	const { path: p } = j(), h = {
		type: "LineString",
		coordinates: o || [r, t]
	};
	return import_react.createElement("path", {
		ref: l,
		d: p(h),
		className: `rsm-line ${i}`,
		stroke: a,
		strokeWidth: n,
		fill: s,
		...c
	});
});
q.displayName = "Line";
var K = (0, import_react.forwardRef)(({ subject: r, children: t, connectorProps: o, dx: a = 30, dy: n = 30, curve: s = 0, className: i = "", ...c }, l) => {
	const { projection: p } = j(), h = p(r), m = function(e = 30, r = 30, t = .5) {
		const o = Array.isArray(t) ? t : [t, t];
		return `M0,0 Q${-e / 2 - e / 2 * o[0]},${-r / 2 + r / 2 * o[1]} ${-e},${-r}`;
	}(a, n, s);
	if (!h) return null;
	const [u, g] = h;
	return import_react.createElement("g", {
		ref: l,
		transform: `translate(${u + a}, ${g + n})`,
		className: `rsm-annotation ${i}`,
		...c
	}, import_react.createElement("path", {
		d: m,
		fill: "transparent",
		stroke: "#000",
		...o
	}), t);
});
K.displayName = "Annotation";
//#endregion
//#region node_modules/react-simple-maps/dist/shared/DbIF5Tqp.es.js
var l = (0, import_react.createContext)(void 0);
var f = {
	x: 0,
	y: 0,
	k: 1,
	transformString: "translate(0 0) scale(1)"
};
var x = ({ value: t = f, children: n }) => import_react.createElement(l.Provider, { value: t }, n);
function d(r, t, n) {
	const e = (r * n.k - r) / 2, o = (t * n.k - t) / 2;
	return [r / 2 - (e + n.x) / n.k, t / 2 - (o + n.y) / n.k];
}
function k(r, t, n, e, o, c) {
	const a = r([e, o]);
	if (!a) return null;
	return {
		x: t / 2 - a[0] * c,
		y: n / 2 - a[1] * c,
		k: c
	};
}
function E({ center: r = [0, 0], filterZoomEvent: t, onMoveStart: n, onMoveEnd: a, onMove: l, translateExtent: f = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], scaleExtent: x = [1, 8], zoom: v = 1 }) {
	const { width: E, height: y, projection: g } = j(), [p, h] = r, [z, M] = (0, import_react.useState)(() => k(g, E, y, p, h, v) ?? {
		x: 0,
		y: 0,
		k: 1
	}), Z = (0, import_react.useRef)(null), S = (0, import_react.useRef)(null), w = (0, import_react.useRef)(null), b = (0, import_react.useRef)(!1), [P, $] = f, [j$1, N] = P, [R, C] = $, [G, K] = x, q = (0, import_react.useRef)(n), A = (0, import_react.useRef)(l), B = (0, import_react.useRef)(a), D = (0, import_react.useRef)(t);
	return (0, import_react.useEffect)(() => {
		q.current = n, A.current = l, B.current = a, D.current = t;
	}), (0, import_react.useEffect)(() => {
		const r = S.current;
		if (!r) return;
		const t = select_default(r), n = zoom_default().extent([[0, 0], [E, y]]).filter((r) => {
			if (D.current) return D.current(r);
			const t = r;
			return !!r && !t.ctrlKey && !t.button;
		}).scaleExtent([G, K]).translateExtent([[j$1, N], [R, C]]).on("start", (r) => {
			if (!q.current || b.current) return;
			const t = g.invert?.(d(E, y, r.transform));
			q.current({
				coordinates: t ?? void 0,
				zoom: r.transform.k
			}, r);
		}).on("zoom", (r) => {
			if (b.current) return;
			const { transform: t, sourceEvent: n } = r;
			M({
				x: t.x,
				y: t.y,
				k: t.k,
				dragging: n
			}), A.current && A.current({
				x: t.x,
				y: t.y,
				zoom: t.k,
				dragging: n
			}, r);
		}).on("end", (r) => {
			if (b.current) return void (b.current = !1);
			const t = g.invert?.(d(E, y, r.transform));
			if (t) {
				const [n, e] = t;
				Z.current = {
					x: n,
					y: e,
					k: r.transform.k
				};
			}
			B.current && B.current({
				coordinates: t ?? void 0,
				zoom: r.transform.k
			}, r);
		});
		w.current = n, t.call(n);
	}, [
		E,
		y,
		j$1,
		N,
		R,
		C,
		G,
		K,
		g
	]), (0, import_react.useEffect)(() => {
		if (Z.current && p === Z.current.x && h === Z.current.y && v === Z.current.k) return;
		const r = k(g, E, y, p, h, v);
		if (!r) return;
		if (!S.current || !w.current) return;
		const t = select_default(S.current);
		b.current = !0, t.call(w.current.transform, identity.translate(r.x, r.y).scale(r.k)), M((t) => t.x === r.x && t.y === r.y && t.k === r.k ? t : r), Z.current = {
			x: p,
			y: h,
			k: v
		};
	}, [
		p,
		h,
		v,
		E,
		y,
		g
	]), {
		mapRef: S,
		position: z,
		transformString: `translate(${z.x} ${z.y}) scale(${z.k})`
	};
}
var y = (0, import_react.forwardRef)(({ center: t = [0, 0], zoom: n = 1, minZoom: e = 1, maxZoom: o = 8, translateExtent: c, filterZoomEvent: a, onMoveStart: u, onMove: i, onMoveEnd: m, className: l = "", children: f, ...v }, d) => {
	const { width: k, height: y } = j(), { mapRef: g, transformString: p, position: h } = E({
		center: t,
		filterZoomEvent: a,
		onMoveStart: u,
		onMove: i,
		onMoveEnd: m,
		scaleExtent: [e, o],
		translateExtent: c,
		zoom: n
	});
	return import_react.createElement(x, { value: {
		x: h.x,
		y: h.y,
		k: h.k,
		transformString: p
	} }, import_react.createElement("g", { ref: g }, import_react.createElement("rect", {
		width: k,
		height: y,
		fill: "transparent"
	}), import_react.createElement("g", {
		ref: d,
		transform: p,
		className: `rsm-zoomable-group ${l}`,
		...v
	}, f)));
});
y.displayName = "ZoomableGroup";
//#endregion
export { T as a, S as i, C as n, x$1 as o, N as r, A as t };
