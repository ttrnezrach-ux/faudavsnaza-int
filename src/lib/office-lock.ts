import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type OfficeLockState =
  | { status: "setup"; otpauth: string; secret: string; qr: string }
  | { status: "locked" }
  | { status: "unlocked" }
  | { status: "wait" };

export const getOfficeLockState = createServerFn({ method: "GET" }).handler(async () => {
  const { readOfficeLockState } = await import("@/lib/office-lock.server");
  return readOfficeLockState();
});

export const verifyOfficeLock = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ code: z.string().max(8), password: z.string().min(1).max(128) }).parse(input),
  )
  .handler(async ({ data }): Promise<OfficeLockState> => {
    const { verifyOfficeCredentials } = await import("@/lib/office-lock.server");
    return verifyOfficeCredentials(data.code, data.password);
  });

export const lockOfficeSession = createServerFn({ method: "POST" }).handler(async () => {
  const { clearOfficeSession } = await import("@/lib/office-lock.server");
  return clearOfficeSession();
});
