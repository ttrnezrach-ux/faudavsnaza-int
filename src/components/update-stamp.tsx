import { useEffect, useState } from "react";
import { BUNDLED_CHANGES, formatJerusalemClock, getLatestLiveRun, nextIngestClock, siteUpdatedIso } from "@/lib/ingest";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function UpdateStamp({ className }: { className?: string }) {
  const { t } = useI18n();
  const [iso, setIso] = useState(siteUpdatedIso());
  const when = formatJerusalemClock(iso);
  const next = nextIngestClock();

  useEffect(() => {
    void getLatestLiveRun()
      .then((run) => {
        if (!run?.lastRunAt) return;
        const bundled = Date.parse(BUNDLED_CHANGES.lastRunAt ?? "") || 0;
        const remote = Date.parse(run.lastRunAt) || 0;
        if (remote >= bundled) setIso(run.lastRunAt);
      })
      .catch(() => {});
  }, []);

  if (!when) return null;

  return (
    <time dateTime={iso} className={cn("whitespace-nowrap", className)}>
      {t("updatedStamp", { when, next })}
    </time>
  );
}
