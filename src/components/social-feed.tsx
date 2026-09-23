import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  bucketPct,
  commentsByPlatform,
  needsTranslate,
  postBuckets,
  socialByPlatform,
  translatedText,
  type CommentEmotion,
  type MoodComment,
  type SocialPlatform,
  type SocialPost,
} from "@/lib/social";
import { countryDisplayName, flagEmoji } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";
import { useWork } from "@/lib/work";
import { cn } from "@/lib/utils";
import { trackClick } from "@/lib/track";
import { SocialViz } from "@/components/social-viz";
import { WORK_STILL } from "@/components/work-still";
import { seoFor } from "@/lib/seo";
import { deepShareUrl, ogImagePath, shareCore, shareHref, type ShareNetwork } from "@/lib/share";

function formatCount(n: number | undefined): string | null {
  if (n == null) return null;
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

function PlatformMark({ platform }: { platform: SocialPlatform }) {
  if (platform === "x") {
    return (
      <span className="inline-flex size-7 items-center justify-center rounded-md bg-foreground text-[11px] font-semibold text-background">
        𝕏
      </span>
    );
  }
  if (platform === "facebook") {
    return (
      <span className="inline-flex size-7 items-center justify-center rounded-md bg-[#1877F2] text-xs font-bold text-white">
        f
      </span>
    );
  }
  if (platform === "tiktok") {
    return (
      <span className="inline-flex size-7 items-center justify-center rounded-md bg-foreground text-[10px] font-bold text-background">
        TT
      </span>
    );
  }
  return (
    <span className="inline-flex size-7 items-center justify-center rounded-md bg-[linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)] text-[10px] font-bold text-white">
      IG
    </span>
  );
}

const EMOTION_KEY: Record<CommentEmotion, string> = {
  grief: "moodGrief",
  tooHard: "moodTooHard",
  praise: "moodPraise",
  solidarity: "moodSolidarity",
  anger: "moodAnger",
  sanitized: "moodSanitized",
  critical: "moodCriticalFine",
};

const LANG_KEY: Record<string, string> = {
  he: "langHe",
  en: "langEn",
  ar: "langAr",
  fr: "langFr",
  es: "langEs",
  ru: "langRu",
  pt: "langPt",
  nl: "langNl",
};

function Translatable({ id, text, lang }: { id: string; text: string; lang: string }) {
  const { t, locale } = useI18n();
  const { work } = useWork();
  const [on, setOn] = useState(false);
  useEffect(() => setOn(false), [locale]);
  const show = needsTranslate(lang, locale, id, work.tr);
  const body = on ? translatedText(id, text, lang, locale, work.tr) : text;
  return (
    <div>
      <p className="text-sm leading-relaxed text-pretty text-foreground">{body}</p>
      {show ? (
        <button
          type="button"
          className="mt-1.5 inline-flex h-10 items-center text-xs font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => {
            setOn((v) => !v);
            trackClick("social:translate");
          }}
        >
          {on ? t("showOriginal") : t("translateTo", { lang: t(LANG_KEY[locale] ?? "langHe") })}
          <span className="ms-1.5 text-muted-foreground">
            {t("fromLang", { lang: t(LANG_KEY[lang] ?? lang) })}
          </span>
        </button>
      ) : null}
    </div>
  );
}

function ToneBar({
  title,
  hint,
  support,
  mixed,
  critical,
  n,
}: {
  title: string;
  hint: string;
  support: number;
  mixed: number;
  critical: number;
  n: number;
}) {
  const { t } = useI18n();
  return (
    <div className="rounded-lg bg-muted px-3 py-3">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hint}</p>
      <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-background">
        <span className="bg-positive" style={{ width: `${support}%` }} />
        <span className="bg-mixed" style={{ width: `${mixed}%` }} />
        <span className="bg-negative" style={{ width: `${critical}%` }} />
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <span className="text-positive">
          {t("moodSupport")} {support}%
        </span>
        <span className="text-mixed">
          {t("moodMixed")} {mixed}%
        </span>
        <span className="text-negative">
          {t("moodCritical")} {critical}%
        </span>
        <span className="tabular-nums">n={n}</span>
      </div>
    </div>
  );
}

