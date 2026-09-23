import type { Topology } from "topojson-specification";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Sphere,
  Graticule,
} from "react-simple-maps";
import worldAtlasJson from "@/data/world-110m.json";
import {
  countryByGeoName,
  countryByIsoNumeric,
  isTalkOnly,
  peakRank,
  rankHeat,
  type Country,
} from "@/lib/data";
import { socialCountryIds } from "@/lib/social";
import { useWork } from "@/lib/work";
import { cn } from "@/lib/utils";
import { NAZA_SCREENINGS, screeningPinFill } from "@/lib/naza-screenings";

export type MapMode = "rank" | "tone" | "social";

export type WorldMapProps = {
  mode: MapMode;
  selectedId: string | null;
  onSelect: (id: string) => void;
  hoveredId: string | null;
  onHover: (id: string | null, x?: number, y?: number) => void;
};

const worldAtlas = worldAtlasJson as unknown as Topology;

function rankFill(c: Country | undefined): string {
  if (!c) return "var(--color-land)";
  const peak = peakRank(c);
  if (peak == null) return "color-mix(in oklab, var(--color-mixed) 32%, var(--color-land))";
  const h = rankHeat(peak);
  if (h <= 0) return "var(--color-land)";
  const pct = Math.round(22 + h * 78);
  return `color-mix(in oklab, var(--color-heat) ${pct}%, var(--color-land))`;
}

function toneFill(c: Country | undefined): string {
  if (!c) return "var(--color-land)";
  const p = c.positive;
  return `color-mix(in oklab, var(--color-positive) ${p}%, var(--color-negative))`;
}

function socialFill(c: Country | undefined, score: number, documented: boolean, down: boolean): string {
  if (!c) return "var(--color-land)";
  const pct = documented ? Math.round(30 + score * 0.65) : Math.round(10 + score * 0.4);
  const hue = down ? "var(--color-negative)" : "var(--color-heat)";
  return `color-mix(in oklab, ${hue} ${pct}%, var(--color-land))`;
}

function fillFor(
  mode: MapMode,
  c: Country | undefined,
  social?: { score: number; documented: boolean; down: boolean },
): string {
  if (mode === "rank") return rankFill(c);
  if (mode === "tone") return toneFill(c);
  return socialFill(c, social?.score ?? 0, social?.documented ?? false, social?.down ?? false);
}

function geoLabel(geo: { properties?: { name?: string } | null }): string {
  return geo.properties?.name ?? "";
}

function countryForGeo(
  geo: { id?: string | number; properties?: { name?: string } | null },
  list: Country[],
): Country | undefined {
  return countryByIsoNumeric(geo.id, list) ?? countryByGeoName(geoLabel(geo), list);
}

