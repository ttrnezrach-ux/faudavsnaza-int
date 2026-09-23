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
import { OfficeVisuals, GoogleArrivalCharts, AnalyticsGoals, ClickDonut, FunnelLadder, DimensionCharts, DualHourChart } from "@/components/traffic-chart";
import { OfficeOverview } from "@/components/office-overview";
import { VersionStamp } from "@/components/version-stamp";
import { WeekScan } from "@/components/week-scan";
import { VersionsPanel } from "@/components/versions-panel";

export const Route = createFileRoute("/office")({
  component: OfficePage,
});

function workShort(id: string | undefined, t: (k: string) => string) {
  if (id === "fauda") return t("workFaudaShort");
  if (id === "naza") return t("workNazaShort");
  if (id === "compare") return t("workCompare");
  return id ?? "";
}

function tabShort(id: string | undefined, t: (k: string) => string) {
  if (id === "map" || id === "list") return t("navMap");
  if (id === "social") return t("navSocialShort");
  if (id === "algo") return t("navAlgo");
  if (id === "concl") return t("navConcl");
  if (id === "search") return t("tabSearch");
  if (id === "iso") return t("tabIso");
  if (id === "quotes") return t("tabQuotes");
  if (id === "regions") return t("tabRegions");
  return id ?? "";
}

function netName(id: string | undefined, t: (k: string) => string) {
  if (id === "whatsapp") return t("netWhatsapp");
  if (id === "facebook") return t("netFacebook");
  if (id === "x") return t("netX");
  if (id === "telegram") return t("netTelegram");
  if (id === "linkedin") return t("netLinkedin");
  if (id === "mail") return t("netMail");
  if (id === "tiktok") return t("netTiktok");
  if (id === "instagram") return t("netInstagram");
  if (id === "all") return t("socialAll");
  return id ?? "";
}

