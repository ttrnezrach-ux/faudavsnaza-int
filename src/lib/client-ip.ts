import { createHash } from "node:crypto";
import { getRequest } from "@tanstack/react-start/server";
import { isBotUserAgent } from "@/lib/traffic-filter";

export type ClientAddr = { hash: string; hint: string; ip: string; ok: boolean };

function rawIp(): string {
  const headers = getRequest()?.headers;
  if (!headers) return "";
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const raw =
    forwarded ||
    headers.get("x-real-ip")?.trim() ||
    headers.get("cf-connecting-ip")?.trim() ||
    headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    "";
  let ip = raw.replace(/^\[([^\]]+)\](?::\d+)?$/, "$1");
  if (/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(ip)) ip = ip.replace(/:\d+$/, "");
  return ip;
}

function maskIp(ip: string): string {
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(ip)) {
    const [a, b] = ip.split(".");
    return `${a}.${b}.x.x`;
  }
  if (ip.includes(":")) {
    const parts = ip.split(":").filter(Boolean);
    return `${parts.slice(0, 3).join(":")}::x`;
  }
  return "";
}

export function isBotRequest(): boolean {
  return isBotUserAgent(getRequest()?.headers.get("user-agent"));
}

export function clientAddr(): ClientAddr {
  const ip = rawIp();
  if (!ip) return { hash: "", hint: "", ip: "", ok: false };
  const hash = createHash("sha256").update(ip).digest("hex").slice(0, 16);
  return { hash, hint: maskIp(ip) || hash.slice(0, 8), ip, ok: true };
}
