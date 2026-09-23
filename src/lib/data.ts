import { ISO_BY_ALPHA2, isoOf } from "@/lib/iso";
import { LIVE, applyLiveRanks } from "@/lib/live";

export const RANK_DAYS = LIVE.days;

export type Tone = "positive" | "mixed" | "critical";
export type Region = "me" | "eu" | "am" | "aa";
export type Confidence = "documented" | "estimated";

export type Quote = {
  text: string;
  by: string;
  tone: "positive" | "critical" | "emotional";
  source: string;
};

export type Country = {
  id: string;
  nameHe: string;
  nameEn: string;
  geoNames: string[];
  region: Region;
  coords: [number, number];
  ranks: (number | null)[];
  sentiment: Tone;
  positive: number;
  mixed: number;
  negative: number;
  confidence: Confidence;
  note?: string;
  quotes?: Quote[];
};

export const SNAPSHOT = LIVE.snapshot;

export const GLOBAL = LIVE.global;

export const REGION_LABEL: Record<Region, string> = {
  me: "המזרח התיכון",
  eu: "אירופה",
  am: "אמריקה",
  aa: "אסיה ואפריקה",
};

export const TONE_LABEL: Record<Tone, string> = {
  positive: "חיובי",
  mixed: "מעורב",
  critical: "ביקורתי",
};

