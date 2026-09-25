import { env } from "@/lib/env.server";
import { authorizeMonitor } from "@/lib/monitor-auth";
import { loadTrafficSnapshot, monitorBody } from "@/lib/traffic.server";

const noStore = { "cache-control": "no-store" };

/** GET /api/office/traffic — bearer token, no PII. */
export async function handleTrafficMonitor(request: Request): Promise<Response> {
  const decision = authorizeMonitor(request.headers.get("authorization"), env("OFFICE_MONITOR_TOKEN"));
  if (decision === "unset") {
    return Response.json(
      { error: "monitor token is not configured" },
      { status: 503, headers: noStore },
    );
  }
  if (decision === "unauthorized") {
    return Response.json({ error: "unauthorized" }, { status: 401, headers: noStore });
  }
  const snapshot = await loadTrafficSnapshot();
  return Response.json(monitorBody(snapshot), { status: 200, headers: noStore });
}
