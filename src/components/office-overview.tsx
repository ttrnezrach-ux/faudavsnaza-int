import { DualHourChart } from "@/components/traffic-chart";
import { countryDisplayName, flagEmoji } from "@/lib/geo";
import type { DualHour, NamedCount, OfficeStats } from "@/lib/visits";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const DURATION_ORDER = ["lt10", "lt30", "lt2m", "lt5m", "gt5m"] as const;

function durationLabel(id: string, t: (k: string) => string): string {
  if (id === "lt10") return t("durLt10");
  if (id === "lt30") return t("durLt30");
  if (id === "lt2m") return t("durLt2m");
  if (id === "lt5m") return t("durLt5m");
  return t("durGt5m");
}

function InsightOpens({
  leaders,
  labelClick,
}: {
  leaders: OfficeStats["clickLeaders"];
  labelClick: (target: string) => string;
}) {
  const { t, locale } = useI18n();
  const rows = leaders.filter((c) => c.target.startsWith("insight:"));
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
      <h2 className="font-display text-lg font-medium">{t("insightOpens")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("insightOpensHint")}</p>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">{t("noData")}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {rows.map((r) => (
            <li key={r.target}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{labelClick(r.target)}</span>
                <span className="tabular-nums text-muted-foreground">{r.count.toLocaleString(locale)}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <span className="block h-full bg-heat" style={{ width: `${Math.max(8, (r.count / max) * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function BounceRing({ rate, sessions }: { rate: number; sessions: number }) {
  const { t, locale } = useI18n();
  const r = 52;
  const c = 2 * Math.PI * r;
  const bounce = Math.min(100, Math.max(0, rate));
  const dash = (bounce / 100) * c;
  const stayed = 100 - bounce;

  return (
    <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
      <h2 className="font-display text-lg font-medium">{t("bounceTitle")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("bounceHint")}</p>
      <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row">
        <svg viewBox="0 0 140 140" className="size-40 shrink-0" role="img" aria-label={t("bounce")}>
          <circle cx="70" cy="70" r={r} fill="none" className="stroke-positive" strokeWidth="18" />
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            className="stroke-negative"
            strokeWidth="18"
            strokeDasharray={`${dash} ${c - dash}`}
            transform="rotate(-90 70 70)"
            strokeLinecap="butt"
          />
          <text x="70" y="66" textAnchor="middle" className="fill-foreground" fontSize="28" fontWeight="600">
            {bounce}%
          </text>
          <text x="70" y="86" textAnchor="middle" className="fill-muted-foreground" fontSize="11">
            {t("bounce")}
          </text>
        </svg>
        <ul className="grid flex-1 gap-2 text-sm">
          <li className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2">
              <span className="size-2.5 rounded-sm bg-negative" />
              {t("bounce")}
            </span>
            <span className="tabular-nums text-muted-foreground">{bounce}%</span>
          </li>
          <li className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2">
              <span className="size-2.5 rounded-sm bg-positive" />
              {t("stayRate")}
            </span>
            <span className="tabular-nums text-muted-foreground">{stayed}%</span>
          </li>
          <li className="flex items-center justify-between gap-3 text-muted-foreground">
            <span>{t("sessions")}</span>
            <span className="tabular-nums">{sessions.toLocaleString(locale)}</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

function DurationChart({ buckets, avgSeconds }: { buckets: NamedCount[]; avgSeconds: number }) {
  const { t, locale } = useI18n();
  const byName = new Map(buckets.map((b) => [b.name, b.count]));
  const rows = DURATION_ORDER.map((id) => ({ id, count: byName.get(id) ?? 0 }));
  const max = Math.max(1, ...rows.map((r) => r.count));
  const m = Math.floor(avgSeconds / 60);
  const s = avgSeconds % 60;
  const clock = `${m}:${String(s).padStart(2, "0")}`;

  return (
    <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-medium">{t("durationTitle")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("durationHint")}</p>
        </div>
        <p className="font-display text-2xl font-medium tabular-nums leading-none">{clock}</p>
      </div>
      {rows.every((r) => r.count === 0) ? (
        <p className="mt-3 text-sm text-muted-foreground">{t("noData")}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {rows.map((r) => (
            <li key={r.id}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{durationLabel(r.id, t)}</span>
                <span className="tabular-nums text-muted-foreground">{r.count.toLocaleString(locale)}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full bg-heat"
                  style={{ width: `${Math.max(r.count ? 8 : 0, (r.count / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CommonCard({
  label,
  value,
  share,
}: {
  label: string;
  value: string;
  share?: string;
}) {
  return (
    <div className="rounded-2xl bg-card px-4 py-4 shadow-[var(--shadow-border)]">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 truncate font-display text-xl font-medium leading-tight">{value}</p>
      {share ? <p className="mt-1 text-xs tabular-nums text-muted-foreground">{share}</p> : null}
    </div>
  );
}

export function OfficeOverview({
  stats,
  hourlyTitle,
  labelClick,
}: {
  stats: OfficeStats;
  hourlyTitle: string;
  labelClick: (target: string) => string;
}) {
  const { t, locale } = useI18n();
  const device = stats.devices[0];
  const source = stats.sources[0];
  const country = stats.countries[0];
  const click = stats.clickLeaders[0];
  const deviceTotal = stats.devices.reduce((n, d) => n + d.count, 0);
  const sourceTotal = stats.sources.reduce((n, d) => n + d.count, 0);
  const countryTotal = stats.countries.reduce((n, d) => n + d.visitors, 0);
  const clickTotal = stats.clickLeaders.reduce((n, d) => n + d.count, 0);

  function pct(part: number, total: number) {
    if (!total) return undefined;
    return `${Math.round((part / total) * 100)}%`;
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
        <h2 className="font-display text-lg font-medium">{hourlyTitle}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("trafficHint")}</p>
        <DualHourChart points={stats.hourlyDual as DualHour[]} />
      </section>

      <div>
        <h2 className="font-display text-lg font-medium">{t("mostCommon")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("mostCommonHint")}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <CommonCard
            label={t("mostCommonDevice")}
            value={device ? (device.name === "mobile" ? t("deviceMobile") : device.name === "tablet" ? t("deviceTablet") : t("deviceDesktop")) : "—"}
            share={device ? pct(device.count, deviceTotal) : undefined}
          />
          <CommonCard
            label={t("mostCommonSource")}
            value={
              source
                ? source.name === "google"
                  ? t("sourceGoogle")
                  : source.name === "internal"
                    ? t("sourceInternal")
                    : source.name === "referral"
                      ? t("sourceReferral")
                      : t("sourceDirect")
                : "—"
            }
            share={source ? pct(source.count, sourceTotal) : undefined}
          />
          <CommonCard
            label={t("mostCommonCountry")}
            value={country ? `${flagEmoji(country.code)} ${countryDisplayName(country.code, locale)}` : "—"}
            share={country ? pct(country.visitors, countryTotal) : undefined}
          />
          <CommonCard
            label={t("mostCommonClick")}
            value={click ? labelClick(click.target) : "—"}
            share={click ? pct(click.count, clickTotal) : undefined}
          />
        </div>
      </div>

      <InsightOpens leaders={stats.clickLeaders} labelClick={labelClick} />

      <div className={cn("grid gap-4 lg:grid-cols-2")}>
        <BounceRing rate={stats.bounceRate} sessions={stats.sessions} />
        <DurationChart buckets={stats.durationBuckets} avgSeconds={stats.avgSeconds} />
      </div>
    </div>
  );
}
