import { createHmac, randomBytes } from "node:crypto";

const ALPH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function randomTotpSecret(): string {
  return encodeBase32(randomBytes(20));
}

export function encodeBase32(bytes: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const b of bytes) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += ALPH[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += ALPH[(value << (5 - bits)) & 31];
  return out;
}

export function decodeBase32(input: string): Buffer {
  const clean = input.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    const idx = ALPH.indexOf(ch);
    if (idx < 0) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

export function formatSecret(secret: string): string {
  return secret.replace(/(.{4})/g, "$1 ").trim();
}

function hotp(key: Buffer, counter: number): string {
  const buf = Buffer.alloc(8);
  buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  buf.writeUInt32BE(counter >>> 0, 4);
  const hmac = createHmac("sha1", key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const bin =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return String(bin % 1_000_000).padStart(6, "0");
}

export function totpCode(secretB32: string, at = Date.now()): { code: string; counter: number } {
  const counter = Math.floor(at / 30_000);
  return { code: hotp(decodeBase32(secretB32), counter), counter };
}

export function verifyTotp(
  secretB32: string,
  code: string,
  lastCounter: number | null,
  at = Date.now(),
): { ok: true; counter: number } | { ok: false } {
  const trimmed = code.replace(/\s/g, "");
  if (!/^\d{6}$/.test(trimmed)) return { ok: false };
  const key = decodeBase32(secretB32);
  for (const delta of [-2, -1, 0, 1, 2]) {
    const counter = Math.floor(at / 30_000) + delta;
    if (lastCounter != null && counter <= lastCounter) continue;
    if (hotp(key, counter) === trimmed) return { ok: true, counter };
  }
  return { ok: false };
}

export function otpauthUrl(secretB32: string): string {
  const secret = secretB32.replace(/\s/g, "").toUpperCase();
  return `otpauth://totp/FaudaNaza:office?secret=${secret}&issuer=FaudaNaza&algorithm=SHA1&digits=6&period=30`;
}
