import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Globe2,
  Hash,
  Link2,
  MapPin,
  MessageSquareText,
  Search,
  TrendingUp,
  Cpu,
  ScrollText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RankSpark } from "@/components/rank-spark";
import { SentimentBar } from "@/components/sentiment-bar";
import { WorldMap, type MapMode } from "@/components/world-map";
import { CountrySearch } from "@/components/country-search";
import { IsoTable } from "@/components/iso-table";
import { ArticleLede } from "@/components/article-lede";
import { ShareTabs } from "@/components/share-tabs";
import { SocialFeed } from "@/components/social-feed";
import { SocialMark } from "@/components/social-mark";
import { GlobalCompare } from "@/components/global-compare";
import { StreamingTools } from "@/components/streaming-tools";
import { RankTrend } from "@/components/rank-trend";
import { DualCompare } from "@/components/dual-compare";
import { AlgoLens } from "@/components/algo-lens";
import { Conclusions } from "@/components/conclusions";
import { PointsGraph } from "@/components/points-graph";
import { WorkThumb } from "@/components/work-still";
import { NazaScreenings } from "@/components/naza-screenings";
import { UniqueIpCounter } from "@/components/unique-ip-counter";
import { ContactBox } from "@/components/contact-box";
import { ChangeBanner } from "@/components/change-banner";
import { useI18n } from "@/lib/i18n";
import { useWork } from "@/lib/work";
import { countryDisplayName, flagEmoji } from "@/lib/geo";
import { screeningFromHover } from "@/lib/naza-screenings";
import { trackClick } from "@/lib/track";
import { isContentTab, type ContentTab } from "@/lib/share";
import {
  inTop10,
  isTalkOnly,
  latestRank,
  peakRank,
  regionStats,
  type Country,
  type Region,
  type Tone,
} from "@/lib/data";
import { isoOf, formatIsoLine } from "@/lib/iso";
import { SOURCE_HREF } from "@/lib/seo";
import { FAUDA_WEEK, FAUDA_WEEK_LATEST } from "@/lib/live";
import { cn } from "@/lib/utils";

const TONE_BADGE: Record<Tone, "positive" | "mixed" | "critical"> = {
  positive: "positive",
  mixed: "mixed",
  critical: "critical",
};

function formatRank(n: number | null): string {
  return n == null ? "—" : String(n);
}

function Kpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-medium tabular-nums leading-tight tracking-tight text-foreground">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-subtle">{hint}</p> : null}
    </div>
  );
}

