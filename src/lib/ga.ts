export const GA_ID = "G-94C52QGQ7T";
export const UC_SETTINGS_ID = "Kr9hDriNcFKt8y";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function sendGaEvent(name: string, params?: Record<string, string>) {
  try {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    window.gtag("event", name, params);
  } catch {
    /* analytics must never block */
  }
}

export function gaFromClick(target: string) {
  const [kind, ...rest] = target.split(":");
  const id = rest.join(":").slice(0, 80) || target.slice(0, 80);
  sendGaEvent("select_content", { content_type: kind || "ui", item_id: id });
  if (kind === "share") {
    sendGaEvent("share", { method: id, content_type: "article", item_id: "fauda-naza" });
  }
}
