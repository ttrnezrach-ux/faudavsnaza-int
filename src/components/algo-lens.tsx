import { Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WorkStill } from "@/components/work-still";
import {
  ALGO_CASES,
  emotionRatio,
  platformEngagement,
  postsWithCounts,
  toneEngagement,
  type AlgoCaseId,
  type AlgoTone,
} from "@/lib/algo";
import { useI18n } from "@/lib/i18n";
import { useWork } from "@/lib/work";
import { cn } from "@/lib/utils";
import { flagEmoji } from "@/lib/geo";

const TONE_KEY: Record<AlgoTone, string> = {
  positive: "algoTonePos",
  emotional: "algoToneEmo",
  critical: "algoToneCrit",
};

const TONE_BAR: Record<AlgoTone, string> = {
  positive: "bg-positive",
  emotional: "bg-mixed",
  critical: "bg-negative",
};

function platformName(platform: string, t: (k: string) => string) {
  if (platform === "facebook") return t("netFacebook");
  if (platform === "x") return t("netX");
  if (platform === "tiktok") return t("netTiktok");
  return t("netInstagram");
}

const CASE_FLAG: Record<AlgoCaseId, string> = {
  IL: "IL",
  LB: "LB",
  IT: "IT",
};

function EngBars({
  rows,
  measurable,
}: {
  rows: ReturnType<typeof toneEngagement>;
  measurable: boolean;
}) {
  const { t } = useI18n();
  const max = Math.max(1, ...rows.map((r) => r.avg));
  if (!measurable) {
    return <p className="text-sm leading-relaxed text-muted-foreground">{t("algoNoEng")}</p>;
  }
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.tone}>
          <div className="flex items-baseline justify-between gap-2 text-xs">
            <span className="text-muted-foreground">{t(TONE_KEY[r.tone])}</span>
            <span className="tabular-nums text-foreground">
              {r.avg} · {t("algoSampleN", { n: r.n })}
            </span>
          </div>
          <span className="mt-1 flex h-2 overflow-hidden rounded-full bg-muted">
            <span
              className={cn("h-full rounded-full", TONE_BAR[r.tone])}
              style={{ width: `${Math.max(r.avg ? 6 : 0, Math.round((r.avg / max) * 100))}%` }}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}

export function AlgoLens() {
  const { t } = useI18n();
  const { fauda, naza } = useWork();
  const faudaTones = toneEngagement(fauda.posts);
  const nazaTones = toneEngagement(naza.posts);
  const faudaPlat = platformEngagement(fauda.posts);
  const nazaPlat = platformEngagement(naza.posts);
  const faudaMeasurable = postsWithCounts(fauda.posts) >= 5;
  const nazaMeasurable = postsWithCounts(naza.posts) >= 5;
  const ratio = emotionRatio(faudaTones);

  return (
    <section
      className="mx-auto w-full max-w-7xl space-y-5 px-4 py-5 pb-28 sm:px-6"
      aria-labelledby="algo-heading"
    >
      <div className="rounded-2xl bg-card px-4 py-5 shadow-[var(--shadow-border)] sm:px-5">
        <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">{t("algoKicker")}</p>
        <h2 id="algo-heading" className="mt-1 flex items-center gap-2 font-display text-2xl font-medium tracking-tight">
          <Cpu className="size-5 shrink-0" aria-hidden="true" />
          {t("algoTitle")}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-pretty text-muted-foreground">{t("algoThesis")}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-border)]">
          <WorkStill
            id="fauda"
            alt={t("stillFaudaAlt")}
            className="aspect-[2.4/1] object-right"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="px-4 py-4 sm:px-5">
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">{t("workFaudaShort")}</p>
            <h3 className="mt-1 font-display text-lg font-medium tracking-tight">{t("algoEngineFauda")}</h3>
            <dl className="mt-3 space-y-3 text-sm leading-relaxed">
              <div>
                <dt className="text-xs font-medium text-muted-foreground">{t("algoReward")}</dt>
                <dd className="mt-1 text-pretty">{t("algoRewardFauda")}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">{t("algoLoop")}</dt>
                <dd className="mt-1 text-pretty">{t("algoLoopFauda")}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs font-medium text-muted-foreground">{t("algoAvgEng")}</p>
            <div className="mt-2">
              <EngBars rows={faudaTones} measurable={faudaMeasurable} />
            </div>
            {ratio != null ? (
              <p className="mt-3 text-sm leading-relaxed text-pretty">{t("algoFaudaFinding", { n: ratio })}</p>
            ) : null}
            <p className="mt-3 text-xs text-muted-foreground">
              {faudaPlat.map((p) => `${platformName(p.platform, t)} ${p.n}`).join(" · ")}
            </p>
          </div>
        </article>

        <article className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-border)]">
          <WorkStill
            id="naza"
            alt={t("stillNazaAlt")}
            className="aspect-[2.4/1]"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="px-4 py-4 sm:px-5">
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">{t("workNazaShort")}</p>
            <h3 className="mt-1 font-display text-lg font-medium tracking-tight">{t("algoEngineNaza")}</h3>
            <dl className="mt-3 space-y-3 text-sm leading-relaxed">
              <div>
                <dt className="text-xs font-medium text-muted-foreground">{t("algoReward")}</dt>
                <dd className="mt-1 text-pretty">{t("algoRewardNaza")}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">{t("algoLoop")}</dt>
                <dd className="mt-1 text-pretty">{t("algoLoopNaza")}</dd>
              </div>
            </dl>
            {nazaMeasurable ? (
              <>
                <p className="mt-4 text-xs font-medium text-muted-foreground">{t("algoAvgEng")}</p>
                <div className="mt-2">
                  <EngBars rows={nazaTones} measurable />
                </div>
              </>
            ) : null}
            <p className="mt-3 text-sm leading-relaxed text-pretty">{t("algoNazaFinding")}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {nazaPlat.map((p) => `${platformName(p.platform, t)} ${p.n}`).join(" · ")}
            </p>
          </div>
        </article>
      </div>

      <div className="rounded-2xl bg-card px-4 py-4 shadow-[var(--shadow-border)] sm:px-5">
        <h3 className="font-display text-lg font-medium tracking-tight">{t("algoCasesTitle")}</h3>
        <ul className="mt-4 grid gap-3 lg:grid-cols-3">
          {ALGO_CASES.map((id) => (
            <li key={id} className="rounded-xl bg-muted px-3 py-3">
              <p className="text-sm font-medium">
                <span className="me-1.5" aria-hidden="true">
                  {flagEmoji(CASE_FLAG[id])}
                </span>
                {t(`algoCase${id}Title`)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">
                {t(`algoCase${id}`)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-card px-4 py-4 shadow-[var(--shadow-border)] sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-medium tracking-tight">{t("algoCaveatTitle")}</h3>
          <Badge variant="mixed">{t("estimated")}</Badge>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-pretty text-muted-foreground">{t("algoCaveat")}</p>
        <p className="mt-2 text-xs text-muted-foreground">{t("algoMeasuredHint")}</p>
      </div>
    </section>
  );
}
