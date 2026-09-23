import { countryById, type Country } from "@/lib/data";
import {
  COMMENT_MOOD,
  SOCIAL_POSTS,
  engagementOf,
  socialOf,
  type CommentEmotion,
  type CommentMood,
  type SocialPlatform,
  type SocialPost,
} from "@/lib/social";

export const VIZ_PLATFORMS: SocialPlatform[] = ["x", "facebook", "tiktok", "instagram"];

export function platformViz(posts: SocialPost[] = SOCIAL_POSTS) {
  return VIZ_PLATFORMS.map((platform) => {
    const list = posts.filter((p) => p.platform === platform);
    const engagement = list.reduce((s, p) => s + engagementOf(p), 0);
    return { platform, posts: list.length, engagement };
  });
}

export function countryViz(posts: SocialPost[] = SOCIAL_POSTS, countries: Country[] = []) {
  const ids = [...new Set(posts.map((p) => p.country).filter((id): id is string => Boolean(id)))];
  return ids
    .map((id) => {
      const country = countryById(id, countries.length ? countries : undefined);
      if (!country) return null;
      const list = posts.filter((p) => p.country === id);
      const s = socialOf(country, posts);
      return {
        id,
        posts: list.length,
        engagement: list.reduce((n, p) => n + engagementOf(p), 0),
        score: s.score,
        trend: s.trend,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row != null)
    .sort((a, b) => b.score - a.score || b.engagement - a.engagement);
}

export function timeViz(posts: SocialPost[] = SOCIAL_POSTS) {
  const byDay = new Map<string, number>();
  for (const p of posts) {
    byDay.set(p.at, (byDay.get(p.at) ?? 0) + 1);
  }
  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, count]) => ({ day, count }));
}

export function emotionViz(mood: CommentMood = COMMENT_MOOD) {
  const entries = Object.entries(mood.emotions) as [CommentEmotion, number][];
  const total = entries.reduce((s, [, n]) => s + n, 0) || 1;
  return entries
    .sort((a, b) => b[1] - a[1])
    .map(([emotion, n]) => ({ emotion, n, pct: Math.round((n / total) * 100) }));
}
