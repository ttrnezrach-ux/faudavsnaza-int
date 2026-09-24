import { useState, type ReactNode } from "react";
import { countryDisplayName, flagEmoji, googleHostCountry } from "@/lib/geo";
import type { CountryStat, DualHour, GoalStat, GoogleArrival, IpTraffic, NamedCount, RecentClick } from "@/lib/visits";
import { LOCALE_META, useI18n } from "@/lib/i18n";

const SLICE = ["#d8d2c8", "#7d9b84", "#c4a574", "#c47a7a", "#8aa0b8", "#b89a7a", "#9a8ab8", "#7aa8a0"] as const;

function HoverTip({
  show,
  x,
  y,
  children,
}: {
  show: boolean;
  x: number;
  y: number;
  children: ReactNode;
}) {
  if (!show) return null;
  return (
    <div
      className="pointer-events-none absolute z-20 min-w-36 rounded-lg bg-foreground px-3 py-2 text-xs text-background shadow-lg"
      style={{ left: x, top: y, transform: "translate(-50%, calc(-100% - 8px))" }}
    >
      {children}
    </div>
  );
}

export function DualHourChart({ points }: { points: DualHour[] }) {
  const { t, locale } = useI18n();
  const [tip, setTip] = useState<{ i: number; x: number; y: number } | null>(null);
  if (points.length === 0) return <p className="mt-3 text-sm text-muted-foreground">{t("noData")}</p>;
  const max = Math.max(1, ...points.flatMap((p) => [p.visits, p.clicks]));
  const w = 720;
  const h = 188;
  const pad = { t: 28, r: 8, b: 28, l: 8 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const gap = innerW / points.length;
  const barW = Math.max(3, gap * 0.32);

  function x(i: number) {
    return pad.l + i * gap + gap / 2;
  }
  function y(n: number) {
    return pad.t + innerH - (n / max) * innerH;
  }

  const visitLine = points.map((p, i) => `${x(i)},${y(p.visits)}`).join(" ");
  const clickLine = points.map((p, i) => `${x(i)},${y(p.clicks)}`).join(" ");
  const active = tip ? points[tip.i] : null;

  return (
    <div
      className="relative"
      dir="ltr"
      onMouseLeave={() => setTip(null)}
    >
      <svg viewBox={`0 0 ${w} ${h}`} className="h-44 w-full" role="img" aria-label={t("trafficHourly")}>
        {points.map((p, i) => (
          <g key={p.hour + i}>
            <rect
              x={x(i) - gap / 2}
              y={pad.t}
              width={gap}
              height={innerH}
              className={tip?.i === i ? "fill-muted/60" : "fill-transparent"}
              onMouseEnter={(e) => {
                const box = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                const parent = (e.currentTarget.ownerSVGElement as SVGSVGElement).parentElement?.getBoundingClientRect();
                if (!parent) return;
                setTip({
                  i,
                  x: ((x(i) / w) * box.width),
                  y: 12,
                });
              }}
            />
            <rect
              x={x(i) - barW - 1}
              y={y(p.visits)}
              width={barW}
              height={Math.max(2, pad.t + innerH - y(p.visits))}
              rx="1.5"
              className="fill-heat"
            />
            <rect
              x={x(i) + 1}
              y={y(p.clicks)}
              width={barW}
              height={Math.max(2, pad.t + innerH - y(p.clicks))}
              rx="1.5"
              className="fill-positive"
            />
            {tip?.i === i ? (
              <>
                <text
                  x={x(i) - barW}
                  y={y(p.visits) - 6}
                  textAnchor="middle"
                  className="fill-foreground"
                  fontSize="12"
                  fontWeight="700"
                >
                  {p.visits}
                </text>
                <text
                  x={x(i) + barW}
                  y={y(p.clicks) - 6}
                  textAnchor="middle"
                  className="fill-positive"
                  fontSize="12"
                  fontWeight="700"
                >
                  {p.clicks}
                </text>
              </>
            ) : null}
            {i % (points.length > 16 ? 4 : points.length > 8 ? 2 : 1) === 0 ? (
              <text x={x(i)} y={h - 8} textAnchor="middle" className="fill-muted-foreground" fontSize="11">
                {p.hour}
              </text>
            ) : null}
          </g>
        ))}
        <polyline points={visitLine} fill="none" className="stroke-heat" strokeWidth="1.5" />
        <polyline points={clickLine} fill="none" className="stroke-positive" strokeWidth="1.5" />
      </svg>
      <HoverTip show={!!active && !!tip} x={tip?.x ?? 0} y={tip?.y ?? 0}>
        {active ? (
          <div className="space-y-0.5">
            <p className="font-medium">{active.hour}</p>
            <p>
              {t("trafficVisits")}: {active.visits.toLocaleString(locale)}
            </p>
            <p>
              {t("trafficClicks")}: {active.clicks.toLocaleString(locale)}
            </p>
          </div>
        ) : null}
      </HoverTip>
      <p className="mt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-heat" />
          {t("trafficVisits")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-positive" />
          {t("trafficClicks")}
        </span>
      </p>
    </div>
  );
}

function FlagColumnChart({
  rows,
}: {
  rows: { id: string; flag: string; name: string; visits: number; clicks: number }[];
}) {
  const { t, locale } = useI18n();
  const data = rows.slice(0, 14);
  if (data.length === 0) return <p className="mt-3 text-sm text-muted-foreground">{t("noData")}</p>;
  const max = Math.max(1, ...data.flatMap((r) => [r.visits, r.clicks]));
  const showClicks = data.some((r) => r.clicks > 0);
  const w = 720;
  const h = 260;
  const pad = { t: 16, r: 8, b: 56, l: 8 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const slot = innerW / data.length;
  const barW = Math.max(7, slot * 0.3);

  function x(i: number) {
    return pad.l + i * slot + slot / 2;
  }
  function y(n: number) {
    return pad.t + innerH - (n / max) * innerH;
  }

  return (
    <div dir="ltr">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-64 w-full" role="img" aria-label={t("countriesByIp")}>
        {data.map((r, i) => (
          <g key={r.id}>
            <title>{`${r.name}: ${r.visits} / ${r.clicks}`}</title>
            <rect
              x={x(i) - (showClicks ? barW + 1 : barW / 2)}
              y={y(r.visits)}
              width={barW}
              height={Math.max(4, pad.t + innerH - y(r.visits))}
              rx="2"
              className="fill-heat"
            />
            {showClicks ? (
              <rect
                x={x(i) + 1}
                y={y(r.clicks)}
                width={barW}
                height={Math.max(4, pad.t + innerH - y(r.clicks))}
                rx="2"
                className="fill-positive"
              />
            ) : null}
            <text x={x(i)} y={h - 32} textAnchor="middle" fontSize="20">
              {r.flag}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function IpVisitChart({ rows }: { rows: IpTraffic[] }) {
  const { t, locale } = useI18n();
  const [tip, setTip] = useState<{ i: number; x: number; y: number } | null>(null);
  const data = rows.slice(0, 16);
  if (data.length === 0) return <p className="mt-3 text-sm text-muted-foreground">{t("noData")}</p>;
  const max = Math.max(1, ...data.flatMap((r) => [r.visits, r.clicks]));
  const w = 720;
  const h = 280;
  const pad = { t: 28, r: 8, b: 64, l: 8 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const slot = innerW / data.length;
  const barW = Math.max(8, slot * 0.32);

  function x(i: number) {
    return pad.l + i * slot + slot / 2;
  }
  function y(n: number) {
    return pad.t + innerH - (n / max) * innerH;
  }

  const active = tip ? data[tip.i] : null;

  return (
    <div className="relative" dir="ltr" onMouseLeave={() => setTip(null)}>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-72 w-full" role="img" aria-label={t("ipVisits")}>
        {data.map((r, i) => (
          <g
            key={r.id}
            onMouseEnter={(e) => {
              const svg = e.currentTarget.ownerSVGElement;
              if (!svg) return;
              const box = svg.getBoundingClientRect();
              setTip({ i, x: (x(i) / w) * box.width, y: 8 });
            }}
          >
            <rect
              x={x(i) - slot / 2}
              y={pad.t}
              width={slot}
              height={innerH}
              className={tip?.i === i ? "fill-muted/70" : "fill-transparent"}
            />
            <rect
              x={x(i) - barW - 1}
              y={y(r.visits)}
              width={barW}
              height={Math.max(4, pad.t + innerH - y(r.visits))}
              rx="2"
              className="fill-heat"
            />
            <rect
              x={x(i) + 1}
              y={y(r.clicks)}
              width={barW}
              height={Math.max(4, pad.t + innerH - y(r.clicks))}
              rx="2"
              className="fill-positive"
            />
            <text
              x={x(i)}
              y={y(r.visits) - 6}
              textAnchor="middle"
              className="fill-foreground"
              fontSize="11"
              fontWeight="600"
            >
              {r.visits}
            </text>
            <text x={x(i)} y={h - 36} textAnchor="middle" fontSize="16">
              {flagEmoji(r.country)}
            </text>
            <text x={x(i)} y={h - 16} textAnchor="middle" className="fill-muted-foreground" fontSize="9">
              {r.hint}
            </text>
          </g>
        ))}
      </svg>
      <HoverTip show={!!active && !!tip} x={tip?.x ?? 0} y={tip?.y ?? 0}>
        {active ? (
          <div className="space-y-0.5" dir="auto">
            <p className="font-medium">
              {flagEmoji(active.country)} {countryDisplayName(active.country ?? "", locale)}
            </p>
            <p dir="ltr">
              {t("ipAddress")}: {active.hint}
            </p>
            <p>
              {t("trafficVisits")}: {active.visits.toLocaleString(locale)}
            </p>
            <p>
              {t("trafficClicks")}: {active.clicks.toLocaleString(locale)}
            </p>
          </div>
        ) : null}
      </HoverTip>
      <p className="mt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-heat" />
          {t("trafficVisits")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-positive" />
          {t("trafficClicks")}
        </span>
      </p>
    </div>
  );
}

export function ClickDonut({
  slices,
  centerLabel,
}: {
  slices: { id: string; label: string; count: number }[];
  centerLabel?: string;
}) {
  const { t, locale } = useI18n();
  const data = slices.slice(0, 8).filter((s) => s.count > 0);
  if (data.length === 0) return <p className="mt-3 text-sm text-muted-foreground">{t("noData")}</p>;
  const total = data.reduce((n, s) => n + s.count, 0);
  const r = 54;
  const c = 2 * Math.PI * r;
  let acc = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <svg viewBox="0 0 160 160" className="size-44 shrink-0" role="img" aria-label={t("clicksTitle")}>
        <circle cx="80" cy="80" r={r} fill="none" className="stroke-muted" strokeWidth="22" />
        {data.map((s, i) => {
          const frac = s.count / total;
          const dash = frac * c;
          const gap = c - dash;
          const rot = (acc / total) * 360 - 90;
          acc += s.count;
          return (
            <circle
              key={s.id}
              cx="80"
              cy="80"
              r={r}
              fill="none"
              stroke={SLICE[i % SLICE.length]}
              strokeWidth="22"
              strokeDasharray={`${dash} ${gap}`}
              transform={`rotate(${rot} 80 80)`}
              strokeLinecap="butt"
            >
              <title>{`${s.label}: ${s.count}`}</title>
            </circle>
          );
        })}
        <text x="80" y="76" textAnchor="middle" className="fill-foreground" fontSize="22" fontWeight="600">
          {total.toLocaleString(locale)}
        </text>
        <text x="80" y="96" textAnchor="middle" className="fill-muted-foreground" fontSize="11">
          {centerLabel ?? t("trafficClicks")}
        </text>
      </svg>
      <ul className="grid min-w-0 flex-1 grid-cols-1 gap-2">
        {data.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2 text-sm">
            <span className="size-2.5 shrink-0 rounded-sm" style={{ background: SLICE[i % SLICE.length] }} />
            <span className="min-w-0 truncate font-medium">{s.label}</span>
            <span className="ms-auto shrink-0 tabular-nums text-muted-foreground">
              {s.count.toLocaleString(locale)} · {Math.round((s.count / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlagBubbles({
  rows,
}: {
  rows: { code: string; count: number }[];
}) {
  const { t, locale } = useI18n();
  if (rows.length === 0) return <p className="mt-3 text-sm text-muted-foreground">{t("noData")}</p>;
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="flex flex-wrap items-end justify-center gap-3 py-2" role="img" aria-label={t("recentClicks")}>
      {rows.map((r) => {
        const size = 36 + (r.count / max) * 44;
        return (
          <div key={r.code} className="flex flex-col items-center gap-1">
            <span
              className="flex items-center justify-center rounded-full bg-muted"
              style={{ width: size, height: size, fontSize: size * 0.42 }}
              title={`${countryDisplayName(r.code, locale)} · ${r.count}`}
            >
              {flagEmoji(r.code)}
            </span>
            <span className="text-xs tabular-nums text-muted-foreground">{r.count.toLocaleString(locale)}</span>
          </div>
        );
      })}
    </div>
  );
}

export function OfficeVisuals({
  countries,
  hourly,
  clickLeaders,
  recentClicks,
  ipLeaders,
  labelClick,
  seriesTitle,
  hideHourly = false,
}: {
  countries: CountryStat[];
  hourly: DualHour[];
  clickLeaders: { target: string; count: number }[];
  recentClicks: RecentClick[];
  ipLeaders: IpTraffic[];
  labelClick: (target: string) => string;
  seriesTitle?: string;
  hideHourly?: boolean;
}) {
  const { t, locale } = useI18n();
  const byCountry = new Map<string, number>();
  for (const c of recentClicks) {
    const code = c.country ?? "ZZ";
    byCountry.set(code, (byCountry.get(code) ?? 0) + 1);
  }
  const bubbles = [...byCountry.entries()]
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count);
  const shares = clickLeaders.filter((c) => c.target.startsWith("share:"));

  return (
    <div className="space-y-4">
      {hideHourly ? null : (
        <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
          <h2 className="font-display text-lg font-medium">{seriesTitle ?? t("trafficHourly")}</h2>
          <DualHourChart points={hourly} />
        </section>
      )}

      <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
        <h2 className="font-display text-lg font-medium">{t("ipVisits")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("ipVisitsHint")}</p>
        <IpVisitChart rows={ipLeaders} />
      </section>

      <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
        <h2 className="font-display text-lg font-medium">{t("countriesByIp")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("trafficHint")}</p>
        <FlagColumnChart
          rows={countries.map((c) => ({
            id: c.code,
            flag: flagEmoji(c.code),
            name: countryDisplayName(c.code, locale),
            visits: c.views,
            clicks: c.clicks,
          }))}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
          <h2 className="font-display text-lg font-medium">{t("clicksTitle")}</h2>
          <div className="mt-3">
            <ClickDonut
              slices={clickLeaders.map((c) => ({
                id: c.target,
                label: labelClick(c.target),
                count: c.count,
              }))}
            />
          </div>
        </section>
        <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
          <h2 className="font-display text-lg font-medium">{t("recentClicks")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("countriesByIp")}</p>
          <FlagBubbles rows={bubbles} />
        </section>
      </div>

      <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
        <h2 className="font-display text-lg font-medium">{t("shareByNetwork")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("shareByNetworkHint")}</p>
        <div className="mt-3">
          <ClickDonut
            slices={shares.map((c) => ({
              id: c.target,
              label: labelClick(c.target),
              count: c.count,
            }))}
          />
        </div>
      </section>
    </div>
  );
}

function productLabel(name: string, t: (k: string) => string): string {
  if (name === "news") return t("googleNews");
  if (name === "images") return t("googleImages");
  if (name === "ads") return t("googleAds");
  if (name === "maps") return t("googleMaps");
  if (name === "other") return t("googleOther");
  return t("googleSearch");
}

function landingLabel(name: string, t: (k: string) => string): string {
  if (name === "/") return t("title");
  if (name === "/office") return t("office");
  if (name === "/accessibility") return t("accessibility");
  return name;
}

export function GoogleArrivalCharts({ data }: { data: GoogleArrival }) {
  const { t, locale } = useI18n();
  const hostRows = data.hosts.map((h) => {
    const code = googleHostCountry(h.name);
    return {
      id: h.name,
      flag: flagEmoji(code),
      name: code ? `${flagEmoji(code)} ${countryDisplayName(code, locale)}` : h.name,
      visits: h.count,
      clicks: 0,
    };
  });

  return (
    <section className="space-y-4" aria-labelledby="google-heading">
      <div>
        <h2 id="google-heading" className="font-display text-xl font-medium">
          {t("googleTitle")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("googleHint")}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]">
          <p className="text-xs font-medium text-muted-foreground">{t("googleSessions")}</p>
          <p className="mt-1 font-display text-2xl font-medium tabular-nums">{data.sessions.toLocaleString(locale)}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
          <h3 className="font-display text-lg font-medium">{t("googleProduct")}</h3>
          <div className="mt-3">
            <ClickDonut
              slices={data.products.map((p) => ({
                id: p.name,
                label: productLabel(p.name, t),
                count: p.count,
              }))}
            />
          </div>
        </section>
        <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
          <h3 className="font-display text-lg font-medium">{t("googleFromCountry")}</h3>
          <FlagBubbles rows={data.countries.map((c) => ({ code: c.name, count: c.count }))} />
        </section>
        <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
          <h3 className="font-display text-lg font-medium">{t("googleFromHost")}</h3>
          <FlagColumnChart rows={hostRows} />
        </section>
        <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
          <h3 className="font-display text-lg font-medium">{t("googleLanding")}</h3>
          <div className="mt-3">
            <ClickDonut
              slices={data.landings.map((p) => ({
                id: p.name,
                label: landingLabel(p.name, t),
                count: p.count,
              }))}
            />
          </div>
        </section>
      </div>

      {data.campaigns.length > 0 ? (
        <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
          <h3 className="font-display text-lg font-medium">{t("googleCampaign")}</h3>
          <div className="mt-3">
            <ClickDonut
              slices={data.campaigns.map((p) => ({
                id: p.name,
                label: p.name,
                count: p.count,
              }))}
            />
          </div>
        </section>
      ) : null}
    </section>
  );
}

export function FunnelLadder({ steps }: { steps: { key: string; n: number }[] }) {
  const { t, locale } = useI18n();
  const land = steps[0]?.n ?? 0;
  if (!land) return <p className="mt-3 text-sm text-muted-foreground">{t("noData")}</p>;

  return (
    <ol className="mt-3 space-y-2">
      {steps.map((step, i) => {
        const prev = i === 0 ? step.n : steps[i - 1]?.n ?? 0;
        const ofLand = Math.round((step.n / land) * 100);
        const fromPrev = prev ? Math.round((step.n / prev) * 100) : 0;
        const width = Math.min(100, Math.max(step.n ? 8 : 0, ofLand));
        return (
          <li key={step.key}>
            {i > 0 ? (
              <p className="mb-1 text-center text-xs font-medium text-muted-foreground">
                {t("funnelStepRate", { n: fromPrev })}
              </p>
            ) : null}
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">{t(step.key)}</span>
              <span className="tabular-nums text-muted-foreground">
                {step.n.toLocaleString(locale)} · {t("funnelOfLand", { n: ofLand })}
              </span>
            </div>
            <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted">
              <span className="block h-full rounded-full bg-heat" style={{ width: `${width}%` }} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function workSliceLabel(name: string, t: (k: string) => string) {
  if (name === "fauda") return t("workFaudaShort");
  if (name === "naza") return t("workNazaShort");
  if (name === "compare") return t("workCompare");
  return t("dimUnknown");
}

function tabSliceLabel(name: string, t: (k: string) => string) {
  if (name === "map") return t("navMap");
  if (name === "social") return t("navSocialShort");
  if (name === "algo") return t("navAlgo");
  if (name === "concl") return t("navConcl");
  return t("dimUnknown");
}

function langSliceLabel(name: string, t: (k: string) => string) {
  if (name === "unknown") return t("dimUnknown");
  return LOCALE_META[name as keyof typeof LOCALE_META]?.native ?? name.toUpperCase();
}

function knownSlices(rows: NamedCount[], label: (name: string, t: (k: string) => string) => string, t: (k: string) => string) {
  return rows
    .filter((r) => r.name !== "unknown" && r.count > 0)
    .map((r) => ({ id: r.name, label: label(r.name, t), count: r.count }));
}

export function DimensionCharts({
  works,
  tabs,
  langs,
}: {
  works: NamedCount[];
  tabs: NamedCount[];
  langs: NamedCount[];
}) {
  const { t, locale } = useI18n();
  const pending = (rows: NamedCount[]) => rows.find((r) => r.name === "unknown")?.count ?? 0;
  const cards = [
    { title: t("workBreakdown"), hint: t("workBreakdownHint"), rows: works, label: workSliceLabel },
    { title: t("tabBreakdown"), hint: t("tabBreakdownHint"), rows: tabs, label: tabSliceLabel },
    { title: t("langBreakdown"), hint: t("langBreakdownHint"), rows: langs, label: langSliceLabel },
  ] as const;

  return (
    <section className="space-y-4" aria-labelledby="dims-heading">
      <div>
        <h2 id="dims-heading" className="font-display text-xl font-medium">
          {t("breakdownTitle")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("breakdownHint")}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {cards.map((card) => {
          const older = pending(card.rows);
          const slices = knownSlices(card.rows, card.label, t);
          return (
            <section key={card.title} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
              <h3 className="font-display text-lg font-medium">{card.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{card.hint}</p>
              <div className="mt-3">
                {slices.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {older > 0 ? t("dimPending", { n: older.toLocaleString(locale) }) : t("noData")}
                  </p>
                ) : (
                  <ClickDonut slices={slices} centerLabel={t("trafficVisits")} />
                )}
              </div>
              {slices.length > 0 && older > 0 ? (
                <p className="mt-2 text-xs text-muted-foreground">{t("dimPending", { n: older.toLocaleString(locale) })}</p>
              ) : null}
            </section>
          );
        })}
      </div>
    </section>
  );
}

const GOAL_KEYS: Record<string, string> = {
  land: "goalLand",
  explore: "goalExplore",
  share: "goalShare",
  office: "goalOffice",
  google: "goalGoogle",
  googleShare: "goalGoogleShare",
  duration: "goalDuration",
  engaged: "goalEngaged",
};

export function AnalyticsGoals({ goals, sessions }: { goals: GoalStat[]; sessions: number }) {
  const { t, locale } = useI18n();
  const denom = Math.max(1, sessions);
  return (
    <section className="space-y-4" aria-labelledby="goals-heading">
      <div>
        <h2 id="goals-heading" className="font-display text-xl font-medium">
          {t("goalsTitle")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("goalsHint")}</p>
      </div>
      {goals.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noData")}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {goals.map((g) => {
            const rate = Math.min(100, Math.round((g.completions / denom) * 1000) / 10);
            const circ = 2 * Math.PI * 28;
            const dash = (rate / 100) * circ;
            return (
              <article key={g.id} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)]">
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 72 72" className="size-16 shrink-0" aria-hidden="true">
                    <circle cx="36" cy="36" r="28" fill="none" className="stroke-muted" strokeWidth="8" />
                    <circle
                      cx="36"
                      cy="36"
                      r="28"
                      fill="none"
                      className="stroke-positive"
                      strokeWidth="8"
                      strokeDasharray={`${dash} ${circ - dash}`}
                      strokeLinecap="round"
                      transform="rotate(-90 36 36)"
                    />
                    <text x="36" y="40" textAnchor="middle" className="fill-foreground" fontSize="12" fontWeight="600">
                      {rate}%
                    </text>
                  </svg>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium leading-snug">{t(GOAL_KEYS[g.id] ?? g.id)}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("goalCompletions")}:{" "}
                      <span className="tabular-nums text-foreground">{g.completions.toLocaleString(locale)}</span>
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
