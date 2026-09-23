import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { SentimentBar } from "@/components/sentiment-bar";
import { useI18n } from "@/lib/i18n";
import { useWork } from "@/lib/work";
import { inTop10, isTalkOnly, peakRank, type Country } from "@/lib/data";
import { socialOf } from "@/lib/social";
import { countryDisplayName, flagEmoji } from "@/lib/geo";
import { cn } from "@/lib/utils";
import { trackClick } from "@/lib/track";
import { WorkStill } from "@/components/work-still";
import { FAUDA_WEEK, FAUDA_WEEK_LATEST } from "@/lib/live";

type SortKey = "invert" | "presence" | "name";

type Row = {
  id: string;
  fauda: Country;
  naza: Country;
  faudaPeak: number | null;
  nazaPeak: number | null;
  deltaPos: number;
};

function peakOr99(n: number | null) {
  return n ?? 99;
}

export function DualCompare({
  onSelect,
  onOpenAlgo,
  onOpenConclusions,
}: {
  onSelect: (id: string) => void;
  onOpenAlgo: () => void;
  onOpenConclusions: () => void;
}) {
  const { t, locale } = useI18n();
  const { fauda, naza, setView } = useWork();
  const [sort, setSort] = useState<SortKey>("invert");
  const [openId, setOpenId] = useState<string | null>("IL");
  const [invertOpen, setInvertOpen] = useState(false);

  const rows = useMemo<Row[]>(() => {
    const nazaById = new Map(naza.countries.map((c) => [c.id, c]));
    const list: Row[] = [];
    for (const f of fauda.countries) {
      const n = nazaById.get(f.id);
      if (!n) continue;
      list.push({
        id: f.id,
        fauda: f,
        naza: n,
        faudaPeak: peakRank(f),
        nazaPeak: peakRank(n),
        deltaPos: n.positive - f.positive,
      });
    }
    list.sort((a, b) => {
      if (sort === "name") return a.fauda.nameHe.localeCompare(b.fauda.nameHe, "he");
      if (sort === "presence") {
        const pa = Math.min(peakOr99(a.faudaPeak), peakOr99(a.nazaPeak));
        const pb = Math.min(peakOr99(b.faudaPeak), peakOr99(b.nazaPeak));
        if (pa !== pb) return pa - pb;
      }
      const da = Math.abs(a.deltaPos);
      const db = Math.abs(b.deltaPos);
      if (db !== da) return db - da;
      return peakOr99(a.faudaPeak) - peakOr99(b.faudaPeak);
    });
    return list;
  }, [fauda.countries, naza.countries, sort]);

  const faudaWatch = fauda.countries.filter(inTop10).length;
  const nazaTalk = naza.countries.filter(inTop10).length;
  const nazaPos = Math.round(naza.countries.reduce((s, c) => s + c.positive, 0) / naza.countries.length);
  const inversions = rows.filter((r) => Math.abs(r.deltaPos) >= 30).length;

  return (
    <section className="mx-auto w-full max-w-7xl space-y-5 px-4 py-5 sm:px-6" aria-labelledby="dual-heading">
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-border)]">
          <button
            type="button"
            onClick={() => {
              setView("fauda");
              trackClick("work:fauda");
            }}
            className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={t("openWork", { name: t("workFaudaName") })}
          >
            <WorkStill
              id="fauda"
              alt={t("stillFaudaAlt")}
              className="aspect-video"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </button>
          <div className="px-4 py-4 sm:px-5">
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">{t("workFaudaKicker")}</p>
          <h2 className="mt-1 font-display text-xl font-medium tracking-tight">{t("workFaudaName")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">{t("workFaudaBlurb")}</p>
          <dl className="mt-4 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
            <div className="rounded-xl bg-muted px-2 py-2">
              <dt className="text-xs text-muted-foreground">{t("week2Views")}</dt>
              <dd className="font-display text-lg tabular-nums">{FAUDA_WEEK_LATEST.viewsM}M</dd>
              <p className="mt-0.5 text-xs text-muted-foreground">{t("week2Rank", { n: FAUDA_WEEK_LATEST.nonEnglishTv })}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t("week1Short")} {FAUDA_WEEK.viewsM}M · {t("week1Rank", { n: FAUDA_WEEK.nonEnglishTv })}
              </p>
            </div>
            <div className="rounded-xl bg-muted px-2 py-2">
              <dt className="text-xs text-muted-foreground">{t("week2Hours")}</dt>
              <dd className="font-display text-lg tabular-nums">{FAUDA_WEEK_LATEST.hoursM}M</dd>
              <p className="mt-0.5 text-xs text-muted-foreground">{t("week2Dates")}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t("week1Short")} {FAUDA_WEEK.hoursM}M
              </p>
            </div>
            <div className="rounded-xl bg-muted px-2 py-2">
              <dt className="text-[11px] text-muted-foreground">{t("kpiWorld")}</dt>
              <dd className="font-display text-lg tabular-nums">#{fauda.global.latest}</dd>
            </div>
            <div className="rounded-xl bg-muted px-2 py-2">
              <dt className="text-[11px] text-muted-foreground">{t("kpiTop10")}</dt>
              <dd className="font-display text-lg tabular-nums">{faudaWatch}</dd>
            </div>
          </dl>
          </div>
        </article>
        <article className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-border)]">
          <button
            type="button"
            onClick={() => {
              setView("naza");
              trackClick("work:naza");
            }}
            className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={t("openWork", { name: t("workNazaName") })}
          >
            <WorkStill
              id="naza"
              alt={t("stillNazaAlt")}
              className="aspect-video"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </button>
          <div className="px-4 py-4 sm:px-5">
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">{t("workNazaKicker")}</p>
          <h2 className="mt-1 font-display text-xl font-medium tracking-tight">{t("workNazaName")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">{t("workNazaBlurb")}</p>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-muted px-2 py-2">
              <dt className="text-[11px] text-muted-foreground">{t("kpiCritics")}</dt>
              <dd className="font-display text-lg tabular-nums">{naza.global.points}</dd>
            </div>
            <div className="rounded-xl bg-muted px-2 py-2">
              <dt className="text-[11px] text-muted-foreground">{t("kpiDiscourse")}</dt>
              <dd className="font-display text-lg tabular-nums">{nazaTalk}</dd>
            </div>
            <div className="rounded-xl bg-muted px-2 py-2">
              <dt className="text-[11px] text-muted-foreground">{t("tonePositive")}</dt>
              <dd className="font-display text-lg tabular-nums text-positive">{nazaPos}%</dd>
            </div>
          </dl>
          </div>
        </article>
      </div>

      <div className="rounded-2xl bg-card px-4 py-4 shadow-[var(--shadow-border)] sm:px-5">
        <h2 id="dual-heading" className="font-display text-lg font-medium tracking-tight">
          {t("methodTitle")}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-pretty text-muted-foreground">{t("methodBody")}</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          <li className="rounded-xl bg-muted px-3 py-3">
            <p className="text-xs font-medium text-muted-foreground">{t("compareView")}</p>
            <p className="mt-1 text-sm leading-relaxed">{t("methodPresence")}</p>
          </li>
          <li className="rounded-xl bg-muted px-3 py-3">
            <p className="text-xs font-medium text-muted-foreground">{t("compareTalk")}</p>
            <p className="mt-1 text-sm leading-relaxed">{t("methodTalk")}</p>
          </li>
          <li className="rounded-xl bg-muted px-3 py-3">
            <p className="text-xs font-medium text-muted-foreground">{t("compareSocial")}</p>
            <p className="mt-1 text-sm leading-relaxed">{t("methodSocial")}</p>
          </li>
        </ul>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
      <button
        type="button"
        onClick={() => {
          onOpenAlgo();
        }}
        className="w-full rounded-2xl bg-card px-4 py-4 text-start shadow-[var(--shadow-border)] transition-[box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] hover:shadow-[var(--shadow-border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-5"
      >
        <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">{t("algoKicker")}</p>
        <p className="mt-1 font-display text-lg font-medium tracking-tight">{t("algoTeaser")}</p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-pretty text-muted-foreground">{t("algoThesis")}</p>
        <span className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-foreground underline-offset-4 hover:underline">
          {t("algoOpen")}
        </span>
      </button>
      <button
        type="button"
        onClick={() => {
          onOpenConclusions();
        }}
        className="w-full rounded-2xl bg-card px-4 py-4 text-start shadow-[var(--shadow-border)] transition-[box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] hover:shadow-[var(--shadow-border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-5"
      >
        <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">{t("conclKicker")}</p>
        <p className="mt-1 font-display text-lg font-medium tracking-tight">{t("conclTeaser")}</p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-pretty text-muted-foreground">{t("conclThesis")}</p>
        <span className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-foreground underline-offset-4 hover:underline">
          {t("conclOpen")}
        </span>
      </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <article
          className={cn(
            "rounded-2xl bg-card px-4 py-4 shadow-[var(--shadow-border)]",
            invertOpen && "sm:col-span-3",
          )}
        >
          <button
            type="button"
            aria-expanded={invertOpen}
            aria-controls="invert-explain"
            onClick={() => {
              const next = !invertOpen;
              setInvertOpen(next);
              if (next) {
                setSort("invert");
                setOpenId("IL");
              }
              trackClick("invert:explain");
            }}
            className="w-full text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <p className="text-xs font-medium text-muted-foreground">{t("invertTitle")}</p>
            <p className="mt-1 font-display text-2xl tabular-nums">{inversions}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("invertHint")}</p>
            <span className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-foreground underline-offset-4">
              {invertOpen ? t("invertClose") : t("invertOpen")}
            </span>
          </button>
          {invertOpen ? (
            <div id="invert-explain" className="mt-3 border-t border-border pt-3">
              <h3 className="font-display text-base font-medium tracking-tight">{t("invertExplainTitle")}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-pretty text-muted-foreground">
                {t("invertExplainBody")}
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-pretty text-muted-foreground">
                {t("invertExplainHow")}
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-pretty">{t("invertExplainExample")}</p>
              <p className="mt-3 text-xs text-muted-foreground">{t("invertExplainTable")}</p>
            </div>
          ) : null}
        </article>
        <figure className="rounded-2xl bg-card px-4 py-4 shadow-[var(--shadow-border)]">
          <figcaption className="text-xs font-medium text-muted-foreground">{t("israelSplit")}</figcaption>
          <p className="mt-1 font-display text-lg leading-snug">{t("israelSplitValue")}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("israelSplitHint")}</p>
        </figure>
        <figure className="rounded-2xl bg-card px-4 py-4 shadow-[var(--shadow-border)]">
          <figcaption className="text-xs font-medium text-muted-foreground">{t("veniceSplit")}</figcaption>
          <p className="mt-1 font-display text-lg leading-snug">{t("veniceSplitValue")}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("veniceSplitHint")}</p>
        </figure>
      </div>

      <div className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-border)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <h3 className="font-display text-base font-medium">{t("countryVs")}</h3>
          <div className="flex flex-wrap gap-1" role="radiogroup" aria-label={t("sortBy")}>
            {(
              [
                ["invert", "sortInvert"],
                ["presence", "sortPresence"],
                ["name", "sortName"],
              ] as const
            ).map(([id, key]) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={sort === id}
                onClick={() => setSort(id)}
                className={cn(
                  "h-11 rounded-full px-3 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  sort === id ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
                )}
              >
                {t(key)}
              </button>
            ))}
          </div>
        </div>
        <ul>
          {rows.slice(0, 28).map((row) => {
            const open = openId === row.id;
            const fScore = socialOf(row.fauda, fauda.posts).score;
            const nScore = socialOf(row.naza, naza.posts).score;
            return (
              <li key={row.id} className="border-b border-border last:border-b-0">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => {
                    setOpenId(open ? null : row.id);
                    onSelect(row.id);
                    trackClick(`vs:${row.id.toLowerCase()}`);
                  }}
                  className="flex min-h-11 w-full flex-col gap-2 px-4 py-3 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">
                      <span className="me-1.5" aria-hidden="true">
                        {flagEmoji(row.id)}
                      </span>
                      {countryDisplayName(row.id, locale)}
                    </span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {row.deltaPos > 0 ? "+" : ""}
                      {row.deltaPos} {t("ppTowardNaza")}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{t("workFaudaShort")}</span>
                        <span className="tabular-nums">
                          {isTalkOnly(row.fauda) ? t("talkShort") : `#${row.faudaPeak}`}
                        </span>
                      </p>
                      <SentimentBar country={row.fauda} className="mt-1" />
                    </div>
                    <div>
                      <p className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{t("workNazaShort")}</span>
                        <span className="tabular-nums">
                          {isTalkOnly(row.naza) ? t("talkShort") : `#${row.nazaPeak}`}
                        </span>
                      </p>
                      <SentimentBar country={row.naza} className="mt-1" />
                    </div>
                  </div>
                </button>
                {open ? (
                  <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2">
                    <p className="text-xs leading-relaxed text-pretty text-muted-foreground">
                      <Badge variant={row.fauda.sentiment}>{t("workFaudaShort")}</Badge>{" "}
                      {row.fauda.note ?? t("noLocalNote")} · {t("socialScore")} {fScore}
                    </p>
                    <p className="text-xs leading-relaxed text-pretty text-muted-foreground">
                      <Badge variant={row.naza.sentiment}>{t("workNazaShort")}</Badge>{" "}
                      {row.naza.note ?? t("noLocalNote")} · {t("socialScore")} {nScore}
                    </p>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
