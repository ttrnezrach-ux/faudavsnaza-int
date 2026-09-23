import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import bundledVersions from "@/data/versions.json";
import bundledFindings from "@/data/findings.json";
import { RELEASE, formatReleaseVersion } from "@/lib/release";
import { jerusalemNow } from "@/lib/ingest";

export type SiteVersion = {
  version: number;
  releasedAt: string;
  noteHe: string;
  noteEn: string;
};

export type SiteFinding = {
  id: string;
  week: number;
  from: string;
  to: string;
  version: number | null;
  at: string;
  he: string;
  en: string;
};

export const BUNDLED_VERSIONS = bundledVersions as SiteVersion[];
export const BUNDLED_FINDINGS = bundledFindings as SiteFinding[];

function asIso(v: unknown): string {
  if (v instanceof Date) return v.toISOString();
  return String(v ?? "");
}

export async function listSiteVersions(): Promise<SiteVersion[]> {
  const map = new Map<number, SiteVersion>();
  for (const v of BUNDLED_VERSIONS) map.set(v.version, v);
  try {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<Record<string, unknown>>(
      "select version, released_at, note_he, note_en from site_versions order by version desc",
    );
    for (const r of rows) {
      const version = Number(r.version);
      if (!Number.isFinite(version)) continue;
      map.set(version, {
        version,
        releasedAt: asIso(r.released_at),
        noteHe: String(r.note_he ?? ""),
        noteEn: String(r.note_en ?? ""),
      });
    }
  } catch {
    /* bundled only */
  }
  return [...map.values()].sort((a, b) => b.version - a.version);
}

export async function listSiteFindings(): Promise<SiteFinding[]> {
  const out: SiteFinding[] = [...BUNDLED_FINDINGS];
  const seen = new Set(out.map((f) => f.id));
  try {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<Record<string, unknown>>(
      "select id, week, range_from, range_to, version, noted_at, note_he, note_en from site_findings order by week asc, noted_at asc",
    );
    for (const r of rows) {
      const id = String(r.id ?? "");
      if (!id || seen.has(id)) continue;
      seen.add(id);
      out.push({
        id,
        week: Number(r.week) || 0,
        from: String(r.range_from ?? ""),
        to: String(r.range_to ?? ""),
        version: r.version != null ? Number(r.version) : null,
        at: asIso(r.noted_at),
        he: String(r.note_he ?? ""),
        en: String(r.note_en ?? ""),
      });
    }
  } catch {
    /* bundled only */
  }
  return out.sort((a, b) => a.week - b.week || a.at.localeCompare(b.at));
}

export const getVersionBoard = createServerFn({ method: "GET" }).handler(async () => {
  const [versions, findings] = await Promise.all([listSiteVersions(), listSiteFindings()]);
  return {
    current: RELEASE.version,
    display: formatReleaseVersion(RELEASE.version),
    releasedAt: RELEASE.releasedAt,
    versions,
    findings,
  };
});

const appendInput = z.object({
  noteHe: z.string().trim().min(2).max(500),
  noteEn: z.string().trim().max(500).optional(),
  findingHe: z.string().trim().max(800).optional(),
  findingEn: z.string().trim().max(800).optional(),
  week: z.number().int().min(1).max(12).optional(),
  from: z.string().max(8).optional(),
  to: z.string().max(8).optional(),
});

export const appendSiteVersion = createServerFn({ method: "POST" })
  .validator(appendInput)
  .handler(async ({ data }) => {
    const { isOfficeUnlocked } = await import("@/lib/office-lock.server");
    if (!(await isOfficeUnlocked())) throw new Error("office locked");
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const clock = jerusalemNow();
    const existing = await listSiteVersions();
    const next = Math.max(RELEASE.version, ...existing.map((v) => v.version), 0) + 1;
    await sql.query(
      `insert into site_versions (version, released_at, note_he, note_en, finding_he, finding_en, week)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [
        next,
        clock.iso,
        data.noteHe,
        data.noteEn ?? "",
        data.findingHe ?? "",
        data.findingEn ?? "",
        data.week ?? null,
      ],
    );
    if (data.findingHe) {
      const id = `w${data.week ?? 0}-${clock.iso}`;
      await sql.query(
        `insert into site_findings (id, week, range_from, range_to, version, noted_at, note_he, note_en)
         values ($1, $2, $3, $4, $5, $6, $7, $8)
         on conflict (id) do nothing`,
        [
          id,
          data.week ?? 0,
          data.from ?? "",
          data.to ?? "",
          next,
          clock.iso,
          data.findingHe,
          data.findingEn ?? "",
        ],
      );
    }
    return {
      current: next,
      display: formatReleaseVersion(next),
      releasedAt: clock.iso,
      versions: await listSiteVersions(),
      findings: await listSiteFindings(),
    };
  });