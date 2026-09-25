import { createFileRoute } from "@tanstack/react-router";
import { handleTrafficMonitor } from "@/lib/traffic-monitor.server";

export const Route = createFileRoute("/api/office/traffic")({
  server: {
    handlers: {
      GET: ({ request }) => handleTrafficMonitor(request),
    },
  },
});
