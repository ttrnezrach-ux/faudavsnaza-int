import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { formatJerusalemClock } from "@/lib/ingest";
import { formatReleaseVersion } from "@/lib/release";
import {
  appendSiteVersion,
  getVersionBoard,
  type SiteFinding,
  type SiteVersion,
} from "@/lib/versions";

export function VersionsPanel() {
  const { t, locale } = useI18n();
  const [versions, setVersions] = useState<SiteVersion[]>([]);
  const [findings, setFindings] = useState<SiteFinding[]>([]);
  const [current, setCurrent] = useState("");
  const [noteHe, setNoteHe] = useState("");
  const [noteEn, setNoteEn] = useState("");
  const [findingHe, setFindingHe] = useState("");
  const [findingEn, setFindingEn] = useState("");
  const [week, setWeek] = useState("2");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    void getVersionBoard()
      .then((b) => {
        setVersions(b.versions);
        setFindings(b.findings);
        setCurrent(b.display);
      })
      .catch(() => {});
  }, []);

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    if (busy || noteHe.trim().length < 2) return;
    setBusy(true);
    setErr(null);
    try {
      const board = await appendSiteVersion({
        data: {
          noteHe: noteHe.trim(),
          noteEn: noteEn.trim() || undefined,
          findingHe: findingHe.trim() || undefined,
          findingEn: findingEn.trim() || undefined,
          week: Number(week) || undefined,
        },
      });
      setVersions(board.versions);
      setFindings(board.findings);
      setCurrent(board.display);
      setNoteHe("");
      setNoteEn("");
      setFindingHe("");
      setFindingEn("");
    } catch {
      setErr(t("officeVersionFail"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl bg-card px-4 py-4 shadow-[var(--shadow-border)] sm:px-5" aria-labelledby="ver-heading">
      <h2 id="ver-heading" className="font-display text-lg font-medium tracking-tight">
        {t("officeVersions")}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("officeVersionNow")}: {t("releaseLabel", { n: current || "—" })}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{t("officeVersionHint")}</p>

      <form className="mt-4 space-y-3" onSubmit={(e) => void publish(e)}>
        <label className="block text-sm">
          <span className="mb-1 block text-xs text-muted-foreground">{t("officeVersionNote")}</span>
          <Input value={noteHe} onChange={(e) => setNoteHe(e.target.value)} required maxLength={500} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-xs text-muted-foreground">{t("officeVersionNoteEn")}</span>
          <Input value={noteEn} onChange={(e) => setNoteEn(e.target.value)} maxLength={500} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-xs text-muted-foreground">{t("officeFindingAdd")}</span>
          <textarea
            value={findingHe}
            onChange={(e) => setFindingHe(e.target.value)}
            maxLength={800}
            rows={3}
            className="min-h-20 w-full rounded-md bg-muted px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-xs text-muted-foreground">{t("officeFindingAddEn")}</span>
          <textarea
            value={findingEn}
            onChange={(e) => setFindingEn(e.target.value)}
            maxLength={800}
            rows={2}
            className="min-h-16 w-full rounded-md bg-muted px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-xs text-muted-foreground">{t("officeFindingWeek")}</span>
          <Input value={week} onChange={(e) => setWeek(e.target.value)} inputMode="numeric" className="max-w-24" />
        </label>
        <Button type="submit" className="h-11" disabled={busy}>
          {busy ? t("scanBusy") : t("officeVersionBump")}
        </Button>
        {err ? <p className="text-sm text-muted-foreground">{err}</p> : null}
      </form>

      <ul className="mt-5 space-y-2">
        {versions.map((v) => (
          <li key={v.version} className="rounded-xl bg-muted px-3 py-3 text-sm">
            <p className="text-xs font-medium text-muted-foreground">
              {t("releaseLabel", { n: formatReleaseVersion(v.version) })}
              {formatJerusalemClock(v.releasedAt) ? ` · ${formatJerusalemClock(v.releasedAt)}` : ""}
            </p>
            <p className="mt-1 leading-relaxed text-pretty">{locale === "en" ? v.noteEn || v.noteHe : v.noteHe}</p>
          </li>
        ))}
      </ul>

      {findings.length ? (
        <div className="mt-5 border-t border-border/70 pt-4">
          <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground">{t("conclFindingKicker")}</p>
          <ul className="mt-3 space-y-2">
            {findings.map((f) => (
              <li key={f.id} className="rounded-xl bg-muted px-3 py-3 text-sm">
                <p className="text-xs text-muted-foreground">
                  {t("conclWeekN", { n: f.week, range: `${f.from}–${f.to}` })}
                </p>
                <p className="mt-1 leading-relaxed">{locale === "en" ? f.en || f.he : f.he}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
