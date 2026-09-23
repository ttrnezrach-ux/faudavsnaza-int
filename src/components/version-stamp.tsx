import { useEffect, useState } from "react";
import { BUNDLED_CHANGES, formatJerusalemClock, getLatestLiveRun } from "@/lib/ingest";
import { displayReleasedIso, displayVersion, formatReleaseVersion, RELEASE } from "@/lib/release";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function VersionStamp({
  className,
}: {
  className?: string;
  next?: boolean;
}) {
  const { t } = useI18n();
  const [version, setVersion] = useState(displayVersion(BUNDLED_CHANGES));
  const [iso, setIso] = useState(displayReleasedIso(BUNDLED_CHANGES));
  const when = formatJerusalemClock(iso);

  useEffect(() => {
    void getLatestLiveRun()
      .then((run) => {
        if (!run?.lastRunAt) return;
        const nextIso = displayReleasedIso(run);
        setVersion(Math.max(displayVersion(run), RELEASE.version));
        const cur = Date.parse(iso) || 0;
        const nxt = Date.parse(nextIso) || 0;
        if (nxt >= cur) setIso(nextIso);
      })
      .catch(() => {});
  }, []);

  if (!when) return null;

  return (
    <span className={cn("whitespace-nowrap tabular-nums", className)}>
      {t("releaseLabel", { n: formatReleaseVersion(version) })}
      {" · "}
      <time dateTime={iso}>{t("updatedAt", { when })}</time>
    </span>
  );
}

export function versionMeta(): string {
  return `v${formatReleaseVersion(RELEASE.version)}`;
}
