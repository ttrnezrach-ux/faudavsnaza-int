import { o as __toESM } from "../_runtime.mjs";
import { a as getRequest, i as getCookie, o as setCookie$1 } from "./ssr.mjs";
import { t as getSql } from "./db-pb99grkE.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
//#region node_modules/.nitro/vite/services/ssr/assets/office-lock.server-CkekrlXK.js
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
	const salt = randomBytes(16);
	const hash = await scryptAsync(password, salt, 64);
	return `scrypt:${salt.toString("base64")}:${hash.toString("base64")}`;
}
async function verifyPassword(password, stored) {
	if (!stored) return false;
	const [scheme, saltB64, hashB64] = stored.split(":");
	if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;
	const salt = Buffer.from(saltB64, "base64");
	const expected = Buffer.from(hashB64, "base64");
	const actual = await scryptAsync(password, salt, expected.length);
	return actual.length === expected.length && timingSafeEqual(actual, expected);
}
var ALPH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function decodeBase32(input) {
	const clean = input.toUpperCase().replace(/[^A-Z2-7]/g, "");
	let bits = 0;
	let value = 0;
	const out = [];
	for (const ch of clean) {
		const idx = ALPH.indexOf(ch);
		if (idx < 0) continue;
		value = value << 5 | idx;
		bits += 5;
		if (bits >= 8) {
			out.push(value >>> bits - 8 & 255);
			bits -= 8;
		}
	}
	return Buffer.from(out);
}
function formatSecret(secret) {
	return secret.replace(/(.{4})/g, "$1 ").trim();
}
function hotp(key, counter) {
	const buf = Buffer.alloc(8);
	buf.writeUInt32BE(Math.floor(counter / 4294967296), 0);
	buf.writeUInt32BE(counter >>> 0, 4);
	const hmac = createHmac("sha1", key).update(buf).digest();
	const offset = hmac[hmac.length - 1] & 15;
	const bin = (hmac[offset] & 127) << 24 | (hmac[offset + 1] & 255) << 16 | (hmac[offset + 2] & 255) << 8 | hmac[offset + 3] & 255;
	return String(bin % 1e6).padStart(6, "0");
}
function verifyTotp(secretB32, code, lastCounter, at = Date.now()) {
	const trimmed = code.replace(/\s/g, "");
	if (!/^\d{6}$/.test(trimmed)) return { ok: false };
	const key = decodeBase32(secretB32);
	for (const delta of [
		-2,
		-1,
		0,
		1,
		2
	]) {
		const counter = Math.floor(at / 3e4) + delta;
		if (lastCounter != null && counter <= lastCounter) continue;
		if (hotp(key, counter) === trimmed) return {
			ok: true,
			counter
		};
	}
	return { ok: false };
}
function otpauthUrl(secretB32) {
	return `otpauth://totp/FaudaNaza:office?secret=${secretB32.replace(/\s/g, "").toUpperCase()}&issuer=FaudaNaza&algorithm=SHA1&digits=6&period=30`;
}
var COOKIE = "office_unlock";
var TTL = 43200;
var OFFICE_PASSWORD = "NazaFauda#2108";
var OFFICE_TOTP_SECRET = "44ZTYVM4U5UHPZFEUWKJRKTP5D7W6S55";
function asNum(v) {
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
	return {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure
	};
}
function sign(secret, exp) {
	return `${exp}.${createHmac("sha256", secret).update(`office:${exp}`).digest("base64url")}`;
}
function cookieValid(secret) {
	const raw = getCookie(COOKIE);
	if (!raw) return false;
	const dot = raw.indexOf(".");
	if (dot < 1) return false;
	const exp = Number(raw.slice(0, dot));
	const sig = raw.slice(dot + 1);
	if (!Number.isFinite(exp) || exp * 1e3 < Date.now()) return false;
	const expected = createHmac("sha256", secret).update(`office:${exp}`).digest("base64url");
	return sig.length === expected.length && sig === expected;
}
async function ensureTable() {
	await (await getSql()).query(`
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
async function loadRow() {
	await ensureTable();
	return (await (await getSql())`
    select secret_b32, password_hash, confirmed_at, last_counter, fail_count, locked_until
    from office_lock where id = 1
  `)[0] ?? null;
}
async function ensureRow() {
	const existing = await loadRow();
	const hash = await hashPassword(OFFICE_PASSWORD);
	const sql = await getSql();
	if (existing) {
		if (existing.secret_b32 === OFFICE_TOTP_SECRET && existing.password_hash) return existing;
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
			locked_until: null
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
	return {
		...again,
		password_hash: hash
	};
}
function waiting(row) {
	if (!row.locked_until) return false;
	const until = typeof row.locked_until === "string" ? Date.parse(row.locked_until) : row.locked_until.getTime();
	return Number.isFinite(until) && until > Date.now();
}
function enrolled(row) {
	return Boolean(row.confirmed_at && row.password_hash);
}
async function isOfficeUnlocked() {
	try {
		const row = await loadRow();
		if (!row || !enrolled(row)) return false;
		return cookieValid(row.secret_b32);
	} catch {
		return false;
	}
}
async function toState(row) {
	if (!enrolled(row)) {
		const otpauth = otpauthUrl(row.secret_b32);
		const qr = await import_lib.toString(otpauth, {
			type: "svg",
			margin: 1,
			width: 220,
			color: {
				dark: "#0c0d0e",
				light: "#eceae6"
			}
		});
		return {
			status: "setup",
			otpauth,
			secret: formatSecret(row.secret_b32),
			qr
		};
	}
	if (cookieValid(row.secret_b32)) return { status: "unlocked" };
	if (waiting(row)) return { status: "wait" };
	return { status: "locked" };
}
async function readOfficeLockState() {
	return toState(await ensureRow());
}
async function verifyOfficeCredentials(code, password) {
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
		if (settingUp) return toState({
			...row,
			fail_count: fails
		});
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
	const exp = Math.floor(Date.now() / 1e3) + TTL;
	setCookie$1(COOKIE, sign(row.secret_b32, exp), {
		...cookieOpts(),
		maxAge: TTL
	});
	return { status: "unlocked" };
}
function clearOfficeSession() {
	setCookie$1(COOKIE, "", {
		...cookieOpts(),
		maxAge: 0
	});
	return { status: "locked" };
}
//#endregion
export { clearOfficeSession, isOfficeUnlocked, readOfficeLockState, verifyOfficeCredentials };
