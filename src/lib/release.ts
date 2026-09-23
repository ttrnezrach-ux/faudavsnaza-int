import releaseFile from "@/data/release.json";
import bundledChanges from "@/data/changes.json";
import { formatJerusalemClock, type ChangeNote } from "@/lib/ingest";

export type Release = {
  version: number;
  releasedAt: string;
};

export const RELEASE = releaseFile as Release;

export function displayVersion(note?: Pick<ChangeNote, "version"> | null): number {
  const fromNote = note?.version;
  if (typeof fromNote === "number" && fromNote > 0) return Math.max(fromNote, RELEASE.version);
  return RELEASE.version;
}

/** Integer 25 is shown as 2.5 so display and release match with a decimal. */
export function formatReleaseVersion(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return String(RELEASE.version / 10);
  const scaled = n >= 10 ? n / 10 : n;
  return scaled.toFixed(1);
}

export function displayReleasedIso(note?: Pick<ChangeNote, "lastRunAt"> | null): string {
  const a = Date.parse(RELEASE.releasedAt) || 0;
  const b = Date.parse(note?.lastRunAt || bundledChanges.lastRunAt || "") || 0;
  return b > a ? (note?.lastRunAt || bundledChanges.lastRunAt || RELEASE.releasedAt) : RELEASE.releasedAt;
}

export function displayClock(note?: Pick<ChangeNote, "lastRunAt"> | null): string | null {
  return formatJerusalemClock(displayReleasedIso(note));
}
