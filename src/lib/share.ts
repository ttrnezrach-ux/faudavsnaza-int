import { publicOrigin, hashtagLine } from "@/lib/seo";
import type { Locale } from "@/lib/i18n";
import type { WorkView } from "@/lib/work";

export const CONTENT_TABS = ["map", "social", "algo", "concl"] as const;
export type ContentTab = (typeof CONTENT_TABS)[number];

export const SHARE_NETWORKS = ["whatsapp", "facebook", "x", "telegram", "linkedin", "mail"] as const;
export type ShareNetwork = (typeof SHARE_NETWORKS)[number];

export function isContentTab(v: string | null | undefined): v is ContentTab {
  return v === "map" || v === "social" || v === "algo" || v === "concl";
}

export function isWorkViewParam(v: string | null | undefined): v is WorkView {
  return v === "fauda" || v === "naza" || v === "compare";
}

const LIVE = "https://faudavsnaza-int.vercel.app";

const WORK_HOOK: Record<Locale, Record<WorkView, string>> = {
  he: {
    compare: "פאודה 5 מול נז״א — אותה מתודולוגיה, שתי מכונות.",
    fauda: "פאודה 5: מפת הצפייה והשיח בנטפליקס.",
    naza: "נז״א (נזק אגבי): זוכה ונציה. שיח בלי שעות צפייה.",
  },
  en: {
    compare: "Fauda 5 vs NAZA — same method, two machines.",
    fauda: "Fauda 5: Netflix viewing and the talk around it.",
    naza: "NAZA (collateral damage): Venice winner. Talk, not hours watched.",
  },
  ar: {
    compare: "فودا 5 مقابل نازا — المنهج نفسه، آلتان.",
    fauda: "فودا 5: خريطة المشاهدة والخطاب على نتفليكس.",
    naza: "نازا (ضرر جانبي): جائزة البندقية. خطاب بلا ساعات مشاهدة.",
  },
  fr: {
    compare: "Fauda 5 face à NAZA — même méthode, deux machines.",
    fauda: "Fauda 5 : audiences Netflix et le débat.",
    naza: "NAZA (dommages collatéraux) : prix à Venise. Le débat, pas les heures.",
  },
  es: {
    compare: "Fauda 5 frente a NAZA — el mismo método, dos máquinas.",
    fauda: "Fauda 5: audiencia de Netflix y el debate.",
    naza: "NAZA (daño colateral): premio en Venecia. Debate, no horas vistas.",
  },
  ru: {
    compare: "«Фауда 5» против NAZA — тот же метод, две машины.",
    fauda: "«Фауда 5»: просмотры Netflix и разговор вокруг сериала.",
    naza: "NAZA («сопутствующий ущерб»): приз Венеции. Разговор, не часы просмотра.",
  },
};

const TAB_HOOK: Record<Locale, Record<ContentTab, string>> = {
  he: {
    map: "דירוג וטון לפי מדינה.",
    social: "מה אומרים בפיד — פוסטים, טון, מעורבות.",
    algo: "למה #1 אינו #1: נטפליקס מול אלגוריתם הסערה.",
    concl: "מסקנות השיח: הזדהות מול סערה, ולבנון שהאלגוריתם לא מחרים.",
  },
  en: {
    map: "Rank and tone, country by country.",
    social: "What the feed says — posts, tone, engagement.",
    algo: "Why #1 is not #1: Netflix versus the storm algorithm.",
    concl: "Findings: identification versus a storm — and Lebanon, where the algorithm does not boycott.",
  },
  ar: {
    map: "التصنيف والنبرة حسب البلد.",
    social: "ماذا يقول الشريط: منشورات ونبرة وتفاعل.",
    algo: "لماذا المركز 1 ليس المركز 1: نتفليكس مقابل خوارزمية العاصفة.",
    concl: "الخلاصات: تماهي مقابل عاصفة — ولبنان حيث الخوارزمية لا تقاطع.",
  },
  fr: {
    map: "Classement et ton, pays par pays.",
    social: "Ce que dit le fil — posts, ton, engagement.",
    algo: "Pourquoi le n°1 n’est pas le n°1 : Netflix face à l’algorithme de la tempête.",
    concl: "Conclusions : identification contre tempête — et le Liban, où l’algorithme ne boycotte pas.",
  },
  es: {
    map: "Puesto y tono, país por país.",
    social: "Lo que dice el feed: publicaciones, tono, engagement.",
    algo: "Por qué el n.º 1 no es el n.º 1: Netflix frente al algoritmo de la tormenta.",
    concl: "Conclusiones: identificación frente a tormenta — y Líbano, donde el algoritmo no boicotea.",
  },
  ru: {
    map: "Рейтинг и тон по странам.",
    social: "Что говорит лента — посты, тон, вовлечённость.",
    algo: "Почему 1-е место — не 1-е: Netflix против алгоритма бури.",
    concl: "Выводы: отождествление против бури — и Ливан, где алгоритм не бойкотирует.",
  },
};

