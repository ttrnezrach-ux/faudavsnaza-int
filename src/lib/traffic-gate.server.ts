import { getCookie, getRequest, setCookie } from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";
import { authorizeMonitor } from "@/lib/monitor-auth";
import { isBotUserAgent, isInternalCheck, isPrefetch, trafficDecision, type TrafficDecision } from "@/lib/traffic-filter";

export const OWNER_COOKIE = "fauda_owner";
export const INTERNAL_COOKIE = "fauda_internal";
const BOT_SEEN_COOKIE = "fauda_bot_seen";
const OWNER_MAX_AGE = 400 * 24 * 60 * 60;

function cookieOpts(maxAge: number) {
  let secure = true;
  try {
    secure = new URL(getRequest().url).protocol === "https:";
  } catch {
    secure = true;
  }
  return { path: "/", httpOnly: true, sameSite: "lax" as const, secure, maxAge };
}

function headerGet(name: string): string | null {
  return getRequest()?.headers.get(name) ?? null;
}

export function currentTrafficDecision(): TrafficDecision {
  const monitor = authorizeMonitor(headerGet("authorization"), process.env.OFFICE_MONITOR_TOKEN);
  const internal = isInternalCheck({
    internalHeader: headerGet("x-internal-check"),
    monitorAuthorized: monitor === "ok",
    internalCookie: getCookie(INTERNAL_COOKIE) ?? null,
  });
  return trafficDecision({
    internal,
    ownerCookie: getCookie(OWNER_COOKIE) ?? null,
    prefetch: isPrefetch((name) => headerGet(name)),
    bot: isBotUserAgent(headerGet("user-agent")),
  });
}

/** Marks this browser so later visits are left out of the public totals. */
export function markOwnerDevice(): void {
  setCookie(OWNER_COOKIE, "1", cookieOpts(OWNER_MAX_AGE));
}

export function clearOwnerDevice(): void {
  setCookie(OWNER_COOKIE, "", cookieOpts(0));
}

export function ownerDeviceExcluded(): boolean {
  return getCookie(OWNER_COOKIE) === "1";
}

export async function noteBotHit(reason: "bot" | "prefetch"): Promise<void> {
  try {
    if (getCookie(BOT_SEEN_COOKIE) === "1") return;
    const sql = await getSql();
    await sql`insert into bot_hits (reason) values (${reason})`;
    setCookie(BOT_SEEN_COOKIE, "1", cookieOpts(60 * 30));
  } catch (err) {
    console.error("[traffic] bot hit was not stored:", err);
  }
}

/**
 * True when this request must not be written into visitor totals, charts, or anomalies.
 * Bot and prefetch hits are stored in `bot_hits` instead.
 */
export async function blockUncountedTraffic(): Promise<boolean> {
  const decision = currentTrafficDecision();
  if (decision === "count") return false;
  if (decision === "bot" || decision === "prefetch") await noteBotHit(decision);
  return true;
}

/** Document loads that never run the visit script, plus internal-check cookies. */
export async function noteDocumentTrafficNow(): Promise<{ ok: true }> {
  const monitor = authorizeMonitor(headerGet("authorization"), process.env.OFFICE_MONITOR_TOKEN);
  const headerInternal = isInternalCheck({
    internalHeader: headerGet("x-internal-check"),
    monitorAuthorized: monitor === "ok",
    internalCookie: null,
  });
  if (headerInternal) {
    setCookie(INTERNAL_COOKIE, "1", cookieOpts(60 * 60 * 24));
  }
  const decision = currentTrafficDecision();
  if (decision === "bot" || decision === "prefetch") await noteBotHit(decision);
  return { ok: true as const };
}

export async function readDeviceExclusion(): Promise<{ excluded: boolean }> {
  const { isOfficeUnlocked } = await import("@/lib/office-lock.server");
  if (!(await isOfficeUnlocked())) return { excluded: false };
  return { excluded: ownerDeviceExcluded() };
}

export async function writeDeviceExclusion(exclude: boolean): Promise<{ excluded: boolean }> {
  const { isOfficeUnlocked } = await import("@/lib/office-lock.server");
  if (!(await isOfficeUnlocked())) return { excluded: false };
  if (exclude) markOwnerDevice();
  else clearOwnerDevice();
  return { excluded: exclude };
}
