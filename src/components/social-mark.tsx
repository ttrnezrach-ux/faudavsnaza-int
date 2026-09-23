import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useWork } from "@/lib/work";
import { cn } from "@/lib/utils";
import type { Country } from "@/lib/data";

export function SocialMark({
  country,
  size = "sm",
}: {
  country: Country;
  size?: "sm" | "md";
}) {
  const { t } = useI18n();
  const { socialOf } = useWork();
  const s = socialOf(country);
  const Icon = s.trend === "up" ? TrendingUp : s.trend === "down" ? TrendingDown : Minus;
  const trendKey = s.trend === "up" ? "socialTrendUp" : s.trend === "down" ? "socialTrendDown" : "socialTrendFlat";
  const color =
    s.trend === "up" ? "text-positive" : s.trend === "down" ? "text-negative" : "text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 tabular-nums",
        size === "md" ? "text-sm" : "text-xs",
        color,
      )}
      title={`${t("socialScore")} ${s.score} · ${t(trendKey)}`}
      aria-label={`${t("socialScore")} ${s.score}, ${t(trendKey)}`}
    >
      <Icon className={size === "md" ? "size-4" : "size-3.5"} aria-hidden="true" />
      <span className="font-medium text-foreground">{s.score}</span>
    </span>
  );
}
