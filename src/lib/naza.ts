import {
  countries as FAUDA,
  type Confidence,
  type Country,
  type Quote,
  type Tone,
} from "@/lib/data";

const EMPTY: (number | null)[] = [null, null, null, null, null, null];

export const NAZA_DAYS = ["9.9", "10.9", "11.9", "12.9", "13.9", "14.9"];
export const NAZA_SNAPSHOT = "ונציה · הקרנות צפויות";
export const NAZA_SOURCE = "https://en.wikipedia.org/wiki/NAZA_(film)";

export const NAZA_GLOBAL = {
  latest: 1,
  peak: 1,
  peakDate: "10 בספטמבר",
  points: 96,
  top10Countries: 0,
  firstPlaces: 2,
};

export const NAZA_QUOTES: Quote[] = [
  {
    text: "The spare, focused style of Naza has a grim, artful beauty, all in service of the subject matter. The results are impossible to shake.",
    by: "Bilge Ebiri, Vulture",
    tone: "positive",
    source: "Vulture",
  },
  {
    text: "As a work of cinema, it is exemplary. As a work of journalism, it is inarguable. As a document, it is an indictment.",
    by: "John Bleasdale, Time Out — 5/5",
    tone: "positive",
    source: "Time Out",
  },
  {
    text: "It is based on blood libels and deliberate distortions of reality.",
    by: "רא\"ל אייל זמיר, על הסרט",
    tone: "critical",
    source: "NYT",
  },
];

type Patch = {
  ranks: (number | null)[];
  sentiment: Tone;
  positive: number;
  mixed: number;
  negative: number;
  confidence: Confidence;
  note?: string;
  quotes?: Quote[];
};

