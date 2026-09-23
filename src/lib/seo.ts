import { LOCALES, type Locale } from "@/lib/i18n";
import { RELEASE } from "@/lib/release";

export type ShareSeo = {
  title: string;
  description: string;
  shareText: string;
  keywords: string;
  locale: string;
  tags: string[];
  hashtags: string[];
  twitterHashtags: string;
};

const COMMON_TAGS = ["Fauda", "Fauda 5", "NAZA", "Netflix", "Venice", "FlixPatrol"];

export const SEO_BY_LOCALE: Record<Locale, ShareSeo> = {
  he: {
    title: "פאודה 5 מול נז״א · מפת צפייה, שיח ופסטיבל",
    description:
      "אותה מתודולוגיה, שתי יצירות: פאודה 5 בנטפליקס מול הסרט התיעודי נז״א (נזק אגבי) מוונציה. דירוגים, טון שיח ורשתות לפי מדינה.",
    shareText: "פאודה 5 מול נז״א: אותה מפת מדינות, שלוש עדשות. צפייה, שיח, רשתות:",
    keywords: "פאודה, פאודה 5, Fauda, נז״א, NAZA, נטפליקס, Netflix, ונציה, FlixPatrol, ישראל, לבנון",
    locale: "he_IL",
    tags: ["פאודה", "פאודה 5", "נז״א", "NAZA", "נטפליקס", "ונציה", "ישראל", "לבנון", ...COMMON_TAGS],
    hashtags: ["#פאודה5", "#נזא", "#Fauda5", "#NAZA", "#נטפליקס", "#ונציה"],
    twitterHashtags: "Fauda5,NAZA,Netflix,Venice",
  },
  en: {
    title: "Fauda 5 vs NAZA · viewing, talk, festival",
    description:
      "Same method, two works: Fauda season 5 on Netflix versus the Venice documentary NAZA (collateral damage). Country map of ranks, discourse tone, and social posts.",
    shareText: "Fauda 5 vs NAZA: one country sample, three lenses. Viewing, talk, social:",
    keywords: "Fauda, Fauda 5, NAZA, Netflix, Venice, FlixPatrol, rankings, Israel, Lebanon",
    locale: "en_US",
    tags: ["Fauda", "Fauda 5", "NAZA", "Netflix", "Venice", "Lebanon", "Israel", ...COMMON_TAGS],
    hashtags: ["#Fauda5", "#NAZA", "#Netflix", "#Venice"],
    twitterHashtags: "Fauda5,NAZA,Netflix,Venice",
  },
  ar: {
    title: "فودا 5 مقابل نازا · خريطة المشاهدة والخطاب",
    description:
      "المنهج نفسه، عملان: فودا 5 على نتفليكس مقابل الوثائقي نازا (ضرر جانبي) من البندقية. تصنيف ونبرة خطاب ومنشورات حسب البلد.",
    shareText: "فودا 5 مقابل نازا: خريطة الدول، ثلاث عدسات. مشاهدة، خطاب، شبكات:",
    keywords: "فودا, فودا 5, نازا, نتفليكس, FlixPatrol, لبنان, إسرائيل",
    locale: "ar_AR",
    tags: ["فودا", "نازا", "نتفليكس", "لبنان", "إسرائيل", ...COMMON_TAGS],
    hashtags: ["#فودا", "#Fauda5", "#نازا", "#NAZA", "#نتفليكس", "#البندقية"],
    twitterHashtags: "Fauda5,NAZA,Netflix,Venice",
  },
  fr: {
    title: "Fauda 5 face à NAZA · audiences, débat, festival",
    description:
      "Même méthode, deux œuvres : Fauda saison 5 sur Netflix face au documentaire NAZA (dommages collatéraux) à Venise. Classements, ton du débat et posts par pays.",
    shareText: "Fauda 5 face à NAZA : une carte, trois lunettes. Audiences, débat, réseaux :",
    keywords: "Fauda, Fauda 5, NAZA, Netflix, Venise, FlixPatrol, Liban, Israël",
    locale: "fr_FR",
    tags: ["Fauda", "NAZA", "Netflix", "Venise", "Liban", "Israël", ...COMMON_TAGS],
    hashtags: ["#Fauda5", "#NAZA", "#Netflix", "#Venise"],
    twitterHashtags: "Fauda5,NAZA,Netflix,Venise",
  },
  es: {
    title: "Fauda 5 frente a NAZA · audiencia, debate, festival",
    description:
      "El mismo método, dos obras: Fauda temporada 5 en Netflix frente al documental NAZA (daño colateral) de Venecia. Rankings, tono del debate y publicaciones por país.",
    shareText: "Fauda 5 frente a NAZA: un mapa, tres lentes. Audiencia, debate, redes:",
    keywords: "Fauda, Fauda 5, NAZA, Netflix, Venecia, FlixPatrol, Líbano, Israel",
    locale: "es_ES",
    tags: ["Fauda", "NAZA", "Netflix", "Venecia", "Líbano", "Israel", ...COMMON_TAGS],
    hashtags: ["#Fauda5", "#NAZA", "#Netflix", "#Venecia"],
    twitterHashtags: "Fauda5,NAZA,Netflix,Venecia",
  },
  ru: {
    title: "«Фауда 5» против NAZA · просмотры, дискуссия, фестиваль",
    description:
      "Тот же метод, две работы: «Фауда 5» на Netflix против венецианского документального фильма NAZA («сопутствующий ущерб»). Рейтинги, тон дискуссии и посты по странам.",
    shareText: "«Фауда 5» против NAZA: одна карта, три линзы. Просмотры, дискуссия, сети:",
    keywords: "Фауда, Фауда 5, NAZA, Netflix, FlixPatrol, Ливан, Израиль",
    locale: "ru_RU",
    tags: ["Фауда", "NAZA", "Netflix", "Ливан", "Израиль", ...COMMON_TAGS],
    hashtags: ["#Фауда", "#Fauda5", "#NAZA", "#Netflix", "#Венеция"],
    twitterHashtags: "Fauda5,NAZA,Netflix,Venice",
  },
};

