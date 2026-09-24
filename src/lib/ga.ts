export const GA_ID = "G-94C52QGQ7T";
export const UC_SETTINGS_ID = "Kr9hDriNcFKt8y";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type GaDims = {
  language?: string;
  work?: string;
  tab?: string;
};

function withDims(params: Record<string, string>, dims?: GaDims): Record<string, string> {
  const out = { ...params };
  if (dims?.language) out.language = dims.language;
  if (dims?.work) out.content_group = dims.work;
  if (dims?.tab) out.content_id = dims.tab;
  return out;
}

export function sendGaEvent(name: string, params?: Record<string, string>) {
  try {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    window.gtag("event", name, params);
  } catch {
    /* analytics must never block */
  }
}

/** Keep GA page params aligned with first-party work / tab / lang. Does not change consent. */
export function syncGaView(path: string, dims?: GaDims) {
  try {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    const params = withDims({ page_path: path }, dims);
    window.gtag("set", params);
    window.gtag("config", GA_ID, { ...params, anonymize_ip: true, send_page_view: false });
    sendGaEvent("page_view", params);
  } catch {
    /* analytics must never block */
  }
}

export function gaFromClick(target: string, dims?: GaDims) {
  const [kind, ...rest] = target.split(":");
  const id = rest.join(":").slice(0, 80) || target.slice(0, 80);
  sendGaEvent("select_content", withDims({ content_type: kind || "ui", item_id: id }, dims));
  if (kind === "share") {
    sendGaEvent(
      "share",
      withDims({ method: id, content_type: "article", item_id: "fauda-naza" }, dims),
    );
  }
}
