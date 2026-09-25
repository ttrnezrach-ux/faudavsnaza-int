import { timingSafeEqual } from "node:crypto";

/** Bearer check for GET /api/office/traffic. Empty env means the route is not configured. */
export function authorizeMonitor(
  authorization: string | null,
  token: string | undefined,
): "ok" | "unset" | "unauthorized" {
  const configured = token?.trim() ?? "";
  if (!configured) return "unset";
  const match = /^Bearer\s+(\S+)\s*$/i.exec(authorization ?? "");
  const presented = match?.[1] ?? "";
  const a = Buffer.from(presented);
  const b = Buffer.from(configured);
  if (a.length !== b.length) {
    timingSafeEqual(b, b);
    return "unauthorized";
  }
  return timingSafeEqual(a, b) ? "ok" : "unauthorized";
}