function clickLabel(target: string, locale: string, t: (k: string) => string): string {
  const parts = target.split(":");
  const kind = parts[0] ?? "";
  const rest = parts.slice(1).join(":");
  if (kind === "share") {
    const [step, detail] = parts.slice(1);
    if (step === "step" && detail === "open") return t("shareStepOpen");
    if (step === "work") return `${t("sharePickWork")} · ${workShort(detail, t)}`;
    if (step === "tab") return `${t("sharePickTab")} · ${tabShort(detail, t)}`;
    if (step === "copy") return detail ? `${t("shareCopy")} · ${tabShort(detail, t)}` : t("shareCopy");
    if (step === "native") return t("shareNative");
    if (step === "card") return t("sharePreview");
    if (detail) return `${netName(step, t)} · ${tabShort(detail, t)}`;
    return netName(step, t) || target;
  }
  if (kind === "tab") return tabShort(rest, t) || target;
  if (kind === "lang") {
    return LOCALE_META[rest as keyof typeof LOCALE_META]?.native ?? rest.toUpperCase();
  }
  if (kind === "country") {
    return `${flagEmoji(rest)} ${countryDisplayName(rest, locale)}`;
  }
  if (kind === "work") return workShort(rest, t) || rest;
  if (kind === "nav") {
    if (rest === "office") return t("office");
    if (rest === "map") return t("navMap");
    if (rest === "social") return t("navSocialShort");
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
  if (kind === "social-tab") {
    const [work, platform] = parts.slice(1);
    return `${workShort(work, t)} · ${netName(platform, t)}`;
  }
  if (kind === "social") {
    const [a, b] = parts.slice(1);
    if (a === "translate") return rest;
    if (a === "next") return t("socialNextCta");
    if (a === "open") return `${t("navSocialShort")} · ${workShort(b, t)}`;
    if (b) return `${workShort(a, t)} · ${netName(b, t)}`;
    return netName(a, t) || target;
  }
  if (kind === "comment") {
    const [a, b] = parts.slice(1);
    if (b) return `${workShort(a, t)} · ${netName(b, t)}`;
    return netName(a, t) || target;
  }
  if (kind === "concl" && rest === "open") return t("conclOpen");
  if (kind === "viz" && parts[1] === "platform") return `${t("navSocialShort")} · ${netName(parts[2], t)}`;
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
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setFailed(false);
    setLoading(true);
    void getOfficeStats({ data: { range } })
      .then(setStats)
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [range]);

  useEffect(() => {
    trackClick("nav:office");
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const hourlyTitle =
    range === "year"
      ? t("trafficHourlyYear")
      : range === "week"
        ? t("trafficHourlyWeek")
        : range === "month"
          ? t("trafficHourlyMonth")
          : t("trafficHourly");

  function deltaLabel(current?: number, prior?: number) {
    if (current == null || prior == null) return undefined;
    if (!prior) return current ? { text: t("kpiDeltaNew"), tone: "flat" as const } : { text: t("kpiDeltaFlat"), tone: "flat" as const };
    const pct = Math.round(((current - prior) / prior) * 100);
    if (pct === 0) return { text: t("kpiDeltaFlat"), tone: "flat" as const };
    const text = t("kpiDelta", { n: pct > 0 ? `+${pct}` : String(pct) });
    return { text, tone: pct > 0 ? ("up" as const) : ("down" as const) };
  }

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

      <main id="main" tabIndex={-1} aria-busy={loading} className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 outline-none sm:px-6">
        {failed ? <p className="text-sm text-muted-foreground">{t("noData")}</p> : null}
        {loading && !stats ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{t("officeLoading")}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
            <div className="h-56 animate-pulse rounded-2xl bg-muted" />
          </div>
        ) : null}

        {stats ? (
          <>
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label={t("officeTitle")}>
              <Kpi label={t("visitsAllTime")} value={stats.allTimeVisits} locale={locale} />
              <Kpi label={t("visitsUniqueAll")} value={stats.allTimeUnique} locale={locale} />
              <Kpi
                label={t("visitsPeriod")}
                value={stats.periodVisits}
                locale={locale}
                delta={deltaLabel(stats.periodVisits, stats.prior.visits)}
              />
              <Kpi
                label={t("visitsUniquePeriod")}
                value={stats.periodUnique}
                locale={locale}
                delta={deltaLabel(stats.periodUnique, stats.prior.unique)}
              />
            </section>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("visitsExplain")}</p>
            {stats.allTimeUnique > 0 ? (
              <p className="text-xs text-muted-foreground">
                {t("visitsPerUnique", {
                  n: (stats.allTimeVisits / stats.allTimeUnique).toLocaleString(locale, {
                    maximumFractionDigits: 1,
                  }),
                })}
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              {range === "year" ? t("lastYear") : range === "month" ? t("last30d") : range === "week" ? t("last7d") : t("last24h")}
              {loading ? ` · ${t("officeLoading")}` : ""}
            </p>

            <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
              <h2 className="font-display text-lg font-medium">{hourlyTitle}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("trafficHint")}</p>
              <DualHourChart points={stats.hourlyDual} />
            </section>

            <section className="space-y-4" aria-labelledby="behavior-heading">
              <div>
                <h2 id="behavior-heading" className="font-display text-xl font-medium">
                  {t("behaviorTitle")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("behaviorHint")}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <Kpi label={t("sessions")} value={stats.sessions} locale={locale} />
                <Kpi label={t("bounce")} value={stats.bounceRate} locale={locale} suffix="%" />
                <Kpi label={t("pagesPerSession")} value={stats.pagesPerSession} locale={locale} />
                <Kpi label={t("avgTime")} display={formatTime(stats.avgSeconds)} locale={locale} />
                <Kpi label={t("newUsers")} value={stats.newUsers} locale={locale} />
                <Kpi label={t("returning")} value={stats.returning} locale={locale} />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5 lg:col-span-2">
                  <h3 className="font-display text-lg font-medium">{t("funnelTitle")}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t("funnelHint")}</p>
                  <FunnelLadder
                    steps={[
                      { key: "funnelLand", n: stats.funnel.land },
                      { key: "funnelExplore", n: stats.funnel.explore },
                      { key: "funnelShare", n: stats.funnel.share },
                      { key: "funnelOffice", n: stats.funnel.office },
                    ]}
                  />
                </section>
                <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
                  <h3 className="font-display text-lg font-medium">{t("devicesTitle")}</h3>
                  <div className="mt-3">
                    <ClickDonut
                      centerLabel={t("sessions")}
                      slices={stats.devices.map((d) => ({ id: d.name, label: deviceLabel(d.name, t), count: d.count }))}
                    />
                  </div>
                </section>
                <section className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
                  <h3 className="font-display text-lg font-medium">{t("sourcesTitle")}</h3>
                  <div className="mt-3">
                    <ClickDonut
                      centerLabel={t("sessions")}
                      slices={stats.sources.map((d) => ({ id: d.name, label: sourceLabel(d.name, t), count: d.count }))}
                    />
                  </div>
                </section>
                <BarCard
                  title={t("pagesTitle")}
                  rows={stats.pages.map((d) => ({ name: pageLabel(d.name, t), count: d.count }))}
                  empty={t("noData")}
                  color="bg-mixed"
                  className="lg:col-span-2"
                />
              </div>
            </section>

            <OfficeOverview stats={stats} labelClick={(target) => clickLabel(target, locale, t)} />

            <DimensionCharts works={stats.works} tabs={stats.tabs} langs={stats.langs} />

            <OfficeVisuals
              countries={stats.countries}
              hourly={stats.hourlyDual}
              clickLeaders={stats.clickLeaders}
              recentClicks={stats.recentClicks}
              ipLeaders={stats.ipLeaders}
              labelClick={(target) => clickLabel(target, locale, t)}
              seriesTitle={hourlyTitle}
              hideHourly
            />

            <IpHitLog hits={stats.ipHits} labelPage={(name) => pageLabel(name, t)} />

            <AnalyticsGoals goals={stats.goals} sessions={stats.sessions} />

            <GoogleArrivalCharts data={stats.google} />
          </>
        ) : null}

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
  className,
}: {
  title: string;
  rows: NamedCount[];
  empty: string;
  color: string;
  className?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <section className={`rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5 ${className ?? ""}`}>
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
  delta,
}: {
  label: string;
  value?: number;
  locale: string;
  suffix?: string;
  display?: string;
  delta?: { text: string; tone: "up" | "down" | "flat" };
}) {
  return (
    <div className="rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-medium tabular-nums leading-tight">
        {display ?? (value == null ? "—" : `${value.toLocaleString(locale)}${suffix ?? ""}`)}
      </p>
      {delta ? (
        <p
          className={
            delta.tone === "up"
              ? "mt-1 text-xs text-positive"
              : delta.tone === "down"
                ? "mt-1 text-xs text-negative"
                : "mt-1 text-xs text-muted-foreground"
          }
        >
          {delta.text}
        </p>
      ) : null}
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
