import { useMemo, useState } from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { countryViz, emotionViz, platformViz, timeViz } from "@/lib/social-viz";
import { countryDisplayName, flagEmoji } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { CommentEmotion, SocialPlatform } from "@/lib/social";
import { useWork } from "@/lib/work";

type Lens = "platform" | "country" | "time";

const EMOTION_KEY: Record<CommentEmotion, string> = {
  grief: "moodGrief",
  tooHard: "moodTooHard",
  praise: "moodPraise",
  solidarity: "moodSolidarity",
  anger: "moodAnger",
  sanitized: "moodSanitized",
  critical: "moodCriticalFine",
};

const EMOTION_TONE: Record<CommentEmotion, string> = {
  grief: "bg-mixed",
  tooHard: "bg-mixed",
  praise: "bg-positive",
  solidarity: "bg-positive",
  anger: "bg-negative",
  sanitized: "bg-muted-foreground/40",
  critical: "bg-negative",
};

function platformLabel(platform: SocialPlatform, t: (k: string) => string) {
  if (platform === "facebook") return t("netFacebook");
  if (platform === "x") return t("netX");
  if (platform === "tiktok") return t("netTiktok");
  return t("netInstagram");
}

export function SocialViz({
  platform,
  country,
  onPlatform,
  onCountry,
}: {
  platform: SocialPlatform | "all";
  country: string | "all";
  onPlatform: (p: SocialPlatform | "all") => void;
  onCountry: (id: string | "all") => void;
}) {
  const { t, locale } = useI18n();
  const { work } = useWork();
  const [lens, setLens] = useState<Lens>("country");
  const platforms = useMemo(() => platformViz(work.posts), [work.posts]);
  const countries = useMemo(() => countryViz(work.posts, work.countries), [work.posts, work.countries]);
  const days = useMemo(() => timeViz(work.posts), [work.posts]);
  const emotions = useMemo(() => emotionViz(work.mood), [work.mood]);
  const maxEng = Math.max(1, ...platforms.map((p) => p.engagement));
  const maxScore = Math.max(1, ...countries.map((c) => c.score));
  const maxDay = Math.max(1, ...days.map((d) => d.count));

  return (
    <section className="rounded-xl bg-muted px-3 py-3" aria-labelledby="viz-heading">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id="viz-heading" className="text-sm font-medium text-foreground">
          {t("vizTitle")}
        </h3>
        <div className="flex flex-wrap gap-1" role="tablist" aria-label={t("vizTitle")}>
          {(
            [
              ["country", "vizCountries"],
              ["platform", "vizPlatforms"],
              ["time", "vizTime"],
            ] as const
          ).map(([id, key]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={lens === id}
              onClick={() => setLens(id)}
              className={cn(
                "h-11 rounded-full px-3 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                lens === id ? "bg-foreground text-background" : "bg-background text-muted-foreground",
              )}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{t("vizHint")}</p>

      {lens === "platform" ? (
        <ul className="mt-3 space-y-2">
          {platforms.map((row) => {
            const active = platform === row.platform;
            return (
              <li key={row.platform}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onPlatform(active ? "all" : row.platform)}
                  className="flex min-h-11 w-full items-center gap-2 rounded-lg px-1 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="w-20 shrink-0 text-xs font-medium">{platformLabel(row.platform, t)}</span>
                  <span className="flex h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-background">
                    <span
                      className={cn("h-full rounded-full", active ? "bg-foreground" : "bg-heat")}
                      style={{ width: `${Math.max(row.posts ? 6 : 0, Math.round((row.engagement / maxEng) * 100))}%` }}
                    />
                  </span>
                  <span className="w-16 shrink-0 text-end text-xs tabular-nums text-muted-foreground">
                    {row.posts} · {new Intl.NumberFormat("en", { notation: "compact" }).format(row.engagement)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {lens === "country" ? (
        <ul className="mt-3 space-y-1.5">
          {countries.map((row) => {
            const active = country === row.id;
            const Icon = row.trend === "up" ? TrendingUp : row.trend === "down" ? TrendingDown : Minus;
            return (
              <li key={row.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onCountry(active ? "all" : row.id)}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-2 rounded-lg px-1 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "bg-background" : "",
                  )}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-1.5 text-xs font-medium">
                    <span aria-hidden="true">{flagEmoji(row.id)}</span>
                    <span className="truncate">{countryDisplayName(row.id, locale)}</span>
                    <Icon
                      className={cn(
                        "size-3.5 shrink-0",
                        row.trend === "up" ? "text-positive" : row.trend === "down" ? "text-negative" : "text-muted-foreground",
                      )}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="flex h-2.5 w-28 overflow-hidden rounded-full bg-background sm:w-36">
                    <span className="h-full rounded-full bg-heat" style={{ width: `${Math.round((row.score / maxScore) * 100)}%` }} />
                  </span>
                  <span className="w-10 shrink-0 text-end text-xs tabular-nums">{row.score}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {lens === "time" ? (
        <div className="mt-3">
          <div className="flex h-28 items-end gap-2">
            {days.map((d) => (
              <div key={d.day} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <span className="text-xs tabular-nums text-muted-foreground">{d.count}</span>
                <span
                  className="w-full max-w-10 rounded-t-md bg-heat"
                  style={{ height: `${Math.max(8, Math.round((d.count / maxDay) * 88))}px` }}
                />
                <span className="text-xs tabular-nums text-muted-foreground">{d.day.slice(5)}</span>
              </div>
            ))}
          </div>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {emotions.map((e) => (
              <li
                key={e.emotion}
                className={cn("rounded-full px-2.5 py-1 text-xs text-foreground", EMOTION_TONE[e.emotion])}
              >
                {t(EMOTION_KEY[e.emotion])} {e.n}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
