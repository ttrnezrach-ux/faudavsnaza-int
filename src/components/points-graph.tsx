import { LIVE } from "@/lib/live";
import { useI18n } from "@/lib/i18n";

const CHART = LIVE.chart;

export function PointsGraph() {
  const { t } = useI18n();
  if (!CHART?.days.length) return null;

  const w = 720;
  const h = 260;
  const pad = { t: 28, r: 36, b: 36, l: 40 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const n = CHART.days.length;
  const gap = innerW / n;
  const barW = gap * 0.52;
  const maxPts = 300;
  const points = CHART.points;
  const ranks = CHART.avgRank;

  function bx(i: number) {
    return pad.l + i * gap + gap / 2;
  }
  function yPts(v: number) {
    return pad.t + innerH - (v / maxPts) * innerH;
  }
  function yRank(r: number) {
    return pad.t + ((r - 1) / 9) * innerH;
  }

  const line = ranks.map((r, i) => `${bx(i)},${yRank(r)}`).join(" ");
  const ticks = [0, 50, 100, 150, 200, 250, 300];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-4 sm:px-6" aria-labelledby="points-graph-title">
      <article className="rounded-2xl bg-card px-4 py-4 shadow-[var(--shadow-border)] sm:px-5">
        <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">{t("pointsGraphKicker")}</p>
        <h2 id="points-graph-title" className="mt-1 font-display text-xl font-medium tracking-tight">
          {t("pointsGraphTitle")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("pointsGraphHint")}</p>
        <div className="mt-4" dir="ltr">
          <svg viewBox={`0 0 ${w} ${h}`} className="h-56 w-full sm:h-64" role="img" aria-label={t("pointsGraphTitle")}>
            {ticks.map((tick) => (
              <g key={tick}>
                <line
                  x1={pad.l}
                  x2={w - pad.r}
                  y1={yPts(tick)}
                  y2={yPts(tick)}
                  className="stroke-border"
                  strokeWidth="1"
                />
                <text x={pad.l - 8} y={yPts(tick) + 4} textAnchor="end" className="fill-muted-foreground" fontSize="11">
                  {tick}
                </text>
              </g>
            ))}
            {[1, 4, 7, 10].map((r) => (
              <text key={r} x={w - pad.r + 8} y={yRank(r) + 4} className="fill-muted-foreground" fontSize="11">
                {r}.
              </text>
            ))}
            {points.map((v, i) => (
              <rect
                key={CHART.days[i]}
                x={bx(i) - barW / 2}
                y={yPts(v)}
                width={barW}
                height={Math.max(0, yPts(0) - yPts(v))}
                rx="4"
                className="fill-[#7aa2d4]"
              />
            ))}
            <polyline points={line} fill="none" stroke="#e8a04a" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            {ranks.map((r, i) => (
              <circle key={`d${i}`} cx={bx(i)} cy={yRank(r)} r="4.5" className="fill-[#e8a04a]" />
            ))}
            {CHART.days.map((d, i) => (
              <text key={d} x={bx(i)} y={h - 10} textAnchor="middle" className="fill-muted-foreground" fontSize="11">
                {d}
              </text>
            ))}
          </svg>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{t("pointsGraphSource")}</p>
      </article>
    </section>
  );
}