const PATCH: Record<string, Patch> = {
  IL: {
    ranks: [3, 2, 1, 1, 1, 1],
    sentiment: "critical",
    positive: 18,
    mixed: 22,
    negative: 60,
    confidence: "documented",
    note: "הסערה החריפה ביותר: איום בשלילת אזרחות, הרמטכ\"ל כינה עלילות דם, עצומת 200 קולנוענים. אין הקרנה מסחרית בישראל במדגם. לתיעוד: פוסט וריל בפייסבוק שצורפו למדגם השיח.",
    quotes: [
      {
        text: "כשר התרבות, אפעל מיידית לשלול את האזרחות הישראלית של היוצרים השפלים הללו בגין בגידה במדינה.",
        by: "שר התרבות מיקי זוהר",
        tone: "critical",
        source: "Ynet",
      },
      {
        text: "ביקורת לגיטימית בדמוקרטיה, אבל תהום בינה לבין השמצת חיילים כדי לקצור תשואות בפסטיבלים בחו\"ל.",
        by: "גדי איזנקוט",
        tone: "critical",
        source: "NYT",
      },
      {
        text: "תפקידם המרכזי של אמנות ועיתונות הוא להחזיק מראה מול החברה שבה הן קיימות.",
        by: "עצומת יותר מ־200 קולנוענים ישראלים",
        tone: "positive",
        source: "Wikipedia",
      },
      {
        text: "אני מקווה שהסרט יופץ בישראל. שיתקפים אותו — שיראו אותו קודם כול.",
        by: "יובל אברהם",
        tone: "emotional",
        source: "NYT",
      },
    ],
  },
  IT: {
    ranks: [4, 1, 1, 1, 2, 2],
    sentiment: "positive",
    positive: 88,
    mixed: 8,
    negative: 4,
    confidence: "documented",
    note: "בכורת ונציה ב־10 בספטמבר: 25 דקות תשואות ופרס חבר השופטים. הקרנות צפויות באיטליה 28–30 בספטמבר (I Wonder Pictures), כולל צ׳ינמה בלטראדה במילאנו.",
    quotes: [
      {
        text: "זה המדינה שלנו שעושה את הפשעים האלה. חשוב שאיטלקים וגרמנים יראו, כי הממשלות שלכם חוסמות לחץ על ישראל.",
        by: "יובל אברהם, על בימת ונציה",
        tone: "emotional",
        source: "Vanity Fair Italia",
      },
    ],
  },
  GB: {
    ranks: [5, 3, 2, 2, 3, 3],
    sentiment: "positive",
    positive: 72,
    mixed: 16,
    negative: 12,
    confidence: "documented",
    note: "הגרדיאן שותף להפקה. רויטרס וסיקור בריטי ליוו את הבכורה. שיח יהודי-בריטי מפוצל יותר מהמבקרים.",
    quotes: [
      {
        text: "Mass civilian deaths were routinely built into Israeli military targeting decisions in Gaza, according to a Venice documentary that challenges official accounts of the war.",
        by: "Reuters, Venice",
        tone: "emotional",
        source: "Reuters",
      },
    ],
  },
  US: {
    ranks: [6, 3, 3, 3, 2, 2],
    sentiment: "mixed",
    positive: 58,
    mixed: 22,
    negative: 20,
    confidence: "documented",
    note: "שבחי מבקרים מול דחייה פוליטית. NYFF ב־26–27 בספטמבר (לינקולן סנטר). יציאה מוגבלת בארה״ב מ־9 באוקטובר: Alamo Drafthouse בניו יורק ולוס אנג׳לס, Laemmle NoHo ו־Royal.",
    quotes: [
      {
        text: "Naza is one of the most important films of our time.",
        by: "Bilge Ebiri, Vulture",
        tone: "positive",
        source: "Vulture",
      },
      {
        text: "If Israel had a special intent to erase the Palestinians, their deaths wouldn’t be collateral. They’d be the objective.",
        by: "אריאל אוסרן, i24NEWS",
        tone: "critical",
        source: "X",
      },
    ],
  },
  DE: {
    ranks: [null, 5, 5, 4, 3, 3],
    sentiment: "positive",
    positive: 64,
    mixed: 20,
    negative: 16,
    confidence: "documented",
    note: "אברהם תקף על הבמה את ממשלת גרמניה שחוסמת לחץ על ישראל. סיקור DW. שיח גרמני מקוטב סביב ישראל, חיובי יותר כלפי הסרט כקולנוע.",
  },
  FR: {
    ranks: [null, 4, 4, 4, 5, 5],
    sentiment: "positive",
    positive: 70,
    mixed: 18,
    negative: 12,
    confidence: "estimated",
    note: "MK2 מחזיקה בזכויות המכירה. לפי עינת תמקין: יציאה לאולמות ככל הנראה ב־30 בספטמבר 2026 — טרם אושר.",
  },
  ES: {
    ranks: [null, 6, 6, 5, 5, 5],
    sentiment: "positive",
    positive: 66,
    mixed: 20,
    negative: 14,
    confidence: "estimated",
    note: "הערכה לפי סיקור פסטיבל אירופי. אין דירוג סטרימינג.",
  },
  NL: {
    ranks: [null, 7, 7, 6, 6, 6],
    sentiment: "positive",
    positive: 62,
    mixed: 22,
    negative: 16,
    confidence: "estimated",
  },
  GR: {
    ranks: [null, null, 8, 7, 5, 5],
    sentiment: "mixed",
    positive: 54,
    mixed: 24,
    negative: 22,
    confidence: "documented",
    note: "לפי עינת תמקין: פסטיבל סלוניקי מ־1 באוקטובר (אולימפיון, זאנאס, טורנס, קסאווטס); יציאה ארצית מ־2 באוקטובר עם Filmtrade ו־Tanweer. פסטיבל אתונה 30.9–11.10 — טרם אושר.",
  },
  IE: {
    ranks: [null, 7, 6, 6, 6, 6],
    sentiment: "positive",
    positive: 74,
    mixed: 16,
    negative: 10,
    confidence: "estimated",
    note: "אקלים ציבורי ביקורתי כלפי ישראל. הטון כלפי הסרט מוערך כחיובי, בלי ציטוט מקומי מתועד.",
  },
  BE: {
    ranks: [null, 7, 6, 6, 6, 6],
    sentiment: "positive",
    positive: 66,
    mixed: 20,
    negative: 14,
    confidence: "estimated",
  },
  AT: {
    ranks: [null, 7, 6, 6, 6, 6],
    sentiment: "positive",
    positive: 63,
    mixed: 22,
    negative: 15,
    confidence: "estimated",
  },
  CH: {
    ranks: [null, 8, 7, 7, 7, 7],
    sentiment: "positive",
    positive: 64,
    mixed: 22,
    negative: 14,
    confidence: "estimated",
  },
  SE: {
    ranks: [null, 8, 7, 7, 7, 7],
    sentiment: "positive",
    positive: 68,
    mixed: 18,
    negative: 14,
    confidence: "estimated",
  },
  NO: {
    ranks: [null, 8, 7, 7, 7, 7],
    sentiment: "positive",
    positive: 67,
    mixed: 19,
    negative: 14,
    confidence: "estimated",
  },
  DK: {
    ranks: [null, 8, 8, 7, 7, 7],
    sentiment: "mixed",
    positive: 56,
    mixed: 24,
    negative: 20,
    confidence: "estimated",
  },
  PS: {
    ranks: [null, 2, 2, 2, 2, 2],
    sentiment: "positive",
    positive: 78,
    mixed: 14,
    negative: 8,
    confidence: "documented",
    note: "נושא הסרט. +972 / שיחה מקומית פרסמו את התחקירים שעליהם הוא מבוסס. אין צפייה מסחרית — זה שיח, לא שעות צפייה.",
    quotes: [
      {
        text: "NAZA makes visible what we could never see from inside Gaza: that there were people watching, calculating, and deciding how many of us would die.",
        by: "שיחה מקומית / +972 Magazine",
        tone: "emotional",
        source: "+972",
      },
    ],
  },
  QA: {
    ranks: [null, 4, 4, 3, 3, 3],
    sentiment: "positive",
    positive: 82,
    mixed: 12,
    negative: 6,
    confidence: "estimated",
    note: "הערכה לפי סיקור ערבי של בכורת ונציה. אין מדד צפייה.",
  },
  LB: {
    ranks: [null, 5, 4, 4, 4, 4],
    sentiment: "positive",
    positive: 76,
    mixed: 16,
    negative: 8,
    confidence: "estimated",
    note: "השוואה חדה לפאודה: שם הסדרה הייתה מקום 1 בנטפליקס למרות חרם; כאן השיח על נז\"א מוערך כחיובי לסרט.",
  },
  EG: {
    ranks: [null, 6, 5, 5, 5, 5],
    sentiment: "positive",
    positive: 74,
    mixed: 16,
    negative: 10,
    confidence: "estimated",
  },
  JO: {
    ranks: [null, 7, 6, 6, 6, 6],
    sentiment: "positive",
    positive: 72,
    mixed: 18,
    negative: 10,
    confidence: "estimated",
  },
  AE: {
    ranks: [null, 8, 7, 7, 7, 7],
    sentiment: "mixed",
    positive: 58,
    mixed: 24,
    negative: 18,
    confidence: "estimated",
    note: "קהל סטרימינג שצפה בפאודה כמתח; השיח על נז\"א מוערך כמעורב-חיובי, בלי ציטוט מקומי.",
  },
  TR: {
    ranks: [null, 6, 5, 4, 4, 4],
    sentiment: "positive",
    positive: 80,
    mixed: 12,
    negative: 8,
    confidence: "estimated",
    note: "הערכה לפי אקלים תקשורתי ביקורתי כלפי ישראל וסיקור Daily Sabah / AA.",
  },
  SA: {
    ranks: [null, 9, 8, 8, 8, 8],
    sentiment: "positive",
    positive: 70,
    mixed: 18,
    negative: 12,
    confidence: "estimated",
  },
  MA: {
    ranks: [null, 8, 7, 7, 7, 7],
    sentiment: "positive",
    positive: 72,
    mixed: 16,
    negative: 12,
    confidence: "estimated",
  },
  CA: {
    ranks: [null, 7, 6, 6, 5, 5],
    sentiment: "mixed",
    positive: 56,
    mixed: 24,
    negative: 20,
    confidence: "estimated",
    note: "הערכה לפי שיח אנגלופוני (NYT, Vulture) בלי סקר קנדי.",
  },
  AU: {
    ranks: [null, 8, 8, 7, 7, 7],
    sentiment: "mixed",
    positive: 54,
    mixed: 26,
    negative: 20,
    confidence: "estimated",
  },
  BR: {
    ranks: [null, 8, 8, 7, 7, 7],
    sentiment: "mixed",
    positive: 52,
    mixed: 26,
    negative: 22,
    confidence: "estimated",
  },
  AR: {
    ranks: [null, 9, 8, 8, 8, 8],
    sentiment: "mixed",
    positive: 50,
    mixed: 28,
    negative: 22,
    confidence: "estimated",
  },
  IN: {
    ranks: [null, null, 9, 8, 8, 8],
    sentiment: "mixed",
    positive: 48,
    mixed: 28,
    negative: 24,
    confidence: "estimated",
  },
  ZA: {
    ranks: [null, 8, 7, 6, 6, 6],
    sentiment: "positive",
    positive: 72,
    mixed: 16,
    negative: 12,
    confidence: "estimated",
    note: "מסורת ICJ/BDS. הטון כלפי הסרט מוערך כחיובי, בלי ציטוט מקומי מתועד לשבוע הבכורה.",
  },
  PT: {
    ranks: [null, null, 8, 7, 6, 6],
    sentiment: "positive",
    positive: 64,
    mixed: 22,
    negative: 14,
    confidence: "documented",
    note: "לפי עינת תמקין: יציאה לאולמות מתחילת 1 באוקטובר 2026.",
  },
  RO: {
    ranks: [null, null, 8, 7, 7, 7],
    sentiment: "mixed",
    positive: 56,
    mixed: 26,
    negative: 18,
    confidence: "documented",
    note: "לפי עינת תמקין: יציאה לאולמות ככל הנראה באוקטובר 2026 — טרם אושר. 6–8 באוקטובר זמניים לפי בקשת היוצרים.",
  },
};

