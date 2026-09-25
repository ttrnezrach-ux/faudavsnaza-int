import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getVisitStats } from "@/lib/visits";
import { onVisitStats } from "@/lib/track";
import { SHOW_PUBLIC_VISIT_COUNTER } from "@/lib/visit-counter";

export function UniqueIpCounter() {
  if (!SHOW_PUBLIC_VISIT_COUNTER) return null;
  return <UniqueIpCounterLive />;
}

function UniqueIpCounterLive() {
  const { t, locale } = useI18n();
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const unsub = onVisitStats((stats) => {
      setTotal(stats.total);
    });
    void getVisitStats()
      .then((stats) => {
        setTotal(stats.total);
      })
      .catch(() => {});
    return unsub;
  }, []);

  const display = total == null ? "—" : total.toLocaleString(locale);

  return (
    <p
      className="flex min-h-14 w-full items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-[var(--shadow-border)] sm:px-5"
      aria-live="polite"
      title={t("uniqueIpHint")}
    >
      <Users className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="flex flex-col leading-tight">
        <span className="font-display text-base tabular-nums tracking-tight">{display}</span>
        <span className="text-[11px] text-muted-foreground">{t("visitsAllTime")}</span>
      </span>
    </p>
  );
}