export function WorldMap({ mode, selectedId, onSelect, hoveredId, onHover }: WorldMapProps) {
  const { work, socialOf } = useWork();
  const countries = work.countries;
  const documentedIds = socialCountryIds(work.posts);
  const markerCountries = countries.filter((c) => c.geoNames.length === 0);
  const label =
    mode === "rank"
      ? "מפת עולם לפי שיא נוכחות. בחירת מדינה זמינה ברשימה שלצד המפה."
      : mode === "tone"
        ? "מפת עולם לפי טון השיח. בחירת מדינה זמינה ברשימה שלצד המפה."
        : "מפת עולם לפי ניקוד רשתות. נקודות מסמנות מדינות עם פוסט מתועד.";

  return (
    <div className="relative h-full w-full">
      <p className="sr-only">{label}</p>
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 148, rotate: [-10, 0, 0] }}
        width={800}
        height={400}
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-full"
        role="img"
        aria-hidden="true"
        focusable="false"
      >
        <Sphere
          id="ocean"
          fill="var(--color-ocean)"
          stroke="var(--color-map-stroke)"
          strokeWidth={0.4}
        />
        <Graticule stroke="var(--color-map-stroke)" strokeWidth={0.25} step={[24, 24]} />
        <Geographies
          geography={worldAtlas as never}
          parseGeographies={(features) =>
            features.filter((f) => {
              const n = geoLabel(f);
              return n !== "Antarctica" && n !== "Fr. S. Antarctic Lands" && n !== "Greenland";
            })
          }
        >
          {({ geographies }) =>
            geographies.map((geo) => {
              const c = countryForGeo(geo, countries);
              const active = Boolean(c && (c.id === selectedId || c.id === hoveredId));
              const talk = Boolean(c && isTalkOnly(c));
              const s = c ? socialOf(c) : null;
              const fill = fillFor(mode, c, s ? { score: s.score, documented: documentedIds.has(c!.id), down: s.trend === "down" } : undefined);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke={active ? "var(--color-foreground)" : talk ? "var(--color-mixed)" : "var(--color-map-stroke)"}
                  strokeWidth={active ? 1.15 : talk ? 0.7 : 0.4}
                  strokeDasharray={talk && !active ? "2 1.4" : undefined}
                  className={cn(
                    "outline-none transition-[fill,stroke-width] duration-[var(--motion-quick)]",
                    c ? "cursor-pointer" : "cursor-default",
                  )}
                  onMouseEnter={(e: { clientX: number; clientY: number }) => {
                    if (c) onHover(c.id, e.clientX, e.clientY);
                  }}
                  onMouseMove={(e: { clientX: number; clientY: number }) => {
                    if (c) onHover(c.id, e.clientX, e.clientY);
                  }}
                  onMouseLeave={() => onHover(null)}
                  onClick={() => {
                    if (c) onSelect(c.id);
                  }}
                />
              );
            })
          }
        </Geographies>
        {markerCountries.map((c) => {
          const peak = peakRank(c);
          const r = 3.4 + rankHeat(peak) * 3.6;
          const active = c.id === selectedId || c.id === hoveredId;
          return (
            <Marker key={c.id} coordinates={c.coords}>
              <circle
                r={r}
                fill={fillFor(mode, c, { score: socialOf(c).score, documented: documentedIds.has(c.id), down: socialOf(c).trend === "down" })}
                stroke={active ? "var(--color-foreground)" : "var(--color-heat)"}
                strokeWidth={active ? 1.4 : 0.8}
                className="cursor-pointer"
                onMouseEnter={(e) => onHover(c.id, e.clientX, e.clientY)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onSelect(c.id)}
              />
            </Marker>
          );
        })}
        {countries
          .filter((c) => documentedIds.has(c.id))
          .map((c) => {
            const active = c.id === selectedId || c.id === hoveredId;
            return (
              <Marker key={`social-${c.id}`} coordinates={c.coords}>
                <circle
                  r={active ? 5.2 : 4.2}
                  fill="var(--color-foreground)"
                  fillOpacity={0.9}
                  stroke="var(--color-background)"
                  strokeWidth={1}
                  className="cursor-pointer"
                  onMouseEnter={(e) => onHover(c.id, e.clientX, e.clientY)}
                  onMouseLeave={() => onHover(null)}
                  onClick={() => onSelect(c.id)}
                />
              </Marker>
            );
          })}
        {work.id === "naza" && mode === "rank"
          ? NAZA_SCREENINGS.filter(
              (s) => s.kind !== "social" && Array.isArray(s.coords) && s.coords.length >= 2,
            ).map((s) => {
              const hid = `scr:${s.id}`;
              const active = hoveredId === hid || selectedId === s.country;
              return (
                <Marker key={`scr-${s.id}`} coordinates={s.coords}>
                  <g
                    className="cursor-pointer"
                    onMouseEnter={(e) => onHover(hid, e.clientX, e.clientY)}
                    onMouseLeave={() => onHover(null)}
                    onClick={() => onSelect(s.country)}
                  >
                    <rect
                      x={-4.2}
                      y={-4.2}
                      width={8.4}
                      height={8.4}
                      rx={1}
                      transform="rotate(45)"
                      fill={screeningPinFill(s)}
                      stroke={active ? "var(--color-foreground)" : "var(--color-background)"}
                      strokeWidth={active ? 1.4 : 1}
                    />
                  </g>
                </Marker>
              );
            })
          : null}
      </ComposableMap>
    </div>
  );
}
