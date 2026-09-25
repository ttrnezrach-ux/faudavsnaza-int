import { createHmac, timingSafeEqual } from "node:crypto";
import { getCookie, getRequest, setCookie } from "@tanstack/react-start/server";
import QRCode from "qrcode";
import { formatSecret, otpauthUrl, verifyTotp } from "@/lib/totp";
import { markOwnerDevice } from "@/lib/traffic-gate.server";
import type { OfficeLockState } from "@/lib/office-lock";

const COOKIE = "office_unlock";
const FAIL_COOKIE = "office_fail";
const TTL = 60 * 60 * 12;
const OFFICE_PASSWORD = "NazaFauda#2108";
const OFFICE_TOTP_SECRET = "LYQONHQJCQKXFXH4IEADN2HPAOEEXJWP";

/**
 * Stateless office lock: no DATABASE_URL / PGLite.
 * Production Vercel has no Neon URL, and PGLite fails there
 * (`ENOENT …/pglite.data`), which previously hid the QR behind a fake "locked" UI.
 */

function cookieOpts() {
  let secure = true;
  try {
    const url = getRequest().url;
    secure = new URL(url).protocol === "https:";
  } catch {
    secure = true;
  }
  return { path: "/", httpOnly: true, sameSite: "lax" as const, secure };
}

function sameText(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function sign(secret: string, exp: number): string {
  const sig = createHmac("sha256", secret).update(`office:${exp}`).digest("base64url");
  return `${exp}.${sig}`;
}

function cookieValid(secret: string): boolean {
  const raw = getCookie(COOKIE);
  if (!raw) return false;
  const dot = raw.indexOf(".");
  if (dot < 1) return false;
  const exp = Number(raw.slice(0, dot));
  const sig = raw.slice(dot + 1);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  const expected = createHmac("sha256", secret).update(`office:${exp}`).digest("base64url");
  return sameText(sig, expected);
}

function passwordMatches(password: string): boolean {
  const a = Buffer.from(password, "utf8");
  const b = Buffer.from(OFFICE_PASSWORD, "utf8");
  if (a.length !== b.length) {
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

function readFails(): { count: number; until: number } {
  const raw = getCookie(FAIL_COOKIE);
  if (!raw) return { count: 0, until: 0 };
  const [c, u] = raw.split(".");
  const count = Number(c);
  const until = Number(u);
  return {
    count: Number.isFinite(count) ? count : 0,
    until: Number.isFinite(until) ? until : 0,
  };
}

function writeFails(count: number, until: number): void {
  setCookie(FAIL_COOKIE, `${count}.${until}`, { ...cookieOpts(), maxAge: 120 });
}

function clearFails(): void {
  setCookie(FAIL_COOKIE, "", { ...cookieOpts(), maxAge: 0 });
}

async function setupState(): Promise<Extract<OfficeLockState, { status: "setup" }>> {
  const otpauth = otpauthUrl(OFFICE_TOTP_SECRET);
  const qr = await QRCode.toString(otpauth, {
    type: "svg",
    margin: 1,
    width: 220,
    color: { dark: "#0c0d0e", light: "#eceae6" },
  });
  return {
    status: "setup",
    otpauth,
    secret: formatSecret(OFFICE_TOTP_SECRET),
    qr,
  };
}

async function withQr(status: "setup" | "wait"): Promise<OfficeLockState> {
  const setup = await setupState();
  if (status === "wait") return { ...setup, status: "wait" };
  return setup;
}

export async function isOfficeUnlocked(): Promise<boolean> {
  try {
    return cookieValid(OFFICE_TOTP_SECRET);
  } catch {
    return false;
  }
}

export async function readOfficeLockState(): Promise<OfficeLockState> {
  if (cookieValid(OFFICE_TOTP_SECRET)) return { status: "unlocked" };
  const fails = readFails();
  if (fails.until > Date.now()) return withQr("wait");
  return withQr("setup");
}

export async function verifyOfficeCredentials(code: string, password: string): Promise<OfficeLockState> {
  const fails = readFails();
  if (fails.until > Date.now()) return withQr("wait");

  const pass = passwordMatches(password);
  const totp = verifyTotp(OFFICE_TOTP_SECRET, code, null);
  if (!totp.ok || !pass) {
    const next = fails.count + 1;
    if (next >= 5) {
      writeFails(next, Date.now() + 30_000);
      return withQr("wait");
    }
    writeFails(next, 0);
    return withQr("setup");
  }

  clearFails();
  const exp = Math.floor(Date.now() / 1000) + TTL;
  setCookie(COOKIE, sign(OFFICE_TOTP_SECRET, exp), { ...cookieOpts(), maxAge: TTL });
  markOwnerDevice();
  return { status: "unlocked" };
}

export async function clearOfficeSession(): Promise<OfficeLockState> {
  setCookie(COOKIE, "", { ...cookieOpts(), maxAge: 0 });
  return withQr("setup");
}
