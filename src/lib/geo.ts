/** Timezone → ISO 3166-1 alpha-2. Used only when the edge did not send a country header. Never stores IP. */
const TZ_COUNTRY: Record<string, string> = {
  "Asia/Jerusalem": "IL",
  "Asia/Gaza": "PS",
  "Asia/Hebron": "PS",
  "Asia/Beirut": "LB",
  "Asia/Amman": "JO",
  "Asia/Dubai": "AE",
  "Asia/Muscat": "OM",
  "Asia/Qatar": "QA",
  "Asia/Bahrain": "BH",
  "Asia/Kuwait": "KW",
  "Asia/Riyadh": "SA",
  "Africa/Cairo": "EG",
  "Africa/Casablanca": "MA",
  "Africa/Tripoli": "LY",
  "Africa/Nairobi": "KE",
  "Africa/Lagos": "NG",
  "Europe/Istanbul": "TR",
  "Europe/Paris": "FR",
  "Europe/Berlin": "DE",
  "Europe/Amsterdam": "NL",
  "Europe/Rome": "IT",
  "Europe/Athens": "GR",
  "Europe/Nicosia": "CY",
  "Europe/Bucharest": "RO",
  "Europe/Prague": "CZ",
  "Europe/Bratislava": "SK",
  "Europe/Budapest": "HU",
  "Europe/Belgrade": "RS",
  "Europe/Zagreb": "HR",
  "Europe/Sofia": "BG",
  "Europe/Warsaw": "PL",
  "Europe/Brussels": "BE",
  "Europe/Helsinki": "FI",
  "Europe/Vienna": "AT",
  "Europe/Luxembourg": "LU",
  "Europe/Zurich": "CH",
  "Europe/Stockholm": "SE",
  "Europe/Oslo": "NO",
  "Europe/Copenhagen": "DK",
  "Europe/Madrid": "ES",
  "Europe/Lisbon": "PT",
  "Europe/Ljubljana": "SI",
  "Europe/Vilnius": "LT",
  "Europe/Dublin": "IE",
  "Europe/London": "GB",
  "Europe/Moscow": "RU",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Sao_Paulo": "BR",
  "America/Argentina/Buenos_Aires": "AR",
  "America/Santiago": "CL",
  "America/Panama": "PA",
  "Asia/Kolkata": "IN",
  "Asia/Karachi": "PK",
  "Asia/Dhaka": "BD",
  "Asia/Colombo": "LK",
  "Asia/Tokyo": "JP",
  "Asia/Shanghai": "CN",
};

export function countryFromTimezone(tz: string | undefined): string | null {
  if (!tz) return null;
  const direct = TZ_COUNTRY[tz];
  if (direct) return direct;
  if (tz.startsWith("America/")) return "US";
  if (tz.startsWith("Europe/")) return null;
  return null;
}

export function normalizeCountry(code: string | null | undefined): string | null {
  if (!code) return null;
  const u = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(u) || u === "XX" || u === "T1") return null;
  return u;
}

export function flagEmoji(code: string | null | undefined): string {
  const u = normalizeCountry(code);
  if (!u) return "🌐";
  return String.fromCodePoint(...[...u].map((c) => 127397 + c.charCodeAt(0)));
}

const displayCache = new Map<string, Intl.DisplayNames>();

/** Node ICU and Chromium disagree on a few region labels. Pin the short form. */
const REGION_PIN: Record<string, Partial<Record<string, string>>> = {
  PS: {
    he: "פלסטין",
    en: "Palestine",
    ar: "فلسطين",
    fr: "Palestine",
    es: "Palestina",
    ru: "Палестина",
  },
};

export function countryDisplayName(code: string, locale: string): string {
  const u = normalizeCountry(code);
  if (!u) return code;
  const pinned = REGION_PIN[u]?.[locale] ?? REGION_PIN[u]?.en;
  if (pinned) return pinned;
  try {
    let fmt = displayCache.get(locale);
    if (!fmt) {
      fmt = new Intl.DisplayNames([locale], { type: "region" });
      displayCache.set(locale, fmt);
    }
    return fmt.of(u) ?? u;
  } catch {
    return u;
  }
}

/** Country implied by a Google hostname (google.co.il → IL). */
export function googleHostCountry(host: string | null | undefined): string | null {
  if (!host) return null;
  const h = host.toLowerCase().replace(/^www\./, "");
  if (h.includes("co.il") || h.endsWith(".il")) return "IL";
  if (h.includes(".co.uk") || h.endsWith(".uk")) return "GB";
  const com = h.match(/google\.com\.([a-z]{2})$/);
  if (com) return com[1].toUpperCase();
  const co = h.match(/google\.co\.([a-z]{2})$/);
  if (co) return co[1].toUpperCase();
  const tld = h.match(/google\.([a-z]{2})$/);
  if (tld) return tld[1].toUpperCase();
  if (h.includes("google.com")) return "US";
  return null;
}
