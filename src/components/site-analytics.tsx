import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { VIEW_EVENT } from "@/lib/view-url";

/**
 * Three analytics layers, stacked. None of them replaces the others.
 * 1. First-party office — src/lib/track.ts writes visits and clicks into our database for /office.
 * 2. Google Analytics — src/lib/ga.ts and the gtag snippet in the document head
 *    (consent default: analytics_storage granted, ads denied).
 * 3. Vercel Web Analytics + Speed Insights — this component. On Vercel production
 *    it collects page views and web vitals; in development the scripts only log.
 */
export function SiteAnalytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  const [path, setPath] = useState(`${pathname}${searchStr}`);

  useEffect(() => {
    const sync = () => setPath(`${window.location.pathname}${window.location.search}`);
    sync();
    window.addEventListener(VIEW_EVENT, sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener(VIEW_EVENT, sync);
      window.removeEventListener("popstate", sync);
    };
  }, [pathname, searchStr]);

  return (
    <>
      <Analytics framework="react" route={pathname} path={path} />
      <SpeedInsights framework="react" route={pathname} />
    </>
  );
}
