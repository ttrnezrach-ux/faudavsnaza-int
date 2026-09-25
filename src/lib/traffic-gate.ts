import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Runs on each document load. Bots and prefetches are logged; internal checks are marked. */
export const noteDocumentTraffic = createServerFn({ method: "GET" }).handler(async () => {
  const { noteDocumentTrafficNow } = await import("@/lib/traffic-gate.server");
  return noteDocumentTrafficNow();
});

export const getDeviceExclusion = createServerFn({ method: "GET" }).handler(async () => {
  const { readDeviceExclusion } = await import("@/lib/traffic-gate.server");
  return readDeviceExclusion();
});

export const setDeviceExclusion = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ exclude: z.boolean() }).parse(input))
  .handler(async ({ data }) => {
    const { writeDeviceExclusion } = await import("@/lib/traffic-gate.server");
    return writeDeviceExclusion(data.exclude);
  });