function MoodPanel({ platform }: { platform: SocialPlatform | "all" }) {
  const { t } = useI18n();
  const { work } = useWork();
  const [open, setOpen] = useState(true);
  const comments = useMemo(() => commentsByPlatform(platform, work.mood), [platform, work.mood]);
  const posts = useMemo(() => socialByPlatform(platform, work.posts), [platform, work.posts]);
  const support = bucketPct("support", comments);
  const mixed = bucketPct("mixed", comments);
  const critical = bucketPct("critical", comments);
  const pb = postBuckets(posts);
  const pn = posts.length || 1;
  const pSupport = Math.round((pb.support / pn) * 100);
  const pMixed = Math.round((pb.mixed / pn) * 100);
  const pCritical = Math.round((pb.critical / pn) * 100);
  const emotions = (Object.keys(work.mood.emotions) as CommentEmotion[])
    .map((key) => [key, comments.filter((c) => c.emotion === key).length] as const)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-2">
      <ToneBar
        title={t("postMoodTitle")}
        hint={t("postMoodHint", { n: posts.length })}
        support={pSupport}
        mixed={pMixed}
        critical={pCritical}
        n={posts.length}
      />
      <div className="rounded-lg bg-muted px-3 py-3">
        <p className="text-sm font-medium text-foreground">{t("moodTitle")}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {t(work.id === "naza" ? "nazaMoodHint" : "moodHint", {
            n: comments.length,
            locked: work.mood.facebookLocked,
            reactions: work.mood.facebookReactions,
          })}
        </p>
        <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-background">
          <span className="bg-positive" style={{ width: `${support}%` }} />
          <span className="bg-mixed" style={{ width: `${mixed}%` }} />
          <span className="bg-negative" style={{ width: `${critical}%` }} />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span className="text-positive">
            {t("moodSupport")} {support}%
          </span>
          <span className="text-mixed">
            {t("moodMixed")} {mixed}%
          </span>
          <span className="text-negative">
            {t("moodCritical")} {critical}%
          </span>
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] text-muted-foreground">
          {emotions.map(([key, n]) => (
            <li key={key} className="flex justify-between gap-2">
              <span>{t(EMOTION_KEY[key])}</span>
              <span className="tabular-nums">{n}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="mt-3 inline-flex h-10 items-center text-xs font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? t("moodHide") : t("moodShow")}
        </button>
        {open ? (
          <>
            <p className="mt-3 text-xs font-medium text-foreground">{t("commentLinksTitle")}</p>
            <ul className="mt-2 space-y-2">
              {comments.map((c) => (
                <MoodRow key={c.id} comment={c} />
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}

function MoodRow({ comment }: { comment: MoodComment }) {
  const { t, locale } = useI18n();
  const { work } = useWork();
  const [on, setOn] = useState(false);
  useEffect(() => setOn(false), [locale]);
  const variant = comment.bucket === "support" ? "positive" : comment.bucket === "critical" ? "critical" : "mixed";
  const show = needsTranslate(comment.lang, locale, comment.id, work.tr);
  const body = on ? translatedText(comment.id, comment.text, comment.lang, locale, work.tr) : comment.text;
  return (
    <li className="rounded-md bg-background px-2.5 py-2">
      <a
        href={comment.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClick(`comment:${comment.platform}`)}
        className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <p className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground">{comment.by}</span>
          <Badge variant={variant}>{t(EMOTION_KEY[comment.emotion])}</Badge>
        </p>
        <p className="mt-1 text-xs leading-relaxed text-pretty text-foreground">{body}</p>
        <span className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-xs font-medium text-foreground underline-offset-4 hover:underline">
          <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
          {t("commentOpen")}
        </span>
      </a>
      {show ? (
        <button
          type="button"
          className="mt-0.5 inline-flex h-10 items-center text-xs font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => {
            setOn((v) => !v);
            trackClick("social:translate");
          }}
        >
          {on ? t("showOriginal") : t("translateTo", { lang: t(LANG_KEY[locale] ?? "langHe") })}
          <span className="ms-1.5 text-muted-foreground">
            {t("fromLang", { lang: t(LANG_KEY[comment.lang] ?? comment.lang) })}
          </span>
        </button>
      ) : null}
    </li>
  );
}

function PostCard({ post, locale }: { post: SocialPost; locale: string }) {
  const { t } = useI18n();
  const { view } = useWork();
  const stats = [
    formatCount(post.reactions) ? `${formatCount(post.reactions)} ${t("socialReactions")}` : null,
    formatCount(post.comments) ? `${formatCount(post.comments)} ${t("socialComments")}` : null,
    formatCount(post.shares) ? `${formatCount(post.shares)} ${t("socialShares")}` : null,
    formatCount(post.views) ? `${formatCount(post.views)} ${t("socialViews")}` : null,
  ].filter(Boolean);
  const toneKey = post.tone === "positive" ? "quotePositive" : post.tone === "critical" ? "quoteCritical" : "quoteEmotional";
  const variant = post.tone === "positive" ? "positive" : post.tone === "critical" ? "critical" : "mixed";
  const still = view === "compare" && post.work ? WORK_STILL[post.work] : null;

  return (
    <article className="flex overflow-hidden rounded-lg bg-muted">
      {still ? (
        <img
          src={still}
          alt={t(post.work === "naza" ? "stillNazaAlt" : "stillFaudaAlt")}
          width={56}
          height={96}
          className="still w-14 shrink-0 object-cover"
        />
      ) : null}
      <div className="min-w-0 flex-1 px-3.5 py-3">
      <div className="flex items-start gap-3">
        <PlatformMark platform={post.platform} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            {post.by}
            {post.handle ? <span className="ms-1.5 font-normal text-muted-foreground">{post.handle}</span> : null}
          </p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-muted-foreground">
            {post.country ? (
              <span>
                <span className="me-1" aria-hidden="true">
                  {flagEmoji(post.country)}
                </span>
                {countryDisplayName(post.country, locale)}
              </span>
            ) : null}
            <Badge variant={variant}>{t(toneKey)}</Badge>
            {view === "compare" && post.work ? (
              <Badge variant="mixed">{t(post.work === "naza" ? "workNazaShort" : "workFaudaShort")}</Badge>
            ) : null}
          </p>
        </div>
      </div>
      <blockquote className="mt-2">
        <Translatable id={post.id} text={post.text} lang={post.lang} />
      </blockquote>
      {post.note ? <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{post.note}</p> : null}
      {stats.length ? <p className="mt-2 text-xs tabular-nums text-muted-foreground">{stats.join(" · ")}</p> : null}
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClick(`social:${post.platform}`)}
        className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-xs font-medium text-foreground underline-offset-4 hover:underline"
      >
        <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
        {t("socialOpen")}
      </a>
      </div>
    </article>
  );
}

const FILTERS: (SocialPlatform | "all")[] = ["all", "facebook", "x", "tiktok", "instagram"];

const NEXT_NETWORKS: ShareNetwork[] = ["whatsapp", "facebook", "x", "telegram"];

function SocialNextCard() {
  const { t, locale } = useI18n();
  const { view: work } = useWork();
  const seo = seoFor(locale);
  const url = deepShareUrl(locale, { work, tab: "algo" });
  const localHref = `?lang=${locale}&work=${work}&tab=algo`;
  const img = ogImagePath(locale, work);
  const title = shareCore(locale, work, "algo");
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${url}\n${title}`);
      setCopied(true);
      trackClick("share:copy:algo");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-xl bg-muted">
      <p className="px-3 pt-3 text-xs font-medium tracking-[0.14em] text-muted-foreground">{t("socialNextKicker")}</p>
      <a
        href={localHref}
        onClick={() => trackClick("social:next:algo")}
        className="mt-2 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <img
          src={img}
          alt={title}
          width={1200}
          height={630}
          className="aspect-[1200/630] w-full object-cover"
        />
        <div className="space-y-1 px-3 py-3">
          <p className="font-display text-base font-medium leading-snug text-foreground">{title}</p>
          <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{seo.description}</p>
          <p className="flex items-center gap-2 text-xs text-foreground">
            <LinkIcon className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate" dir="ltr">
              {url}
            </span>
          </p>
          <p className="inline-flex min-h-11 items-center text-xs font-medium text-foreground underline-offset-4 hover:underline">
            {t("socialNextCta")}
          </p>
        </div>
      </a>
      <ul className="grid grid-cols-2 gap-2 px-3 pb-3 sm:grid-cols-4">
        {NEXT_NETWORKS.map((id) => (
          <li key={id}>
            <a
              href={shareHref(id, url, locale, work, "algo")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(`share:${id}:algo`)}
              className="flex min-h-11 items-center justify-center rounded-lg bg-foreground px-2 text-xs font-medium text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {id === "whatsapp"
                ? t("netWhatsapp")
                : id === "facebook"
                  ? t("netFacebook")
                  : id === "x"
                    ? t("netX")
                    : t("netTelegram")}
            </a>
          </li>
        ))}
      </ul>
      <div className="px-3 pb-3">
        <button
          type="button"
          onClick={() => void copyLink()}
          className="flex min-h-11 w-full items-center justify-center rounded-lg bg-background px-3 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? t("shareCopied") : t("shareCopy")}
        </button>
      </div>
    </article>
  );
}

export function SocialFeed() {
  const { t, locale } = useI18n();
  const { work, view: workView, feedPosts } = useWork();
  const [platform, setPlatform] = useState<SocialPlatform | "all">("all");
  const [country, setCountry] = useState<string | "all">("all");
  const source = workView === "compare" ? feedPosts : work.posts;
  const posts = useMemo(() => {
    return socialByPlatform(platform, source).filter((p) => country === "all" || p.country === country);
  }, [platform, country, source]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-2 px-3 py-3">
        <SocialViz
          platform={platform}
          country={country}
          onPlatform={(p) => {
            setPlatform(p);
            trackClick(`viz:platform:${p}`);
          }}
          onCountry={(id) => {
            setCountry(id);
            trackClick(`viz:country:${id}`);
          }}
        />
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((opt) => (
            <button
              key={opt}
              type="button"
              aria-pressed={platform === opt}
              onClick={() => setPlatform(opt)}
              className={cn(
                "h-11 rounded-full px-3 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                platform === opt ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
              )}
            >
              {opt === "all"
                ? t("socialAll")
                : opt === "facebook"
                  ? t("netFacebook")
                  : opt === "x"
                    ? t("netX")
                    : opt === "tiktok"
                      ? t("netTiktok")
                      : t("netInstagram")}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{t("socialHint")}</p>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pb-28">
        {platform !== "instagram" ? <MoodPanel platform={platform} /> : null}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} locale={locale} />
        ))}
        {platform === "instagram" && posts.length === 0 ? (
          <p className="px-1 py-6 text-sm leading-relaxed text-muted-foreground">{t("socialIgEmpty")}</p>
        ) : null}
        {platform !== "instagram" && posts.length === 0 ? (
          <p className="px-1 py-6 text-sm text-muted-foreground">{t("socialEmpty")}</p>
        ) : null}
        <SocialNextCard />
      </div>
    </div>
  );
}
