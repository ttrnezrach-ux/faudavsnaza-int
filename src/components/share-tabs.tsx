import { useEffect, useState } from "react";
import { Check, Copy, Link as LinkIcon, Mail, MessageCircle, Send, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { seoFor } from "@/lib/seo";
import {
  CONTENT_TABS,
  deepShareUrl,
  ogImagePath,
  shareCopyBlock,
  shareCore,
  shareHref,
  shareText,
  type ContentTab,
  type ShareNetwork,
} from "@/lib/share";
import { useI18n, type Locale } from "@/lib/i18n";
import { useWork, type WorkView } from "@/lib/work";
import { WorkStill } from "@/components/work-still";
import { HashtagRow } from "@/components/hashtag-row";
import { trackClick } from "@/lib/track";
import { cn } from "@/lib/utils";

const NETWORKS: { id: ShareNetwork; labelKey: string; hintKey: string }[] = [
  { id: "whatsapp", labelKey: "netWhatsapp", hintKey: "shareHintWa" },
  { id: "facebook", labelKey: "netFacebook", hintKey: "shareHintFb" },
  { id: "x", labelKey: "netX", hintKey: "shareHintX" },
  { id: "telegram", labelKey: "netTelegram", hintKey: "shareHintTg" },
  { id: "linkedin", labelKey: "netLinkedin", hintKey: "shareHintLi" },
  { id: "mail", labelKey: "netMail", hintKey: "shareHintMail" },
];

function NetworkIcon({ id }: { id: string }) {
  if (id === "mail") return <Mail className="size-4 shrink-0" aria-hidden="true" />;
  if (id === "telegram") return <Send className="size-4 shrink-0" aria-hidden="true" />;
  if (id === "whatsapp") return <MessageCircle className="size-4 shrink-0" aria-hidden="true" />;
  if (id === "x") {
    return (
      <span className="flex size-4 items-center justify-center text-sm font-semibold leading-none" aria-hidden="true">
        𝕏
      </span>
    );
  }
  return <Share2 className="size-4 shrink-0" aria-hidden="true" />;
}

const TAB_LABEL: Record<ContentTab, string> = {
  map: "navMap",
  social: "navSocialShort",
  algo: "navAlgo",
  concl: "navConcl",
};

const WORK_LABEL: Record<WorkView, string> = {
  fauda: "workFaudaShort",
  naza: "workNazaShort",
  compare: "workCompare",
};

export function ShareTabs({
  tab,
  onTabChange,
}: {
  tab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
}) {
  const { t, locale } = useI18n();
  const { view: work, setView: setWork } = useWork();
  const seo = seoFor(locale);
  const [pageUrl, setPageUrl] = useState(deepShareUrl(locale, { work, tab }));
  const [copied, setCopied] = useState(false);
  const [canNative, setCanNative] = useState(false);
  const [previewNet, setPreviewNet] = useState<ShareNetwork>("whatsapp");

  useEffect(() => {
    setPageUrl(deepShareUrl(locale, { work, tab }));
    setCanNative(typeof navigator.share === "function");
  }, [locale, work, tab]);

  const caption = shareText(locale, work, tab, previewNet);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareCopyBlock(locale, work, tab));
      setCopied(true);
      trackClick("share:copy");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function nativeShare() {
    if (!navigator.share) return;
    try {
      const payload: ShareData = {
        title: seo.title,
        text: shareText(locale, work, tab, "whatsapp"),
        url: pageUrl,
      };
      try {
        const imgPath = ogImagePath(locale, work);
        const res = await fetch(imgPath);
        if (res.ok) {
          const blob = await res.blob();
          const file = new File([blob], "fauda-naza.jpg", { type: blob.type || "image/jpeg" });
          if (navigator.canShare?.({ files: [file] })) {
            payload.files = [file];
          }
        }
      } catch {
        /* image optional */
      }
      await navigator.share(payload);
      trackClick("share:native");
    } catch {
      /* cancelled */
    }
  }

  return (
    <section aria-labelledby="share-heading" className="rounded-2xl bg-card px-4 py-4 shadow-[var(--shadow-border)] sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="share-heading" className="font-display text-lg font-medium">
          {t("shareTitle")}
        </h2>
        {canNative ? (
          <Button type="button" variant="secondary" className="h-11" onClick={() => void nativeShare()}>
            <Share2 className="size-4" />
            {t("shareNative")}
          </Button>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{t("shareHintCopy")}</p>

      <fieldset className="mt-4">
        <legend className="text-xs font-medium text-muted-foreground">{t("sharePickWork")}</legend>
        <div className="mt-2 flex flex-wrap gap-1 rounded-xl bg-muted p-1">
          {(["compare", "fauda", "naza"] as const).map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={work === id}
              onClick={() => {
                setWork(id);
                trackClick(`share:work:${id}`);
              }}
              className={cn(
                "min-h-11 flex-1 rounded-lg px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                work === id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t(WORK_LABEL[id])}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-3">
        <legend className="text-xs font-medium text-muted-foreground">{t("sharePickTab")}</legend>
        <div className="mt-2 flex flex-wrap gap-1 rounded-xl bg-muted p-1">
          {CONTENT_TABS.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={tab === id}
              onClick={() => {
                onTabChange(id);
                trackClick(`share:tab:${id}`);
              }}
              className={cn(
                "min-h-11 flex-1 rounded-lg px-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3",
                tab === id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t(TAB_LABEL[id])}
            </button>
          ))}
        </div>
      </fieldset>

      <a
        href={pageUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClick("share:card")}
        className="mt-4 block overflow-hidden rounded-xl bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <p className="px-3 pt-2 text-xs font-medium text-muted-foreground">{t("sharePreview")}</p>
        <div className="relative mt-2 grid grid-cols-2">
          <figure className="relative min-h-36 overflow-hidden sm:min-h-48">
            <WorkStill id="fauda" alt={t("stillFaudaAlt")} className="object-right" sizes="50vw" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent px-3 pb-2 pt-8 text-xs font-medium text-foreground">
              {t("workFaudaName")}
            </figcaption>
          </figure>
          <figure className="relative min-h-36 overflow-hidden sm:min-h-48">
            <WorkStill id="naza" alt={t("stillNazaAlt")} className="object-center" sizes="50vw" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent px-3 pb-2 pt-8 text-end text-xs font-medium text-foreground">
              {t("workNazaName")}
            </figcaption>
          </figure>
        </div>
        <div className="space-y-1 px-3 py-3">
          <p className="font-display text-base font-medium leading-snug text-foreground">{shareCore(locale, work, tab)}</p>
          <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{seo.description}</p>
          <div className="pt-1">
            <HashtagRow />
          </div>
          <p className="flex items-center gap-2 text-xs text-foreground">
            <LinkIcon className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate" dir="ltr">
              {pageUrl}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {t("shareOpensIn", { lang: t("langLabel"), tab: t(TAB_LABEL[tab]), work: t(WORK_LABEL[work]) })}
          </p>
        </div>
      </a>

      <div className="mt-4 rounded-xl bg-muted px-3 py-3">
        <p className="text-xs font-medium text-muted-foreground">{t("shareCaptionPreview")}</p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-pretty">{caption}</p>
        <p className="mt-2 truncate text-xs text-subtle" dir="ltr">
          {pageUrl}
        </p>
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {NETWORKS.map((n) => (
          <li key={n.id}>
            <a
              href={shareHref(n.id, pageUrl, locale, work, tab)}
              target="_blank"
              rel="noopener noreferrer"
              title={t(n.hintKey)}
              onClick={() => {
                setPreviewNet(n.id);
                trackClick(`share:${n.id}`);
              }}
              onFocus={() => setPreviewNet(n.id)}
              onPointerEnter={() => setPreviewNet(n.id)}
              className={cn(
                "flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                previewNet === n.id ? "bg-foreground text-background" : "bg-foreground/90 text-background",
              )}
            >
              <NetworkIcon id={n.id} />
              {t(n.labelKey)}
            </a>
          </li>
        ))}
        <li className="col-span-2 sm:col-span-3">
          <button
            type="button"
            onClick={() => void copyLink()}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-muted px-3 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? t("shareCopied") : t("shareCopy")}
          </button>
        </li>
      </ul>
    </section>
  );
}

export function Permalink({ className }: { className?: string }) {
  const { locale } = useI18n();
  const { view: work } = useWork();
  const [url, setUrl] = useState(deepShareUrl(locale, { work, tab: "map" }));
  useEffect(() => {
    setUrl(deepShareUrl(locale, { work, tab: "map" }));
  }, [locale, work]);
  return (
    <a
      href={url}
      className={cn(
        "inline-flex min-h-11 max-w-full items-center gap-2 text-sm text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <LinkIcon className="size-4 shrink-0" />
      <span className="truncate" dir="ltr">
        {url}
      </span>
    </a>
  );
}
