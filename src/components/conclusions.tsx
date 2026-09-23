import { useEffect, useState } from "react";
import { ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SentimentBar } from "@/components/sentiment-bar";
import { WorkStill } from "@/components/work-still";
import { InsightBoard } from "@/components/insight-board";
import { StreamingTools } from "@/components/streaming-tools";
import { useI18n } from "@/lib/i18n";
import { useWork } from "@/lib/work";
import { peakRank, type Country } from "@/lib/data";
import { countryDisplayName, flagEmoji } from "@/lib/geo";
import { cn } from "@/lib/utils";
import { worldAccum, liveFromFauda, weekRangeLabel } from "@/lib/insights";
import { HashtagRow } from "@/components/hashtag-row";
import { PointsGraph } from "@/components/points-graph";
import { formatReleaseVersion } from "@/lib/release";
import { BUNDLED_FINDINGS, getVersionBoard, type SiteFinding } from "@/lib/versions";

const FOCUS = ["IL", "LB", "QA", "IR", "IT"] as const;

function sentCounts(countries: Country[]) {
  const positive = countries.filter((c) => c.sentiment === "positive").length;
  const mixed = countries.filter((c) => c.sentiment === "mixed").length;
  const critical = countries.filter((c) => c.sentiment === "critical").length;
  const documented = countries.filter((c) => c.confidence === "documented").length;
  const n = countries.length || 1;
  return {
    n: countries.length,
    positive,
    mixed,
    critical,
    documented,
    meanPos: Math.round(countries.reduce((s, c) => s + c.positive, 0) / n),
    meanNeg: Math.round(countries.reduce((s, c) => s + c.negative, 0) / n),
  };
}

function daysAtFirst(c: Country) {
  return c.ranks.filter((r) => r === 1).length;
}

function CountBar({
  positive,
  mixed,
  critical,
}: {
  positive: number;
  mixed: number;
  critical: number;
}) {
  const t = positive + mixed + critical || 1;
  return (
    <div
      className="flex h-2 w-full overflow-hidden rounded-full bg-muted"
      role="img"
      aria-label={`${positive} / ${mixed} / ${critical}`}
    >
      <span className="h-full bg-positive" style={{ width: `${(positive / t) * 100}%` }} />
      <span className="h-full bg-mixed" style={{ width: `${(mixed / t) * 100}%` }} />
      <span className="h-full bg-negative" style={{ width: `${(critical / t) * 100}%` }} />
    </div>
  );
}

function WorkToneCard({
  id,
  title,
  body,
  countries,
  postsN,
  support,
  mixed,
  critical,
}: {
  id: "fauda" | "naza";
  title: string;
  body: string;
  countries: Country[];
  postsN: number;
  support: number;
  mixed: number;
  critical: number;
}) {
  const { t } = useI18n();
  const s = sentCounts(countries);
  return (
    <article className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-border)]">
      <WorkStill
        id={id}
        alt={t(id === "fauda" ? "stillFaudaAlt" : "stillNazaAlt")}
        className={cn("aspect-[2.4/1]", id === "fauda" ? "object-right" : "object-center")}
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
      <div className="px-4 py-4 sm:px-5">
        <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">
          {t(id === "fauda" ? "workFaudaShort" : "workNazaShort")}
        </p>
        <h3 className="mt-1 font-display text-lg font-medium tracking-tight">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-pretty">{body}</p>
        <div className="mt-4 space-y-2">
          <CountBar positive={s.positive} mixed={s.mixed} critical={s.critical} />
          <p className="text-xs text-muted-foreground">
            {t("conclCountries", { pos: s.positive, mix: s.mixed, crit: s.critical })}
          </p>
          <p className="text-xs tabular-nums text-muted-foreground">
            {t("conclMean", { p: s.meanPos, n: s.meanNeg })}
            {" · "}
            {t("conclDoc", { n: s.documented, total: s.n })}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("conclSampleLine", { posts: postsN, support, mixed, critical })}
          </p>
        </div>
      </div>
    </article>
  );
}

