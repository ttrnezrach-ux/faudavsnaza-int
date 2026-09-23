import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { OfficeGate } from "@/components/office-gate";
import { WeekScan } from "@/components/week-scan";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/scan")({
  component: ScanPage,
});

function ScanPage() {
  return (
    <AppShell>
      <OfficeGate>
        <ScanBody />
      </OfficeGate>
    </AppShell>
  );
}

function ScanBody() {
  const { t } = useI18n();
  return (
    <main id="main" className="mx-auto w-full max-w-3xl space-y-5 px-4 py-6 sm:px-6">
      <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">{t("office")}</p>
      <h1 className="font-display text-2xl font-medium tracking-tight">{t("scanTitle")}</h1>
      <WeekScan />
      <p className="text-sm">
        <Link to="/office" className="underline-offset-4 hover:underline">
          {t("office")}
        </Link>
      </p>
    </main>
  );
}