export const SEO = {
  ...SEO_BY_LOCALE.he,
  published: "2026-09-14",
  image: "/share-collage.jpg",
};

export function parseShareLang(raw: unknown): Locale {
  const v = typeof raw === "string" ? raw : "";
  return (LOCALES as readonly string[]).includes(v) ? (v as Locale) : "he";
}

export function seoFor(lang: Locale | string | undefined): ShareSeo {
  return SEO_BY_LOCALE[parseShareLang(lang)];
}

export type SeoWork = "fauda" | "naza" | "compare";

const FAUDA_HASHTAGS: Record<Locale, string[]> = {
  he: ["#פאודה", "#פאודה5", "#Fauda5", "#נטפליקס"],
  en: ["#Fauda", "#Fauda5", "#Netflix"],
  ar: ["#فودا", "#Fauda5", "#نتفليكس"],
  fr: ["#Fauda", "#Fauda5", "#Netflix"],
  es: ["#Fauda", "#Fauda5", "#Netflix"],
  ru: ["#Фауда", "#Fauda5", "#Netflix"],
};

const NAZA_HASHTAGS: Record<Locale, string[]> = {
  he: ["#נזא", "#NAZA", "#ונציה", "#נזקאגבי"],
  en: ["#NAZA", "#Venice", "#CollateralDamage"],
  ar: ["#نازا", "#NAZA", "#البندقية"],
  fr: ["#NAZA", "#Venise"],
  es: ["#NAZA", "#Venecia"],
  ru: ["#NAZA", "#Венеция"],
};

export function hashtagsFor(lang: Locale | string | undefined, work: SeoWork = "compare"): string[] {
  const locale = parseShareLang(lang);
  if (work === "naza") return NAZA_HASHTAGS[locale];
  if (work === "fauda") return FAUDA_HASHTAGS[locale];
  return seoFor(locale).hashtags;
}

export function hashtagLine(lang: Locale | string | undefined, work: SeoWork = "compare"): string {
  return hashtagsFor(lang, work).join(" ");
}

export const FACEBOOK_SHARE_URL = "https://faudaint.grok.me/";

export function shareCaption(lang: Locale = "he"): string {
  const seo = seoFor(lang);
  return `${seo.shareText}\n${seo.hashtags.join(" ")}`;
}

export function sharePageUrl(lang: Locale = "he"): string {
  const origin = (publicOrigin() || "https://faudaint.grok.me").replace(/\/$/, "");
  const u = new URL(`${origin}/`);
  u.searchParams.set("lang", lang);
  u.searchParams.set("work", "compare");
  u.searchParams.set("tab", "map");
  return u.toString();
}

