import { hashtagsFor } from "@/lib/seo";
import { useI18n } from "@/lib/i18n";
import { useWork, type WorkView } from "@/lib/work";
import { trackClick } from "@/lib/track";

export function HashtagRow({ work }: { work?: WorkView }) {
  const { t, locale } = useI18n();
  const { view } = useWork();
  const tags = hashtagsFor(locale, work ?? view);
  return (
    <p className="flex flex-wrap gap-2" aria-label={t("seoHashtags")}>
      {tags.map((tag) => {
        const q = tag.replace(/^#/, "");
        return (
          <a
            key={tag}
            href={`https://x.com/hashtag/${encodeURIComponent(q)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick("hashtag:seo")}
            className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground underline-offset-4 hover:underline"
          >
            {tag}
          </a>
        );
      })}
    </p>
  );
}
