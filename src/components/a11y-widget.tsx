import { useEffect, useId, useRef, useState } from "react";
import {
  Accessibility,
  ALargeSmall,
  Contrast,
  Link2,
  Pause,
  Type,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "fauda-a11y";

type Prefs = {
  scale: 100 | 125 | 150;
  contrast: boolean;
  links: boolean;
  readable: boolean;
  pause: boolean;
};

const DEFAULT: Prefs = {
  scale: 100,
  contrast: false,
  links: false,
  readable: false,
  pause: false,
};

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<Prefs>;
    return {
      scale: parsed.scale === 125 || parsed.scale === 150 ? parsed.scale : 100,
      contrast: Boolean(parsed.contrast),
      links: Boolean(parsed.links),
      readable: Boolean(parsed.readable),
      pause: Boolean(parsed.pause),
    };
  } catch {
    return DEFAULT;
  }
}

function applyPrefs(prefs: Prefs) {
  const root = document.documentElement;
  root.style.fontSize = `${prefs.scale}%`;
  root.classList.toggle("a11y-contrast", prefs.contrast);
  root.classList.toggle("a11y-links", prefs.links);
  root.classList.toggle("a11y-readable", prefs.readable);
  root.classList.toggle("a11y-pause", prefs.pause);
}

export function A11yWidget() {
  const panelId = useId();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT);

  useEffect(() => {
    const next = loadPrefs();
    setPrefs(next);
    applyPrefs(next);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const first = panelRef.current?.querySelector<HTMLElement>("button");
    first?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function update(patch: Partial<Prefs>) {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      applyPrefs(next);
      return next;
    });
  }

  return (
    <div className="fixed right-3 bottom-24 z-50">
      <button
        ref={launcherRef}
        type="button"
        className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        aria-label={open ? "סגירת תפריט נגישות" : "פתיחת תפריט נגישות"}
        onClick={() =>
          setOpen((v) => {
            if (v) launcherRef.current?.focus();
            return !v;
          })
        }
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Accessibility className="size-5" aria-hidden="true" />}
      </button>

      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="התאמות נגישות"
          className="absolute bottom-14 right-0 w-72 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-card p-4 shadow-[var(--shadow-border-hover)]"
        >
          <p className="mb-3 text-sm font-medium">התאמות נגישות</p>
          <ul className="space-y-2">
            <li>
              <p className="mb-1 text-xs text-muted-foreground">גודל טקסט</p>
              <div className="flex gap-1" role="group" aria-label="גודל טקסט">
                {([100, 125, 150] as const).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => update({ scale: n })}
                    aria-pressed={prefs.scale === n}
                    className={cn(
                      "h-11 flex-1 rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      prefs.scale === n
                        ? "bg-foreground text-background"
                        : "bg-muted text-foreground",
                    )}
                  >
                    {n}%
                  </button>
                ))}
              </div>
            </li>
            <li>
              <Toggle
                pressed={prefs.contrast}
                onToggle={() => update({ contrast: !prefs.contrast })}
                icon={Contrast}
                label="ניגודיות גבוהה"
              />
            </li>
            <li>
              <Toggle
                pressed={prefs.readable}
                onToggle={() => update({ readable: !prefs.readable })}
                icon={Type}
                label="גופן קריא"
              />
            </li>
            <li>
              <Toggle
                pressed={prefs.links}
                onToggle={() => update({ links: !prefs.links })}
                icon={Link2}
                label="הדגשת קישורים"
              />
            </li>
            <li>
              <Toggle
                pressed={prefs.pause}
                onToggle={() => update({ pause: !prefs.pause })}
                icon={Pause}
                label="עצירת אנימציות"
              />
            </li>
          </ul>
          <button
            type="button"
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-muted text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => update(DEFAULT)}
          >
            <ALargeSmall className="size-4" aria-hidden="true" />
            איפוס הגדרות
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Toggle({
  pressed,
  onToggle,
  icon: Icon,
  label,
}: {
  pressed: boolean;
  onToggle: () => void;
  icon: typeof Contrast;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onToggle}
      className={cn(
        "flex h-11 w-full items-center gap-2 rounded-md px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        pressed ? "bg-foreground text-background" : "bg-muted text-foreground",
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}