function QuoteBlock({
  text,
  by,
  source,
  tone,
}: {
  text: string;
  by: string;
  source: string;
  tone: "positive" | "critical" | "emotional";
}) {
  const { t } = useI18n();
  return (
    <figure className="rounded-lg bg-muted px-3.5 py-3">
      <blockquote className="text-sm leading-relaxed text-pretty text-foreground">
        {text}
      </blockquote>
      <figcaption className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        <span>{by}</span>
        <span className="text-subtle">·</span>
        {SOURCE_HREF[source] ? (
          <a
            href={SOURCE_HREF[source]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline-offset-4 hover:underline"
          >
            {source}
          </a>
        ) : (
          <span>{source}</span>
        )}
        {tone === "critical" ? (
          <Badge variant="critical">{t("quoteCritical")}</Badge>
        ) : tone === "positive" ? (
          <Badge variant="positive">{t("quotePositive")}</Badge>
        ) : (
          <Badge variant="mixed">{t("quoteEmotional")}</Badge>
        )}
      </figcaption>
    </figure>
  );
}

function CountryDetail({
  country,
  onBack,
  days,
}: {
  country: Country;
  onBack: () => void;
  days: string[];
}) {
  const { t, locale, dir } = useI18n();
  const { work } = useWork();
  const peak = peakRank(country);
  const latest = latestRank(country);
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;
  const toneKey =
    country.sentiment === "positive" ? "tonePositive" : country.sentiment === "mixed" ? "toneMixed" : "toneCritical";
  const regionKey =
    country.region === "me" ? "regionMe" : country.region === "eu" ? "regionEu" : country.region === "am" ? "regionAm" : "regionAa";
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-start gap-2 px-4 pt-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="mt-0.5 h-11 shrink-0">
          <BackIcon className="size-4" />
          {t("allCountries")}
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-medium tracking-tight">
              <span className="me-2" aria-hidden="true">{flagEmoji(country.id)}</span>
              {countryDisplayName(country.id, locale)}
            </h2>
            <Badge variant={TONE_BADGE[country.sentiment]}>{t(toneKey)}</Badge>
            {isTalkOnly(country) ? <Badge variant="mixed">{t("talkOnly")}</Badge> : null}
            <Badge variant={country.confidence === "documented" ? "positive" : "mixed"}>
              {country.confidence === "documented" ? t("documented") : t("estimated")}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {country.nameEn} · {formatIsoLine(country.id)} · {t(regionKey)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 px-4 sm:grid-cols-4">
        <div className="rounded-lg bg-muted px-3 py-2">
          <p className="text-xs text-muted-foreground">{t("peak")}</p>
          <p className="font-display text-lg tabular-nums">{isTalkOnly(country) ? "—" : formatRank(peak)}</p>
        </div>
        <div className="rounded-lg bg-muted px-3 py-2">
          <p className="text-xs text-muted-foreground">{t("now")}</p>
          <p className="font-display text-lg tabular-nums">{isTalkOnly(country) ? "—" : formatRank(latest)}</p>
        </div>
        <div className="rounded-lg bg-muted px-3 py-2">
          <p className="text-xs text-muted-foreground">חיובי</p>
          <p className="font-display text-lg tabular-nums text-positive">{country.positive}%</p>
        </div>
        <div className="rounded-lg bg-muted px-3 py-2">
          <p className="text-xs text-muted-foreground">{t("socialScore")}</p>
          <div className="mt-0.5">
            <SocialMark country={country} size="md" />
          </div>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{t("socialScoreHint")}</p>
        </div>
      </div>

      <div className="mt-4 px-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>מגמת דירוג · {days[0]}–{days[days.length - 1]}</span>
          <span>1 = גבוה</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <RankSpark country={country} days={days} />
          <div className="flex gap-1">
            {country.ranks.map((r, i) => (
              <span
                key={days[i] ?? i}
                className="flex size-7 items-center justify-center rounded-md bg-muted text-[11px] tabular-nums text-foreground"
                title={days[i]}
              >
                {formatRank(r)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 px-4">
        <SentimentBar country={country} className="h-2" />
        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
          <span>חיובי {country.positive}%</span>
          <span>מעורב {country.mixed}%</span>
          <span>ביקורתי {country.negative}%</span>
        </div>
      </div>

      {isTalkOnly(country) ? (
        <p className="mt-4 px-4 text-sm leading-relaxed text-pretty text-muted-foreground">{t(work.presence === "discourse" ? "nazaNoRankHint" : "noRankHint")}</p>
      ) : null}

      {country.note ? (
        <p className="mt-4 px-4 text-sm leading-relaxed text-pretty text-muted-foreground">
          {country.note}
        </p>
      ) : null}

      <div className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-5">
        {(country.quotes ?? []).length === 0 ? (
          <p className="text-xs text-subtle">אין ציטוט מתועד למדינה זו — הטון הוא הערכה לפי אזור ודיווחים.</p>
        ) : (
          country.quotes!.map((q) => (
            <QuoteBlock key={q.text} {...q} />
          ))
        )}
      </div>
    </div>
  );
}

export function Dashboard() {
  const { t, locale } = useI18n();
  const { view: workView, setView: setWorkView, work, allQuotes: workQuotes } = useWork();
  const countries = work.countries;
  const GLOBAL = work.global;
  const SNAPSHOT = work.snapshot;
  const [mode, setMode] = useState<MapMode>("rank");
  const [query, setQuery] = useState("");
  const [tone, setTone] = useState<Tone | "all">("all");
  const [region, setRegion] = useState<Region | "all">("all");
  const [coverage, setCoverage] = useState<"all" | "viewing" | "talk">("all");
  const [selectedId, setSelectedId] = useState<string | null>(work.defaultCountry);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number; id: string } | null>(null);
  const [tab, setTab] = useState<"list" | "search" | "iso" | "quotes" | "regions">("list");
  const [view, setView] = useState<"map" | "social" | "share" | "algo" | "concl">("map");
  const [shareTab, setShareTab] = useState<ContentTab>("map");

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("tab");
    if (isContentTab(fromUrl)) {
      setView(fromUrl);
      setShareTab(fromUrl);
    }
  }, []);

  function writeTabParam(next: ContentTab) {
    const url = new URL(window.location.href);
    if (next === "map") url.searchParams.delete("tab");
    else url.searchParams.set("tab", next);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function goView(next: "map" | "social" | "share" | "algo" | "concl") {
    setView(next);
    trackClick(`nav:${next}`);
    if (isContentTab(next)) {
      setShareTab(next);
      writeTabParam(next);
    }
  }

  useEffect(() => {
    setSelectedId(work.defaultCountry);
    setQuery("");
  }, [work.id, work.defaultCountry]);

  const toneLabel = (x: Tone) =>
    t(x === "positive" ? "tonePositive" : x === "mixed" ? "toneMixed" : "toneCritical");
  const regionLabel = (x: Region) =>
    t(x === "me" ? "regionMe" : x === "eu" ? "regionEu" : x === "am" ? "regionAm" : "regionAa");


  const filtered = useMemo(() => {
    const q = query.trim();
    return countries
      .filter((c) => {
        if (tone !== "all" && c.sentiment !== tone) return false;
        if (region !== "all" && c.region !== region) return false;
        if (coverage === "viewing" && isTalkOnly(c)) return false;
        if (coverage === "talk" && !isTalkOnly(c)) return false;
        if (!q) return true;
        const iso = isoOf(c.id);
        const needle = q.toLowerCase();
        return (
          c.nameHe.includes(q) ||
          c.nameEn.toLowerCase().includes(needle) ||
          iso.alpha2.toLowerCase().includes(needle) ||
          iso.alpha3.toLowerCase().includes(needle) ||
          iso.numeric.includes(q) ||
          iso.numeric.replace(/^0+/, "") === q.replace(/^0+/, "")
        );
      })
      .sort((a, b) => {
        const ta = isTalkOnly(a) ? 1 : 0;
        const tb = isTalkOnly(b) ? 1 : 0;
        if (ta !== tb) return ta - tb;
        const pa = peakRank(a) ?? 99;
        const pb = peakRank(b) ?? 99;
        if (pa !== pb) return pa - pb;
        return b.positive - a.positive;
      });
  }, [query, tone, region, coverage]);

  const selected = selectedId ? countries.find((c) => c.id === selectedId) ?? null : null;
  const screeningHover = screeningFromHover(hoveredId);
  const hovered = screeningHover
    ? countries.find((c) => c.id === screeningHover.country) ?? selected
    : hoveredId
      ? countries.find((c) => c.id === hoveredId)
      : selected;
  const quotes = useMemo(() => workQuotes, [workQuotes]);
  const regions = useMemo(() => regionStats(countries), [countries]);
  const watchingCount = countries.filter(inTop10).length;
  const talkCount = countries.filter(isTalkOnly).length;

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex min-h-12 flex-wrap rounded-lg bg-muted p-0.5" role="radiogroup" aria-label={t("workSwitcher")}>
              {(
                [
                  ["fauda", "workFaudaShort"],
                  ["naza", "workNazaShort"],
                  ["compare", "workCompare"],
                ] as const
              ).map(([id, key]) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={workView === id}
                  onClick={() => {
                    setWorkView(id);
                    trackClick(`work:${id}`);
                    goView("map");
                  }}
                  className={cn(
                    "inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    workView === id ? "bg-card text-foreground shadow-[var(--shadow-border)]" : "text-muted-foreground",
                  )}
                >
                  <WorkThumb id={id} />
                  {t(key)}
                </button>
              ))}
            </div>
            <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground">
              {workView === "naza" ? t("nazaKicker") : workView === "compare" ? t("compareKicker") : t("kicker")}
            </p>
            <h1 className="mt-1 font-display text-2xl font-medium tracking-tight text-balance sm:text-4xl">
              {workView === "naza" ? t("nazaTitle") : workView === "compare" ? t("compareTitleMain") : t("title")}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted-foreground">
              {workView === "naza" ? t("nazaSubtitle") : workView === "compare" ? t("compareSubtitle") : t("subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <div className="inline-flex min-h-12 rounded-lg bg-muted p-0.5" role="radiogroup" aria-label={t("rankMode")}>
              <button
                type="button"
                role="radio"
                aria-checked={mode === "rank"}
                onClick={() => {
                  setMode("rank");
                  trackClick("mode:rank");
                }}
                className={cn(
                  "h-11 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  mode === "rank" ? "bg-card text-foreground shadow-[var(--shadow-border)]" : "text-muted-foreground",
                )}
              >
                {t(work.presence === "discourse" ? "nazaRankMode" : "rankMode")}
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={mode === "tone"}
                onClick={() => {
                  setMode("tone");
                  trackClick("mode:tone");
                }}
                className={cn(
                  "h-11 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  mode === "tone" ? "bg-card text-foreground shadow-[var(--shadow-border)]" : "text-muted-foreground",
                )}
              >
                {t("toneMode")}
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={mode === "social"}
                onClick={() => {
                  setMode("social");
                  trackClick("mode:social");
                }}
                className={cn(
                  "h-11 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  mode === "social" ? "bg-card text-foreground shadow-[var(--shadow-border)]" : "text-muted-foreground",
                )}
              >
                {t("socialMode")}
              </button>
            </div>
            <span className="text-xs text-muted-foreground">{SNAPSHOT}</span>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="outline-none">
      {view === "social" ? (
        <section
          id="social"
          className="mx-auto w-full max-w-7xl px-4 pb-28 sm:px-6"
          aria-label={t("tabSocial")}
        >
          <div className="flex min-h-[520px] flex-col overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-border)]">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <h2 className="flex items-center gap-2 font-display text-lg font-medium tracking-tight">
                <TrendingUp className="size-5 shrink-0" aria-hidden="true" />
                {t("tabSocial")}
              </h2>
              <p className="text-xs text-muted-foreground">{t("moodTitle")}</p>
            </div>
            <SocialFeed />
          </div>
        </section>
      ) : null}

      {view === "share" ? (
        <div className="mx-auto w-full max-w-7xl space-y-4 px-4 pb-28 sm:px-6">
          <ShareTabs
            tab={shareTab}
            onTabChange={(next) => {
              setShareTab(next);
              writeTabParam(next);
            }}
          />
        </div>
      ) : null}

      {view === "map" && workView === "compare" ? (
        <>
          <DualCompare
            onSelect={(id) => setSelectedId(id)}
            onOpenAlgo={() => {
              goView("algo");
            }}
            onOpenConclusions={() => {
              goView("concl");
            }}
          />
          <div className="mx-auto w-full max-w-7xl px-4 pb-28 sm:px-6">
            <StreamingTools />
          </div>
        </>
      ) : null}

      {view === "algo" ? <AlgoLens /> : null}
      {view === "concl" ? <Conclusions /> : null}

      {view === "map" && workView !== "compare" ? (
      <>
      <ArticleLede />
      {workView === "fauda" ? (
        <section className="mx-auto w-full max-w-7xl px-4 pb-4 sm:px-6" aria-label={t("netflixWeeksLabel")}>
          <p className="mb-2 text-xs font-medium tracking-[0.14em] text-muted-foreground">{t("netflixWeeksLabel")}</p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Kpi
              label={t("week2Views")}
              value={`${FAUDA_WEEK_LATEST.viewsM}M`}
              hint={`${t("week2Dates")} · ${t("week2Rank", { n: FAUDA_WEEK_LATEST.nonEnglishTv })}`}
            />
            <Kpi
              label={t("week2Hours")}
              value={`${FAUDA_WEEK_LATEST.hoursM}M`}
              hint={t("week2Countries", { n: FAUDA_WEEK_LATEST.top10Countries })}
            />
            <Kpi
              label={t("week1Views")}
              value={`${FAUDA_WEEK.viewsM}M`}
              hint={`${t("week1Dates")} · ${t("week1Rank", { n: FAUDA_WEEK.nonEnglishTv })}`}
            />
            <Kpi
              label={t("week1Hours")}
              value={`${FAUDA_WEEK.hoursM}M`}
              hint={t("week1Runtime", { runtime: FAUDA_WEEK.runtime })}
            />
          </div>
        </section>
      ) : null}
      <div className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 grid-cols-1 gap-4 px-4 pt-1 pb-4 sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
        <section
          id="map"
          className="flex scroll-mt-4 flex-col overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-border)] lg:min-h-[560px]"
          aria-label={
            mode === "rank"
              ? work.presence === "discourse"
                ? "מפת עולם לפי שיא עוצמת שיח. בחירת מדינה זמינה ברשימת המדינות"
                : "מפת עולם לפי שיא דירוג נטפליקס. בחירת מדינה זמינה ברשימת המדינות"
              : mode === "tone"
                ? "מפת עולם לפי טון השיח. בחירת מדינה זמינה ברשימת המדינות"
                : "מפת עולם לפי ניקוד רשתות. נקודות מסמנות מדינות עם פוסט מתועד"
          }
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe2 className="size-4" />
              {mode === "rank"
                ? work.presence === "discourse"
                  ? t("nazaMapRank")
                  : t("mapRank")
                : mode === "tone"
                  ? t("mapTone")
                  : t("mapSocial")}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              {mode === "rank" ? (
                <>
                  <span className="flex items-center gap-1.5">
                    <i className="size-2.5 rounded-sm bg-land" /> {t("notTop10")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="size-2.5 rounded-sm bg-mixed" /> {t("mapTalk")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="size-2.5 rounded-sm bg-heat" /> {t("peak")} 1
                  </span>
                  {workView === "naza" ? (
                    <>
                      <span className="flex items-center gap-1.5">
                        <i className="size-2 rotate-45 bg-heat" /> {t("nazaScreenNow")}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <i className="size-2 rotate-45 bg-mixed" /> {t("nazaScreenSoon")}
                      </span>
                    </>
                  ) : null}
                </>
              ) : mode === "tone" ? (
                <>
                  <span className="flex items-center gap-1.5">
                    <i className="size-2.5 rounded-sm bg-negative" /> ביקורתי
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="size-2.5 rounded-sm bg-positive" /> חיובי
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5">
                    <i className="size-2.5 rounded-sm bg-land" /> {t("socialScore")} 0
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="size-2.5 rounded-sm bg-heat" /> {t("socialScore")} 100
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="size-2 rounded-full bg-foreground" /> {t("mapSocialDot")}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="relative w-full">
            <WorldMap
              mode={mode}
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id);
                setTab("list");
                goView("map");
              }}
              hoveredId={hoveredId}
              onHover={(id, x, y) => {
                setHoveredId(id);
                if (id && x != null && y != null) setTip({ id, x, y });
                else setTip(null);
              }}
            />
            {tip && hovered ? (
              <div
                role="tooltip"
                className="pointer-events-none fixed z-40 w-60 rounded-lg bg-card px-3 py-2 text-sm shadow-[var(--shadow-border-hover)]"
                style={{
                  top: Math.min(tip.y + 16, typeof window !== "undefined" ? window.innerHeight - 90 : tip.y),
                  left: Math.min(
                    Math.max(12, tip.x - 110),
                    typeof window !== "undefined" ? window.innerWidth - 236 : tip.x,
                  ),
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">
                    <span className="me-1" aria-hidden="true">{flagEmoji(hovered.id)}</span>
                    {countryDisplayName(hovered.id, locale)}
                  </span>
                  <Badge variant={TONE_BADGE[hovered.sentiment]}>{toneLabel(hovered.sentiment)}</Badge>
                </div>
                <p className="mt-1 text-xs tabular-nums tracking-wide text-muted-foreground">
                  {isoOf(hovered.id).alpha2} · {isoOf(hovered.id).alpha3} · {isoOf(hovered.id).numeric}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t("peak")} #{formatRank(peakRank(hovered))} · {t("now")} #{formatRank(latestRank(hovered))}
                </p>
                {screeningHover ? (
                  <p className="mt-1 text-xs leading-snug text-foreground">
                    {(locale === "he" ? screeningHover.cityHe : screeningHover.cityEn) +
                      " · " +
                      (locale === "he" ? screeningHover.whenHe : screeningHover.whenEn)}
                  </p>
                ) : null}
                <p className="mt-1">
                  <SocialMark country={hovered} />
                </p>
                <SentimentBar country={hovered} className="mt-2" />
              </div>
            ) : null}
          </div>
          {hovered ? (
            <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5 text-sm">
              <span className="flex items-center gap-2">
                <MapPin className="size-3.5 text-muted-foreground" />
                <span aria-hidden="true">{flagEmoji(hovered.id)}</span>
                {countryDisplayName(hovered.id, locale)}
              </span>
              <span className="tabular-nums text-muted-foreground">
                {inTop10(hovered) ? `${t("peak")} #${peakRank(hovered)}` : t("notTop10")}
              </span>
            </div>
          ) : null}
        </section>

        <aside className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-border)] lg:min-h-[560px]">
          <div className="flex flex-wrap gap-x-0.5 border-b border-border px-2 pt-2" role="tablist" aria-label={t("tabCountries")}>
            {(
              [
                ["list", "tabCountries", TrendingUp],
                ["search", "tabSearch", Search],
                ["quotes", "tabQuotes", MessageSquareText],
                ["iso", "tabIso", Hash],
                ["regions", "tabRegions", Globe2],
              ] as const
            ).map(([id, labelKey, Icon]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => {
                  setTab(id);
                  trackClick(`tab:${id}`);
                }}
                className={cn(
                  "flex h-11 min-w-0 shrink-0 items-center gap-1 px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  tab === id
                    ? "border-b-2 border-foreground text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" />
                {t(labelKey)}
              </button>
            ))}
          </div>

          {tab === "list" && selected ? (
            <CountryDetail country={selected} onBack={() => setSelectedId(null)} days={work.days} />
          ) : null}

          {tab === "list" && !selected ? (
            <>
              <div className="space-y-2 px-3 py-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 end-3 size-4 -translate-y-1/2 text-subtle" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("filterList")}
                    className="pr-10"
                    aria-label={t("filterList")}
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(["all", "positive", "mixed", "critical"] as const).map((toneOpt) => (
                    <button
                      key={toneOpt}
                      type="button"
                      aria-pressed={tone === toneOpt}
                      onClick={() => {
                        setTone(toneOpt);
                        trackClick(`tone:${toneOpt}`);
                      }}
                      className={cn(
                        "h-11 rounded-full px-3 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        tone === toneOpt ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {toneOpt === "all" ? t("allTones") : toneLabel(toneOpt)}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(["all", "me", "eu", "am", "aa"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      aria-pressed={region === r}
                      onClick={() => {
                        setRegion(r);
                        trackClick(`region:${r}`);
                      }}
                      className={cn(
                        "h-11 rounded-full px-3 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        region === r ? "bg-secondary text-foreground" : "bg-transparent text-muted-foreground shadow-[var(--shadow-border)]",
                      )}
                    >
                      {r === "all" ? t("allRegions") : regionLabel(r)}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(["all", "viewing", "talk"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={coverage === opt}
                      onClick={() => {
                        setCoverage(opt);
                        trackClick(`coverage:${opt}`);
                      }}
                      className={cn(
                        "h-11 rounded-full px-3 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        coverage === opt ? "bg-secondary text-foreground" : "bg-transparent text-muted-foreground shadow-[var(--shadow-border)]",
                      )}
                    >
                      {opt === "all" ? t("allCoverage") : opt === "viewing" ? t("viewingOnly") : t("talkOnly")}
                    </button>
                  ))}
                </div>
              </div>
              <Separator />
              <ul className="min-h-0 flex-1 overflow-y-auto">
                {filtered.map((c) => {
                  const peak = peakRank(c);
                  const active = c.id === hoveredId;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        aria-label={`${countryDisplayName(c.id, locale)}, ${c.id}, ${isTalkOnly(c) ? t("talkOnly") : `${t("peak")} ${formatRank(peak)}`}, ${toneLabel(c.sentiment)}`}
                        onMouseEnter={() => setHoveredId(c.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onFocus={() => setHoveredId(c.id)}
                        onClick={() => {
                          setSelectedId(c.id);
                          trackClick(`country:${c.id.toLowerCase()}`);
                        }}
                        className={cn(
                          "flex min-h-11 w-full items-center gap-3 px-3 py-2.5 text-right transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          active ? "bg-muted" : "hover:bg-muted/70",
                        )}
                      >
                        <span className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md bg-muted px-1 font-display text-[10px] tabular-nums">
                          {isTalkOnly(c) ? t("talkShort") : formatRank(peak)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate font-medium">
                              <span className="me-1.5" aria-hidden="true">{flagEmoji(c.id)}</span>
                              {countryDisplayName(c.id, locale)}
                              <span className="ms-2 font-normal tabular-nums tracking-wide text-muted-foreground">
                                {c.id}
                              </span>
                            </span>
                            <span className="flex items-center gap-2">
                              <SocialMark country={c} />
                              <Badge variant={TONE_BADGE[c.sentiment]}>{toneLabel(c.sentiment)}</Badge>
                            </span>
                          </span>
                          <SentimentBar country={c} className="mt-1.5" />
                        </span>
                      </button>
                    </li>
                  );
                })}
                {filtered.length === 0 ? (
                  <li className="px-4 py-8 text-center text-sm text-muted-foreground">{t("noCountries")}</li>
                ) : null}
              </ul>
            </>
          ) : null}

          {tab === "search" ? (
            <CountrySearch
              onSelect={(id) => {
                setSelectedId(id);
                setTab("list");
              }}
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ) : null}

          {tab === "iso" ? (
            <IsoTable
              onSelect={(id) => {
                setSelectedId(id);
                setTab("list");
              }}
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ) : null}

          {tab === "quotes" ? (
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3">
              {quotes.map((q) => (
                <button
                  key={q.text}
                  type="button"
                  className="block min-h-11 w-full text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={q.country ? `ציטוט מ${q.country.nameHe}` : "ציטוט"}
                  onClick={() => {
                    if (!q.country) return;
                    setSelectedId(q.country.id);
                    setTab("list");
                  }}
                >
                  <QuoteBlock {...q} />
                </button>
              ))}
            </div>
          ) : null}

          {tab === "regions" ? (
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {regions.map((r) => (
                <div key={r.region}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-sm font-medium">{regionLabel(r.region)}</h3>
                    <p className="text-xs text-muted-foreground">
                      {r.watching} · {r.total}
                    </p>
                  </div>
                  <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-muted">
                    <span className="bg-positive" style={{ width: `${r.positive}%` }} />
                    <span className="bg-mixed" style={{ width: `${r.mixed}%` }} />
                    <span className="bg-negative" style={{ width: `${r.negative}%` }} />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[11px] tabular-nums text-muted-foreground">
                    <span>{r.positive}% {t("tonePositive")}</span>
                    <span>{r.mixed}% {t("toneMixed")}</span>
                    <span>{r.negative}% {t("toneCritical")}</span>
                  </div>
                </div>
              ))}
              <p className="text-xs leading-relaxed text-subtle">
                ממוצע פשוט על המדינות במדגם — לא משוקלל לפי אוכלוסייה או שעות צפייה.
              </p>
            </div>
          ) : null}
        </aside>
      </div>
      </>
      ) : null}

      {view === "map" && workView !== "compare" ? (
        <>
          <section className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-3 px-4 py-4 sm:grid-cols-3 lg:grid-cols-5 sm:px-6" aria-label="מדדי צפייה עולמיים">
            <Kpi
              label={t(work.presence === "discourse" ? "kpiFestival" : "kpiWorld")}
              value={work.presence === "discourse" ? t("venicePrize") : `#${GLOBAL.latest}`}
              hint={work.presence === "discourse" ? t("veniceOvation") : `${t("peak")} #${GLOBAL.peak}`}
            />
            <Kpi
              label={t(work.presence === "discourse" ? "kpiDiscourse" : "kpiTop10")}
              value={String(work.presence === "discourse" ? watchingCount : GLOBAL.top10Countries)}
              hint={`${watchingCount}`}
            />
            <Kpi label={t("kpiTalk")} value={String(talkCount)} hint={t("talkOnly")} />
            <Kpi label={t("kpiFirst")} value={t(work.presence === "discourse" ? "nazaFirstPlaces" : "firstPlaces")} />
            <Kpi
              label={t(work.presence === "discourse" ? "kpiCritics" : "kpiPoints")}
              value={String(GLOBAL.points)}
              hint={SNAPSHOT}
            />
          </section>
          <p className="mx-auto max-w-7xl px-4 pb-2 text-xs text-muted-foreground sm:px-6">
            {t("coverageLine", { n: countries.length, top: GLOBAL.top10Countries, talk: talkCount })}
            {" · "}
            {t(work.presence === "discourse" ? "nazaLiveUpdated" : "liveUpdated")}
            {workView === "fauda" ? ` · ${t("netflixSourceNote")}` : ""}
          </p>
          {workView === "fauda" ? <PointsGraph /> : null}
          {workView === "naza" ? (
            <NazaScreenings
              onPickCountry={(id) => {
                setSelectedId(id);
                setTab("list");
                goView("map");
              }}
            />
          ) : null}
          <RankTrend />
          <GlobalCompare />
          {workView === "fauda" ? (
            <div className="mx-auto w-full max-w-7xl px-4 pb-4 sm:px-6">
              <StreamingTools />
            </div>
          ) : null}
        </>
      ) : null}

      <nav
        aria-label={t("navMain")}
        className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="pointer-events-auto flex max-w-[calc(100%-1.5rem)] items-center gap-0.5 rounded-full bg-card/95 px-1 py-1 shadow-[var(--shadow-border-hover)] backdrop-blur-sm">
          {(
            [
              ["map", "navMap", Globe2],
              ["social", "navSocialShort", TrendingUp],
              ["algo", "navAlgo", Cpu],
              ["concl", "navConcl", ScrollText],
              ["share", "navShare", Link2],
            ] as const
          ).map(([id, labelKey, Icon]) => (
            <button
              key={id}
              type="button"
              aria-current={view === id ? "page" : undefined}
              aria-label={id === "social" ? t("tabSocial") : id === "algo" ? t("tabAlgo") : id === "concl" ? t("tabConcl") : t(labelKey)}
              onClick={() => {
                goView(id);
              }}
              className={cn(
                "flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-1.5 py-1.5 text-center text-xs font-medium leading-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-none sm:min-w-20 sm:flex-row sm:gap-1 sm:px-3 sm:text-sm",
                view === id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="min-w-0 whitespace-normal text-balance">{t(labelKey)}</span>
            </button>
          ))}
        </div>
      </nav>
      </main>

      <footer className="border-t border-border pb-24">
        <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6">
          <ChangeBanner />
          <div className="rounded-2xl bg-card px-4 py-5 shadow-[var(--shadow-border)] sm:px-5">
            <div id="disclaimer" className="scroll-mt-4 text-sm leading-relaxed text-pretty text-muted-foreground">
              <p className="font-medium text-foreground">{t("disclaimer")}</p>
              <p className="mt-2">
                {workView === "naza"
                  ? t("nazaDisclaimer")
                  : workView === "compare"
                    ? t("compareDisclaimer")
                    : t("faudaDisclaimer")}
              </p>
              <p className="mt-3">
                <Link
                  to="/accessibility"
                  className="text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {t("accessibility")}
                </Link>
              </p>
            </div>
          </div>
          <ContactBox />
          <UniqueIpCounter />
        </div>
      </footer>
    </div>
  );
}
