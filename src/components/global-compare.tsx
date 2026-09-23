import { useMemo } from "react";
import { globalCompare } from "@/lib/compare";
import { useI18n } from "@/lib/i18n";
import { useWork } from "@/lib/work";
import { cn } from "@/lib/utils";

function Bar({ value, max, className }: { value: number; max: number; className: string }) {
  const w = Math.max(4, Math.round((value / Math.max(max, 1)) * 100));
  return (
    <span className="flex h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
      <span className={cn("h-full rounded-full", className)} style={{ width: `${w}%` }} />
    </span>
  );
}

export function GlobalCompare() {
  const { t } = useI18n();
  const { work } = useWork();
  const g = useMemo(
    () =>
      globalCompare({
        countries: work.countries,
        posts: work.posts,
        days: work.days,
        global: work.global,
      }),
    [work],
  );
  const regionKey = (id: string) =>
    id === "me" ? "regionMe" : id === "eu" ? "regionEu" : id === "am" ? "regionAm" : "regionAa";

  return (
    <section
      className="mx-auto w-full max-w-7xl px-4 pb-4 sm:px-6"
      aria-labelledby="compare-heading"
    >
      <div className="rounded-2xl bg-card px-4 py-4 shadow-[var(--shadow-border)] sm:px-5">
        <h2 id="compare-heading" className="font-display text-lg font-medium tracking-tight">
          {t("compareTitle")}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("compareHint")}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-muted px-3 py-3">
            <p className="text-xs font-medium text-muted-foreground">{t("compareView")}</p>
            <p className="mt-1 font-display text-2xl tabular-nums">#{g.world}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("peak")} #{g.peak} · {g.top10} {t("kpiTop10")} · {g.points} {t("kpiPoints")}
            </p>
            <div className="mt-3 space-y-1.5">
              {g.byDay.map((d) => (
                <div key={d.day} className="flex items-center gap-2 text-xs">
                  <span className="w-8 tabular-nums text-muted-foreground">{d.day}</span>
                  <Bar value={d.count} max={g.maxDay} className="bg-heat" />
                  <span className="w-6 tabular-nums text-muted-foreground">{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-muted px-3 py-3">
            <p className="text-xs font-medium text-muted-foreground">{t("compareTalk")}</p>
            <p className="mt-1 font-display text-2xl tabular-nums">{g.avgPositive}%</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("tonePositive")} · {g.documentedTalk} {t("documented")}
            </p>
            <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-background">
              <span className="bg-positive" style={{ width: `${g.avgPositive}%` }} />
              <span className="bg-mixed" style={{ width: `${g.avgMixed}%` }} />
              <span className="bg-negative" style={{ width: `${g.avgCritical}%` }} />
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
              <span className="text-positive">{t("tonePositive")} {g.avgPositive}%</span>
              <span className="text-mixed">{t("toneMixed")} {g.avgMixed}%</span>
              <span className="text-negative">{t("toneCritical")} {g.avgCritical}%</span>
            </div>
          </div>

          <div className="rounded-xl bg-muted px-3 py-3">
            <p className="text-xs font-medium text-muted-foreground">{t("compareSocial")}</p>
            <p className="mt-1 font-display text-2xl tabular-nums">{g.avgScore}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("socialScore")} · {g.posts} {t("comparePosts")} · {g.documentedSocial} {t("documented")}
            </p>
            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-12 shrink-0 text-positive">{t("compareUp")}</span>
                <Bar value={g.trendUp} max={g.sample} className="bg-positive" />
                <span className="w-6 tabular-nums">{g.trendUp}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 shrink-0 text-muted-foreground">{t("compareFlat")}</span>
                <Bar value={g.trendFlat} max={g.sample} className="bg-mixed" />
                <span className="w-6 tabular-nums">{g.trendFlat}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 shrink-0 text-negative">{t("compareDown")}</span>
                <Bar value={g.trendDown} max={g.sample} className="bg-negative" />
                <span className="w-6 tabular-nums">{g.trendDown}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[28rem] text-sm">
            <caption className="mb-2 text-start text-xs text-muted-foreground">{t("compareRegions")}</caption>
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="py-2 pe-3 text-start font-medium">{t("tabRegions")}</th>
                <th className="py-2 pe-3 text-start font-medium">{t("kpiTop10")}</th>
                <th className="py-2 pe-3 text-start font-medium">{t("socialScore")}</th>
                <th className="py-2 text-start font-medium">{t("tonePositive")}</th>
              </tr>
            </thead>
            <tbody>
              {g.regions.map((r) => (
                <tr key={r.region} className="border-t border-border">
                  <td className="py-2.5 pe-3 font-medium">{t(regionKey(r.region))}</td>
                  <td className="py-2.5 pe-3 tabular-nums">
                    {r.watching}/{r.total}
                  </td>
                  <td className="py-2.5 pe-3">
                    <span className="flex items-center gap-2">
                      <Bar value={r.avgSocial} max={99} className="bg-heat" />
                      <span className="w-6 tabular-nums">{r.avgSocial}</span>
                    </span>
                  </td>
                  <td className="py-2.5 tabular-nums text-positive">{r.positive}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
