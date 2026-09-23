import { createHmac } from "node:crypto";
import { getCookie, getRequest, setCookie } from "@tanstack/react-start/server";
import QRCode from "qrcode";
import { getSql } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { formatSecret, otpauthUrl, verifyTotp } from "@/lib/totp";
import type { OfficeLockState } from "@/lib/office-lock";

const COOKIE = "office_unlock";
const TTL = 60 * 60 * 12;
const OFFICE_PASSWORD = "NazaFauda#2108";
const OFFICE_TOTP_SECRET = "44ZTYVM4U5UHPZFEUWKJRKTP5D7W6S55";

type LockRow = {
  secret_b32: string;
  password_hash: string | null;
  confirmed_at: string | Date | null;
  last_counter: number | string | null;
  fail_count: number;
  locked_until: string | Date | null;
};

function asNum(v: number | string | null | undefined): number | null {
  if (v == null) return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

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
  return sig.length === expected.length && sig === expected;
}

async function ensureTable(): Promise<void> {
  const sql = await getSql();
  await sql.query(`
    create table if not exists office_lock (
      id int primary key,
      secret_b32 text not null,
      password_hash text,
      confirmed_at timestamptz,
      last_counter bigint,
      fail_count int not null default 0,
      locked_until timestamptz
    )
  `);
}

async function loadRow(): Promise<LockRow | null> {
  await ensureTable();
  const sql = await getSql();
  const rows = await sql<LockRow>`
    select secret_b32, password_hash, confirmed_at, last_counter, fail_count, locked_until
    from office_lock where id = 1
  `;
  return rows[0] ?? null;
}

async function ensureRow(): Promise<LockRow> {
  const existing = await loadRow();
  const hash = await hashPassword(OFFICE_PASSWORD);
  const sql = await getSql();
  if (existing) {
    if (existing.secret_b32 === OFFICE_TOTP_SECRET && existing.password_hash) {
      return existing;
    }
    await sql`
      update office_lock
      set secret_b32 = ${OFFICE_TOTP_SECRET},
          password_hash = ${hash},
          confirmed_at = null,
          last_counter = null,
          fail_count = 0,
          locked_until = null
      where id = 1
    `;
    return {
      secret_b32: OFFICE_TOTP_SECRET,
      password_hash: hash,
      confirmed_at: null,
      last_counter: null,
      fail_count: 0,
      locked_until: null,
    };
  }
  await sql`
    insert into office_lock (id, secret_b32, password_hash)
    values (1, ${OFFICE_TOTP_SECRET}, ${hash})
    on conflict (id) do nothing
  `;
  const again = await loadRow();
  if (!again) throw new Error("office lock init failed");
  if (again.password_hash) return again;
  await sql`update office_lock set password_hash = ${hash} where id = 1`;
  return { ...again, password_hash: hash };
}

function waiting(row: LockRow): boolean {
  if (!row.locked_until) return false;
  const until = typeof row.locked_until === "string" ? Date.parse(row.locked_until) : row.locked_until.getTime();
  return Number.isFinite(until) && until > Date.now();
}

function enrolled(row: LockRow): boolean {
  return Boolean(row.confirmed_at && row.password_hash);
}

export async function isOfficeUnlocked(): Promise<boolean> {
  try {
    const row = await loadRow();
    if (!row || !enrolled(row)) return false;
    return cookieValid(row.secret_b32);
  } catch {
    return false;
  }
}

async function toState(row: LockRow): Promise<OfficeLockState> {
  if (!enrolled(row)) {
    const otpauth = otpauthUrl(row.secret_b32);
    const qr = await QRCode.toString(otpauth, {
      type: "svg",
      margin: 1,
      width: 220,
      color: { dark: "#0c0d0e", light: "#eceae6" },
    });
    return { status: "setup", otpauth, secret: formatSecret(row.secret_b32), qr };
  }
  if (cookieValid(row.secret_b32)) return { status: "unlocked" };
  if (waiting(row)) return { status: "wait" };
  return { status: "locked" };
}

export async function readOfficeLockState(): Promise<OfficeLockState> {
  const row = await ensureRow();
  return toState(row);
}

export async function verifyOfficeCredentials(code: string, password: string): Promise<OfficeLockState> {
  const sql = await getSql();
  const row = await ensureRow();
  if (waiting(row)) return { status: "wait" };

  const settingUp = !enrolled(row);
  const pass = await verifyPassword(password, row.password_hash);
  const last = asNum(row.last_counter);
  const totp = verifyTotp(row.secret_b32, code, last);
  if (!totp.ok || !pass) {
    const fails = (row.fail_count ?? 0) + 1;
    if (fails >= 5) {
      await sql`update office_lock set fail_count = ${fails}, locked_until = now() + interval '30 seconds' where id = 1`;
      return { status: "wait" };
    }
    await sql`update office_lock set fail_count = ${fails} where id = 1`;
    if (settingUp) return toState({ ...row, fail_count: fails });
    return { status: "locked" };
  }

  await sql`
    update office_lock
    set confirmed_at = coalesce(confirmed_at, now()),
        last_counter = ${totp.counter},
        fail_count = 0,
        locked_until = null
    where id = 1
  `;
  const exp = Math.floor(Date.now() / 1000) + TTL;
  setCookie(COOKIE, sign(row.secret_b32, exp), { ...cookieOpts(), maxAge: TTL });
  return { status: "unlocked" };
}

export function clearOfficeSession(): OfficeLockState {
  setCookie(COOKIE, "", { ...cookieOpts(), maxAge: 0 });
  return { status: "locked" };
}