const BASE_COUNTRIES: Country[] = [
  {
    id: "IL",
    nameHe: "ישראל",
    nameEn: "Israel",
    geoNames: ["Israel"],
    region: "me",
    coords: [34.85, 31.45],
    ranks: [null, 1, 1, 1, 1],
    sentiment: "positive",
    positive: 86,
    mixed: 10,
    negative: 4,
    confidence: "documented",
    note: "העונה שודרה ב-yes ממאי עד יולי והיתה הסדרה הנצפית ביותר בתולדות הרשת. מבקרים תיארו זעם, משבר אמון ותשוקה לנקמה אחרי 7 באוקטובר.",
    quotes: [
      {
        text: "העונה מצליחה לצייר את מה שקרה לישראלים רבים: הזעם המטורף, העלבון, משבר האמון המוחלט והתשוקה לנקמה גם במחיר קריסה מוסרית.",
        by: "עינב שיף, ידיעות אחרונות",
        tone: "emotional",
        source: "NYT / ידיעות",
      },
    ],
  },
  {
    id: "LB",
    nameHe: "לבנון",
    nameEn: "Lebanon",
    geoNames: ["Lebanon"],
    region: "me",
    coords: [35.5, 33.85],
    ranks: [null, 1, 1, 1, 1],
    sentiment: "mixed",
    positive: 48,
    mixed: 22,
    negative: 30,
    confidence: "documented",
    note: "מקום ראשון בנטפליקס ארבעה ימים רצופים — למרות חוק חרם על ישראל וקמפיין שהאשים את נטפליקס בהפרתו.",
    quotes: [
      {
        text: "קמפיין חרם לבנוני האשים את נטפליקס בהפרת החוק המקומי על ידי הפצת הפקות ישראליות, וטען שפאודה מקדמת נרטיב ביטחוני.",
        by: "דיווח Ynet על קמפיין החרם",
        tone: "critical",
        source: "Ynet",
      },
    ],
  },
  {
    id: "JO",
    nameHe: "ירדן",
    nameEn: "Jordan",
    geoNames: ["Jordan"],
    region: "me",
    coords: [36.24, 31.3],
    ranks: [6, 2, 2, 3, 4],
    sentiment: "mixed",
    positive: 46,
    mixed: 28,
    negative: 26,
    confidence: "estimated",
    note: "שיא מקום 2. צפייה גבוהה בממלכה לצד שיח פוליטי רגיש סביב הסכסוך.",
  },
  {
    id: "AE",
    nameHe: "איחוד האמירויות",
    nameEn: "United Arab Emirates",
    geoNames: ["United Arab Emirates"],
    region: "me",
    coords: [54.37, 24.45],
    ranks: [null, 2, 6, 5, 4],
    sentiment: "mixed",
    positive: 58,
    mixed: 26,
    negative: 16,
    confidence: "estimated",
    note: "שיא מקום 2 ב-10 בספטמבר. קהל הסטרימינג באיחוד נוטה לצפות בסדרה כמתח, לא רק כמסמך פוליטי.",
  },
  {
    id: "BH",
    nameHe: "בחריין",
    nameEn: "Bahrain",
    geoNames: [],
    region: "me",
    coords: [50.58, 26.22],
    ranks: [8, 2, 4, 5, 6],
    sentiment: "mixed",
    positive: 56,
    mixed: 28,
    negative: 16,
    confidence: "estimated",
    note: "שיא מקום 2. מדינה קטנה שלא מופיעה במפת 110m — מסומנת בנקודה.",
  },
  {
    id: "QA",
    nameHe: "קטאר",
    nameEn: "Qatar",
    geoNames: ["Qatar"],
    region: "me",
    coords: [51.18, 25.3],
    ranks: [8, 3, 3, 4, 4],
    sentiment: "critical",
    positive: 28,
    mixed: 24,
    negative: 48,
    confidence: "documented",
    note: "צפייה גבוהה (שיא מקום 3) במקביל לקמפיין תקשורתי עוין עם עליית העונה.",
    quotes: [
      {
        text: "שחקנים מהסדרה השתתפו במלחמת ההשמדה נגד עזה. הסדרה הישראלית פאודה חוזרת לנטפליקס.",
        by: "אל-ערבי אל-ג'דיד",
        tone: "critical",
        source: "Al-Araby Al-Jadeed",
      },
    ],
  },
  {
    id: "OM",
    nameHe: "עומאן",
    nameEn: "Oman",
    geoNames: ["Oman"],
    region: "me",
    coords: [58.0, 21.5],
    ranks: [10, 3, 4, 5, 7],
    sentiment: "mixed",
    positive: 50,
    mixed: 32,
    negative: 18,
    confidence: "estimated",
  },
  {
    id: "KW",
    nameHe: "כווית",
    nameEn: "Kuwait",
    geoNames: ["Kuwait"],
    region: "me",
    coords: [47.8, 29.3],
    ranks: [null, 3, 3, 7, 8],
    sentiment: "mixed",
    positive: 44,
    mixed: 30,
    negative: 26,
    confidence: "estimated",
  },
  {
    id: "EG",
    nameHe: "מצרים",
    nameEn: "Egypt",
    geoNames: ["Egypt"],
    region: "me",
    coords: [30.8, 26.8],
    ranks: [9, 4, 6, 8, 10],
    sentiment: "mixed",
    positive: 42,
    mixed: 30,
    negative: 28,
    confidence: "estimated",
    note: "שיא מקום 4. שיח ערבי קלאסי: צפייה גבוהה לצד ביקורת על הנרטיב.",
  },
  {
    id: "MA",
    nameHe: "מרוקו",
    nameEn: "Morocco",
    geoNames: ["Morocco"],
    region: "me",
    coords: [-7.0, 31.8],
    ranks: [10, 5, 3, 7, 6],
    sentiment: "mixed",
    positive: 54,
    mixed: 28,
    negative: 18,
    confidence: "estimated",
    note: "שיא מקום 3 ב-11 בספטמבר.",
  },
  {
    id: "SA",
    nameHe: "ערב הסעודית",
    nameEn: "Saudi Arabia",
    geoNames: ["Saudi Arabia"],
    region: "me",
    coords: [45.0, 24.0],
    ranks: [null, 9, null, null, null],
    sentiment: "mixed",
    positive: 40,
    mixed: 34,
    negative: 26,
    confidence: "estimated",
    note: "נכנסה לטופ 10 ב-10 בספטמבר (מקום 9) וירדה מהדירוג בימים שאחרי.",
  },
  {
    id: "TR",
    nameHe: "טורקיה",
    nameEn: "Turkey",
    geoNames: ["Turkey"],
    region: "me",
    coords: [35.2, 39.0],
    ranks: [null, null, 10, 10, 10],
    sentiment: "critical",
    positive: 30,
    mixed: 28,
    negative: 42,
    confidence: "estimated",
    note: "נכנסה לטופ 10 למרות אקלים פוליטי ביקורתי כלפי ישראל.",
  },
  {
    id: "FR",
    nameHe: "צרפת",
    nameEn: "France",
    geoNames: ["France"],
    region: "eu",
    coords: [2.3, 46.6],
    ranks: [3, 3, 3, 5, 5],
    sentiment: "mixed",
    positive: 58,
    mixed: 26,
    negative: 16,
    confidence: "documented",
    note: "עלילת מרסיי. הצילומים הועברו לבודפשט אחרי אזהרת אבטחה. העונה דורגה מקום 3 בסדרות בצרפת בימים הראשונים.",
    quotes: [
      {
        text: "זה לא המציאות, אבל הרגשנו שיש סיפור שצריך לספר. רצינו שהעונה תעורר דיון ושצופים יבינו כמה השלום חשוב.",
        by: "ליאור רז ואבי יששכרוף",
        tone: "emotional",
        source: "Télé-Loisirs",
      },
    ],
  },
  {
    id: "DE",
    nameHe: "גרמניה",
    nameEn: "Germany",
    geoNames: ["Germany"],
    region: "eu",
    coords: [10.4, 51.1],
    ranks: [10, 5, 6, 8, 7],
    sentiment: "positive",
    positive: 76,
    mixed: 16,
    negative: 8,
    confidence: "documented",
    note: "פיד הרשתות התמלא בציוצים גרמניים של הלם אחרי פרקי 7 באוקטובר.",
    quotes: [
      {
        text: "כל הפיד שלי מלא בציוצים של הולנדים וגרמנים על פרקי 7 באוקטובר. הם בהלם מוחלט, והפוסטים קשים לקריאה ותומכים מאוד בישראל.",
        by: "לי מלאך",
        tone: "emotional",
        source: "Jerusalem Post",
      },
    ],
  },
  {
    id: "NL",
    nameHe: "הולנד",
    nameEn: "Netherlands",
    geoNames: ["Netherlands"],
    region: "eu",
    coords: [5.3, 52.1],
    ranks: [4, 2, 3, 4, 4],
    sentiment: "positive",
    positive: 78,
    mixed: 14,
    negative: 8,
    confidence: "documented",
    note: "שיא מקום 2. שיח הולנדי בולט של הלם ותמיכה אחרי פרקים 7–8.",
  },
  {
    id: "IT",
    nameHe: "איטליה",
    nameEn: "Italy",
    geoNames: ["Italy"],
    region: "eu",
    coords: [12.6, 42.8],
    ranks: [9, 2, 4, 5, 6],
    sentiment: "positive",
    positive: 72,
    mixed: 18,
    negative: 10,
    confidence: "documented",
    quotes: [
      {
        text: "בקושי הצלחתי להשאיר את העיניים פתוחות.",
        by: "צופה איטלקי",
        tone: "emotional",
        source: "Jerusalem Post",
      },
      {
        text: "אולי הסדרה תעזור לאנשים להבין את הזוועות שחמאס ביצע ב-7 באוקטובר.",
        by: "חברה של צופה איטלקייה, לא יהודייה ולא ישראלית",
        tone: "positive",
        source: "Jerusalem Post",
      },
    ],
  },
  {
    id: "GR",
    nameHe: "יוון",
    nameEn: "Greece",
    geoNames: ["Greece"],
    region: "eu",
    coords: [22.0, 39.0],
    ranks: [2, 2, 2, 3, 4],
    sentiment: "positive",
    positive: 74,
    mixed: 18,
    negative: 8,
    confidence: "estimated",
    note: "מהמדינות החזקות ביותר באירופה — מקום 2 ארבעה ימים ברצף כמעט.",
  },
  {
    id: "CY",
    nameHe: "קפריסין",
    nameEn: "Cyprus",
    geoNames: ["Cyprus"],
    region: "eu",
    coords: [33.4, 35.1],
    ranks: [2, 2, 2, 2, 3],
    sentiment: "positive",
    positive: 76,
    mixed: 16,
    negative: 8,
    confidence: "estimated",
  },
  {
    id: "RO",
    nameHe: "רומניה",
    nameEn: "Romania",
    geoNames: ["Romania"],
    region: "eu",
    coords: [25.0, 45.9],
    ranks: [2, 1, 2, 4, 4],
    sentiment: "positive",
    positive: 74,
    mixed: 18,
    negative: 8,
    confidence: "estimated",
    note: "המדינה האירופית היחידה שבה העונה הגיעה למקום הראשון (10 בספטמבר).",
  },
  {
    id: "CZ",
    nameHe: "צ'כיה",
    nameEn: "Czechia",
    geoNames: ["Czechia"],
    region: "eu",
    coords: [15.5, 49.8],
    ranks: [2, 2, 3, 4, 4],
    sentiment: "positive",
    positive: 73,
    mixed: 19,
    negative: 8,
    confidence: "estimated",
  },
  {
    id: "SK",
    nameHe: "סלובקיה",
    nameEn: "Slovakia",
    geoNames: ["Slovakia"],
    region: "eu",
    coords: [19.7, 48.7],
    ranks: [2, 2, 4, 5, 5],
    sentiment: "positive",
    positive: 72,
    mixed: 20,
    negative: 8,
    confidence: "estimated",
  },
  {
    id: "HU",
    nameHe: "הונגריה",
    nameEn: "Hungary",
    geoNames: ["Hungary"],
    region: "eu",
    coords: [19.5, 47.2],
    ranks: [2, 2, 4, 4, 4],
    sentiment: "positive",
    positive: 74,
    mixed: 18,
    negative: 8,
    confidence: "estimated",
    note: "חלק ניכר מצילומי מרסיי הועתק לבודפשט מסיבות אבטחה.",
  },
  {
    id: "RS",
    nameHe: "סרביה",
    nameEn: "Serbia",
    geoNames: ["Serbia"],
    region: "eu",
    coords: [20.8, 44.2],
    ranks: [2, 2, 3, 4, 4],
    sentiment: "positive",
    positive: 70,
    mixed: 22,
    negative: 8,
    confidence: "estimated",
  },
  {
    id: "HR",
    nameHe: "קרואטיה",
    nameEn: "Croatia",
    geoNames: ["Croatia"],
    region: "eu",
    coords: [16.0, 45.1],
    ranks: [3, 2, 4, 4, 4],
    sentiment: "positive",
    positive: 71,
    mixed: 21,
    negative: 8,
    confidence: "estimated",
  },
  {
    id: "BG",
    nameHe: "בולגריה",
    nameEn: "Bulgaria",
    geoNames: ["Bulgaria"],
    region: "eu",
    coords: [25.3, 42.7],
    ranks: [4, 2, 3, 4, 5],
    sentiment: "positive",
    positive: 70,
    mixed: 22,
    negative: 8,
    confidence: "estimated",
  },
  {
    id: "PL",
    nameHe: "פולין",
    nameEn: "Poland",
    geoNames: ["Poland"],
    region: "eu",
    coords: [19.4, 52.1],
    ranks: [3, 3, 4, 5, 5],
    sentiment: "positive",
    positive: 72,
    mixed: 18,
    negative: 10,
    confidence: "estimated",
  },
  {
    id: "BE",
    nameHe: "בלגיה",
    nameEn: "Belgium",
    geoNames: ["Belgium"],
    region: "eu",
    coords: [4.4, 50.6],
    ranks: [9, 3, 5, 5, 6],
    sentiment: "positive",
    positive: 66,
    mixed: 22,
    negative: 12,
    confidence: "estimated",
  },
  {
    id: "FI",
    nameHe: "פינלנד",
    nameEn: "Finland",
    geoNames: ["Finland"],
    region: "eu",
    coords: [26.0, 64.5],
    ranks: [5, 3, 3, 6, 6],
    sentiment: "positive",
    positive: 70,
    mixed: 22,
    negative: 8,
    confidence: "estimated",
  },
  {
    id: "AT",
    nameHe: "אוסטריה",
    nameEn: "Austria",
    geoNames: ["Austria"],
    region: "eu",
    coords: [14.1, 47.6],
    ranks: [8, 4, 5, 6, 5],
    sentiment: "positive",
    positive: 68,
    mixed: 22,
    negative: 10,
    confidence: "estimated",
  },
  {
    id: "LU",
    nameHe: "לוקסמבורג",
    nameEn: "Luxembourg",
    geoNames: ["Luxembourg"],
    region: "eu",
    coords: [6.13, 49.8],
    ranks: [7, 4, 6, 6, 5],
    sentiment: "positive",
    positive: 68,
    mixed: 22,
    negative: 10,
    confidence: "estimated",
  },
  {
    id: "CH",
    nameHe: "שווייץ",
    nameEn: "Switzerland",
    geoNames: ["Switzerland"],
    region: "eu",
    coords: [8.2, 46.8],
    ranks: [null, null, null, null, 5],
    sentiment: "positive",
    positive: 66,
    mixed: 24,
    negative: 10,
    confidence: "estimated",
  },
  {
    id: "SE",
    nameHe: "שוודיה",
    nameEn: "Sweden",
    geoNames: ["Sweden"],
    region: "eu",
    coords: [15.0, 62.0],
    ranks: [null, null, null, null, 5],
    sentiment: "mixed",
    positive: 58,
    mixed: 26,
    negative: 16,
    confidence: "estimated",
    note: "צפייה בינונית-גבוהה באקלים פוליטי מקוטב סביב ישראל.",
  },
  {
    id: "NO",
    nameHe: "נורווגיה",
    nameEn: "Norway",
    geoNames: ["Norway"],
    region: "eu",
    coords: [8.5, 60.5],
    ranks: [6, 6, 6, 6, 6],
    sentiment: "mixed",
    positive: 56,
    mixed: 28,
    negative: 16,
    confidence: "estimated",
  },
  {
    id: "DK",
    nameHe: "דנמרק",
    nameEn: "Denmark",
    geoNames: ["Denmark"],
    region: "eu",
    coords: [10.0, 56.0],
    ranks: [8, 7, 8, 9, 9],
    sentiment: "positive",
    positive: 64,
    mixed: 24,
    negative: 12,
    confidence: "estimated",
  },
  {
    id: "ES",
    nameHe: "ספרד",
    nameEn: "Spain",
    geoNames: ["Spain"],
    region: "eu",
    coords: [-3.7, 40.4],
    ranks: [null, 7, 7, 8, 8],
    sentiment: "mixed",
    positive: 52,
    mixed: 28,
    negative: 20,
    confidence: "estimated",
  },
  {
    id: "PT",
    nameHe: "פורטוגל",
    nameEn: "Portugal",
    geoNames: ["Portugal"],
    region: "eu",
    coords: [-8.0, 39.6],
    ranks: [null, 6, 6, 8, 8],
    sentiment: "positive",
    positive: 64,
    mixed: 24,
    negative: 12,
    confidence: "estimated",
  },
  {
    id: "SI",
    nameHe: "סלובניה",
    nameEn: "Slovenia",
    geoNames: ["Slovenia"],
    region: "eu",
    coords: [14.8, 46.1],
    ranks: [7, 5, 6, 7, 8],
    sentiment: "positive",
    positive: 68,
    mixed: 22,
    negative: 10,
    confidence: "estimated",
  },
  {
    id: "LT",
    nameHe: "ליטא",
    nameEn: "Lithuania",
    geoNames: ["Lithuania"],
    region: "eu",
    coords: [23.9, 55.2],
    ranks: [null, 5, 7, 8, 7],
    sentiment: "positive",
    positive: 70,
    mixed: 20,
    negative: 10,
    confidence: "estimated",
  },
  {
    id: "IE",
    nameHe: "אירלנד",
    nameEn: "Ireland",
    geoNames: ["Ireland"],
    region: "eu",
    coords: [-8.0, 53.4],
    ranks: [null, 9, null, null, null],
    sentiment: "mixed",
    positive: 48,
    mixed: 28,
    negative: 24,
    confidence: "estimated",
    note: "יום אחד בטופ 10. השיח הציבורי באירלנד סביב ישראל מקוטב יותר מאשר הצפייה עצמה.",
  },
  {
    id: "GB",
    nameHe: "בריטניה",
    nameEn: "United Kingdom",
    geoNames: ["United Kingdom"],
    region: "eu",
    coords: [-1.5, 52.5],
    ranks: [null, null, null, null, null],
    sentiment: "positive",
    positive: 70,
    mixed: 18,
    negative: 12,
    confidence: "documented",
    note: "לא נכנסה לטופ 10 של FlixPatrol בשבוע הראשון, אבל צופים בריטים הובילו חלק מהשיח הרגשי סביב פרקים 7–8.",
    quotes: [
      {
        text: "פרקים 7 ו-8 שברו אותי. בכיתי המון. העונה שונה מהקודמות, אבל עדיין נהניתי.",
        by: "צופה מאנגליה",
        tone: "emotional",
        source: "Ynet",
      },
      {
        text: "תנועת ה-BDS דרשה מנטפליקס לבטל את הסדרה ותיארה אותה ככלי תעמולה גזעני נגד ערבים.",
        by: "דיווח The Telegraph על קמפיין החרם בבריטניה, ספטמבר 2026",
        tone: "critical",
        source: "Telegraph",
      },
    ],
  },
  {
    id: "IN",
    nameHe: "הודו",
    nameEn: "India",
    geoNames: ["India"],
    region: "aa",
    coords: [79.0, 22.0],
    ranks: [7, 2, 4, 5, 5],
    sentiment: "positive",
    positive: 68,
    mixed: 22,
    negative: 10,
    confidence: "documented",
    note: "שיא מקום 2. קהל נאמן לסדרה; מבקר ב-NDTV נתן 2.5/5 וכתב שהיכולת להפתיע נחלשה.",
    quotes: [
      {
        text: "אפשר לצפות ברצף, אבל בסוף נשארים יותר מותשים מנלהבים — היכולת של הסדרה להדהים נמצאת בשפל.",
        by: "סייבל צ'טרג'י, NDTV",
        tone: "critical",
        source: "NDTV",
      },
    ],
  },
  {
    id: "LK",
    nameHe: "סרי לנקה",
    nameEn: "Sri Lanka",
    geoNames: ["Sri Lanka"],
    region: "aa",
    coords: [80.7, 7.9],
    ranks: [8, 3, null, null, null],
    sentiment: "positive",
    positive: 66,
    mixed: 24,
    negative: 10,
    confidence: "estimated",
  },
  {
    id: "PK",
    nameHe: "פקיסטן",
    nameEn: "Pakistan",
    geoNames: ["Pakistan"],
    region: "aa",
    coords: [69.3, 30.4],
    ranks: [null, 8, 8, 10, 10],
    sentiment: "mixed",
    positive: 38,
    mixed: 30,
    negative: 32,
    confidence: "estimated",
  },
  {
    id: "BD",
    nameHe: "בנגלדש",
    nameEn: "Bangladesh",
    geoNames: ["Bangladesh"],
    region: "aa",
    coords: [90.3, 23.7],
    ranks: [null, 8, 9, 10, 10],
    sentiment: "mixed",
    positive: 40,
    mixed: 32,
    negative: 28,
    confidence: "estimated",
  },
  {
    id: "KE",
    nameHe: "קניה",
    nameEn: "Kenya",
    geoNames: ["Kenya"],
    region: "aa",
    coords: [37.9, 0.0],
    ranks: [8, 7, 9, 10, 9],
    sentiment: "positive",
    positive: 64,
    mixed: 24,
    negative: 12,
    confidence: "estimated",
  },
  {
    id: "NG",
    nameHe: "ניגריה",
    nameEn: "Nigeria",
    geoNames: ["Nigeria"],
    region: "aa",
    coords: [8.0, 9.0],
    ranks: [7, 5, 7, 7, 9],
    sentiment: "positive",
    positive: 62,
    mixed: 26,
    negative: 12,
    confidence: "estimated",
  },
  {
    id: "AR",
    nameHe: "ארגנטינה",
    nameEn: "Argentina",
    geoNames: ["Argentina"],
    region: "am",
    coords: [-64.0, -34.0],
    ranks: [7, 4, 5, 7, 7],
    sentiment: "positive",
    positive: 82,
    mixed: 12,
    negative: 6,
    confidence: "documented",
    quotes: [
      {
        text: "שנה טובה, עם ישראל חי.",
        by: "צופה מארגנטינה, אחרי סיום העונה",
        tone: "positive",
        source: "Walla",
      },
    ],
  },
  {
    id: "BR",
    nameHe: "ברזיל",
    nameEn: "Brazil",
    geoNames: ["Brazil"],
    region: "am",
    coords: [-51.0, -14.0],
    ranks: [null, 10, null, null, null],
    sentiment: "positive",
    positive: 74,
    mixed: 18,
    negative: 8,
    confidence: "documented",
    quotes: [
      {
        text: "פאודה תמיד היתה סדרה מטלטלת. העונה החמישית מזעזעת וכואבת במיוחד. פרקים 7 ו-8 משחזרים את הטבח — קשה יותר מדרמה בדיונית.",
        by: "לוסיאנו פירס, קריקטוריסט",
        tone: "emotional",
        source: "Jerusalem Post",
      },
    ],
  },
  {
    id: "CL",
    nameHe: "צ'ילה",
    nameEn: "Chile",
    geoNames: ["Chile"],
    region: "am",
    coords: [-71.0, -35.0],
    ranks: [null, 8, 10, null, null],
    sentiment: "mixed",
    positive: 54,
    mixed: 26,
    negative: 20,
    confidence: "estimated",
  },
  {
    id: "PA",
    nameHe: "פנמה",
    nameEn: "Panama",
    geoNames: ["Panama"],
    region: "am",
    coords: [-80.0, 8.5],
    ranks: [7, 6, 7, 10, 8],
    sentiment: "positive",
    positive: 66,
    mixed: 24,
    negative: 10,
    confidence: "estimated",
  },
  {
    id: "US",
    nameHe: "ארצות הברית",
    nameEn: "United States",
    geoNames: ["United States of America"],
    region: "am",
    coords: [-97.0, 39.5],
    ranks: [null, null, null, null, null],
    sentiment: "positive",
    positive: 72,
    mixed: 16,
    negative: 12,
    confidence: "documented",
    note: "לא בטופ 10 של FlixPatrol בשבוע הראשון. Decider המליץ Stream It. צופים אמריקאים הובילו חלק מהשיח על חשיבות הפרקים.",
    quotes: [
      {
        text: "עבודה מצוינת. קשה לצפות, אבל חשוב שאנשים יראו מה ישראל עברה ועדיין עוברת.",
        by: "צופה אמריקאי לא-יהודי",
        tone: "positive",
        source: "Ynet",
      },
      {
        text: "העונה החמישית הולכת לכיוון אחר מהארבע הראשונות, אבל היא מבט מרתק על איך דמויות שאנחנו מכירים שנים מגיבות לזוועות 7 באוקטובר.",
        by: "ג'ואל קלר, Decider — Stream It",
        tone: "positive",
        source: "Decider",
      },
    ],
  },
  {
    id: "LY",
    nameHe: "לוב",
    nameEn: "Libya",
    geoNames: ["Libya"],
    region: "me",
    coords: [17.2, 27.0],
    ranks: [null, null, null, null, null],
    sentiment: "critical",
    positive: 18,
    mixed: 20,
    negative: 62,
    confidence: "documented",
    note: "אין דירוג FlixPatrol בשבוע הראשון. צופה מלוב פרסם ביקורת חריפה על הנרטיב.",
    quotes: [
      {
        text: "הבעיה היא לא שעוסקים באירועי 7 באוקטובר. הבעיה היא הנרטיב שהיצירה מציגה, ייצוג הפלסטינים והמאבק שלהם, והפרשנות שמשרתת נרטיב אחד על חשבון האחר.",
        by: "צופה מלוב",
        tone: "critical",
        source: "Ynet",
      },
    ],
  },
  {
    id: "PS",
    nameHe: "פלסטין",
    nameEn: "Palestine",
    geoNames: ["Palestine"],
    region: "me",
    coords: [35.2, 31.9],
    ranks: [null, null, null, null, null],
    sentiment: "mixed",
    positive: 34,
    mixed: 22,
    negative: 44,
    confidence: "documented",
    note: "אין דירוג נטפליקס. השיח מפוצל: ציטוט חיובי מצופה בעזה לצד ביקורת ערבית על הנרטיב. הטון כאן הוא שיח, לא צפייה.",
    quotes: [
      {
        text: "אחת העונות החזקות, המותחות והמרתקות של הסדרה.",
        by: "צופה מרצועת עזה",
        tone: "positive",
        source: "Ynet",
      },
    ],
  },
  {
    id: "CA",
    nameHe: "קנדה",
    nameEn: "Canada",
    geoNames: ["Canada"],
    region: "am",
    coords: [-96.0, 56.0],
    ranks: [null, null, null, null, null],
    sentiment: "positive",
    positive: 68,
    mixed: 20,
    negative: 12,
    confidence: "estimated",
    note: "נטפליקס זמין, לא בטופ 10 של FlixPatrol. הטון מוערך לפי שיח אנגלופוני מתועד בארה״ב ובבריטניה (Decider, NYT, Ynet).",
  },
  {
    id: "AU",
    nameHe: "אוסטרליה",
    nameEn: "Australia",
    geoNames: ["Australia"],
    region: "aa",
    coords: [134.0, -25.0],
    ranks: [null, null, null, null, null],
    sentiment: "positive",
    positive: 66,
    mixed: 20,
    negative: 14,
    confidence: "estimated",
    note: "העונה עלתה בנטפליקס אוסטרליה. אין דירוג טופ 10. הערכה לפי שיח אנגלופוני מתועד, לא לפי סקר מקומי.",
  },
  {
    id: "NZ",
    nameHe: "ניו זילנד",
    nameEn: "New Zealand",
    geoNames: ["New Zealand"],
    region: "aa",
    coords: [174.0, -41.0],
    ranks: [null, null, null, null, null],
    sentiment: "positive",
    positive: 64,
    mixed: 22,
    negative: 14,
    confidence: "estimated",
    note: "נטפליקס זמין, בלי טופ 10. הערכה אזורית לפי אוסטרליה והשיח האנגלופוני.",
  },
  {
    id: "MX",
    nameHe: "מקסיקו",
    nameEn: "Mexico",
    geoNames: ["Mexico"],
    region: "am",
    coords: [-102.0, 23.0],
    ranks: [null, null, null, null, null],
    sentiment: "mixed",
    positive: 52,
    mixed: 28,
    negative: 20,
    confidence: "estimated",
    note: "שוק נטפליקס גדול בלי כניסה לטופ 10 בשבוע הראשון. הטון מוערך לפי אמריקה הלטינית במדגם (צ׳ילה, ברזיל, ארגנטינה).",
  },
  {
    id: "CO",
    nameHe: "קולומביה",
    nameEn: "Colombia",
    geoNames: ["Colombia"],
    region: "am",
    coords: [-74.0, 4.0],
    ranks: [null, null, null, null, null],
    sentiment: "mixed",
    positive: 50,
    mixed: 28,
    negative: 22,
    confidence: "estimated",
    note: "אין דירוג צפייה. הערכה לפי שכנות לטיניות במדגם, בלי ציטוט מקומי מתועד.",
  },
  {
    id: "PE",
    nameHe: "פרו",
    nameEn: "Peru",
    geoNames: ["Peru"],
    region: "am",
    coords: [-75.0, -10.0],
    ranks: [null, null, null, null, null],
    sentiment: "mixed",
    positive: 51,
    mixed: 27,
    negative: 22,
    confidence: "estimated",
    note: "נטפליקס זמין, בלי טופ 10. שיח מוערך אזורית.",
  },
  {
    id: "JP",
    nameHe: "יפן",
    nameEn: "Japan",
    geoNames: ["Japan"],
    region: "aa",
    coords: [138.0, 36.0],
    ranks: [null, null, null, null, null],
    sentiment: "mixed",
    positive: 58,
    mixed: 26,
    negative: 16,
    confidence: "estimated",
    note: "העונה זמינה בנטפליקס יפן. אין דירוג טופ 10 ואין ביקורת מקומית במדגם — הערכה כצפיית מתח, לא כמסמך פוליטי.",
  },
  {
    id: "KR",
    nameHe: "דרום קוריאה",
    nameEn: "South Korea",
    geoNames: ["South Korea"],
    region: "aa",
    coords: [128.0, 36.0],
    ranks: [null, null, null, null, null],
    sentiment: "mixed",
    positive: 57,
    mixed: 27,
    negative: 16,
    confidence: "estimated",
    note: "נטפליקס חזק מקומית, בלי כניסה לטופ 10 של פאודה. אין ציטוט קוריאני מתועד.",
  },
  {
    id: "PH",
    nameHe: "הפיליפינים",
    nameEn: "Philippines",
    geoNames: ["Philippines"],
    region: "aa",
    coords: [122.0, 12.0],
    ranks: [null, null, null, null, null],
    sentiment: "mixed",
    positive: 55,
    mixed: 28,
    negative: 17,
    confidence: "estimated",
    note: "שוק סטרימינג גדול בלי דירוג טופ 10. הערכה אזורית.",
  },
  {
    id: "TH",
    nameHe: "תאילנד",
    nameEn: "Thailand",
    geoNames: ["Thailand"],
    region: "aa",
    coords: [101.0, 15.0],
    ranks: [null, null, null, null, null],
    sentiment: "mixed",
    positive: 54,
    mixed: 28,
    negative: 18,
    confidence: "estimated",
    note: "נטפליקס זמין, בלי טופ 10. אין סיקור מקומי במדגם.",
  },
  {
    id: "ID",
    nameHe: "אינדונזיה",
    nameEn: "Indonesia",
    geoNames: ["Indonesia"],
    region: "aa",
    coords: [118.0, -2.0],
    ranks: [null, null, null, null, null],
    sentiment: "critical",
    positive: 30,
    mixed: 28,
    negative: 42,
    confidence: "estimated",
    note: "מדינה מוסלמית גדולה עם נטפליקס, בלי טופ 10. הטון מוערך לפי אקלים חרם ושיח ערבי מתועד (אל-ערבי), לא לפי סקר אינדונזי.",
  },
  {
    id: "MY",
    nameHe: "מלזיה",
    nameEn: "Malaysia",
    geoNames: ["Malaysia"],
    region: "aa",
    coords: [102.0, 4.0],
    ranks: [null, null, null, null, null],
    sentiment: "critical",
    positive: 28,
    mixed: 30,
    negative: 42,
    confidence: "estimated",
    note: "אין דירוג צפייה. הערכה לפי שכנות מוסלמית בדרום-מזרח אסיה ושיח חרם אזורי.",
  },
  {
    id: "TN",
    nameHe: "תוניסיה",
    nameEn: "Tunisia",
    geoNames: ["Tunisia"],
    region: "me",
    coords: [9.5, 34.0],
    ranks: [null, null, null, null, null],
    sentiment: "critical",
    positive: 24,
    mixed: 26,
    negative: 50,
    confidence: "estimated",
    note: "אין טופ 10. הטון מוערך לפי שיח צפון-אפריקאי וביקורת אל-ערבי על חזרת הסדרה לנטפליקס.",
  },
  {
    id: "DZ",
    nameHe: "אלג׳יריה",
    nameEn: "Algeria",
    geoNames: ["Algeria"],
    region: "me",
    coords: [2.6, 28.0],
    ranks: [null, null, null, null, null],
    sentiment: "critical",
    positive: 22,
    mixed: 24,
    negative: 54,
    confidence: "estimated",
    note: "נטפליקס מוגבל יחסית, בלי דירוג. הערכה לפי המגרב ושיח ערבי מתועד — לא לפי שעות צפייה.",
  },
  {
    id: "IQ",
    nameHe: "עיראק",
    nameEn: "Iraq",
    geoNames: ["Iraq"],
    region: "me",
    coords: [44.0, 33.0],
    ranks: [null, null, null, null, null],
    sentiment: "critical",
    positive: 20,
    mixed: 24,
    negative: 56,
    confidence: "estimated",
    note: "אין דירוג FlixPatrol. השיח מוערך לפי התקשורת הערבית סביב עליית העונה.",
  },
  {
    id: "SY",
    nameHe: "סוריה",
    nameEn: "Syria",
    geoNames: ["Syria"],
    region: "me",
    coords: [38.5, 35.0],
    ranks: [null, null, null, null, null],
    sentiment: "critical",
    positive: 18,
    mixed: 22,
    negative: 60,
    confidence: "estimated",
    note: "אין שוק נטפליקס מדורג. צבע המפה משקף שיח אזורי, לא צפייה.",
  },
  {
    id: "IR",
    nameHe: "איראן",
    nameEn: "Iran",
    geoNames: ["Iran"],
    region: "aa",
    coords: [53.0, 32.0],
    ranks: [null, null, null, null, null],
    sentiment: "critical",
    positive: 14,
    mixed: 18,
    negative: 68,
    confidence: "estimated",
    note: "נטפליקס אינו רשמי. אין נתון צפייה. הטון הוא הערכת שיח מדינתי ואזורי בלבד.",
  },
  {
    id: "ZA",
    nameHe: "דרום אפריקה",
    nameEn: "South Africa",
    geoNames: ["South Africa"],
    region: "aa",
    coords: [24.0, -29.0],
    ranks: [null, null, null, null, null],
    sentiment: "mixed",
    positive: 38,
    mixed: 30,
    negative: 32,
    confidence: "estimated",
    note: "נטפליקס זמין, בלי טופ 10. הערכה מעורבת: קהל סטרימינג מול מסורת BDS מקומית — בלי ציטוט ספציפי לעונה 5.",
  },
  {
    id: "UA",
    nameHe: "אוקראינה",
    nameEn: "Ukraine",
    geoNames: ["Ukraine"],
    region: "eu",
    coords: [32.0, 49.0],
    ranks: [null, null, null, null, null],
    sentiment: "mixed",
    positive: 56,
    mixed: 26,
    negative: 18,
    confidence: "estimated",
    note: "אין דירוג טופ 10. הערכה לפי אירופה במדגם, בלי סיקור אוקראיני מתועד.",
  },
  {
    id: "CR",
    nameHe: "קוסטה ריקה",
    nameEn: "Costa Rica",
    geoNames: ["Costa Rica"],
    region: "am",
    coords: [-84.0, 10.0],
    ranks: [null, 10, null, null, null],
    sentiment: "mixed",
    positive: 58,
    mixed: 26,
    negative: 16,
    confidence: "estimated",
    note: "נכנסה לטופ 10 ליום אחד לפי FlixPatrol. אין ציטוט מקומי מתועד.",
  },
  {
    id: "UY",
    nameHe: "אורוגוואי",
    nameEn: "Uruguay",
    geoNames: ["Uruguay"],
    region: "am",
    coords: [-56.0, -33.0],
    ranks: [6, 4, 5, 7, 7],
    sentiment: "positive",
    positive: 64,
    mixed: 22,
    negative: 14,
    confidence: "estimated",
    note: "דירוג צפייה יציב בטופ 10. הטון מוערך לפי השכנות הלטינית (ארגנטינה).",
  },
  {
    id: "VE",
    nameHe: "ונצואלה",
    nameEn: "Venezuela",
    geoNames: ["Venezuela"],
    region: "am",
    coords: [-66.0, 8.0],
    ranks: [null, 8, 10, null, null],
    sentiment: "mixed",
    positive: 50,
    mixed: 28,
    negative: 22,
    confidence: "estimated",
    note: "יומיים בטופ 10. אין שיח מקומי מתועד במדגם.",
  },
  {
    id: "SV",
    nameHe: "אל סלוודור",
    nameEn: "El Salvador",
    geoNames: ["El Salvador"],
    region: "am",
    coords: [-88.9, 13.7],
    ranks: [null, 10, null, null, null],
    sentiment: "mixed",
    positive: 54,
    mixed: 28,
    negative: 18,
    confidence: "estimated",
    note: "יום אחד בטופ 10 לפי FlixPatrol.",
  },
  {
    id: "EE",
    nameHe: "אסטוניה",
    nameEn: "Estonia",
    geoNames: ["Estonia"],
    region: "eu",
    coords: [25.0, 58.6],
    ranks: [null, 8, null, null, null],
    sentiment: "mixed",
    positive: 60,
    mixed: 24,
    negative: 16,
    confidence: "estimated",
    note: "יום בטופ 10. הערכה לפי צפון-אירופה במדגם.",
  },
  {
    id: "LV",
    nameHe: "לטביה",
    nameEn: "Latvia",
    geoNames: ["Latvia"],
    region: "eu",
    coords: [24.1, 56.9],
    ranks: [null, 10, null, null, null],
    sentiment: "mixed",
    positive: 58,
    mixed: 26,
    negative: 16,
    confidence: "estimated",
    note: "יום בטופ 10. אין ציטוט מקומי.",
  },
  {
    id: "IS",
    nameHe: "איסלנד",
    nameEn: "Iceland",
    geoNames: ["Iceland"],
    region: "eu",
    coords: [-19.0, 65.0],
    ranks: [null, 9, null, null, null],
    sentiment: "mixed",
    positive: 62,
    mixed: 22,
    negative: 16,
    confidence: "estimated",
    note: "יום בטופ 10 לפי FlixPatrol.",
  },
  {
    id: "MT",
    nameHe: "מלטה",
    nameEn: "Malta",
    geoNames: ["Malta"],
    region: "eu",
    coords: [14.4, 35.9],
    ranks: [7, 4, 5, 6, 6],
    sentiment: "mixed",
    positive: 60,
    mixed: 24,
    negative: 16,
    confidence: "estimated",
    note: "דירוג עקבי בטופ 10. מדינה קטנה — הערכה לפי דרום-אירופה.",
  },
  {
    id: "MU",
    nameHe: "מאוריציוס",
    nameEn: "Mauritius",
    geoNames: ["Mauritius"],
    region: "aa",
    coords: [57.5, -20.3],
    ranks: [null, null, null, null, null],
    sentiment: "mixed",
    positive: 58,
    mixed: 26,
    negative: 16,
    confidence: "estimated",
    note: "יום בטופ 10 לפי FlixPatrol. לא היה במדגם הקודם.",
  },
  {
    id: "NC",
    nameHe: "קלדוניה החדשה",
    nameEn: "New Caledonia",
    geoNames: ["New Caledonia"],
    region: "aa",
    coords: [165.5, -21.3],
    ranks: [null, null, null, null, null],
    sentiment: "mixed",
    positive: 58,
    mixed: 26,
    negative: 16,
    confidence: "estimated",
    note: "נכנסה למצעד לפי FlixPatrol. לא הייתה במדגם הקודם.",
  },
];

