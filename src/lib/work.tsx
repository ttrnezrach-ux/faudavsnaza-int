import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  GLOBAL,
  RANK_DAYS,
  SNAPSHOT,
  allQuotes,
  countries as FAUDA_COUNTRIES,
  globalQuotes,
  type Country,
  type Quote,
} from "@/lib/data";
import {
  COMMENT_MOOD,
  NAZA_COMMENT_MOOD,
  NAZA_SOCIAL_POSTS,
  NAZA_SOCIAL_TR,
  SOCIAL_POSTS,
  SOCIAL_TR,
  socialOf,
  type CommentMood,
  type SocialPost,
} from "@/lib/social";
import { NAZA_DAYS, NAZA_GLOBAL, NAZA_QUOTES, NAZA_SNAPSHOT, nazaCountries } from "@/lib/naza";
import { LIVE, type LiveFile } from "@/lib/live";
import { getLatestLiveRun, runLiveIngest, type LiveRun } from "@/lib/ingest";

export type WorkId = "fauda" | "naza";
export type WorkView = WorkId | "compare";

export type WorkBundle = {
  id: WorkId;
  countries: Country[];
  global: typeof GLOBAL;
  snapshot: string;
  days: string[];
  posts: SocialPost[];
  mood: CommentMood;
  tr: Record<string, Partial<Record<string, string>>>;
  quotes: Quote[];
  source: string;
  presence: "netflix" | "discourse";
  defaultCountry: string;
};

export const FAUDA_WORK: WorkBundle = {
  id: "fauda",
  countries: FAUDA_COUNTRIES,
  global: GLOBAL,
  snapshot: SNAPSHOT,
  days: RANK_DAYS,
  posts: SOCIAL_POSTS.map((p) => ({ ...p, work: "fauda" as const })),
  mood: COMMENT_MOOD,
  tr: SOCIAL_TR,
  quotes: globalQuotes,
  source: LIVE.source,
  presence: "netflix",
  defaultCountry: "LB",
};

export const NAZA_WORK: WorkBundle = {
  id: "naza",
  countries: nazaCountries,
  global: NAZA_GLOBAL,
  snapshot: NAZA_SNAPSHOT,
  days: NAZA_DAYS,
  posts: NAZA_SOCIAL_POSTS,
  mood: NAZA_COMMENT_MOOD,
  tr: NAZA_SOCIAL_TR,
  quotes: NAZA_QUOTES,
  source: "https://en.wikipedia.org/wiki/NAZA_(film)",
  presence: "discourse",
  defaultCountry: "IT",
};

export const WORKS: Record<WorkId, WorkBundle> = {
  fauda: FAUDA_WORK,
  naza: NAZA_WORK,
};

type WorkValue = {
  view: WorkView;
  setView: (view: WorkView) => void;
  work: WorkBundle;
  other: WorkBundle;
  fauda: WorkBundle;
  naza: WorkBundle;
  socialOf: (c: Country) => ReturnType<typeof socialOf>;
  allQuotes: ReturnType<typeof allQuotes>;
  feedPosts: SocialPost[];
};

const WorkContext = createContext<WorkValue | null>(null);

function isWorkView(v: string | null): v is WorkView {
  return v === "fauda" || v === "naza" || v === "compare";
}

function patchFauda(overlay: LiveFile | null): WorkBundle {
  if (!overlay) return FAUDA_WORK;
  return {
    ...FAUDA_WORK,
    days: overlay.days,
    snapshot: overlay.snapshot,
    global: overlay.global,
    source: overlay.source,
    countries: FAUDA_WORK.countries.map((c) => {
      const ranks = overlay.ranks[c.id];
      if (!ranks || ranks.length !== overlay.days.length) return c;
      return { ...c, ranks };
    }),
  };
}

function overlayIfRicher(run: LiveRun | null | undefined): LiveFile | null {
  if (!run?.fauda) return null;
  if ((run.fauda.days?.length ?? 0) < LIVE.days.length) return null;
  const remote = Date.parse(run.lastRunAt || run.fauda.fetchedAt) || 0;
  const bundled = Date.parse(LIVE.fetchedAt) || 0;
  if (remote < bundled) return null;
  return run.fauda;
}

export function WorkProvider({ children, initialView }: { children: ReactNode; initialView?: WorkView }) {
  const [view, setViewState] = useState<WorkView>(isWorkView(initialView ?? null) ? initialView! : "compare");
  const [ready, setReady] = useState(false);
  const [overlay, setOverlay] = useState<LiveFile | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("work");
    if (isWorkView(fromUrl)) setViewState(fromUrl);
    setReady(true);
    const apply = (run: LiveRun | null | undefined) => {
      const next = overlayIfRicher(run);
      if (next) setOverlay(next);
    };
    void runLiveIngest({ data: {} })
      .then(apply)
      .catch(() => {
        void getLatestLiveRun().then(apply).catch(() => {});
      });
  }, []);

  const setView = useCallback((next: WorkView) => {
    setViewState(next);
    const url = new URL(window.location.href);
    url.searchParams.set("work", next);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  const fauda = useMemo(() => patchFauda(overlay), [overlay]);
  const work = view === "naza" ? NAZA_WORK : fauda;
  const other = work.id === "fauda" ? NAZA_WORK : fauda;

  const value = useMemo<WorkValue>(
    () => ({
      view,
      setView,
      work,
      other,
      fauda,
      naza: NAZA_WORK,
      socialOf: (c) => socialOf(c, work.posts),
      allQuotes: allQuotes(work.countries, work.quotes),
      feedPosts:
        view === "compare" ? [...FAUDA_WORK.posts, ...NAZA_WORK.posts] : work.posts,
    }),
    [view, setView, work, other, fauda],
  );

  if (!ready) {
    return <WorkContext.Provider value={value}>{children}</WorkContext.Provider>;
  }

  return <WorkContext.Provider value={value}>{children}</WorkContext.Provider>;
}

export function useWork(): WorkValue {
  const ctx = useContext(WorkContext);
  if (!ctx) throw new Error("useWork must be used within WorkProvider");
  return ctx;
}
