import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  TONE_LABEL,
  inTop10,
  peakRank,
  searchCountries,
  searchSuggestions,
  type Country,
  type Tone,
} from "@/lib/data";
import { isoOf } from "@/lib/iso";
import { SocialMark } from "@/components/social-mark";
import { useWork } from "@/lib/work";
import { cn } from "@/lib/utils";

const TONE_BADGE: Record<Tone, "positive" | "mixed" | "critical"> = {
  positive: "positive",
  mixed: "mixed",
  critical: "critical",
};

function formatRank(n: number | null): string {
  return n == null ? "—" : String(n);
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const lower = text.toLowerCase();
  const needle = q.toLowerCase();
  const i = lower.indexOf(needle);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-heat-soft text-foreground">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

type Props = {
  onSelect: (id: string) => void;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
};

export function CountrySearch({ onSelect, hoveredId, onHover }: Props) {
  const listId = useId();
  const inputId = useId();
  const statusId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const { work } = useWork();
  const list = work.countries;

  const hits = useMemo(() => searchCountries(query, list), [query, list]);
  const suggestions = useMemo(() => searchSuggestions(list), [list]);
  const searching = query.trim().length > 0;
  const rows: Country[] = searching ? hits.map((h) => h.country) : suggestions;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (active >= rows.length) setActive(0);
  }, [active, rows.length]);

  function pick(id: string) {
    onSelect(id);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (rows.length ? (i + 1) % rows.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (rows.length ? (i - 1 + rows.length) % rows.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const row = rows[active];
      if (row) pick(row.id);
    } else if (e.key === "Escape") {
      if (query) {
        e.preventDefault();
        setQuery("");
      }
    }
  }

  const activeId = rows[active] ? `${listId}-${rows[active].id}` : undefined;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-2 px-3 py-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-subtle" />
          <Input
            ref={inputRef}
            id={inputId}
            type="text"
            role="combobox"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="שם, IL, ISR או 376"
            aria-label="חיפוש מדינה ידני"
            aria-autocomplete="list"
            aria-expanded={rows.length > 0}
            aria-controls={listId}
            aria-activedescendant={activeId}
            aria-describedby={statusId}
            className="h-11 pr-10 pl-10"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="absolute top-1/2 left-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="נקה חיפוש"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
        <p id={statusId} className="px-0.5 text-xs text-muted-foreground" aria-live="polite">
          {searching
            ? hits.length
              ? `${hits.length} תוצאות — בחרו מהרשימה או השתמשו בחצים`
              : "אין התאמה. נסו שם, IL, ISR או 376"
            : "הקלידו לחיפוש, או בחרו הצעה"}
        </p>
      </div>

      {searching && hits.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <p className="text-sm font-medium">לא נמצאה מדינה</p>
          <p className="mt-1 text-xs text-muted-foreground">נסו ״לבנון״, ״France״ או ״US״</p>
        </div>
      ) : (
        <ul
          id={listId}
          role="listbox"
          aria-label={searching ? "תוצאות חיפוש" : "מדינות מוצעות"}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          {rows.map((c, i) => {
            const peak = peakRank(c);
            const iso = isoOf(c.id);
            const isActive = i === active || c.id === hoveredId;
            const hit = searching ? hits[i] : undefined;
            const showEn = hit ? hit.matched !== c.nameHe : true;
            return (
              <li key={c.id} role="presentation">
                <button
                  type="button"
                  id={`${listId}-${c.id}`}
                  role="option"
                  aria-selected={i === active}
                  aria-label={`${c.nameHe}, ${iso.alpha2}, ${iso.alpha3}, ${iso.numeric}, שיא ${formatRank(peak)}, שיח ${TONE_LABEL[c.sentiment]}`}
                  onMouseEnter={() => {
                    setActive(i);
                    onHover(c.id);
                  }}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => {
                    setActive(i);
                    onHover(c.id);
                  }}
                  onClick={() => pick(c.id)}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-3 px-3 py-2.5 text-right transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive ? "bg-muted" : "hover:bg-muted/70",
                  )}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium tabular-nums tracking-wide">
                    {iso.alpha2}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="min-w-0 truncate font-medium">
                        <Highlight text={c.nameHe} query={query} />
                        {showEn ? (
                          <span className="mr-2 text-xs font-normal text-muted-foreground">
                            <Highlight text={c.nameEn} query={query} />
                          </span>
                        ) : null}
                      </span>
                      <span className="flex items-center gap-2">
                        <SocialMark country={c} />
                        <Badge variant={TONE_BADGE[c.sentiment]}>{TONE_LABEL[c.sentiment]}</Badge>
                      </span>
                    </span>
                    <span className="mt-1 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                      <span className="tabular-nums tracking-wide">
                        <Highlight text={iso.alpha3} query={query} /> · {iso.numeric}
                      </span>
                      <span>
                        {inTop10(c) ? `שיא #${peak}` : "לא בטופ 10"}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