export function shareImageUrl(lang: Locale = "he"): string {
  const origin = (publicOrigin() || "https://faudaint.grok.me").replace(/\/$/, "");
  return `${origin}/og-${lang}.jpg`;
}

export const SOURCE_HREF: Record<string, string> = {
  Ynet: "https://www.ynet.co.il/",
  "NYT / ידיעות": "https://www.nytimes.com/",
  "Jerusalem Post": "https://www.jpost.com/",
  Decider: "https://decider.com/",
  NDTV: "https://www.ndtv.com/",
  "Al-Araby Al-Jadeed": "https://www.alaraby.co.uk/",
  Walla: "https://news.walla.co.il/",
  "Télé-Loisirs": "https://www.programme-tv.net/",
  Telegraph: "https://www.telegraph.co.uk/",
  Wikipedia: "https://en.wikipedia.org/wiki/NAZA_(film)",
  Vulture: "https://www.vulture.com/article/review-naza-is-one-of-the-most-important-films-of-our-time.html",
  "Time Out": "https://www.timeout.com/movies/naza-review-2026",
  NYT: "https://www.nytimes.com/2026/09/14/world/middleeast/israel-naza-documentary-backlash.html",
  Reuters: "https://www.reuters.com/world/middle-east/israeli-whistleblowers-detail-gaza-civilian-toll-venice-film-2026-09-10/",
  "Vanity Fair Italia": "https://www.vanityfair.it/article/naza-vince-premio-speciale-giuria-venezia-israeliani-ucciso-bambini-governo-cerca-boicottare-film",
  X: "https://x.com/ariel_oseran/status/2099780089923670264",
  "+972": "https://www.972mag.com/naza-gaza-film-collateral-damage/",
};

export const OUTLET_LINKS = [
  { label: "FlixPatrol", href: "https://flixpatrol.com/title/fauda/" },
  { label: "JustWatch", href: "https://www.justwatch.com/us/tv-show/fauda" },
  { label: "Netflix Top 10", href: "https://www.netflix.com/tudum/top10" },
  { label: "נטפליקס", href: "https://www.netflix.com/title/80149421" },
  { label: "Ynet", href: SOURCE_HREF.Ynet },
  { label: "Jerusalem Post", href: SOURCE_HREF["Jerusalem Post"] },
  { label: "NYT", href: SOURCE_HREF["NYT / ידיעות"] },
  { label: "Decider", href: SOURCE_HREF.Decider },
  { label: "NDTV", href: SOURCE_HREF.NDTV },
  { label: "אל־ערבי אל־ג׳דיד", href: SOURCE_HREF["Al-Araby Al-Jadeed"] },
] as const;

export function publicOrigin(): string {
  const raw = String(
    (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_PUBLIC_HOSTNAME) ||
      process.env.VITE_PUBLIC_HOSTNAME ||
      "",
  )
    .split(",")[0]
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  return raw && raw.includes(".") ? `https://${raw}` : "";
}

export function articleJsonLd(pageUrl: string, lang: Locale = "he", work: SeoWork = "compare") {
  const seo = seoFor(lang);
  const origin = publicOrigin() || "https://faudaint.grok.me";
  const canonical = sharePageUrl(lang);
  const image = `${origin.replace(/\/$/, "")}/og-${lang}.jpg`;
  const tags = [...seo.tags, ...hashtagsFor(lang, work)];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: seo.title,
        url: origin,
        inLanguage: lang,
        publisher: { "@type": "Organization", name: "מפת השיח" },
      },
      {
        "@type": "NewsArticle",
        headline: seo.title,
        description: seo.description,
        inLanguage: lang,
        datePublished: SEO.published,
        dateModified: RELEASE.releasedAt,
        image: [image],
        mainEntityOfPage: pageUrl || canonical,
        url: canonical,
        author: { "@type": "Organization", name: "מפת השיח" },
        publisher: { "@type": "Organization", name: "מפת השיח" },
        about: [
          { "@type": "TVSeries", name: "Fauda" },
          { "@type": "Movie", name: "NAZA" },
        ],
        keywords: tags.join(", "),
        articleSection: work === "naza" ? "Film" : work === "fauda" ? "TV" : "Culture",
      },
    ],
  };
}
