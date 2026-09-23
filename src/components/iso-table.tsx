import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  TONE_LABEL,
  inTop10,
  peakRank,
  type Country,
  type Tone,
} from "@/lib/data";
import { isoOf } from "@/lib/iso";
import { useWork } from "@/lib/work";
import { cn } from "@/lib/utils";

const TONE_BADGE: Record<Tone, "positive" | "mixed" | "critical"> = {
  positive: "positive",
  mixed: "mixed",
  critical: "critical",
};

function formatRank(n: number | null): string {
  return n == null ? "—" : `#${n}`;
}

function matchesIso(c: Country, q: string): boolean {
  if (!q) return true;
  const iso = isoOf(c.id);
  const n = q.replace(/^0+/, "") || "0";
  return (
    c.nameHe.includes(q) ||
    c.nameEn.toLowerCase().includes(q.toLowerCase()) ||
    iso.alpha2.toLowerCase().includes(q.toLowerCase()) ||
    iso.alpha3.toLowerCase().includes(q.toLowerCase()) ||
    iso.numeric.includes(q) ||
    iso.numeric.replace(/^0+/, "") === n
  );
}

type Props = {
  onSelect: (id: string) => void;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
};

export function IsoTable({ onSelect, hoveredId, onHover }: Props) {
  const [query, setQuery] = useState("");
  const { work } = useWork();
  const countries = work.countries;

  const rows = useMemo(() => {
    const q = query.trim();
    return countries
      .filter((c) => matchesIso(c, q))
      .sort((a, b) => a.id.localeCompare(b.id));
  }, [query, countries]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-2 px-3 py-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-subtle" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="IL, ISR, 376 או שם מדינה"
            className="h-11 pr-10"
            aria-label="סינון לפי קוד ISO או שם"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          ISO 3166-1 · {rows.length} מדינות · α-2, α-3 ומספרי
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">מיפוי קודי ISO 3166-1 למדינות במדגם</caption>
          <thead className="sticky top-0 bg-card">
            <tr className="text-xs text-muted-foreground">
              <th scope="col" className="px-3 py-2 text-right font-medium">
                α-2
              </th>
              <th scope="col" className="px-2 py-2 text-right font-medium">
                α-3
              </th>
              <th scope="col" className="px-2 py-2 text-right font-medium">
                מס׳
              </th>
              <th scope="col" className="px-2 py-2 text-right font-medium">
                מדינה
              </th>
              <th scope="col" className="px-3 py-2 text-left font-medium">
                שיא
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const iso = isoOf(c.id);
              const active = c.id === hoveredId;
              return (
                <tr
                  key={c.id}
                  className={cn("cursor-pointer", active ? "bg-muted" : "hover:bg-muted/70")}
                  onMouseEnter={() => onHover(c.id)}
                  onMouseLeave={() => onHover(null)}
                  onClick={() => onSelect(c.id)}
                >
                  <td className="p-0">
                    <button
                      type="button"
                      onClick={() => onSelect(c.id)}
                      onFocus={() => onHover(c.id)}
                      aria-label={`${c.nameHe}, ${iso.alpha2}, ${iso.alpha3}, ${iso.numeric}, שיא ${formatRank(peakRank(c))}, שיח ${TONE_LABEL[c.sentiment]}`}
                      className="flex min-h-11 w-full items-center px-3 text-right font-medium tabular-nums tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {iso.alpha2}
                    </button>
                  </td>
                  <td className="px-2 tabular-nums tracking-wide text-muted-foreground">{iso.alpha3}</td>
                  <td className="px-2 tabular-nums text-muted-foreground">{iso.numeric}</td>
                  <td className="px-2">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate font-medium">{c.nameHe}</span>
                      <Badge variant={TONE_BADGE[c.sentiment]} className="hidden sm:inline-flex">
                        {TONE_LABEL[c.sentiment]}
                      </Badge>
                    </span>
                  </td>
                  <td className="px-3 text-left tabular-nums text-muted-foreground">
                    {inTop10(c) ? formatRank(peakRank(c)) : "—"}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  אין קוד או מדינה בהתאמה.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
