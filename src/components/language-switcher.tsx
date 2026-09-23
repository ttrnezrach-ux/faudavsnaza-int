import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { LOCALES, LOCALE_META, useI18n, type Locale } from "@/lib/i18n";
import { trackClick } from "@/lib/track";
import { cn } from "@/lib/utils";

function Flag({ locale }: { locale: Locale }) {
  const className = "h-4 w-6 shrink-0 rounded-sm";
  if (locale === "he") {
    return (
      <svg viewBox="0 0 60 42" className={className} aria-hidden="true">
        <rect width="60" height="42" fill="#fff" />
        <rect y="6" width="60" height="7" fill="#0038b8" />
        <rect y="29" width="60" height="7" fill="#0038b8" />
        <path
          d="M30 14 L33.4 24 H22.6 Z M30 28 L26.6 18 H33.4 Z"
          fill="none"
          stroke="#0038b8"
          strokeWidth="1.4"
        />
      </svg>
    );
  }
  if (locale === "en") {
    return (
      <svg viewBox="0 0 60 42" className={className} aria-hidden="true">
        <rect width="60" height="42" fill="#012169" />
        <path d="M0 0 L60 42 M60 0 L0 42" stroke="#fff" strokeWidth="8" />
        <path d="M0 0 L60 42 M60 0 L0 42" stroke="#C8102E" strokeWidth="4" />
        <path d="M30 0 V42 M0 21 H60" stroke="#fff" strokeWidth="12" />
        <path d="M30 0 V42 M0 21 H60" stroke="#C8102E" strokeWidth="7" />
      </svg>
    );
  }
  if (locale === "ar") {
    return (
      <svg viewBox="0 0 60 42" className={className} aria-hidden="true">
        <rect width="60" height="14" fill="#165d31" />
        <rect y="14" width="60" height="14" fill="#fff" />
        <rect y="28" width="60" height="14" fill="#000" />
        <path d="M0 0 L18 21 L0 42 Z" fill="#c8102e" />
      </svg>
    );
  }
  if (locale === "fr") {
    return (
      <svg viewBox="0 0 60 42" className={className} aria-hidden="true">
        <rect width="20" height="42" fill="#002395" />
        <rect x="20" width="20" height="42" fill="#fff" />
        <rect x="40" width="20" height="42" fill="#ed2939" />
      </svg>
    );
  }
  if (locale === "es") {
    return (
      <svg viewBox="0 0 60 42" className={className} aria-hidden="true">
        <rect width="60" height="42" fill="#c60b1e" />
        <rect y="10.5" width="60" height="21" fill="#ffc400" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 60 42" className={className} aria-hidden="true">
      <rect width="60" height="14" fill="#fff" />
      <rect y="14" width="60" height="14" fill="#0039a6" />
      <rect y="28" width="60" height="14" fill="#d52b1e" />
    </svg>
  );
}

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const current = LOCALE_META[locale];

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const timer = window.setTimeout(() => {
      document.addEventListener("pointerdown", onPointer);
    }, 0);
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${t("langLabel")}: ${current.native}`}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 items-center gap-2 rounded-lg bg-card px-3 text-sm font-medium shadow-[var(--shadow-border-hover)] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Flag locale={locale} />
        <span>{current.native}</span>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={t("langLabel")}
          className="absolute top-full end-0 z-[80] mt-1 min-w-48 rounded-xl bg-card py-1 shadow-[var(--shadow-border-hover)]"
        >
          {LOCALES.map((id) => {
            const meta = LOCALE_META[id];
            const selected = id === locale;
            return (
              <li key={id} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    setLocale(id as Locale);
                    trackClick(`lang:${id}`);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex h-11 w-full items-center gap-3 px-3 text-start text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                    selected ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Flag locale={id} />
                  {meta.native}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
