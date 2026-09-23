import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { composeInquiry, deliverInquiry, SITE_ID, SITE_URL } from "./contact-mail.ts";

const INBOX = "inbox-test@example.com";

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".vercel" || name === "dist") continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

describe("inquiry mail", () => {
  it("includes the site identity and the visitor fields, not a recipient", () => {
    const mail = composeInquiry({
      name: "Dana\nLevi",
      email: "dana@example.com",
      subject: "Hello",
      message: "A question about the map.",
    });
    assert.ok(mail);
    assert.match(mail.text, new RegExp(`siteId=${SITE_ID}`));
    assert.match(mail.text, new RegExp(`siteUrl=${SITE_URL}`));
    assert.match(mail.text, /name=Dana Levi/);
    assert.match(mail.text, /email=dana@example.com/);
    assert.equal(mail.replyTo, "dana@example.com");
    assert.doesNotMatch(mail.text, /vivik2@gmail\.com/);
    assert.doesNotMatch(mail.subject, /\n/);
  });

  it("rejects an empty message", () => {
    assert.equal(composeInquiry({ name: "Dana", email: "dana@example.com", message: "  " }), null);
  });

  it("posts to Resend when a key is present and never returns the inbox", async () => {
    let url = "";
    let body = "";
    const ok = await deliverInquiry(
      composeInquiry({ name: "Dana", email: "dana@example.com", message: "Hi" })!,
      {
        inbox: INBOX,
        resendKey: "re_test",
        fetchImpl: async (input, init) => {
          url = String(input);
          body = String(init?.body ?? "");
          return new Response(JSON.stringify({ id: "email_1" }), { status: 200 });
        },
      },
    );
    assert.equal(ok, true);
    assert.equal(url, "https://api.resend.com/emails");
    const parsed = JSON.parse(body) as { to: string[]; reply_to: string; text: string };
    assert.deepEqual(parsed.to, [INBOX]);
    assert.equal(parsed.reply_to, "dana@example.com");
    assert.match(parsed.text, /siteId=faudavsnaza-int/);
    assert.doesNotMatch(url, /example\.com/);
  });

  it("posts to FormSubmit on the server when Resend is unset", async () => {
    let url = "";
    const ok = await deliverInquiry(
      composeInquiry({ name: "Dana", email: "dana@example.com", message: "Hi" })!,
      {
        inbox: INBOX,
        fetchImpl: async (input) => {
          url = String(input);
          return new Response(JSON.stringify({ success: "true" }), { status: 200 });
        },
      },
    );
    assert.equal(ok, true);
    assert.equal(url, `https://formsubmit.co/ajax/${encodeURIComponent(INBOX)}`);
  });

  it("keeps the destination address out of client modules", () => {
    const root = new URL("../../src", import.meta.url);
    const files = walk(root.pathname).filter((path) => /\.(tsx?|css)$/.test(path));
    const leaks = files.filter((path) => {
      if (path.endsWith("contact.server.ts") || path.endsWith(".test.ts")) return false;
      return /vivik2@gmail\.com/.test(readFileSync(path, "utf8"));
    });
    assert.deepEqual(leaks, []);
    const server = readFileSync(new URL("./contact.server.ts", import.meta.url), "utf8");
    assert.match(server, /CONTACT_INBOX/);
    assert.match(server, /vivik2@gmail\.com/);
    assert.match(server, /formsubmit|RESEND_API_KEY/);
  });
});
