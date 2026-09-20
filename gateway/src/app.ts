import "reflect-metadata";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import express, { type Request, type Response, type NextFunction } from "express";
import { rateLimit, MemoryStore, ipKeyGenerator } from "express-rate-limit";
import { buildSchema, execute, parse, validate, visit, specifiedRules, NoSchemaIntrospectionCustomRule, GraphQLError } from "graphql";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { createAuth } from "./auth.js";
import { admit } from "./admission.js";
import { progressService } from "./progress.js";
import type { Config } from "./config.js";

@Module({})
class GatewayModule {}
export async function createApp(config: Config) {
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: config.DATABASE_URL, max: 5, connectionTimeoutMillis: 5000, statement_timeout: 5000 }) });
  const auth = createAuth(db, config);
  const schema = buildSchema(readFileSync(resolve("../contracts/progress.graphql"), "utf8"));
  const server = express();
  server.disable("x-powered-by");
  server.use((_req, res, next) => {
    res.set({ "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }); next();
  });
  server.get("/health", async (_req, res) => {
    try { await db.$queryRaw`SELECT 1`; res.json({ status: "ok" }); }
    catch { res.status(503).json({ status: "unavailable" }); }
  });
  server.get("/api/account/status", (_req, res) => res.json({ available: true, emailRecovery: !!config.SMTP_HOST, emailVerificationRequired: config.NODE_ENV === "production" }));
  const protect = (limit: number, prefix: string) => async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET" && req.headers.origin !== config.APP_ORIGIN) { res.status(403).json({ message: "Request origin is not allowed." }); return; }
    if (Number(req.headers["content-length"] ?? 0) > 65536) { res.status(413).json({ message: "Request is too large." }); return; }
    try {
      // Never trust a caller-supplied X-Forwarded-For. The proxy currently shares
      // a conservative ingress limit; per-account GraphQL limits follow below.
      const result = await admit(db, `${prefix}:${req.socket.remoteAddress ?? "unknown"}`, config.BETTER_AUTH_SECRET, limit);
      res.set({ "X-RateLimit-Limit": String(limit), "X-RateLimit-Remaining": String(result.remaining) });
      if (!result.allowed) { res.set("Retry-After", String(result.retryAfter)).status(429).json({ message: "Too many requests. Please wait before trying again." }); return; }
      next();
    } catch { res.set("Retry-After", "10").status(503).json({ message: "Account service is temporarily unavailable." }); }
  };
  const authHandler = toNodeHandler(auth);
  // Cheap process-local admission precedes shared PostgreSQL admission. This
  // limits database work under floods; it does not replace the shared quota.
  const authBurstStore = new MemoryStore();
  const authBurstLimit = rateLimit({
    windowMs: 60000, limit: 60, store: authBurstStore,
    keyGenerator: req => ipKeyGenerator(req.socket.remoteAddress ?? "unknown"),
    standardHeaders: false, legacyHeaders: true,
    message: { message: "Too many requests. Please wait before trying again." },
  });
  server.all("/api/auth/*splat", authBurstLimit, protect(60, "auth"), (req, res, next) => {
    // Preserve the stream for Better Auth; apply an absolute read deadline.
    req.setTimeout(10000);
    void Promise.resolve(authHandler(req, res)).catch(next);
  });
  server.use(express.json({ limit: "64kb" }));
  server.post("/graphql", protect(180, "graphql-ingress"), async (req, res) => {
    try {
      const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
      if (!session) { res.status(401).json({ errors: [{ message: "Sign in to access account progress.", extensions: { code: "UNAUTHENTICATED" } }] }); return; }
      const budget = await admit(db, `progress:${session.user.id}`, config.BETTER_AUTH_SECRET, 60);
      if (!budget.allowed) { res.set("Retry-After", String(budget.retryAfter)).status(429).json({ message: "Please wait before saving again." }); return; }
      const body: unknown = req.body;
      if (!body || typeof body !== "object" || Array.isArray(body)) { res.status(400).json({ message: "Expected one GraphQL operation." }); return; }
      const { query, variables, operationName } = body as Record<string, unknown>;
      if (typeof query !== "string" || query.length > 8000 || (variables !== undefined && (!variables || typeof variables !== "object" || Array.isArray(variables))) || (operationName !== undefined && typeof operationName !== "string")) { res.status(400).json({ message: "Invalid GraphQL request." }); return; }
      const document = parse(query, { maxTokens: 1000 });
      let fields = 0;
      visit(document, { Field() { fields++; }, FragmentDefinition() { fields += 100; } });
      const operations = document.definitions.filter(d => d.kind === "OperationDefinition");
      if (fields > 40 || operations.length !== 1 || operations[0].selectionSet.selections.length !== 1) { res.status(400).json({ message: "Use one bounded root field per request." }); return; }
      const errors = validate(schema, document, [...specifiedRules, NoSchemaIntrospectionCustomRule]);
      if (errors.length) { res.status(400).json({ errors: errors.map(e => ({ message: e.message })) }); return; }
      const result = await execute({ schema, document, rootValue: progressService(db, session.user.id), variableValues: variables as Record<string, unknown> | undefined, operationName });
      res.json({ ...result, ...(result.errors ? { errors: result.errors.map(error => ({ message: error.extensions.code ? error.message : "Unable to complete this request.", extensions: { code: error.extensions.code ?? "SERVICE_UNAVAILABLE" } })) } : {}) });
    } catch (error) {
      if (error instanceof GraphQLError) res.status(400).json({ errors: [{ message: "Invalid GraphQL operation." }] });
      else res.set("Retry-After", "10").status(503).json({ message: "Account service is temporarily unavailable." });
    }
  });
  server.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const status = typeof error === "object" && error !== null && "status" in error && error.status === 413 ? 413 : 400;
    res.status(status).json({ message: status === 413 ? "Request is too large." : "Unable to process this request." });
  });
  const app = await NestFactory.create(GatewayModule, new ExpressAdapter(server), { bodyParser: false, logger: false });
  await app.init();
  const cleanup = setInterval(() => { void db.admissionBucket.deleteMany({ where: { resetAt: { lt: new Date(Date.now() - 3600000) } } }).catch(() => {}); }, 3600000);
  cleanup.unref();
  return { app, db, auth, close: async () => { clearInterval(cleanup); authBurstStore.shutdown(); await app.close(); await db.$disconnect(); } };
}
