import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { OfficeGate } from "@/components/office-gate";
import { Button } from "@/components/ui/button";
import { LOCALE_META, useI18n } from "@/lib/i18n";
import { countryDisplayName, flagEmoji } from "@/lib/geo";
import { getOfficeStats, type IpHit, type NamedCount, type OfficeRange, type OfficeStats } from "@/lib/visits";
import { LIVE } from "@/lib/live";
import { listLiveRuns, runLiveIngest, type LiveRun } from "@/lib/ingest";
import { trackClick } from "@/lib/track";
import { OfficeVisuals, GoogleArrivalCharts, AnalyticsGoals } from "@/components/traffic-chart";
import { OfficeOverview } from "@/components/office-overview";
import { VersionStamp } from "@/components/version-stamp";
import { WeekScan } from "@/components/week-scan";
import { VersionsPanel } from "@/components/versions-panel";
import { OfficeTraffic } from "@/components/office-traffic";
import { getDeviceExclusion, setDeviceExclusion } from "@/lib/traffic-gate";

export const Route = createFileRoute("/office")({
  component: OfficePage,
});

function clickLabel(target: string, locale: string, t: (k: string) => string): string {
  const [kind, rest] = target.split(":");
  if (kind === "share") {
    const map: Record<string, string> = {
      whatsapp: t("netWhatsapp"),
      facebook: t("netFacebook"),
      x: t("netX"),
      telegram: t("netTelegram"),
      linkedin: t("netLinkedin"),
      mail: t("netMail"),
      copy: t("shareCopy"),
      native: t("shareNative"),
      card: t("sharePreview"),
    };
    return map[rest] ?? target;
  }
  if (kind === "tab") {
    const map: Record<string, string> = {
      list: t("tabCountries"),
      search: t("tabSearch"),
      iso: t("tabIso"),
      quotes: t("tabQuotes"),
      social: t("tabSocial"),
      regions: t("tabRegions"),
    };
    return map[rest] ?? target;
  }
  if (kind === "lang") {
    return LOCALE_META[rest as keyof typeof LOCALE_META]?.native ?? rest.toUpperCase();
  }
  if (kind === "country") {
    return `${flagEmoji(rest)} ${countryDisplayName(rest, locale)}`;
  }
  if (kind === "work") {
    if (rest === "fauda") return t("workFaudaShort");
    if (rest === "naza") return t("workNazaShort");
    if (rest === "compare") return t("workCompare");
    return rest;
  }
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
  if (kind === "source") {
    return rest;
  }
  if (kind === "out") return rest;
  if (kind === "contact") return `${t("funnelContact")} · ${rest}`;
  if (kind === "a11y" || kind === "mode" || kind === "tone" || kind === "region" || kind === "coverage") {
    return `${kind} · ${rest}`;
  }
  if (kind === "social") {
    if (rest === "facebook") return t("netFacebook");
    if (rest === "x") return t("netX");
    if (rest === "tiktok") return t("netTiktok");
    return t("netInstagram");
  }
  return target;
}

function pageLabel(name: string, t: (k: string) => string): string {
  if (name === "/") return t("title");
  if (name === "/office") return t("office");
  if (name === "/accessibility") return t("accessibility");
  return name;
}

function deviceLabel(name: string, t: (k: string) => string): string {
  if (name === "mobile") return t("deviceMobile");
  if (name === "tablet") return t("deviceTablet");
  return t("deviceDesktop");
}

function sourceLabel(name: string, t: (k: string) => string): string {
  if (name === "google") return t("sourceGoogle");
  if (name === "internal") return t("sourceInternal");
  if (name === "referral") return t("sourceReferral");
  return t("sourceDirect");
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function ExcludeDeviceToggle() {
  const { t } = useI18n();
  const [excluded, setExcluded] = useState(true);

  useEffect(() => {
    void getDeviceExclusion()
      .then((row) => setExcluded(row.excluded))
      .catch(() => {});
  }, []);

  return (
    <div className="flex max-w-full flex-col gap-1">
      <button
        type="button"
        aria-pressed={excluded}
        className="inline-flex h-11 items-center gap-2 self-start rounded-md px-3 text-sm font-medium shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => {
          const next = !excluded;
          setExcluded(next);
          void setDeviceExclusion({ data: { exclude: next } })
            .then((row) => setExcluded(row.excluded))
            .catch(() => setExcluded(!next));
        }}
      >
        <span className={`size-2.5 rounded-full ${excluded ? "bg-heat" : "bg-muted-foreground/40"}`} aria-hidden="true" />
        {t("excludeDevice")}
      </button>
      <p className="max-w-xs text-xs leading-snug text-muted-foreground">
        {excluded ? t("excludeDeviceOn") : t("excludeDeviceOff")}
      </p>
    </div>
  );
}

