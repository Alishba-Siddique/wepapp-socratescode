import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { createApp } from "../src/app.js";
import { readConfig } from "../src/config.js";
import { admit } from "../src/admission.js";

const databaseUrl = process.env.TEST_DATABASE_URL;
if (!databaseUrl || !new URL(databaseUrl).pathname.endsWith("_test")) throw new Error("Use a dedicated TEST_DATABASE_URL ending in _test.");
function config() {
  return readConfig({ DATABASE_URL: databaseUrl, BETTER_AUTH_SECRET: randomUUID() + randomUUID(), BETTER_AUTH_URL: "http://localhost:3001", APP_ORIGIN: "http://localhost:3001", NODE_ENV: "test" });
}
function bucketKey(secret: string) { return createHmac("sha256", secret).update("auth:127.0.0.1").digest("hex"); }

test("auth burst limit returns retry headers, ignores spoofed IPs, and stops database work", async () => {
  const settings = config();
  const service = await createApp(settings);
  try {
    await service.app.listen(0, "127.0.0.1");
    const base = await service.app.getUrl();
    for (let i = 0; i < 60; i++) {
      const response = await fetch(base + "/api/auth/get-session", { headers: { "X-Forwarded-For": `192.0.2.${i + 1}` } });
      assert.equal(response.status, 200);
      await response.text();
    }
    const before = await service.db.admissionBucket.findUniqueOrThrow({ where: { key: bucketKey(settings.BETTER_AUTH_SECRET) } });
    const blocked = await fetch(base + "/api/auth/sign-in/email", { method: "POST", headers: { origin: settings.APP_ORIGIN, "content-type": "application/json", "X-Forwarded-For": "198.51.100.1" }, body: "{}" });
    assert.equal(blocked.status, 429);
    assert.equal(blocked.headers.get("X-RateLimit-Limit"), "60");
    assert.equal(blocked.headers.get("X-RateLimit-Remaining"), "0");
    assert(Number(blocked.headers.get("Retry-After")) > 0);
    assert.match((await blocked.json()).message, /wait/i);
    const after = await service.db.admissionBucket.findUniqueOrThrow({ where: { key: before.key } });
    assert.equal(after.count, before.count, "Rejected bursts must not reach PostgreSQL or authentication");
  } finally {
    await service.db.admissionBucket.deleteMany({ where: { key: bucketKey(settings.BETTER_AUTH_SECRET) } });
    await service.close();
  }
});

test("a fresh gateway still enforces shared auth admission", async () => {
  const settings = config();
  const service = await createApp(settings);
  try {
    // Reserve the shared bucket before the new process has seen any requests.
    await Promise.all(Array.from({ length: 60 }, () => admit(service.db, "auth:127.0.0.1", settings.BETTER_AUTH_SECRET, 60)));
    await service.app.listen(0, "127.0.0.1");
    const base = await service.app.getUrl();
    const blocked = await fetch(base + "/api/auth/get-session");
    assert.equal(blocked.status, 429);
    assert(Number(blocked.headers.get("Retry-After")) > 0);
    await blocked.text();
  } finally {
    await service.db.admissionBucket.deleteMany({ where: { key: bucketKey(settings.BETTER_AUTH_SECRET) } });
    await service.close();
  }
});

test("auth fails closed with a sanitized 503 when the admission database is unavailable", async () => {
  const service = await createApp({ ...config(), DATABASE_URL: "postgresql://unavailable:private-password@127.0.0.1:1/unavailable_test" });
  try {
    await service.app.listen(0, "127.0.0.1");
    const response = await fetch((await service.app.getUrl()) + "/api/auth/get-session");
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("Retry-After"), "10");
    assert.deepEqual(await response.json(), { message: "Account service is temporarily unavailable." });
  } finally { await service.close(); }
});