function WorldAccumCard() {
  const { t, locale } = useI18n();
  const { fauda } = useWork();
  const w = worldAccum(liveFromFauda(fauda.countries, fauda.days, fauda.snapshot, fauda.global));
  const [findings, setFindings] = useState<SiteFinding[]>(BUNDLED_FINDINGS);

  useEffect(() => {
    void getVersionBoard()
      .then((board) => setFindings(board.findings))
      .catch(() => {});
  }, []);

  return (
    <article className="rounded-2xl bg-card px-4 py-5 shadow-[var(--shadow-border)] sm:px-5">
      <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">{t("conclWorldKicker")}</p>
      <h3 className="mt-1 font-display text-xl font-medium tracking-tight">{t("conclWorldTitle")}</h3>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-pretty">
        {t("conclWorldLead", { ever: w.ever, peak: w.worldwidePeak, latest: w.worldwideLatest })}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {w.weeks.map((week) => (
          <div key={week.id} className="rounded-xl bg-muted px-3 py-3">
            <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground">
              {t("conclWeekN", { n: week.id, range: weekRangeLabel(week.days) })}
            </p>
            <p className="mt-2 font-display text-2xl tabular-nums">
              {week.id === 1 ? `#${w.worldwidePeak}` : `#${week.id === w.weeks[w.weeks.length - 1]?.id ? w.worldwideLatest : week.top10Last}`}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-pretty">
              {t("conclWeekStats", {
                peakN: week.top10Peak,
                peakDay: week.peakDay,
                end: week.top10Last,
              })}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-pretty text-muted-foreground">
        {t("conclWorldKeep", { ever: w.ever, first: w.firstPlaces })}
      </p>
      <div className="mt-5 border-t border-border/70 pt-4">
        <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground">{t("conclFindingKicker")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("conclFindingHint")}</p>
        <ol className="mt-3 space-y-3">
          {findings.map((f) => (
            <li key={f.id} className="rounded-xl bg-muted px-3 py-3">
              <p className="text-xs font-medium text-muted-foreground">
                {t("conclWeekN", { n: f.week, range: `${f.from}–${f.to}` })}
                {f.version ? ` · ${t("releaseLabel", { n: formatReleaseVersion(f.version) })}` : ""}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-pretty">{locale === "en" ? f.en || f.he : f.he}</p>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

export function Conclusions() {
  const { t, locale } = useI18n();
  const { fauda, naza } = useWork();
  const fMood = fauda.mood.buckets;
  const nMood = naza.mood.buckets;
  const fLb = fauda.countries.find((c) => c.id === "LB");
  const nLb = naza.countries.find((c) => c.id === "LB");
  const byId = (bundle: { countries: Country[] }, id: string) =>
    bundle.countries.find((c) => c.id === id) ?? null;

  return (
    <section
      className="mx-auto w-full max-w-7xl space-y-5 px-4 py-5 pb-28 sm:px-6"
      aria-labelledby="concl-heading"
    >
      <div className="rounded-2xl bg-card px-4 py-5 shadow-[var(--shadow-border)] sm:px-5">
        <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">{t("conclKicker")}</p>
        <h2 id="concl-heading" className="mt-1 flex items-center gap-2 font-display text-2xl font-medium tracking-tight">
          <ScrollText className="size-5 shrink-0" aria-hidden="true" />
          {t("conclTitle")}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-pretty">{t("conclThesis")}</p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-pretty text-muted-foreground">{t("conclToneNote")}</p>
        <div className="mt-3">
          <HashtagRow work="compare" />
        </div>
      </div>

      <WorldAccumCard />

      <PointsGraph />

      <InsightBoard />

      <StreamingTools />

      <div className="grid gap-4 lg:grid-cols-2">
        <WorkToneCard
          id="fauda"
          title={t("conclFaudaTitle")}
          body={t("conclFaudaBody")}
          countries={fauda.countries}
          postsN={fauda.posts.length}
          support={fMood.support}
          mixed={fMood.mixed}
          critical={fMood.critical}
        />
        <WorkToneCard
          id="naza"
          title={t("conclNazaTitle")}
          body={t("conclNazaBody")}
          countries={naza.countries}
          postsN={naza.posts.length}
          support={nMood.support}
          mixed={nMood.mixed}
          critical={nMood.critical}
        />
      </div>

      {fLb && nLb ? (
        <article className="rounded-2xl bg-card px-4 py-5 shadow-[var(--shadow-border)] sm:px-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg" aria-hidden="true">
              {flagEmoji("LB")}
            </span>
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">{t("conclLbKicker")}</p>
            <Badge variant="mixed">{t("documented")}</Badge>
          </div>
          <h3 className="mt-2 font-display text-xl font-medium tracking-tight">{t("conclLbTitle")}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-pretty">{t("conclLbLead")}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-muted px-3 py-3">
              <p className="text-xs font-medium text-muted-foreground">{t("workFaudaName")}</p>
              <p className="mt-1 font-display text-2xl tabular-nums">
                {daysAtFirst(fLb) > 0 ? t("conclLbDaysFirst", { n: daysAtFirst(fLb) }) : t("talkOnly")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-pretty">{t("conclLbFauda")}</p>
              <div className="mt-3">
                <SentimentBar country={fLb} />
              </div>
            </div>
            <div className="rounded-xl bg-muted px-3 py-3">
              <p className="text-xs font-medium text-muted-foreground">{t("workNazaName")}</p>
              <p className="mt-1 font-display text-2xl tabular-nums">{t("talkOnly")}</p>
              <p className="mt-2 text-sm leading-relaxed text-pretty">{t("conclLbNaza")}</p>
              <div className="mt-3">
                <SentimentBar country={nLb} />
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-pretty">{t("conclLbClose")}</p>
        </article>
      ) : null}

      <article className="rounded-2xl bg-card px-4 py-5 shadow-[var(--shadow-border)] sm:px-5">
        <h3 className="font-display text-xl font-medium tracking-tight">{t("conclInvertTitle")}</h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-pretty">{t("conclInvertHint")}</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {FOCUS.map((id) => {
            const f = byId(fauda, id);
            const n = byId(naza, id);
            if (!f || !n) return null;
            return (
              <li key={id} className="rounded-xl bg-muted px-3 py-3 text-sm">
                <p className="font-medium">
                  {flagEmoji(id)} {countryDisplayName(id, locale)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("workFaudaShort")} {f.positive}% · {t("workNazaShort")} {n.positive}%
                  {peakRank(f) != null ? ` · #${peakRank(f)}` : ""}
                </p>
              </li>
            );
          })}
        </ul>
      </article>

      <article className="rounded-2xl bg-card px-4 py-5 shadow-[var(--shadow-border)] sm:px-5">
        <h3 className="font-display text-xl font-medium tracking-tight">{t("conclSampleTitle")}</h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-pretty">{t("conclSampleBody")}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("workFaudaShort")} · {t("conclPostsSplit", { n: fauda.posts.length, pos: fMood.support, mix: fMood.mixed, crit: fMood.critical })}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("workNazaShort")} · {t("conclPostsSplit", { n: naza.posts.length, pos: nMood.support, mix: nMood.mixed, crit: nMood.critical })}
        </p>
      </article>

      <article className="rounded-2xl bg-card px-4 py-5 shadow-[var(--shadow-border)] sm:px-5">
        <h3 className="font-display text-xl font-medium tracking-tight">{t("conclCaveatTitle")}</h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-pretty">{t("conclCaveat")}</p>
      </article>
    </section>
  );
}
