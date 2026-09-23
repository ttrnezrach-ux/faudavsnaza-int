import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type ContactResult = { ok: true } | { ok: false; error: "invalid" | "cooldown" | "delivery" };

export const submitContact = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        name: z.string().max(80),
        email: z.string().max(120),
        subject: z.string().max(140).optional(),
        message: z.string().max(4000),
        company: z.string().max(200).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<ContactResult> => {
    const { submitInquiry } = await import("@/lib/contact.server");
    return submitInquiry(data);
  });
