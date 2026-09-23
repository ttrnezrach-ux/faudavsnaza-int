import { ExternalLink, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { countryDisplayName, flagEmoji } from "@/lib/geo";
import {
  NAZA_SCREENINGS,
  liveScreeningStatus,
  screeningPinFill,
  type NazaScreening,
} from "@/lib/naza-screenings";
import { trackClick } from "@/lib/track";
import { cn } from "@/lib/utils";

function cityOf(s: NazaScreening, locale: string) {
  return locale === "he" ? s.cityHe : s.cityEn;
}
function venueOf(s: NazaScreening, locale: string) {
  return locale === "he" ? s.venueHe : s.venueEn;
}
function whenOf(s: NazaScreening, locale: string) {
  return locale === "he" ? s.whenHe : s.whenEn;
}

export function NazaScreenings({
  onPickCountry,
}: {
  onPickCountry?: (id: string) => void;
}) {
  const { t, locale } = useI18n();
  const now = NAZA_SCREENINGS.filter((s) => liveScreeningStatus(s) === "now");
  const upcoming = NAZA_SCREENINGS.filter((s) => liveScreeningStatus(s) === "upcoming");
  const done = NAZA_SCREENINGS.filter((s) => liveScreeningStatus(s) === "done");
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-4 sm:px-6" aria-labelledby="naza-screenings-heading">
      <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
        <h2 id="naza-screenings-heading" className="font-display text-lg font-medium">
          {t("nazaScreeningsTitle")}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t("nazaScreeningsHint")}</p>
        <p className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <i className="size-2 rotate-45 bg-heat" /> {t("nazaScreenNow")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="size-2 rotate-45 bg-mixed" /> {t("nazaScreenSoon")}
          </span>
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t("nazaScreenAvoid")}</p>
        <ScreeningGroup title={t("nazaScreenNow")} rows={now} locale={locale} onPickCountry={onPickCountry} />
        <ScreeningGroup title={t("nazaScreeningsUpcoming")} rows={upcoming} locale={locale} onPickCountry={onPickCountry} />
        <ScreeningGroup title={t("nazaScreeningsDone")} rows={done} locale={locale} onPickCountry={onPickCountry} />
      </div>
    </section>
  );
}

function ScreeningGroup({
  title,
  rows,
  locale,
  onPickCountry,
}: {
  title: string;
  rows: NazaScreening[];
  locale: string;
  onPickCountry?: (id: string) => void;
}) {
  const { t } = useI18n();
  if (rows.length === 0) return null;
  return (
    <div className="mt-4">
      <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground">{title}</p>
      <ul className="mt-2 space-y-2">
        {rows.map((s) => {
          const href = s.tickets ?? s.source;
          const live = liveScreeningStatus(s);
          return (
            <li key={s.id} className="rounded-lg bg-muted px-3 py-2.5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onPickCountry?.(s.country);
                    trackClick(`naza-screen:${s.id}`);
                  }}
                  className="min-w-0 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <p className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-foreground">
                    <span
                      className="size-2.5 shrink-0 rotate-45"
                      style={{ background: screeningPinFill(s) }}
                      aria-hidden="true"
                    />
                    <MapPin className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span aria-hidden="true">{flagEmoji(s.country)}</span>
                    {cityOf(s, locale)}
                    <span className="font-normal text-muted-foreground">· {countryDisplayName(s.country, locale)}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{venueOf(s, locale)}</p>
                  <p className="mt-0.5 text-xs tabular-nums text-foreground">{whenOf(s, locale)}</p>
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  {s.tbc ? <Badge variant="mixed">{t("nazaScreenTbc")}</Badge> : null}
                  <Badge variant={live === "now" ? "critical" : live === "upcoming" ? "mixed" : "positive"}>
                    {s.kind === "festival"
                      ? t("nazaScreenFestival")
                      : s.kind === "theatrical"
                        ? t("nazaScreenTheatrical")
                        : t("nazaScreenSocial")}
                  </Badge>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick(`naza-screen-link:${s.id}`)}
                    className={cn(
                      "inline-flex min-h-11 items-center gap-1 text-xs font-medium text-foreground underline-offset-4 hover:underline",
                    )}
                  >
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                    {s.tickets ? t("nazaScreenTickets") : t("nazaScreenSource")}
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