const LI_TAIL: Record<Locale, string> = {
  he: "מפת מדינות, טון שיח ופיד ציבורי. לא סקר. לא פסק דין.",
  en: "A country map, discourse tone, and a public feed. Not a poll. Not a verdict.",
  ar: "خريطة دول ونبرة خطاب وشريط عام. ليس استطلاعاً. ليس حكماً.",
  fr: "Carte des pays, ton du débat, fil public. Pas un sondage. Pas un verdict.",
  es: "Mapa de países, tono del debate y un feed público. No es una encuesta. No es un veredicto.",
  ru: "Карта стран, тон дискуссии и открытая лента. Не опрос. Не приговор.",
};

export function hashtags(locale: Locale, work: WorkView): string {
  return hashtagLine(locale, work);
}

export function shareCore(locale: Locale, work: WorkView, tab: ContentTab): string {
  return `${WORK_HOOK[locale][work]} ${TAB_HOOK[locale][tab]}`.trim();
}

export function shareText(locale: Locale, work: WorkView, tab: ContentTab, network: ShareNetwork): string {
  const core = shareCore(locale, work, tab);
  const tags = hashtags(locale, work);
  if (network === "x") {
    const short = `${core} ${tags}`;
    return short.length > 240 ? `${core.slice(0, 180).trim()}… ${tags}` : short;
  }
  if (network === "linkedin") return `${core} ${LI_TAIL[locale]}`;
  if (network === "facebook") return core;
  if (network === "mail") return `${core}\n\n${tags}`;
  return `${core}\n${tags}`;
}

export function shareMailSubject(locale: Locale, work: WorkView, tab: ContentTab): string {
  return shareCore(locale, work, tab);
}

export function shareOrigin(): string {
  return (publicOrigin() || LIVE).replace(/\/$/, "");
}

export function deepShareUrl(
  lang: Locale = "he",
  opts?: { work?: WorkView; tab?: ContentTab },
): string {
  const u = new URL(`${shareOrigin()}/`);
  u.searchParams.set("lang", lang);
  const work = opts?.work ?? "compare";
  u.searchParams.set("work", work);
  const tab = opts?.tab ?? "map";
  u.searchParams.set("tab", tab);
  return u.toString();
}

export function ogImagePath(lang: Locale = "he", work: WorkView = "compare"): string {
  if (work === "naza") return "/works/naza.jpg";
  if (work === "fauda") return "/works/fauda.jpg";
  return `/og-${lang}.jpg`;
}

export function ogImageAbs(lang: Locale = "he", work: WorkView = "compare"): string {
  return `${shareOrigin()}${ogImagePath(lang, work)}`;
}

export function shareCopyBlock(lang: Locale, work: WorkView, tab: ContentTab): string {
  return `${deepShareUrl(lang, { work, tab })}\n${shareText(lang, work, tab, "whatsapp")}`;
}

export function shareHref(
  id: ShareNetwork,
  url: string,
  locale: Locale,
  work: WorkView,
  tab: ContentTab,
): string {
  const text = shareText(locale, work, tab, id);
  switch (id) {
    case "whatsapp":
      return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}&hashtag=${encodeURIComponent(work === "naza" ? "#NAZA" : "#Fauda5")}`;
    case "x":
      return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    case "telegram":
      return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    case "mail":
      return `mailto:?subject=${encodeURIComponent(shareMailSubject(locale, work, tab))}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
    default:
      return url;
  }
}

export function shareSeoBlurb(locale: Locale, work: WorkView, tab: ContentTab): string {
  return shareCore(locale, work, tab);
}

export const SHARE_COLLAGE = "/share-collage.jpg";
