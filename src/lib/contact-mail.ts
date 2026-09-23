/** Public site identity included in every inquiry email. Not a secret. */
export const SITE_ID = "faudavsnaza-int";
export const SITE_URL = "https://faudavsnaza-int.vercel.app";

export type InquiryFields = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

export type ComposedInquiry = {
  subject: string;
  text: string;
  replyTo: string;
  name: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function composeInquiry(input: InquiryFields): ComposedInquiry | null {
  const name = oneLine(input.name);
  const email = oneLine(input.email);
  const subject = oneLine(input.subject ?? "");
  const message = input.message.replace(/\r\n/g, "\n").trim();
  if (!name || name.length > 80) return null;
  if (!email || email.length > 120 || !EMAIL.test(email)) return null;
  if (!message || message.length > 4000) return null;
  if (subject.length > 140) return null;

  const text = [
    `siteId=${SITE_ID}`,
    `siteUrl=${SITE_URL}`,
    `name=${name}`,
    `email=${email}`,
    `subject=${subject || "(none)"}`,
    "",
    message,
  ].join("\n");

  return {
    subject: `[${SITE_ID}] ${subject || "Inquiry"} — ${name}`.slice(0, 180),
    text,
    replyTo: email,
    name,
  };
}

type DeliverOpts = {
  inbox: string;
  resendKey?: string;
  from?: string;
  fetchImpl?: typeof fetch;
};

/**
 * Sends one inquiry. The inbox is an argument so this module never bakes in
 * the destination address. Returns only success/failure — never the upstream body.
 */
export async function deliverInquiry(mail: ComposedInquiry, opts: DeliverOpts): Promise<boolean> {
  const inbox = opts.inbox.trim();
  if (!inbox || !EMAIL.test(inbox)) return false;
  const fetchImpl = opts.fetchImpl ?? fetch;
  const key = opts.resendKey?.trim();
  if (key) return postResend(fetchImpl, key, opts.from?.trim() || "Fauda Naza <onboarding@resend.dev>", inbox, mail);
  return postFormSubmit(fetchImpl, inbox, mail);
}

async function postResend(
  fetchImpl: typeof fetch,
  key: string,
  from: string,
  inbox: string,
  mail: ComposedInquiry,
): Promise<boolean> {
  const res = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [inbox],
      reply_to: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
    }),
    signal: AbortSignal.timeout(12_000),
  });
  return res.ok;
}

async function postFormSubmit(fetchImpl: typeof fetch, inbox: string, mail: ComposedInquiry): Promise<boolean> {
  const res = await fetchImpl(`https://formsubmit.co/ajax/${encodeURIComponent(inbox)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: mail.name,
      email: mail.replyTo,
      _replyto: mail.replyTo,
      _subject: mail.subject,
      message: mail.text,
      _captcha: "false",
      _template: "table",
    }),
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) return false;
  try {
    const body = (await res.json()) as { success?: string | boolean };
    if (body.success === false || body.success === "false") return false;
  } catch {
    return false;
  }
  return true;
}
