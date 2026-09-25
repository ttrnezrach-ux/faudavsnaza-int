import { isSeriesSpike, trafficPace, type TrafficSnapshot } from "@/lib/visit-counter";
import { useI18n } from "@/lib/i18n";

export function OfficeTraffic({
  traffic,
  botHits = 0,
}: {
  traffic: Pick<
    TrafficSnapshot,
    | "total"
    | "baseline"
    | "counted"
    | "lastHour"
    | "last24h"
    | "typicalDay"
    | "days"
    | "hours"
    | "anomaly"
    | "durable"
  >;
  botHits?: number;
}) {
  const { t, locale } = useI18n();
  const pace = trafficPace(traffic.last24h, traffic.typicalDay);
  const anomaly = traffic.anomaly;
  const dayValues = traffic.days.map((day) => day.visits);
  const hourValues = traffic.hours.map((hour) => hour.visits);
  const paceLabel =
    pace === "above"
      ? t("trafficAbove")
      : pace === "below"
        ? t("trafficBelow")
        : pace === "quiet"
          ? t("trafficQuiet")
          : t("trafficNormal");
  const max = Math.max(1, ...traffic.days.map((day) => day.visits));

  return (
    <section className="space-y-4" aria-labelledby="office-traffic-heading">
      <div>
        <h2 id="office-traffic-heading" className="font-display text-xl font-medium">
          {t("trafficOfficeTitle")}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {traffic.durable ? t("trafficDurable") : t("trafficEphemeral", { baseline: traffic.baseline })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label={t("visitsAllTime")} value={traffic.total} locale={locale} />
        <Stat label={t("trafficCounted")} value={traffic.counted} locale={locale} />
        <Stat label={t("trafficLastHour")} value={traffic.lastHour} locale={locale} />
        <Stat label={t("trafficLast24")} value={traffic.last24h} locale={locale} />
      </div>

      <p className="text-sm text-muted-foreground">
        <span className="font-medium tabular-nums text-foreground">{botHits.toLocaleString(locale)}</span>{" "}
        {t("botHits")}. {t("botHitsHint")}
      </p>

      <p className="text-sm text-muted-foreground">
        {t("trafficBaselineNote", { baseline: traffic.baseline, counted: traffic.counted })}
      </p>
      <p className="text-sm">
        <span className="text-muted-foreground">{t("trafficVsTypical")} </span>
        <span className="font-medium tabular-nums">
          {traffic.last24h.toLocaleString(locale)}
        </span>
        <span className="text-muted-foreground"> · {paceLabel} · </span>
        <span className="tabular-nums">{traffic.typicalDay.toLocaleString(locale)}</span>
        <span className="text-muted-foreground"> {t("trafficTypical")}</span>
      </p>
      <p className="text-sm leading-relaxed">
        <span className="text-muted-foreground">
          {t("trafficAnomaly", {
            today: anomaly.today.toLocaleString(locale),
            average: anomaly.average.toLocaleString(locale),
            stddev: anomaly.stddev.toLocaleString(locale),
          })}
        </span>{" "}
        <span className="font-medium tabular-nums">
          {t("trafficZ", { z: anomaly.zScore == null ? "—" : anomaly.zScore.toLocaleString(locale) })}
        </span>
        {anomaly.deviationPct != null ? (
          <span className="text-muted-foreground">
            {" "}
            · {t("trafficDeviation", { pct: `${anomaly.deviationPct > 0 ? "+" : ""}${anomaly.deviationPct}` })}
          </span>
        ) : null}
        {anomaly.spike ? (
          <span className="ms-2 inline-flex items-center rounded-full bg-negative-soft px-2 py-0.5 text-xs font-medium text-negative">
            {t("trafficSpike")}
          </span>
        ) : null}
      </p>

      <div>
        <h3 className="text-sm font-medium">{t("trafficHoursTitle")}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{t("trafficUtc")}</p>
        <div className="mt-3 flex items-end gap-0.5" role="img" aria-label={t("trafficHoursTitle")}>
          {traffic.hours.map((hour) => {
            const spike = isSeriesSpike(hour.visits, hourValues);
            const hourMax = Math.max(1, ...hourValues);
            return (
              <div key={hour.hour} className="flex min-w-0 flex-1 flex-col items-center gap-1" title={`${hour.hour.slice(11)} · ${hour.visits}`}>
                <div className="flex h-16 w-full items-end rounded-sm bg-muted">
                  <div
                    className={`w-full rounded-sm ${spike ? "bg-negative" : "bg-heat"}`}
                    style={{ height: `${Math.max(hour.visits ? 8 : 0, (hour.visits / hourMax) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex justify-between text-[10px] tabular-nums text-muted-foreground">
          <span>{traffic.hours[0]?.hour.slice(11) ?? ""}</span>
          <span>{traffic.hours[12]?.hour.slice(11) ?? ""}</span>
          <span>{traffic.hours[23]?.hour.slice(11) ?? ""}</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium">{t("trafficDaysTitle")}</h3>
        <div className="mt-3 flex items-end gap-1" role="img" aria-label={t("trafficDaysTitle")}>
          {traffic.days.map((day) => {
            const spike = isSeriesSpike(day.visits, dayValues) || (day.date === traffic.days.at(-1)?.date && anomaly.spike);
            return (
            <div key={day.date} className="flex min-w-0 flex-1 flex-col items-center gap-1">
              <div className="flex h-16 w-full items-end rounded-sm bg-muted">
                <div
                  className={`w-full rounded-sm ${spike ? "bg-negative" : "bg-heat"}`}
                  style={{ height: `${Math.max(day.visits ? 8 : 0, (day.visits / max) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] tabular-nums text-muted-foreground">{day.date.slice(8)}</span>
            </div>
            );
          })}
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground sm:grid-cols-4">
          {traffic.days.map((day) => (
            <li key={day.date} className="flex justify-between gap-2 tabular-nums">
              <span>{day.date}</span>
              <span className="text-foreground">{day.visits.toLocaleString(locale)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stat({ label, value, locale }: { label: string; value: number; locale: string }) {
  return (
    <div className="rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-medium tabular-nums leading-tight">
        {value.toLocaleString(locale)}
      </p>
    </div>
  );
}
