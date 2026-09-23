import { useCallback, useEffect, useState } from "react";
import { getOfficeLockState, lockOfficeSession, verifyOfficeLock, type OfficeLockState } from "@/lib/office-lock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { Link } from "@tanstack/react-router";

export function OfficeGate({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [state, setState] = useState<OfficeLockState | null>(null);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const load = useCallback(() => {
    setLoadError(false);
    void getOfficeLockState()
      .then((next) => {
        setState(next);
        setLoadError(false);
      })
      .catch(() => {
        setState(null);
        setLoadError(true);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (code.replace(/\s/g, "").length !== 6 || password.length < 8 || busy) return;
    setBusy(true);
    setWrong(false);
    try {
      const next = await verifyOfficeLock({ data: { code, password } });
      setState(next);
      if (next.status === "unlocked") {
        setCode("");
        setPassword("");
        setWrong(false);
      } else if (next.status === "wait") {
        setWrong(false);
      } else setWrong(true);
    } catch {
      setWrong(true);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    const next = await lockOfficeSession();
    setState(next);
    setCode("");
    setPassword("");
  }

  if (!state) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-4 text-foreground">
        {loadError ? (
          <section className="w-full max-w-md rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
            <p className="text-sm leading-relaxed text-muted-foreground">{t("officeLockLoadError")}</p>
            <Button type="button" className="mt-4 h-11 w-full" onClick={load}>
              {t("officeLockRetry")}
            </Button>
          </section>
        ) : null}
      </div>
    );
  }

  const showQr = state.status === "setup" || state.status === "wait";

  if (state.status === "unlocked") {
    return (
      <div>
        <div className="flex justify-end px-4 pt-3 sm:px-6">
          <Button type="button" variant="secondary" className="h-11" onClick={() => void logout()}>
            {t("officeLockOut")}
          </Button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 text-foreground">
      <section className="w-full max-w-md rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground">{t("office")}</p>
        <h1 className="mt-1 font-display text-2xl font-medium">{t("officeLockTitle")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {state.status === "wait" ? t("officeLockWait") : showQr ? t("officeLockHint") : t("officeLockLocked")}
        </p>

        {showQr ? (
          <div className="mt-4 space-y-3">
            <div className="flex justify-center rounded-xl bg-heat p-3" dangerouslySetInnerHTML={{ __html: state.qr }} />
            <p className="text-center text-xs text-muted-foreground">{t("officeLockSecret")}</p>
            <p className="text-center font-mono text-sm tracking-widest text-foreground" dir="ltr">
              {state.secret}
            </p>
            <a
              href={state.otpauth}
              className="flex min-h-11 items-center justify-center rounded-lg bg-muted text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("officeLockOpenApp")}
            </a>
          </div>
        ) : null}

        <form className="mt-4 space-y-3" onSubmit={(e) => void submit(e)}>
          <label className="block text-sm font-medium" htmlFor="office-password">
            {t("officeLockPassword")}
          </label>
          <Input
            id="office-password"
            type="password"
            autoComplete={state.status === "setup" ? "new-password" : "current-password"}
            minLength={8}
            maxLength={128}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12"
          />
          {showQr ? <p className="text-xs text-muted-foreground">{t("officeLockPasswordHint")}</p> : null}

          <label className="block text-sm font-medium" htmlFor="office-code">
            {t("officeLockCode")}
          </label>
          <Input
            id="office-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="h-12 text-center font-mono text-xl tracking-[0.4em]"
            dir="ltr"
          />
          {wrong ? <p className="text-sm text-negative">{t("officeLockWrong")}</p> : null}
          <Button
            type="submit"
            className="h-11 w-full"
            disabled={busy || code.length !== 6 || password.length < 8 || state.status === "wait"}
          >
            {state.status === "setup" ? t("officeLockSetup") : t("officeLockUnlock")}
          </Button>
        </form>

        <Link
          to="/"
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          {t("officeBack")}
        </Link>
      </section>
    </div>
  );
}
