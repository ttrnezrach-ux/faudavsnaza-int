import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { runImageIngest, type LiveRun } from "@/lib/ingest";
import { trackClick } from "@/lib/track";

function fileToJpeg(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 1400;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image"));
    };
    img.src = url;
  });
}

export function WeekScan({ onRun }: { onRun?: (run: LiveRun) => void }) {
  const { t, locale } = useI18n();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file || busy) return;
    setBusy(true);
    setOk(false);
    setNote(null);
    trackClick("scan:image");
    try {
      const image = await fileToJpeg(file);
      const run = await runImageIngest({ data: { image } });
      setOk(!run.source.includes("empty"));
      setNote(locale === "en" ? run.noteEn : run.noteHe);
      onRun?.(run);
    } catch {
      setNote(t("scanFail"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl bg-card px-4 py-4 shadow-[var(--shadow-border)] sm:px-5" aria-labelledby="scan-heading">
      <h2 id="scan-heading" className="font-display text-lg font-medium tracking-tight">
        {t("scanTitle")}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">{t("scanHint")}</p>
      <p className="mt-2 text-sm">
        <a
          href="https://flixpatrol.com/title/fauda/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline-offset-4 hover:underline"
          onClick={() => trackClick("scan:flixpatrol")}
        >
          {t("scanOpenChart")}
        </a>
      </p>
      <div className="mt-4">
        <label className="inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-xl bg-foreground px-4 text-sm font-medium text-background">
          {busy ? t("scanBusy") : t("scanPick")}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              void onFile(file);
            }}
          />
        </label>
      </div>
      {note ? (
        <p className={`mt-3 text-sm leading-relaxed ${ok ? "text-foreground" : "text-muted-foreground"}`}>{note}</p>
      ) : null}
    </section>
  );
}