export const countries: Country[] = applyLiveRanks(BASE_COUNTRIES);

export const globalQuotes: Quote[] = [
  {
    text: "בכיתי את הנשמה. בדרך כלל אני לא בוכה מסדרות או מסרטים.",
    by: "צופה לא-ישראלי ולא-יהודי",
    tone: "emotional",
    source: "Ynet",
  },
  {
    text: "לא הצלחתי לדבר לאורך שני הפרקים וגם די הרבה אחריהם. הכול הרגיש אמיתי מדי. שום הפקה הוליוודית לא מתקרבת לזה.",
    by: "צופה בינלאומי",
    tone: "emotional",
    source: "Ynet",
  },
  {
    text: "זו הפעם הראשונה שהיתה לי התקפת חרדה תוך כדי צפייה בסדרה. אני לא יכול לדמיין איך זה למי שבאמת עבר את זה.",
    by: "צופה בינלאומי",
    tone: "emotional",
    source: "Ynet",
  },
  {
    text: "לא הצלחתי להפסיק לבכות בסצנה שבה הבת של אלי אומרת לאמא, כשהמחבלים מחוץ למרחב המוגן: סליחה אמא, שכחתי להחזיר את העוגה למקרר. כמה קשה ליהודים פשוט לחיות חיים נורמליים. העונה הטובה ביותר.",
    by: "צופה בינלאומי",
    tone: "positive",
    source: "Ynet",
  },
];

