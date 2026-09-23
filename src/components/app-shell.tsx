import { useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { A11yWidget } from "@/components/a11y-widget";
import { LanguageSwitcher } from "@/components/language-switcher";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { WorkProvider } from "@/lib/work";
import { parseShareLang } from "@/lib/seo";
import { isWorkViewParam } from "@/lib/share";
import { trackPage } from "@/lib/track";
import { VIEW_EVENT } from "@/lib/view-url";
import { VersionStamp } from "@/components/version-stamp";

export function AppShell({ children }: { children: ReactNode }) {
  const search = useRouterState({ select: (s) => s.location.search as { lang?: string; work?: string } });
  const initialLocale = parseShareLang(search.lang);
  const initialView = isWorkViewParam(search.work) ? search.work : undefined;
  return (
    <I18nProvider initialLocale={initialLocale}>
      <WorkProvider initialView={initialView}>
        <ShellFrame>{children}</ShellFrame>
      </WorkProvider>
    </I18nProvider>
  );
}

function ShellFrame({ children }: { children: ReactNode }) {
  const { t, locale } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const send = () => {
      const path =
        pathname === "/" || pathname === "/office" || pathname === "/accessibility" ? pathname : "/other";
      const lang = document.documentElement.lang;
      const active = /^[a-z]{2}$/.test(lang) ? lang : locale;
      trackPage(path, active);
    };
    send();
    window.addEventListener(VIEW_EVENT, send);
    window.addEventListener("popstate", send);
    return () => {
      window.removeEventListener(VIEW_EVENT, send);
      window.removeEventListener("popstate", send);
    };
  }, [pathname, locale]);

  return (
    <>
      <a href="#main" className="skip-link">
        {t("skipMain")}
      </a>
      <div className="sticky top-0 z-[60] flex items-center justify-between gap-3 border-b border-border bg-background/95 px-3 py-2">
        <LanguageSwitcher />
        <VersionStamp className="text-[11px] text-muted-foreground" />
      </div>
      {children}
      <A11yWidget />
    </>
  );
}
