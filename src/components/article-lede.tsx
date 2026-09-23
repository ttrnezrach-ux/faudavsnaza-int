import { Permalink } from "@/components/share-tabs";
import { WorkStill } from "@/components/work-still";
import { HashtagRow } from "@/components/hashtag-row";
import { OUTLET_LINKS } from "@/lib/seo";
import { useI18n } from "@/lib/i18n";
import { useWork } from "@/lib/work";
import { trackClick } from "@/lib/track";

export function ArticleLede() {
  const { t } = useI18n();
  const { work } = useWork();
  const GLOBAL = work.global;
  const SNAPSHOT = work.snapshot;
  const naza = work.id === "naza";
  return (
    <section aria-labelledby="lede-heading" className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
        <figure className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-border)]">
          <WorkStill
            id={naza ? "naza" : "fauda"}
            alt={t(naza ? "stillNazaAlt" : "stillFaudaAlt")}
            className="aspect-video"
            sizes="(min-width: 1024px) 55vw, 100vw"
            priority
          />
          <figcaption className="px-4 py-3 text-xs text-muted-foreground">
            {t(naza ? "nazaLedeTitle" : "ledeTitle")} · {naza ? t("venicePrize") : `#${GLOBAL.latest}`} · {SNAPSHOT}
          </figcaption>
        </figure>

        <div className="max-w-prose space-y-4 text-sm leading-relaxed text-pretty text-muted-foreground">
          <h2 id="lede-heading" className="font-display text-2xl font-medium tracking-tight text-foreground">
            {t(naza ? "nazaLedeTitle" : "ledeTitle")}
          </h2>
          <p>
            {naza ? (
              t("nazaLedeP1", { n: GLOBAL.top10Countries })
            ) : (
              <>
                {t("ledeP1", { n: GLOBAL.top10Countries, peak: GLOBAL.peak })}{" "}
                <a
                  href="https://flixpatrol.com/title/fauda/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline-offset-4 hover:underline"
                  onClick={() => trackClick("source:flixpatrol")}
                >
                  FlixPatrol
                </a>
                .
              </>
            )}
          </p>
          <p>{t(naza ? "nazaLedeP2" : "ledeP2")}</p>
          <p>
            {t(naza ? "nazaLedeP3" : "ledeP3")}{" "}
            <a href="#map" className="text-foreground underline-offset-4 hover:underline">
              {t("skipMap")}
            </a>
            .
          </p>
          <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
            {(naza
              ? [
                  { label: "Venice", href: "https://www.labiennale.org/" },
                  { label: "NYFF", href: "https://www.filmlinc.org/nyff2026/films/naza/" },
                  { label: "I Wonder", href: "https://iwonderpictures.com/projects/naza-di-yuval-abraham-rachel-szor-28-29-e-30-settembre-al-cinema/" },
                  { label: "TheWrap", href: "https://www.thewrap.com/creative-content/movies/naza-plans-surprise-us-release/" },
                  { label: "Facebook", href: "https://www.facebook.com/share/p/1Bw2ngM9Nf/" },
                  { label: "Guardian", href: "https://www.theguardian.com/" },
                  { label: "NYT", href: "https://www.nytimes.com/" },
                  { label: "Reuters", href: "https://www.reuters.com/" },
                  { label: "Ynet", href: "https://www.ynet.co.il/" },
                  { label: "+972", href: "https://www.972mag.com/" },
                ]
              : OUTLET_LINKS
            ).map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline-offset-4 hover:underline"
                onClick={() =>
                  trackClick(`source:${s.label.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 20) || "outlet"}`)
                }
              >
                {s.label}
              </a>
            ))}
          </p>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{t("seoHashtags")}</p>
            <div className="mt-2">
              <HashtagRow work={naza ? "naza" : "fauda"} />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{t("articleLink")}</p>
            <Permalink className="mt-1" />
          </div>
        </div>
      </div>
    </section>
  );
}