export function peakRank(c: Country): number | null {
  const nums = c.ranks.filter((n): n is number => n != null);
  return nums.length ? Math.min(...nums) : null;
}

export function latestRank(c: Country): number | null {
  for (let i = c.ranks.length - 1; i >= 0; i--) {
    const v = c.ranks[i];
    if (v != null) return v;
  }
  return null;
}

export function inTop10(c: Country): boolean {
  return peakRank(c) != null;
}

export function isTalkOnly(c: Country): boolean {
  return peakRank(c) == null;
}

export function rankHeat(rank: number | null): number {
  if (rank == null) return 0;
  return (11 - rank) / 10;
}

const byGeo = new Map<string, Country>();
for (const c of countries) {
  for (const n of c.geoNames) byGeo.set(n, c);
}

const byNumeric = new Map<string, Country>();
for (const c of countries) {
  const iso = ISO_BY_ALPHA2[c.id];
  if (iso) byNumeric.set(iso.numeric, c);
}

export function countryByGeoName(name: string, list?: Country[]): Country | undefined {
  if (!list) return byGeo.get(name);
  for (const c of list) {
    if (c.geoNames.includes(name)) return c;
  }
  return undefined;
}

export function countryByIsoNumeric(id: string | number | undefined, list?: Country[]): Country | undefined {
  if (id == null || id === "") return undefined;
  const key = String(id).padStart(3, "0");
  if (!list) return byNumeric.get(key);
  for (const c of list) {
    const iso = ISO_BY_ALPHA2[c.id];
    if (iso?.numeric === key) return c;
  }
  return undefined;
}

