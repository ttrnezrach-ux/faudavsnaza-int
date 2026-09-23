import { useEffect, useState } from "react";
import {
  BUNDLED_CHANGES,
  formatJerusalemClock,
  getLatestLiveRun,
  type ChangeNote,
  type IngestSlot,
  type LiveRun,
} from "@/lib/ingest";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { displayReleasedIso, displayVersion, formatReleaseVersion } from "@/lib/release";

function asNote(run: LiveRun): ChangeNote {
  return {
    lastRunAt: run.lastRunAt,
    slot: run.slot,
    significant: run.significant,
    noteHe: run.noteHe,
    noteEn: run.noteEn,
    wikiAt: run.wikiAt,
    deltas: run.deltas,
    timezone: run.timezone,
    morning: run.morning,
    evening: run.evening,
    version: run.version,
  };
}

function slotKey(slot: IngestSlot | null): string {
  if (slot === "morning") return "ingestSlotMorning";
  if (slot === "evening") return "ingestSlotEvening";
  if (slot === "weekly") return "ingestSlotWeekly";
  return "ingestSlotManual";
}

export function ChangeBanner() {
  const { t, locale } = useI18n();
  const [note, setNote] = useState<ChangeNote>(BUNDLED_CHANGES);
  const iso = displayReleasedIso(note);
  const when = formatJerusalemClock(iso);

  useEffect(() => {
    void getLatestLiveRun()
      .then((run) => {
        if (!run?.lastRunAt) return;
        const bundled = Date.parse(BUNDLED_CHANGES.lastRunAt ?? "") || 0;
        const remote = Date.parse(run.lastRunAt) || 0;
        const remoteVer = displayVersion(run);
        if (remote >= bundled && remoteVer >= displayVersion(BUNDLED_CHANGES)) {
          setNote({ ...asNote(run), version: remoteVer });
        }
      })
      .catch(() => {});
  }, []);

  const text = locale === "en" ? note.noteEn : locale === "he" ? note.noteHe : note.noteHe;

  return (
    <div
      role="status"
      className={cn(
        "rounded-2xl px-4 py-3 shadow-[var(--shadow-border)]",
        note.significant ? "bg-card" : "bg-muted",
      )}
    >
      <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">
        {t("releaseLabel", { n: formatReleaseVersion(displayVersion(note)) })}
        {when ? (
          <>
            {" · "}
            <time dateTime={iso}>{t("updatedAt", { when })}</time>
          </>
        ) : (
          <>
            {" · "}
            {t("ingestSchedule")}
          </>
        )}
        {" · "}
        {note.significant ? t("ingestSignificant") : t(slotKey(note.slot))}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-pretty">{text}</p>
    </div>
  );
}