function OfficePage() {
  return (
    <AppShell>
      <OfficeGate>
        <OfficeBody />
      </OfficeGate>
    </AppShell>
  );
}

function OfficeBody() {
  const { t, locale } = useI18n();
  const [range, setRange] = useState<OfficeRange>("week");
  const [stats, setStats] = useState<OfficeStats | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(() => {
    setFailed(false);
    void getOfficeStats({ data: { range } })
      .then(setStats)
      .catch(() => setFailed(true));
  }, [range]);

  useEffect(() => {
    trackClick("nav:office");
    load();
  }, [load]);

  const funnelMax = Math.max(1, stats?.funnel.land ?? 1);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground">{t("kicker")}</p>
            <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">{t("officeTitle")}</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{t("anonymousNote")}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t("liveUpdated")} · <VersionStamp /> ·{" "}
              <a
                href={LIVE.source}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                FlixPatrol
              </a>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex flex-wrap rounded-lg bg-muted p-1" role="group" aria-label={t("rangeAria")}>
              {(["week", "month", "year", "day"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={range === r}
                  className={
                    range === r
                      ? "h-11 rounded-md bg-foreground px-3 text-sm font-medium text-background"
                      : "h-11 rounded-md px-3 text-sm font-medium text-foreground"
                  }
                  onClick={() => setRange(r)}
                >
                  {r === "day"
                    ? t("rangeDay")
                    : r === "week"
                      ? t("rangeWeek")
                      : r === "month"
                        ? t("rangeMonth")
                        : t("rangeYear")}
                </button>
              ))}
            </div>
            <ExcludeDeviceToggle />
            <Button type="button" variant="secondary" className="h-11" onClick={load}>
              {t("refresh")}
            </Button>
            <Link
              to="/"
              className="inline-flex h-11 items-center rounded-md px-4 text-sm font-medium shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("officeBack")}
            </Link>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 outline-none sm:px-6">
        {failed ? (
          <p className="text-sm text-muted-foreground">{t("noData")}</p>
        ) : null}

        {stats ? (
          <OfficeTraffic
            traffic={{
              total: stats.allTimeVisits,
              baseline: stats.baseline,
              counted: stats.counted,
              lastHour: stats.lastHour,
              last24h: stats.last24h,
              typicalDay: stats.typicalDay,
              days: stats.days,
              hours: stats.hours,
              anomaly: stats.anomaly,
              durable: stats.durable,
            }}
            botHits={stats.botHits}
          />
        ) : null}

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label={t("officeTitle")}>
          <Kpi label={t("visitsAllTime")} value={stats?.allTimeVisits} locale={locale} />
          <Kpi label={t("visitsUniqueAll")} value={stats?.allTimeUnique} locale={locale} />
          <Kpi label={t("visitsPeriod")} value={stats?.periodVisits} locale={locale} />
          <Kpi label={t("visitsUniquePeriod")} value={stats?.periodUnique} locale={locale} />
        </section>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("visitsExplain")}</p>
        {stats && stats.allTimeUnique > 0 ? (
          <p className="text-xs text-muted-foreground">
            {t("visitsPerUnique", {
              n: (stats.allTimeVisits / stats.allTimeUnique).toLocaleString(locale, {
                maximumFractionDigits: 1,
              }),
            })}
          </p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          {range === "year"
            ? t("lastYear")
            : range === "month"
              ? t("last30d")
              : range === "week"
                ? t("last7d")
                : t("last24h")}
        </p>

        {stats ? (
          <OfficeOverview
            stats={stats}
            hourlyTitle={
              range === "year"
                ? t("trafficHourlyYear")
                : range === "week"
                  ? t("trafficHourlyWeek")
                  : range === "month"
                    ? t("trafficHourlyMonth")
                    : t("trafficHourly")
            }
            labelClick={(target) => clickLabel(target, locale, t)}
          />
        ) : null}

        <section className="space-y-4" aria-labelledby="behavior-heading">
          <div>
            <h2 id="behavior-heading" className="font-display text-xl font-medium">
              {t("behaviorTitle")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("behaviorHint")}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            <Kpi label={t("sessions")} value={stats?.sessions} locale={locale} />
            <Kpi label={t("bounce")} value={stats?.bounceRate} locale={locale} suffix="%" />
            <Kpi label={t("pagesPerSession")} value={stats?.pagesPerSession} locale={locale} />
            <Kpi label={t("avgTime")} display={stats ? formatTime(stats.avgSeconds) : undefined} locale={locale} />
            <Kpi label={t("newUsers")} value={stats?.newUsers} locale={locale} />
            <Kpi label={t("returning")} value={stats?.returning} locale={locale} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <BarCard
              title={t("devicesTitle")}
              rows={(stats?.devices ?? []).map((d) => ({ name: deviceLabel(d.name, t), count: d.count }))}
              empty={t("noData")}
              color="bg-heat"
            />
            <BarCard
              title={t("sourcesTitle")}
              rows={(stats?.sources ?? []).map((d) => ({ name: sourceLabel(d.name, t), count: d.count }))}
              empty={t("noData")}
              color="bg-positive"
            />
            <BarCard
              title={t("pagesTitle")}
              rows={(stats?.pages ?? []).map((d) => ({ name: pageLabel(d.name, t), count: d.count }))}
              empty={t("noData")}
              color="bg-mixed"
            />
            <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
              <h3 className="font-display text-lg font-medium">{t("funnelTitle")}</h3>
              {!stats || stats.funnel.land === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">{t("noData")}</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {(
                    [
                      ["funnelLand", stats.funnel.land],
                      ["funnelExplore", stats.funnel.explore],
                      ["funnelShare", stats.funnel.share],
                      ["funnelContact", stats.funnel.contact],
                      ["funnelOffice", stats.funnel.office],
                    ] as const
                  ).map(([key, n]) => (
                    <li key={key}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium">{t(key)}</span>
                        <span className="tabular-nums text-muted-foreground">
                          {n.toLocaleString(locale)} · {Math.round((n / funnelMax) * 100)}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                        <span
                          className="block h-full bg-negative"
                          style={{ width: `${Math.max(6, (n / funnelMax) * 100)}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </section>

        <AnalyticsGoals goals={stats?.goals ?? []} sessions={stats?.sessions ?? 0} />

        <GoogleArrivalCharts
          data={
            stats?.google ?? {
              sessions: 0,
              products: [],
              hosts: [],
              countries: [],
              landings: [],
              campaigns: [],
            }
          }
        />

        {stats ? (
          <IpHitLog
            hits={stats.ipHits}
            labelPage={(name) => pageLabel(name, t)}
          />
        ) : null}

        <OfficeVisuals
          countries={stats?.countries ?? []}
          hourly={stats?.hourlyDual ?? []}
          clickLeaders={stats?.clickLeaders ?? []}
          recentClicks={stats?.recentClicks ?? []}
          ipLeaders={stats?.ipLeaders ?? []}
          labelClick={(target) => clickLabel(target, locale, t)}
          seriesTitle={
            range === "year"
              ? t("trafficHourlyYear")
              : range === "week"
                ? t("trafficHourlyWeek")
                : range === "month"
                  ? t("trafficHourlyMonth")
                  : t("trafficHourly")
          }
          hideHourly
        />

        <VersionsPanel />
        <WeekScan />
        <IngestPanel />
      </main>
    </div>
  );
}

function IpHitLog({ hits, labelPage }: { hits: IpHit[]; labelPage: (name: string) => string }) {
  const { t, locale } = useI18n();
  const fmt = new Intl.DateTimeFormat(locale, {
    timeZone: "Asia/Jerusalem",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
      <h2 className="font-display text-lg font-medium">{t("ipHitLog")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("ipHitHint")}</p>
      {hits.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">{t("noData")}</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-start text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="py-2 pe-3 font-medium">{t("ipHitTime")}</th>
                <th className="py-2 pe-3 font-medium">{t("ipAddress")}</th>
                <th className="py-2 pe-3 font-medium">{t("country")}</th>
                <th className="py-2 font-medium">{t("ipHitPage")}</th>
              </tr>
            </thead>
            <tbody>
              {hits.map((h, i) => (
                <tr key={`${h.at}-${h.hint}-${i}`} className="border-b border-border/60">
                  <td className="py-2 pe-3 tabular-nums whitespace-nowrap">
                    <time dateTime={h.at}>{fmt.format(new Date(h.at))}</time>
                  </td>
                  <td className="py-2 pe-3 font-medium" dir="ltr">
                    {h.hint}
                  </td>
                  <td className="py-2 pe-3">
                    {h.country ? (
                      <span>
                        <span className="me-1" aria-hidden="true">
                          {flagEmoji(h.country)}
                        </span>
                        {countryDisplayName(h.country, locale)}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-2">{labelPage(h.page)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function BarCard({
  title,
  rows,
  empty,
  color,
}: {
  title: string;
  rows: NamedCount[];
  empty: string;
  color: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
      <h3 className="font-display text-lg font-medium">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {rows.map((r) => (
            <li key={r.name}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium">{r.name}</span>
                <span className="tabular-nums text-muted-foreground">{r.count}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                <span className={`block h-full ${color}`} style={{ width: `${Math.max(8, (r.count / max) * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Kpi({
  label,
  value,
  locale,
  suffix,
  display,
}: {
  label: string;
  value?: number;
  locale: string;
  suffix?: string;
  display?: string;
}) {
  return (
    <div className="rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-medium tabular-nums leading-tight">
        {display ?? (value == null ? "—" : `${value.toLocaleString(locale)}${suffix ?? ""}`)}
      </p>
    </div>
  );
}

function IngestPanel() {
  const { t, locale } = useI18n();
  const [runs, setRuns] = useState<LiveRun[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void listLiveRuns()
      .then(setRuns)
      .catch(() => {});
  }, []);

  async function pull() {
    setBusy(true);
    try {
      const run = await runLiveIngest({ data: { slot: "manual" } });
      setRuns((prev) => [run, ...prev.filter((r) => r.id !== run.id)].slice(0, 12));
    } catch {
      /* keep list */
    } finally {
      setBusy(false);
    }
  }

  const slotLabel = (slot: LiveRun["slot"]) =>
    slot === "morning"
      ? t("ingestSlotMorning")
      : slot === "evening"
        ? t("ingestSlotEvening")
        : slot === "weekly"
          ? t("ingestSlotWeekly")
          : t("ingestSlotManual");

  return (
    <section className="rounded-2xl bg-card px-4 py-4 shadow-[var(--shadow-border)] sm:px-5" aria-labelledby="ingest-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="ingest-heading" className="font-display text-lg font-medium tracking-tight">
            {t("ingestRuns")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("ingestSchedule")} · <VersionStamp />
          </p>
        </div>
        <Button type="button" variant="secondary" className="h-11" disabled={busy} onClick={() => void pull()}>
          {t("ingestRunNow")}
        </Button>
      </div>
      {runs.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">{t("noData")}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {runs.map((r) => (
            <li key={r.id} className="rounded-xl bg-muted px-3 py-3 text-sm">
              <p className="text-xs font-medium text-muted-foreground">
                {slotLabel(r.slot)}
                {r.significant ? ` · ${t("ingestSignificant")}` : ""}
                {r.lastRunAt
                  ? ` · ${new Date(r.lastRunAt).toLocaleString(locale === "he" ? "he-IL" : locale, {
                      timeZone: "Asia/Jerusalem",
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "numeric",
                      month: "numeric",
                    })}`
                  : ""}
              </p>
              <p className="mt-1 leading-relaxed text-pretty">{locale === "en" ? r.noteEn : r.noteHe}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