export function countryById(id: string, list: Country[] = countries): Country | undefined {
  return list.find((c) => c.id === id);
}

export const markerCountries = countries.filter((c) => c.geoNames.length === 0);

export function allQuotes(list: Country[] = countries, extra: Quote[] = globalQuotes): (Quote & { country?: Country })[] {
  const out: (Quote & { country?: Country })[] = extra.map((q) => ({ ...q }));
  for (const c of list) {
    for (const q of c.quotes ?? []) out.push({ ...q, country: c });
  }
  return out;
}

export function regionStats(list: Country[] = countries) {
  const groups: Record<Region, Country[]> = { me: [], eu: [], am: [], aa: [] };
  for (const c of list) groups[c.region].push(c);
  return (Object.keys(groups) as Region[]).map((region) => {
    const group = groups[region];
    const n = group.length || 1;
    const positive = Math.round(group.reduce((s, c) => s + c.positive, 0) / n);
    const mixed = Math.round(group.reduce((s, c) => s + c.mixed, 0) / n);
    const negative = Math.round(group.reduce((s, c) => s + c.negative, 0) / n);
    const watching = group.filter(inTop10).length;
    return { region, label: REGION_LABEL[region], positive, mixed, negative, watching, total: group.length };
  });
}

const SEARCH_ALIASES: Record<string, string[]> = {
  US: ["ארהב", "ארה״ב", "ארה\"ב", "אמריקה", "USA", "America", "US"],
  GB: ["אנגליה", "UK", "Britain", "England", "בריטניה"],
  AE: ["אמירויות", "דובאי", "אבו דאבי", "UAE", "Emirates"],
  SA: ["סעודיה", "KSA"],
  CZ: ["צכיה", "Czech", "Czech Republic"],
  CL: ["צילה"],
  NL: ["Holland"],
  QA: ["קטר"],
  OM: ["עומן"],
  CH: ["שוייץ"],
  TR: ["Türkiye", "Turkiye"],
  LY: ["ליביה"],
  LK: ["סרילנקה", "SriLanka"],
  PS: ["עזה", "גדה", "פלסטין", "Gaza", "West Bank"],
  KR: ["קוריאה", "Korea"],
  ZA: ["דרום אפריקה", "RSA"],
};

