import { latestRank, peakRank, type Country } from "@/lib/data";
import posts from "@/data/social.json";
import moodFile from "@/data/comment-mood.json";
import trFile from "@/data/social-tr.json";
import nazaPosts from "@/data/naza-social.json";
import nazaMoodFile from "@/data/naza-mood.json";
import nazaTrFile from "@/data/naza-social-tr.json";

export type SocialPlatform = "facebook" | "x" | "instagram" | "tiktok";
export type SourceLang = "he" | "en" | "ar" | "fr" | "es" | "ru" | "pt" | "nl";
export type SocialTrend = "up" | "down" | "flat";

export type SocialPost = {
  id: string;
  platform: SocialPlatform;
  country?: string;
  by: string;
  handle?: string;
  text: string;
  note?: string;
  url: string;
  tone: "positive" | "critical" | "emotional";
  lang: SourceLang;
  reactions?: number;
  comments?: number;
  shares?: number;
  views?: number;
  at: string;
  work?: "fauda" | "naza";
};

export type CommentEmotion = "grief" | "tooHard" | "praise" | "solidarity" | "anger" | "sanitized" | "critical";
export type CommentBucket = "support" | "mixed" | "critical";

export type MoodComment = {
  id: string;
  platform: SocialPlatform;
  by: string;
  text: string;
  emotion: CommentEmotion;
  bucket: CommentBucket;
  url: string;
  lang: SourceLang;
};

export type CommentMood = {
  sampleSize: number;
  facebookLocked: number;
  facebookReactions: number;
  buckets: Record<CommentBucket, number>;
  emotions: Record<string, number>;
  comments: MoodComment[];
};

export type CountrySocial = {
  score: number;
  trend: SocialTrend;
  posts: number;
  quotes: number;
  documented: boolean;
};

export const SOCIAL_POSTS = posts as SocialPost[];
export const COMMENT_MOOD = moodFile as CommentMood;
export const SOCIAL_TR = trFile as Record<string, Partial<Record<string, string>>>;
export const NAZA_SOCIAL_POSTS = (nazaPosts as SocialPost[]).map((p) => ({ ...p, work: "naza" as const }));
export const NAZA_COMMENT_MOOD = nazaMoodFile as CommentMood;
export const NAZA_SOCIAL_TR = nazaTrFile as Record<string, Partial<Record<string, string>>>;

export function socialByPlatform(
  platform: SocialPlatform | "all",
  list: SocialPost[] = SOCIAL_POSTS,
): SocialPost[] {
  if (platform === "all") return list;
  return list.filter((p) => p.platform === platform);
}

export function commentsByPlatform(
  platform: SocialPlatform | "all",
  mood: CommentMood = COMMENT_MOOD,
): MoodComment[] {
  if (platform === "all") return mood.comments;
  return mood.comments.filter((c) => c.platform === platform);
}

export function bucketPct(bucket: CommentBucket, items: { bucket: CommentBucket }[]): number {
  const n = items.length || 1;
  return Math.round((items.filter((i) => i.bucket === bucket).length / n) * 100);
}

export function postBuckets(items: SocialPost[]): Record<CommentBucket, number> {
  const out: Record<CommentBucket, number> = { support: 0, mixed: 0, critical: 0 };
  for (const p of items) {
    if (p.tone === "critical") out.critical += 1;
    else if (p.tone === "emotional") out.mixed += 1;
    else out.support += 1;
  }
  return out;
}

export function translatedText(
  id: string,
  original: string,
  lang: string,
  locale: string,
  tr: Record<string, Partial<Record<string, string>>> = SOCIAL_TR,
): string {
  if (lang === locale) return original;
  return tr[id]?.[locale] ?? tr[id]?.en ?? original;
}

export function needsTranslate(
  lang: string,
  locale: string,
  id: string,
  tr: Record<string, Partial<Record<string, string>>> = SOCIAL_TR,
): boolean {
  if (lang === locale) return false;
  return Boolean(tr[id]?.[locale] ?? tr[id]?.en);
}

export function engagementOf(p: SocialPost): number {
  return (p.reactions ?? 0) + (p.comments ?? 0) * 2 + (p.shares ?? 0) * 3 + Math.round((p.views ?? 0) / 80);
}

export function computeSocial(country: Country, list: SocialPost[]): CountrySocial {
  const mine = list.filter((p) => p.country === country.id);
  const quotes = country.quotes?.length ?? 0;
  const eng = mine.reduce((s, p) => s + engagementOf(p), 0);
  const peak = peakRank(country);
  const heat = peak == null ? 16 : Math.round((11 - peak) * 6.5);
  const volume = Math.min(36, mine.length * 11 + quotes * 7 + Math.min(16, Math.log10(eng + 1) * 7));
  const score = Math.max(8, Math.min(99, Math.round(heat + volume + country.positive * 0.12)));

  let trend: SocialTrend;
  if (mine.length > 0) {
    const net = mine.reduce((s, p) => s + (p.tone === "critical" ? -1 : p.tone === "positive" ? 1 : 0.25), 0);
    trend = net > 0.2 ? "up" : net < -0.2 ? "down" : "flat";
  } else {
    const first = country.ranks.find((r) => r != null) ?? null;
    const last = latestRank(country);
    if (first != null && last != null && last !== first) trend = last < first ? "up" : "down";
    else if (country.sentiment === "positive") trend = "up";
    else if (country.sentiment === "critical") trend = "down";
    else trend = "flat";
  }

  return { score, trend, posts: mine.length, quotes, documented: mine.length > 0 || quotes > 0 };
}

const socialCache = new Map<string, CountrySocial>();

export function socialOf(country: Country, list: SocialPost[] = SOCIAL_POSTS): CountrySocial {
  const key = `${country.id}:${list.length}:${list[0]?.id ?? ""}`;
  const hit = socialCache.get(key);
  if (hit) return hit;
  const next = computeSocial(country, list);
  socialCache.set(key, next);
  return next;
}

export function socialCountryIds(list: SocialPost[] = SOCIAL_POSTS): Set<string> {
  return new Set(list.map((p) => p.country).filter((id): id is string => Boolean(id)));
}
