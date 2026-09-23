import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { submitContact } from "@/lib/contact";

type Status = "idle" | "sending" | "success" | "error" | "cooldown" | "invalid";

export function ContactBox() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const ready = name.trim().length > 0 && email.includes("@") && message.trim().length > 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || status === "sending") return;
    setStatus("sending");
    try {
      const result = await submitContact({
        data: {
          name,
          email,
          subject,
          message,
          company,
        },
      });
      if (result.ok) {
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setCompany("");
        setStatus("success");
        return;
      }
      setStatus(result.error === "cooldown" ? "cooldown" : result.error === "invalid" ? "invalid" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative rounded-2xl bg-card px-4 py-5 shadow-[var(--shadow-border)] sm:px-5"
    >
      <h2 id="contact-heading" className="font-display text-lg font-medium">
        {t("contactTitle")}
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t("contactHint")}</p>

      <form className="mt-4 space-y-3" autoComplete="off" onSubmit={(e) => void onSubmit(e)}>
        <div className="absolute h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="contact-hp">Company</label>
          <input
            id="contact-hp"
            name="hp_field"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <label className="block text-sm font-medium" htmlFor="contact-name">
          {t("contactName")}
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 h-12"
          />
        </label>

        <label className="block text-sm font-medium" htmlFor="contact-email">
          {t("contactEmail")}
          <Input
            id="contact-email"
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            required
            maxLength={120}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 h-12"
          />
        </label>

        <label className="block text-sm font-medium" htmlFor="contact-subject">
          {t("contactSubject")}
          <Input
            id="contact-subject"
            name="subject"
            maxLength={140}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 h-12"
          />
        </label>

        <label className="block text-sm font-medium" htmlFor="contact-message">
          {t("contactMessage")}
          <textarea
            id="contact-message"
            name="message"
            required
            rows={4}
            maxLength={4000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 min-h-28 w-full rounded-md bg-muted px-3 py-2 text-sm text-foreground shadow-[var(--shadow-border)] placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>

        {status === "success" ? (
          <p role="status" className="text-sm text-positive">
            {t("contactSuccess")}
          </p>
        ) : null}
        {status === "error" ? (
          <p role="alert" className="text-sm text-negative">
            {t("contactError")}
          </p>
        ) : null}
        {status === "cooldown" ? (
          <p role="alert" className="text-sm text-negative">
            {t("contactCooldown")}
          </p>
        ) : null}
        {status === "invalid" ? (
          <p role="alert" className="text-sm text-negative">
            {t("contactInvalid")}
          </p>
        ) : null}

        <Button type="submit" className="h-11 w-full sm:w-auto" disabled={!ready || status === "sending"}>
          {status === "sending" ? t("contactSending") : t("contactSend")}
        </Button>
      </form>
    </section>
  );
}