function foldQuery(s: string): string {
  return s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[״"׳'`]/g, "")
    .replace(/[-_,.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchScore(field: string, q: string, exact: number, prefix: number, contains: number): number {
  const f = foldQuery(field);
  if (!f) return 0;
  if (f === q) return exact;
  if (f.startsWith(q)) return prefix;
  if (f.includes(q)) return contains;
  return 0;
}

export type CountrySearchHit = {
  country: Country;
  score: number;
  matched: string;
};

export function searchCountries(query: string, list: Country[] = countries): CountrySearchHit[] {
  const q = foldQuery(query);
  if (!q) return [];

  const hits: CountrySearchHit[] = [];
  for (const country of list) {
    let score = 0;
    let matched = country.nameHe;
    const consider = (field: string, exact: number, prefix: number, contains: number) => {
      const s = matchScore(field, q, exact, prefix, contains);
      if (s > score) {
        score = s;
        matched = field;
      }
    };
    consider(country.nameHe, 100, 86, 62);
    consider(country.nameEn, 96, 82, 58);
    consider(country.id, 94, 88, 40);
    const iso = isoOf(country.id);
    consider(iso.alpha3, 93, 84, 36);
    consider(iso.numeric, 91, 50, 20);
    consider(String(Number(iso.numeric)), 91, 50, 20);
    for (const n of country.geoNames) consider(n, 90, 74, 52);
    for (const a of SEARCH_ALIASES[country.id] ?? []) consider(a, 92, 78, 54);
    if (score > 0) hits.push({ country, score, matched });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const pa = peakRank(a.country) ?? 99;
    const pb = peakRank(b.country) ?? 99;
    if (pa !== pb) return pa - pb;
    return a.country.nameHe.localeCompare(b.country.nameHe, "he");
  });
  return hits;
}

export function searchSuggestions(list: Country[] = countries): Country[] {
  const top = [...list]
    .sort((a, b) => {
      const pa = peakRank(a) ?? 99;
      const pb = peakRank(b) ?? 99;
      if (pa !== pb) return pa - pb;
      return b.positive - a.positive;
    })
    .slice(0, 8);
  const seen = new Set(top.map((c) => c.id));
  for (const id of ["US", "GB", "LY"] as const) {
    const extra = countryById(id, list);
    if (extra && !seen.has(extra.id)) {
      top.push(extra);
      seen.add(extra.id);
    }
  }
  return top;
}
