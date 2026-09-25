import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { authorizeMonitor } from "./monitor-auth.ts";
import {
  SHOW_PUBLIC_VISIT_COUNTER,
  VISIT_BASELINE,
  fillDaySeries,
  fillHourSeries,
  isSeriesSpike,
  trafficAnomaly,
  trafficPace,
  typicalDayVisits,
  withBaseline,
} from "./visit-counter.ts";

describe("visit counter baseline", () => {
  it("keeps the public counter off and imports the observed Grok total", () => {
    assert.equal(SHOW_PUBLIC_VISIT_COUNTER, false);
    assert.equal(VISIT_BASELINE, 133);
    assert.equal(withBaseline(0), 133);
    assert.equal(withBaseline(4), 137);
  });

  it("hides the public footer component behind the flag", () => {
    const source = readFileSync(new URL("../components/unique-ip-counter.tsx", import.meta.url), "utf8");
    assert.match(source, /SHOW_PUBLIC_VISIT_COUNTER/);
    assert.match(source, /if \(!SHOW_PUBLIC_VISIT_COUNTER\) return null/);
  });
});

describe("14-day series", () => {
  it("fills missing days and averages the earlier ones", () => {
    const now = new Date("2026-09-25T12:00:00.000Z");
    const days = fillDaySeries([{ date: "2026-09-25", visits: 8 }, { date: "2026-09-24", visits: 2 }], now);
    assert.equal(days.length, 14);
    assert.equal(days[0]?.date, "2026-09-12");
    assert.equal(days[13]?.visits, 8);
    assert.equal(days[12]?.visits, 2);
    assert.equal(days[11]?.visits, 0);
    assert.equal(typicalDayVisits(days), 0.2);
  });

  it("flags abnormal days without alarming on a single visit", () => {
    assert.equal(trafficPace(0, 0), "quiet");
    assert.equal(trafficPace(1, 0), "normal");
    assert.equal(trafficPace(9, 4), "above");
    assert.equal(trafficPace(1, 6), "below");
  });
});

describe("anomaly", () => {
  it("compares today with the prior 13 days and flags a spike", () => {
    const now = new Date("2026-09-25T12:00:00.000Z");
    const days = fillDaySeries(
      [
        { date: "2026-09-24", visits: 2 },
        { date: "2026-09-23", visits: 2 },
        { date: "2026-09-25", visits: 20 },
      ],
      now,
    );
    const anomaly = trafficAnomaly(days);
    assert.equal(anomaly.today, 20);
    assert.ok(anomaly.average < 1);
    assert.equal(anomaly.spike, true);
    assert.ok(anomaly.zScore != null && anomaly.zScore > 2);
    assert.equal(isSeriesSpike(20, days.map((day) => day.visits)), true);
    assert.equal(isSeriesSpike(1, [0, 0, 1, 0]), false);
  });

  it("fills 24 UTC hours", () => {
    const now = new Date("2026-09-25T15:40:00.000Z");
    const hours = fillHourSeries([{ hour: "2026-09-25T15", visits: 4 }], now);
    assert.equal(hours.length, 24);
    assert.equal(hours[0]?.hour, "2026-09-24T16");
    assert.equal(hours[23]?.hour, "2026-09-25T15");
    assert.equal(hours[23]?.visits, 4);
  });
});

describe("monitor token", () => {
  it("monitor JSON adds the anomaly and leaves out addresses", () => {
    const source = readFileSync(new URL("./traffic.server.ts", import.meta.url), "utf8");
    const body = source.slice(source.indexOf("export function monitorBody"));
    assert.match(body, /anomaly: snapshot\.anomaly/);
    assert.doesNotMatch(body, /\bip\b|hint|country|visitor/);
  });

  it("rejects a missing env var and a bad bearer token", () => {
    assert.equal(authorizeMonitor("Bearer secret", undefined), "unset");
    assert.equal(authorizeMonitor("Bearer secret", "   "), "unset");
    assert.equal(authorizeMonitor(null, "secret"), "unauthorized");
    assert.equal(authorizeMonitor("Bearer wrong", "secret"), "unauthorized");
    assert.equal(authorizeMonitor("Bearer secret", "secret"), "ok");
    assert.equal(authorizeMonitor("bearer secret", "secret"), "ok");
  });
});
