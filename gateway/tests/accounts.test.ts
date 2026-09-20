import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createApp } from "../src/app.js";
import { readConfig } from "../src/config.js";
import { admit } from "../src/admission.js";
const databaseUrl = process.env.TEST_DATABASE_URL;
if (!databaseUrl || !new URL(databaseUrl).pathname.endsWith("_test")) throw new Error("TEST_DATABASE_URL must name a dedicated database ending in _test.");
const secret = randomUUID() + randomUUID();
const config = readConfig({ DATABASE_URL: databaseUrl, BETTER_AUTH_SECRET: secret, BETTER_AUTH_URL: "http://localhost:3001", APP_ORIGIN: "http://localhost:3001", NODE_ENV: "test" });
let service: Awaited<ReturnType<typeof createApp>>;
let base = ""; let alice = ""; let bob = ""; let aliceId = "";
const emails: string[] = [];
const state = { stage: 0, prediction: "6", traceIndex: 0, choice: -1, modifiedLimit: 4, modifiedPrediction: "", makeLimit: 4, reflection: "", hints: 0, completed: false, updatedAt: 1 };
const fields = "labSlug labVersion revision state updatedAt";
async function request(path: string, body?: unknown, cookie = "", origin = config.APP_ORIGIN) {
  return fetch(base + path, { method: body === undefined ? "GET" : "POST", headers: { ...(body === undefined ? {} : { "content-type": "application/json" }), origin, cookie }, body: body === undefined ? undefined : JSON.stringify(body) });
}
async function signup(prefix: string) {
  const email = `${prefix}-${randomUUID()}@example.test`; emails.push(email);
  const response = await request("/api/auth/sign-up/email", { name: prefix, email, password: "a-long-test-password-42" });
  assert.equal(response.status, 200, await response.clone().text());
  const cookie = response.headers.getSetCookie().map(c => c.split(";")[0]).join("; ");
  assert(cookie.includes("session_token"));
  return { cookie, data: await response.json(), email };
}
async function gql(query: string, variables: unknown, cookie = alice) { return request("/graphql", { query, variables }, cookie); }
before(async () => {
  service = await createApp(config); await service.app.listen(0, "127.0.0.1");
  base = await service.app.getUrl();
  const first = await signup("alice"); alice = first.cookie; aliceId = first.data.user.id;
  bob = (await signup("bob")).cookie;
});
after(async () => { if (service) { await service.db.user.deleteMany({ where: { email: { in: emails } } }); await service.close(); } });
test("Better Auth creates hashed credentials and a real database session", async () => {
  const session = await request("/api/auth/get-session", undefined, alice);
  assert.equal((await session.json()).user.id, aliceId);
  const credential = await service.db.account.findFirstOrThrow({ where: { userId: aliceId } });
  assert(credential.password && credential.password !== "a-long-test-password-42");
  assert.equal(await service.db.session.count({ where: { userId: aliceId } }), 1);
});
test("unauthenticated and cross-origin progress writes are rejected", async () => {
  assert.equal((await gql(`query { myProgress { ${fields} } }`, {}, "")).status, 401);
  assert.equal((await request("/graphql", { query: `{ myProgress { ${fields} } }` }, alice, "https://attacker.invalid")).status, 403);
});
test("progress persists and is scoped by session, with optimistic concurrency", async () => {
  const query = `mutation Save($input: SaveProgressInput!) { saveProgress(input: $input) { ${fields} } }`;
  const input = { labSlug: "a-running-total", labVersion: 1, expectedRevision: 0, state: JSON.stringify(state) };
  const saved = await (await gql(query, { input })).json();
  assert.equal(saved.data.saveProgress.revision, 1);
  const others = await (await gql(`query { myProgress { ${fields} } }`, {}, bob)).json();
  assert.deepEqual(others.data.myProgress, []);
  const stale = await (await gql(query, { input })).json();
  assert.equal(stale.errors[0].extensions.code, "CONFLICT");
  const writes = await Promise.all([gql(query, { input: { ...input, expectedRevision: 1 } }), gql(query, { input: { ...input, expectedRevision: 1 } })]);
  const outcomes = await Promise.all(writes.map(r => r.json()));
  assert.equal(outcomes.filter(r => r.data?.saveProgress?.revision === 2).length, 1);
  assert.equal(outcomes.filter(r => r.errors?.[0]?.extensions.code === "CONFLICT").length, 1);
  const row = await service.db.progress.findUniqueOrThrow({ where: { userId_labSlug: { userId: aliceId, labSlug: input.labSlug } } });
  assert.equal(row.revision, 2);
});
test("guest import is atomic and idempotent; existing account data wins", async () => {
  const query = `mutation Import($key: String!, $entries: [GuestProgressInput!]!) { importGuestProgress(key: $key, entries: $entries) { ${fields} } }`;
  const key = randomUUID();
  const entries = ["a-running-total", "a-growing-product"].map(labSlug => ({ labSlug, labVersion: 1, state: JSON.stringify({ ...state, prediction: "99" }) }));
  const result = await (await gql(query, { key, entries })).json();
  assert.equal(result.data.importGuestProgress.length, 2);
  assert.equal(JSON.parse(result.data.importGuestProgress.find((r: {labSlug: string}) => r.labSlug === "a-running-total").state).prediction, "6");
  assert.equal((await (await gql(query, { key, entries })).json()).data.importGuestProgress.length, 2);
  const changed = await (await gql(query, { key, entries: entries.slice(1) })).json();
  assert.equal(changed.errors[0].extensions.code, "CONFLICT");
  const invalid = await (await gql(query, { key: randomUUID(), entries: [{ ...entries[0], labSlug: "count-the-evens" }, { ...entries[0], labSlug: "missing-lab" }] })).json();
  assert.equal(invalid.errors[0].extensions.code, "BAD_USER_INPUT");
  assert.equal(await service.db.progress.count({ where: { userId: aliceId, labSlug: "count-the-evens" } }), 0);
});
test("invalid completion, unknown input and batched GraphQL operations are rejected", async () => {
  const query = `mutation Save($input: SaveProgressInput!) { saveProgress(input: $input) { ${fields} } }`;
  const result = await (await gql(query, { input: { labSlug: "count-the-evens", labVersion: 1, expectedRevision: 0, state: JSON.stringify({ ...state, stage: 4, completed: true }) } })).json();
  assert.equal(result.errors[0].extensions.code, "BAD_USER_INPUT");
  assert.equal((await gql(`query { a: myProgress { revision } b: myProgress { revision } }`, {})).status, 400);
  assert.equal((await request("/graphql", [{ query: "{ myProgress { revision } }" }], alice)).status, 400);
  assert.equal((await gql("query { __schema { types { name } } }", {})).status, 400);
});
test("shared admission counts concurrent requests atomically and resets", async () => {
  const subject = `test:${randomUUID()}`;
  const outcomes = await Promise.all(Array.from({length: 12}, () => admit(service.db, subject, secret, 5)));
  assert.equal(outcomes.filter(r => r.allowed).length, 5);
  const next = await admit(service.db, subject, secret, 5, new Date(Date.now() + 120000));
  assert.equal(next.allowed, true);
});
test("sign-out revokes the session on the server", async () => {
  assert.equal((await request("/api/auth/sign-out", {}, bob)).status, 200);
  assert.equal(await (await request("/api/auth/get-session", undefined, bob)).json(), null);
  assert.equal((await gql(`query { myProgress { ${fields} } }`, {}, bob)).status, 401);
});
