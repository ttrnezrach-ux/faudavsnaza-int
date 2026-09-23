import { useMemo, useState, type ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { rankDailyTrend } from "@/lib/compare";
import { countryDisplayName, flagEmoji } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";
import { useWork } from "@/lib/work";

export function RankTrend() {
  const { t, locale } = useI18n();
  const { work } = useWork();
  const data = useMemo(
    () =>
      rankDailyTrend({
        countries: work.countries,
        posts: work.posts,
        days: work.days,
        global: work.global,
      }),
    [work],
  );
  const [tip, setTip] = useState<number | null>(null);
  const max = Math.max(1, ...data.byDay.map((d) => d.count));
  const w = 640;
  const h = 160;
  const pad = { t: 24, r: 12, b: 28, l: 28 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const n = data.byDay.length || 1;

  function x(i: number) {
    return pad.l + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  }
  function y(v: number) {
    return pad.t + innerH - (v / max) * innerH;
  }

  const line = data.byDay.map((d, i) => `${x(i)},${y(d.count)}`).join(" ");
  const area = `${x(0)},${pad.t + innerH} ${line} ${x(n - 1)},${pad.t + innerH}`;
  const active = tip != null ? data.byDay[tip] : null;
  const deltaLabel =
    data.deltaTop10 > 0 ? `+${data.deltaTop10}` : data.deltaTop10 < 0 ? String(data.deltaTop10) : "0";

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-4 sm:px-6" aria-labelledby="rank-trend-heading">
      <div className="rounded-2xl bg-card px-4 py-4 shadow-[var(--shadow-border)] sm:px-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="rank-trend-heading" className="font-display text-lg font-medium tracking-tight">
              {t("rankTrendTitle")}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("rankTrendHint")}</p>
          </div>
          <p className="text-sm tabular-nums">
            <span className="font-display text-2xl">{data.today}</span>
            <span className="ms-2 text-muted-foreground">{t("kpiTop10")}</span>
            <span className={data.deltaTop10 >= 0 ? "ms-2 text-positive" : "ms-2 text-negative"}>
              {deltaLabel} {t("vsYesterday")}
            </span>
          </p>
        </div>

        <div className="relative mt-3" dir="ltr" onMouseLeave={() => setTip(null)}>
          <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full" role="img" aria-label={t("top10ByDay")}>
            <polygon points={area} className="fill-heat/20" />
            <polyline points={line} fill="none" className="stroke-heat" strokeWidth="2" />
            {data.byDay.map((d, i) => (
              <g
                key={d.day}
                onMouseEnter={() => setTip(i)}
              >
                <rect x={x(i) - innerW / n / 2} y={pad.t} width={innerW / n} height={innerH} className="fill-transparent" />
                <circle cx={x(i)} cy={y(d.count)} r={tip === i ? 5 : 3.5} className="fill-foreground" />
                <text x={x(i)} y={h - 8} textAnchor="middle" className="fill-muted-foreground" fontSize="11">
                  {d.day}
                </text>
                {tip === i ? (
                  <text
                    x={x(i)}
                    y={y(d.count) - 10}
                    textAnchor="middle"
                    className="fill-foreground"
                    fontSize="12"
                    fontWeight="700"
                  >
                    {d.count}
                  </text>
                ) : null}
              </g>
            ))}
          </svg>
          {active ? (
            <p className="mt-1 text-center text-xs text-muted-foreground">
              {active.day}: {active.count} · {t("kpiFirst")} {active.firsts}
            </p>
          ) : (
            <p className="mt-1 text-center text-xs text-muted-foreground">{t("top10ByDay")}</p>
          )}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <MoverList
            title={t("rankClimbed")}
            icon={<TrendingUp className="size-4 text-positive" aria-hidden="true" />}
            rows={data.climbed.slice(0, 6)}
            locale={locale}
            empty={t("noData")}
            positive
          />
          <MoverList
            title={t("rankFell")}
            icon={<TrendingDown className="size-4 text-negative" aria-hidden="true" />}
            rows={data.fell.slice(0, 6)}
            locale={locale}
            empty={t("noData")}
            positive={false}
          />
        </div>
      </div>
    </section>
  );
}

function MoverList({
  title,
  icon,
  rows,
  locale,
  empty,
  positive,
}: {
  title: string;
  icon: ReactNode;
  rows: { id: string; from: number | null; to: number | null; delta: number }[];
  locale: string;
  empty: string;
  positive: boolean;
}) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {title}
      </h3>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center gap-2 text-sm">
              <span aria-hidden="true">{flagEmoji(r.id)}</span>
              <span className="min-w-0 flex-1 truncate">{countryDisplayName(r.id, locale)}</span>
              <span className="tabular-nums text-muted-foreground">
                {r.from == null ? "—" : `#${r.from}`} → {r.to == null ? "—" : `#${r.to}`}
              </span>
              <span className={positive ? "tabular-nums text-positive" : "tabular-nums text-negative"}>
                {r.delta > 0 ? `+${r.delta}` : r.delta}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
