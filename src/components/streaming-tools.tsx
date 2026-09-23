import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { STREAMING_TOOLS, type StreamingTool } from "@/lib/streaming-tools";
import { useI18n } from "@/lib/i18n";
import { trackClick } from "@/lib/track";

function cadenceKey(c: StreamingTool["cadence"]) {
  if (c === "daily") return "toolsDaily";
  if (c === "weekly") return "toolsWeekly";
  return "toolsIndustry";
}

export function StreamingTools() {
  const { t } = useI18n();

  return (
    <section className="rounded-2xl bg-card px-4 py-5 shadow-[var(--shadow-border)] sm:px-5" aria-labelledby="streaming-tools-heading">
      <h2 id="streaming-tools-heading" className="font-display text-xl font-medium tracking-tight">
        {t("toolsTitle")}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-pretty text-muted-foreground">{t("toolsHint")}</p>

      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {STREAMING_TOOLS.map((tool) => (
          <li key={tool.id} className="flex flex-col rounded-2xl bg-muted px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => trackClick(`source:${tool.id}`)}
              >
                {t(`toolName_${tool.id}`)}
                <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              </a>
              {tool.inUse ? <Badge variant="heat">{t("toolsUsed")}</Badge> : null}
              <span className="text-xs text-muted-foreground">{t(cadenceKey(tool.cadence))}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-pretty">{t(`toolMeasure_${tool.id}`)}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {t("workFaudaShort")}: {t(`toolFauda_${tool.id}`)}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {t("workNazaShort")}: {t("toolsNazaNone")}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
