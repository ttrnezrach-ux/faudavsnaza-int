import assert from "node:assert/strict";
import { test } from "node:test";
import { isBotUserAgent, isInternalCheck, isPrefetch, trafficDecision } from "./traffic-filter.ts";

const CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

test("known crawlers, clients, and preview bots are bots", () => {
  const samples = [
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    "facebookexternalhit/1.1",
    "Twitterbot/1.0",
    "WhatsApp/2.23.20.0",
    "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)",
    "curl/8.7.1",
    "python-requests/2.32.3",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (compatible; vercel-screenshot/1.0; +https://vercel.com)",
    "Pingdom.com_bot_version_1.4",
    "UptimeRobot/2.0",
    "",
    "   ",
  ];
  for (const ua of samples) assert.equal(isBotUserAgent(ua), true, ua || "(empty)");
});

test("ordinary browsers are visitors", () => {
  assert.equal(isBotUserAgent(CHROME), false);
  assert.equal(isBotUserAgent(SAFARI), false);
});

test("prefetch and prerender headers are not visits", () => {
  const headers = (map: Record<string, string>) => (name: string) => map[name] ?? null;
  assert.equal(isPrefetch(headers({ purpose: "prefetch" })), true);
  assert.equal(isPrefetch(headers({ "sec-purpose": "prefetch;prerender" })), true);
  assert.equal(isPrefetch(headers({ "x-purpose": "preview" })), true);
  assert.equal(isPrefetch(headers({ "x-moz": "prefetch" })), true);
  assert.equal(isPrefetch(headers({ "next-router-prefetch": "1" })), true);
  assert.equal(isPrefetch(headers({})), false);
});

test("internal checks are the header, a valid monitor token, or the cookie", () => {
  assert.equal(
    isInternalCheck({ internalHeader: "1", monitorAuthorized: false, internalCookie: null }),
    true,
  );
  assert.equal(
    isInternalCheck({ internalHeader: "true", monitorAuthorized: false, internalCookie: null }),
    false,
  );
  assert.equal(
    isInternalCheck({ internalHeader: null, monitorAuthorized: true, internalCookie: null }),
    true,
  );
  assert.equal(
    isInternalCheck({ internalHeader: null, monitorAuthorized: false, internalCookie: "1" }),
    true,
  );
});

test("owner and internal traffic is not counted as a bot", () => {
  assert.equal(
    trafficDecision({ internal: true, ownerCookie: "1", prefetch: true, bot: true }),
    "internal",
  );
  assert.equal(
    trafficDecision({ internal: false, ownerCookie: "1", prefetch: false, bot: true }),
    "owner",
  );
  assert.equal(
    trafficDecision({ internal: false, ownerCookie: null, prefetch: true, bot: false }),
    "prefetch",
  );
  assert.equal(
    trafficDecision({ internal: false, ownerCookie: null, prefetch: false, bot: false }),
    "count",
  );
});
