import { useState } from "react";
import { AlertTriangle, ChevronDown, Lightbulb, TrendingUp } from "lucide-react";
import { faudaInsightBoard, faudaWeekOf, liveFromFauda, type InsightCard, type InsightGroupId } from "@/lib/insights";
import { useI18n } from "@/lib/i18n";
import { useWork } from "@/lib/work";
import { countryDisplayName, flagEmoji } from "@/lib/geo";
import { trackClick } from "@/lib/track";
import { cn } from "@/lib/utils";

const GROUP_ICON: Record<InsightGroupId, typeof TrendingUp> = {
  trends: TrendingUp,
  findings: Lightbulb,
  outliers: AlertTriangle,
};

const GROUP_TITLE: Record<InsightGroupId, string> = {
  trends: "insightGroupTrends",
  findings: "insightGroupFindings",
  outliers: "insightGroupOutliers",
};

function Flags({ codes, locale }: { codes: string[]; locale: string }) {
  if (codes.length === 0) return null;
  return (
    <p className="mb-2 flex flex-wrap gap-1.5 text-lg leading-none" aria-hidden="true">
      {codes.map((code) => (
        <span key={code} title={countryDisplayName(code, locale)}>
          {flagEmoji(code)}
        </span>
      ))}
    </p>
  );
}

function CardBody({ card }: { card: InsightCard }) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) trackClick(`insight:${card.id}`);
  }

  return (
    <li className="rounded-2xl bg-muted">
      <button
        type="button"
        className="flex min-h-11 w-full items-start gap-3 px-4 py-3 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={open}
        onClick={toggle}
      >
        <span className="min-w-0 flex-1">
          <Flags codes={card.flags} locale={locale} />
          <span className="block text-sm leading-relaxed text-pretty">{t(card.textKey, card.vars)}</span>
          <span className="mt-1 block text-xs text-muted-foreground">{open ? t("insightLess") : t("insightMore")}</span>
        </span>
        <ChevronDown
          className={cn("mt-1 size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div className="border-t border-border/70 px-4 py-3">
          {card.days?.length ? (
            <div className="mb-3 space-y-3">
              {[...new Set(card.days.map((d) => faudaWeekOf(d.day)))].sort((a, b) => a - b).map((week) => {
                const slice = card.days!.filter((d) => faudaWeekOf(d.day) === week);
                if (!slice.length) return null;
                const range = `${slice[0]!.day}–${slice[slice.length - 1]!.day}`;
                return (
                  <div key={week}>
                    <p className="mb-1.5 text-[11px] font-medium tracking-[0.14em] text-muted-foreground">
                      {t("conclWeekN", { n: week, range })}
                    </p>
                    <ul className="grid grid-cols-3 gap-2 text-xs sm:grid-cols-6">
                      {slice.map((d) => (
                        <li key={d.day} className="rounded-lg bg-background px-2 py-2 text-center">
                          <p className="tabular-nums text-muted-foreground">{d.day}</p>
                          <p className="mt-0.5 font-display text-lg tabular-nums">{d.count}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : null}
          {card.rows.length ? (
            <ul className="mb-3 space-y-1.5">
              {card.rows.map((row) => (
                <li key={`${row.iso}-${row.titleKey ?? "row"}-${row.rank ?? ""}`} className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                  <span>
                    <span className="me-1.5" aria-hidden="true">
                      {flagEmoji(row.iso)}
                    </span>
                    {countryDisplayName(row.iso, locale)}
                    {row.titleKey ? <span className="text-muted-foreground"> · {t(row.titleKey)}</span> : null}
                  </span>
                  {row.rank ? <span className="tabular-nums text-muted-foreground">{row.rank}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{t(card.detailKey, card.vars)}</p>
        </div>
      ) : null}
    </li>
  );
}

export function InsightBoard() {
  const { t } = useI18n();
  const { fauda } = useWork();
  const data = faudaInsightBoard(liveFromFauda(fauda.countries, fauda.days, fauda.snapshot, fauda.global));

  return (
    <section className="rounded-2xl bg-card px-4 py-5 shadow-[var(--shadow-border)] sm:px-5" aria-labelledby="insight-board-heading">
      <h2 id="insight-board-heading" className="font-display text-xl font-medium tracking-tight sm:text-2xl">
        {t("insightBoardTitle")}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-pretty text-muted-foreground">{t("insightBoardHint")}</p>
      <p className="mt-1 text-xs text-muted-foreground">{t("insightWeeksLine")}</p>
      <p className="mt-1 text-xs text-muted-foreground">{t("insightClickHint")}</p>

      <div className="mt-5 space-y-5">
        {data.groups.map((group) => {
          const Icon = GROUP_ICON[group.id];
          return (
            <div key={group.id}>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                {t(GROUP_TITLE[group.id])}
              </h3>
              <ul className="space-y-2">
                {group.cards.map((card) => (
                  <CardBody key={card.id} card={card} />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
