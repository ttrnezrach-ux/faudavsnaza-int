import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Dashboard } from "@/components/dashboard";
import { articleJsonLd, parseShareLang, seoFor } from "@/lib/seo";
import { isContentTab, isWorkViewParam, shareCore, type ContentTab } from "@/lib/share";
import type { WorkView } from "@/lib/work";

export const Route = createFileRoute("/")({
  component: Home,
  head: ({ match }) => {
    const lang = parseShareLang((match.search as { lang?: string }).lang);
    const work = (isWorkViewParam((match.search as { work?: string }).work)
      ? (match.search as { work: string }).work
      : "compare") as WorkView;
    const tab = (isContentTab((match.search as { tab?: string }).tab)
      ? (match.search as { tab: string }).tab
      : "map") as ContentTab;
    const seo = seoFor(lang);
    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.description },
        { property: "og:title", content: shareCore(lang, work, tab) },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(articleJsonLd("/", lang, work)),
        },
      ],
    };
  },
});

function Home() {
  return (
    <AppShell>
      <Dashboard />
    </AppShell>
  );
}