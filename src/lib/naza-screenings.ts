import raw from "@/data/naza-screenings.json";

export type ScreeningKind = "festival" | "theatrical" | "social";
export type ScreeningStatus = "done" | "upcoming" | "now";

export type NazaScreening = {
  id: string;
  country: string;
  cityHe: string;
  cityEn: string;
  venueHe: string;
  venueEn: string;
  whenHe: string;
  whenEn: string;
  dates: string;
  dateEnd?: string;
  status: ScreeningStatus;
  kind: ScreeningKind;
  tbc?: boolean;
  coords: [number, number];
  source: string;
  tickets: string | null;
};

export const NAZA_SCREENINGS = raw as NazaScreening[];

export const NAZA_SCREENING_COUNTRIES = new Set(NAZA_SCREENINGS.map((s) => s.country));

export function todayIsoJerusalem(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function liveScreeningStatus(s: NazaScreening, today = todayIsoJerusalem()): ScreeningStatus {
  const start = s.dates;
  const end = s.dateEnd ?? s.dates;
  if (today < start) return "upcoming";
  if (s.dateEnd) {
    if (today > end) return "done";
    return "now";
  }
  if (today > start) return "now";
  if (today === start) return "now";
  return "upcoming";
}

export function screeningPinFill(s: NazaScreening): string {
  const st = liveScreeningStatus(s);
  if (st === "now") return "var(--color-heat)";
  if (st === "upcoming") return "var(--color-mixed)";
  return "var(--color-positive)";
}

export function hasScreeningCoords(s: NazaScreening): boolean {
  return Array.isArray(s.coords) && Number.isFinite(s.coords[0]) && Number.isFinite(s.coords[1]);
}

export function screeningById(id: string): NazaScreening | undefined {
  return NAZA_SCREENINGS.find((s) => s.id === id);
}

export function screeningsForCountry(id: string): NazaScreening[] {
  return NAZA_SCREENINGS.filter((s) => s.country === id);
}

export function isScreeningHover(id: string | null): id is `scr:${string}` {
  return Boolean(id?.startsWith("scr:"));
}

export function screeningFromHover(id: string | null): NazaScreening | undefined {
  if (!isScreeningHover(id)) return undefined;
  return screeningById(id.slice(4));
}
