import { getCookie, getRequest, setCookie } from "@tanstack/react-start/server";
import { clientAddr } from "@/lib/client-ip";
import { composeInquiry, deliverInquiry, type InquiryFields } from "@/lib/contact-mail";

const DEFAULT_INBOX = "vivik1@gmail.com";
const COOLDOWN_MS = 25_000;
const COOKIE = "contact_cd";

const recentByIp = new Map<string, number>();

export type ContactResult = { ok: true } | { ok: false; error: "invalid" | "cooldown" | "delivery" };

export type ContactSubmission = InquiryFields & { company?: string };

function inbox(): string {
  return process.env.CONTACT_INBOX?.trim() || DEFAULT_INBOX;
}

function cookieOpts() {
  let secure = true;
  try {
    const url = getRequest().url;
    secure = new URL(url).protocol === "https:";
  } catch {
    secure = true;
  }
  return { path: "/", httpOnly: true, sameSite: "lax" as const, secure, maxAge: 60 };
}

function coolingDown(): boolean {
  const raw = getCookie(COOKIE);
  const until = Number(raw);
  if (Number.isFinite(until) && until > Date.now()) return true;
  const hash = clientAddr().hash;
  if (!hash) return false;
  return (recentByIp.get(hash) ?? 0) > Date.now();
}

function armCooldown(): void {
  setCookie(COOKIE, String(Date.now() + COOLDOWN_MS), cookieOpts());
  const hash = clientAddr().hash;
  if (!hash) return;
  recentByIp.set(hash, Date.now() + COOLDOWN_MS);
  if (recentByIp.size <= 500) return;
  const now = Date.now();
  for (const [key, until] of recentByIp) {
    if (until < now) recentByIp.delete(key);
  }
}

/**
 * Accepts a public inquiry and emails CONTACT_INBOX (default hidden here).
 * Resend is used when RESEND_API_KEY is set; otherwise the server posts to
 * FormSubmit. FormSubmit is behind Cloudflare, so a datacenter request can
 * come back as HTTP 403 until that path is allowed — set RESEND_API_KEY for
 * a direct send. The first successful FormSubmit delivery also needs the
 * activation link FormSubmit emails to the inbox.
 */
export async function submitInquiry(input: ContactSubmission): Promise<ContactResult> {
  if ((input.company ?? "").trim()) {
    armCooldown();
    return { ok: true };
  }
  if (coolingDown()) return { ok: false, error: "cooldown" };

  const mail = composeInquiry(input);
  if (!mail) return { ok: false, error: "invalid" };

  try {
    const sent = await deliverInquiry(mail, {
      inbox: inbox(),
      resendKey: process.env.RESEND_API_KEY,
      from: process.env.CONTACT_FROM,
    });
    if (!sent) return { ok: false, error: "delivery" };
  } catch {
    return { ok: false, error: "delivery" };
  }

  armCooldown();
  return { ok: true };
}
