import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { parseShareLang, seoFor } from "@/lib/seo";
import { GA_ID, UC_SETTINGS_ID } from "@/lib/ga";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n";
import { isContentTab, isWorkViewParam, deepShareUrl, ogImageAbs, shareCore, type ContentTab } from "@/lib/share";
import type { WorkView } from "@/lib/work";
import { formatReleaseVersion, RELEASE } from "@/lib/release";
import appCss from "../styles.css?url";
import { noteDocumentTraffic } from "@/lib/traffic-gate";

export const Route = createRootRoute({
  beforeLoad: async () => {
    try {
      await noteDocumentTraffic();
    } catch (err) {
      console.error("[traffic] document filter failed:", err);
    }
  },
  validateSearch: (raw: Record<string, unknown>): { lang?: Locale; work?: string; tab?: string } => {
    const out: { lang?: Locale; work?: string; tab?: string } = {};
    if (typeof raw.lang === "string" && (LOCALES as readonly string[]).includes(raw.lang)) {
      out.lang = raw.lang as Locale;
    }
    if (typeof raw.work === "string" && isWorkViewParam(raw.work)) out.work = raw.work;
    if (typeof raw.tab === "string" && isContentTab(raw.tab)) out.tab = raw.tab;
    return out;
  },
  head: ({ match }) => {
    const lang = parseShareLang(match.search.lang);
    const work = (isWorkViewParam(match.search.work) ? match.search.work : "compare") as WorkView;
    const tab = (isContentTab(match.search.tab) ? match.search.tab : "map") as ContentTab;
    const seo = seoFor(lang);
    const page = deepShareUrl(lang, { work, tab });
    const imageAbs = ogImageAbs(lang, work);
    const ogTitle = shareCore(lang, work, tab);
    const ogDesc = seo.description;
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: seo.title },
        { name: "description", content: ogDesc },
        { name: "keywords", content: `${seo.keywords}, ${seo.hashtags.join(", ")}` },
        { name: "author", content: "מפת השיח" },
        { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
        { name: "theme-color", content: "#0c0d0e" },
        { name: "release", content: formatReleaseVersion(RELEASE.version) },
        { name: "revised", content: RELEASE.releasedAt },
        { httpEquiv: "Cache-Control", content: "no-store" },
        { property: "og:locale", content: seo.locale },
        ...LOCALES.filter((l) => l !== lang).map((l) => ({ property: "og:locale:alternate", content: seoFor(l).locale })),
        { property: "og:type", content: "article" },
        { property: "og:url", content: page },
        { property: "og:site_name", content: seo.title },
        { property: "og:title", content: ogTitle },
        { property: "og:description", content: ogDesc },
        { property: "og:image", content: imageAbs },
        { property: "og:image:secure_url", content: imageAbs },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: ogTitle },
        { property: "og:image:type", content: "image/jpeg" },
        { property: "article:published_time", content: "2026-09-14" },
        { property: "article:modified_time", content: RELEASE.releasedAt },
        { property: "article:section", content: work === "naza" ? "Film" : "TV" },
        ...seo.tags.map((tag) => ({ property: "article:tag", content: tag })),
        ...seo.hashtags.map((tag) => ({ property: "article:tag", content: tag })),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: ogTitle },
        { name: "twitter:description", content: ogDesc },
        { name: "twitter:image", content: imageAbs },
        { name: "twitter:image:alt", content: ogTitle },
      ],
      links: [
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/icon-32.png" },
        { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192.png" },
        { rel: "icon", type: "image/png", sizes: "512x512", href: "/icon-512.png" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "stylesheet", href: appCss },
        { rel: "manifest", href: "/__grok/manifest.webmanifest" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/icon-180.png" },
        { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
        { rel: "canonical", href: page },
        { rel: "image_src", href: imageAbs },
        { rel: "alternate", hrefLang: "x-default", href: deepShareUrl("he", { work, tab }) },
        ...LOCALES.map((l) => ({ rel: "alternate" as const, hrefLang: l, href: deepShareUrl(l, { work, tab }) })),
      ],
      scripts: [
        {
          children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});`,
        },
        {
          id: "usercentrics-cmp",
          async: true,
          src: "https://app.usercentrics.eu/browser-ui/latest/loader.js",
          "data-settings-id": UC_SETTINGS_ID,
        },
        { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}` },
        {
          children: `gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true,send_page_view:true});`,
        },
      ],
    };
  },
  component: RootShell,
});

function RootShell() {
  const search = Route.useSearch();
  const lang = parseShareLang(search.lang);
  const dir = LOCALE_META[lang].dir;
  return (
    <html lang={lang} dir={dir} className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}