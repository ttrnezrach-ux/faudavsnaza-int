import { engagementOf, type SocialPlatform, type SocialPost } from "@/lib/social";

export type AlgoTone = "positive" | "emotional" | "critical";

export type ToneEng = {
  tone: AlgoTone;
  n: number;
  eng: number;
  avg: number;
};

export type PlatformEng = {
  platform: SocialPlatform;
  n: number;
  eng: number;
};

const TONES: AlgoTone[] = ["positive", "emotional", "critical"];

export function toneEngagement(posts: SocialPost[]): ToneEng[] {
  const buckets: Record<AlgoTone, { n: number; eng: number }> = {
    positive: { n: 0, eng: 0 },
    emotional: { n: 0, eng: 0 },
    critical: { n: 0, eng: 0 },
  };
  for (const p of posts) {
    const b = buckets[p.tone as AlgoTone];
    if (!b) continue;
    b.n += 1;
    b.eng += engagementOf(p);
  }
  return TONES.map((tone) => {
    const d = buckets[tone];
    return { tone, n: d.n, eng: d.eng, avg: d.n ? Math.round(d.eng / d.n) : 0 };
  });
}

export function platformEngagement(posts: SocialPost[]): PlatformEng[] {
  const buckets = new Map<SocialPlatform, { n: number; eng: number }>();
  for (const p of posts) {
    const cur = buckets.get(p.platform) ?? { n: 0, eng: 0 };
    cur.n += 1;
    cur.eng += engagementOf(p);
    buckets.set(p.platform, cur);
  }
  return [...buckets.entries()]
    .map(([platform, d]) => ({ platform, n: d.n, eng: d.eng }))
    .sort((a, b) => b.eng - a.eng || b.n - a.n);
}

export function postsWithCounts(posts: SocialPost[]): number {
  return posts.filter((p) => engagementOf(p) > 0).length;
}

export function emotionRatio(rows: ToneEng[]): number | null {
  const pos = rows.find((r) => r.tone === "positive");
  const emo = rows.find((r) => r.tone === "emotional");
  if (!pos || !emo || pos.avg <= 0 || emo.n === 0) return null;
  return Math.round((emo.avg / pos.avg) * 10) / 10;
}

export const ALGO_CASES = ["IL", "LB", "IT"] as const;
export type AlgoCaseId = (typeof ALGO_CASES)[number];
