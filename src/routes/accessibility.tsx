import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/accessibility")({
  component: AccessibilityPage,
});

function AccessibilityPage() {
  return (
    <AppShell>
      <div className="min-h-dvh bg-background text-foreground">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
            <h1 className="font-display text-2xl font-medium tracking-tight">הצהרת נגישות</h1>
            <Link
              to="/"
              className="inline-flex h-11 items-center rounded-md px-4 text-sm font-medium shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              חזרה למפה
            </Link>
          </div>
        </header>
        <main id="main" tabIndex={-1} className="mx-auto max-w-3xl space-y-6 px-4 py-8 text-sm leading-relaxed outline-none sm:px-6">
          <p>
            אתר «פאודה 5 · מפת השיח» פועל להתאמה לתקן הישראלי ת״י 5568, לתקנות שוויון זכויות
            לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג–2013, ולקווים המנחים של WCAG 2.0 ברמת AA.
          </p>
          <section>
            <h2 className="mb-2 font-display text-lg font-medium">רמת התאמה</h2>
            <p>
              האתר נבנה לתמיכה בניווט מקלדת, בקורא מסך, ובניגודיות מספקת. הבדיקה האחרונה בוצעה ב־14 בספטמבר 2026.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-display text-lg font-medium">מה הונגש באתר</h2>
            <ul className="list-disc space-y-1 pr-5">
              <li>קישור דילוג לתוכן הראשי</li>
              <li>ניווט מלא במקלדת וסימון פוקוס נראה</li>
              <li>כפתורים בגודל לחיצה של 44 פיקסלים לפחות</li>
              <li>שפה וכיון (עברית, RTL) מוגדרים במסמך</li>
              <li>תוויות, אזורי ציון ומצבי aria לסינון ולשוניות</li>
              <li>תפריט נגישות: גודל טקסט, ניגודיות גבוהה, גופן קריא, הדגשת קישורים ועצירת אנימציות</li>
              <li>חלופה טקסטואלית למפה — רשימת המדינות, חיפוש ומסננים</li>
            </ul>
          </section>
          <section>
            <h2 className="mb-2 font-display text-lg font-medium">מגבלות ידועות</h2>
            <p>
              מפת העולם היא תרשים ויזואלי. בחירה מדויקת של מדינה במקלדת ובקורא מסך מתבצעת דרך
              רשימת המדינות, החיפוש והמסננים — לא דרך ציור ה־SVG עצמו.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-display text-lg font-medium">פנייה בנושא נגישות</h2>
            <p>
              נשמח לתקן ליקויים בהקדם האפשרי. אפשר לדווח דרך משוב האפליקציה ב־Grok.
              ההצהרה עודכנה ב־14 בספטמבר 2026.
            </p>
          </section>
        </main>
      </div>
    </AppShell>
  );
}