const ME_ARAB = new Set([
  "LB", "JO", "EG", "QA", "AE", "BH", "KW", "OM", "SA", "MA", "TN", "DZ", "IQ", "SY", "LY", "PS",
]);
const MUSLIM_AA = new Set(["PK", "BD", "ID", "MY", "IR"]);

function fallback(c: Country): Patch {
  if (c.id === "IL") {
    return PATCH.IL;
  }
  if (ME_ARAB.has(c.id)) {
    return {
      ranks: EMPTY,
      sentiment: "positive",
      positive: 70,
      mixed: 18,
      negative: 12,
      confidence: "estimated",
      note: "אין סיקור מקומי מתועד בשבוע הבכורה. הטון מוערך לפי שיח ערבי סביב תחקיר על עזה — שיח, לא צפייה.",
    };
  }
  if (MUSLIM_AA.has(c.id)) {
    return {
      ranks: EMPTY,
      sentiment: "positive",
      positive: 74,
      mixed: 16,
      negative: 10,
      confidence: "estimated",
      note: "הערכה לפי אקלים חרם וסיקור זוכה ונציה. אין מדד צפייה.",
    };
  }
  if (c.region === "eu") {
    return {
      ranks: EMPTY,
      sentiment: "positive",
      positive: 60,
      mixed: 24,
      negative: 16,
      confidence: "estimated",
      note: "הערכה אזורית לפי סיקור פסטיבל ונציה. הסרט לא עלה לנטפליקס בשבוע המדגם.",
    };
  }
  if (c.region === "am") {
    return {
      ranks: EMPTY,
      sentiment: "mixed",
      positive: 50,
      mixed: 28,
      negative: 22,
      confidence: "estimated",
      note: "הערכה לפי שיח אמריקאי מתועד (מבקרים מול דחייה פוליטית). אין צפייה מסחרית.",
    };
  }
  return {
    ranks: EMPTY,
    sentiment: "mixed",
    positive: 52,
    mixed: 28,
    negative: 20,
    confidence: "estimated",
    note: "אין סיקור מתועד במדגם. הסרט הוקרן בפסטיבל — הטון הוא הערכה אזורית, לא שעות צפייה.",
  };
}

export const nazaCountries: Country[] = FAUDA.map((c) => {
  const p = PATCH[c.id] ?? fallback(c);
  return {
    id: c.id,
    nameHe: c.nameHe,
    nameEn: c.nameEn,
    geoNames: c.geoNames,
    region: c.region,
    coords: c.coords,
    ranks: p.ranks.length === NAZA_DAYS.length ? p.ranks : EMPTY,
    sentiment: p.sentiment,
    positive: p.positive,
    mixed: p.mixed,
    negative: p.negative,
    confidence: p.confidence,
    note: p.note,
    quotes: p.quotes,
  };
});

NAZA_GLOBAL.top10Countries = nazaCountries.filter((c) => c.ranks.some((r) => r != null)).length;
