import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { formatSecret, totpCode, verifyTotp } from "./totp.ts";

const source = readFileSync(new URL("./office-lock.server.ts", import.meta.url), "utf8");

describe("stateless office lock", () => {
  it("does not open Postgres or PGLite", () => {
    assert.doesNotMatch(source, /getSql/);
    assert.doesNotMatch(source, /from "@\/lib\/db"/);
    assert.doesNotMatch(source, /@electric-sql\/pglite/);
    assert.doesNotMatch(source, /create table/i);
    assert.match(source, /cookieValid/);
    assert.match(source, /status: "setup"/);
  });

  it("verifies a current code for the configured secret", () => {
    const secret = source.match(/OFFICE_TOTP_SECRET = "([A-Z2-7]+)"/)?.[1];
    assert.ok(secret);
    assert.equal(secret, "LYQONHQJCQKXFXH4IEADN2HPAOEEXJWP");
    const { code } = totpCode(secret);
    assert.equal(verifyTotp(secret, code, null).ok, true);
    assert.match(formatSecret(secret), / /);
    assert.match(source, /NazaFauda#2108/);
  });
});
