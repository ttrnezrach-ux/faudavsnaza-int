/** Fired after a same-document search update (work, tab, lang) that bypasses the router. */
export const VIEW_EVENT = "fauda:view";

export function patchSearch(mutate: (params: URLSearchParams) => void) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const before = `${url.pathname}${url.search}${url.hash}`;
  mutate(url.searchParams);
  const next = `${url.pathname}${url.search}${url.hash}`;
  if (next === before) return;
  window.history.replaceState(window.history.state, "", next);
  window.dispatchEvent(new Event(VIEW_EVENT));
}
