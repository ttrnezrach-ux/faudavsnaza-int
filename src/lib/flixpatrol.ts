/** FlixPatrol URL slug → ISO 3166-1 alpha-2 used in live.json. */
export const SLUG_ISO: Record<string, string> = {
  israel: "IL",
  lebanon: "LB",
  jordan: "JO",
  "united-arab-emirates": "AE",
  uae: "AE",
  bahrain: "BH",
  qatar: "QA",
  oman: "OM",
  kuwait: "KW",
  egypt: "EG",
  morocco: "MA",
  "saudi-arabia": "SA",
  turkey: "TR",
  france: "FR",
  germany: "DE",
  netherlands: "NL",
  italy: "IT",
  greece: "GR",
  cyprus: "CY",
  romania: "RO",
  czechia: "CZ",
  "czech-republic": "CZ",
  slovakia: "SK",
  hungary: "HU",
  serbia: "RS",
  croatia: "HR",
  bulgaria: "BG",
  poland: "PL",
  belgium: "BE",
  finland: "FI",
  austria: "AT",
  luxembourg: "LU",
  switzerland: "CH",
  sweden: "SE",
  norway: "NO",
  denmark: "DK",
  spain: "ES",
  portugal: "PT",
  slovenia: "SI",
  lithuania: "LT",
  ireland: "IE",
  "united-kingdom": "GB",
  uk: "GB",
  "great-britain": "GB",
  india: "IN",
  "sri-lanka": "LK",
  pakistan: "PK",
  bangladesh: "BD",
  kenya: "KE",
  nigeria: "NG",
  argentina: "AR",
  brazil: "BR",
  chile: "CL",
  panama: "PA",
  "united-states": "US",
  usa: "US",
  libya: "LY",
  palestine: "PS",
  canada: "CA",
  australia: "AU",
  "new-zealand": "NZ",
  mexico: "MX",
  colombia: "CO",
  peru: "PE",
  japan: "JP",
  "south-korea": "KR",
  korea: "KR",
  philippines: "PH",
  thailand: "TH",
  indonesia: "ID",
  malaysia: "MY",
  tunisia: "TN",
  algeria: "DZ",
  iraq: "IQ",
  syria: "SY",
  iran: "IR",
  "south-africa": "ZA",
  ukraine: "UA",
  "costa-rica": "CR",
  uruguay: "UY",
  venezuela: "VE",
  "el-salvador": "SV",
  estonia: "EE",
  latvia: "LV",
  iceland: "IS",
  malta: "MT",
  mauritius: "MU",
  "new-caledonia": "NC",
};

const FAUDA_URL = "https://flixpatrol.com/title/fauda/";

export type ParsedRanks = {
  latestByCountry: Record<string, number | null>;
  globalLatest: number | null;
  blocked: boolean;
  source: string;
};

function parseRankToken(raw: string): number | null {
  const t = raw.replace(/[–—−]/g, "-").trim();
  if (!t || t === "-" || t === "–") return null;
  const n = Number.parseInt(t, 10);
  return n >= 1 && n <= 10 ? n : null;
}

/** Last numeric rank (1–10) in a country row; dashes ignored. */
export function parseFlixpatrolHtml(html: string): Record<string, number | null> {
  const out: Record<string, number | null> = {};
  const rowRe = /\/top10\/netflix\/([a-z-]+)\/[^<]{0,400}/gi;
  let m: RegExpExecArray | null;
  while ((m = rowRe.exec(html))) {
    const iso = SLUG_ISO[m[1]];
    if (!iso) continue;
    const chunk = m[0];
    const tokens = [...chunk.matchAll(/>\s*([0-9]{1,2}|[-–—])\s*</g)].map((x) => parseRankToken(x[1]));
    const last = [...tokens].reverse().find((n) => n != null) ?? null;
    if (last != null) out[iso] = last;
  }
  return out;
}

export async function fetchFaudaRanks(): Promise<ParsedRanks> {
  try {
    const res = await fetch(FAUDA_URL, {
      headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9,he;q=0.8",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "upgrade-insecure-requests": "1",
      },
    });
    if (!res.ok) {
      return { latestByCountry: {}, globalLatest: null, blocked: true, source: FAUDA_URL };
    }
    const html = await res.text();
    if (html.includes("Just a moment") || html.length < 2000) {
      return { latestByCountry: {}, globalLatest: null, blocked: true, source: FAUDA_URL };
    }
    const latestByCountry = parseFlixpatrolHtml(html);
    const worldwide = html.match(/worldwide[^0-9]{0,40}([1-9]|10)/i);
    const globalLatest = worldwide ? Number.parseInt(worldwide[1], 10) : null;
    return { latestByCountry, globalLatest, blocked: false, source: FAUDA_URL };
  } catch {
    return { latestByCountry: {}, globalLatest: null, blocked: true, source: FAUDA_URL };
  }
}
