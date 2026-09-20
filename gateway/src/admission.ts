import { createHmac } from "node:crypto";
import type { PrismaClient } from "@prisma/client";
export async function admit(db: PrismaClient, subject: string, secret: string, limit: number, now = new Date()) {
  const resetAt = new Date(Math.floor(now.getTime() / 60000) * 60000 + 60000);
  const key = createHmac("sha256", secret).update(subject).digest("hex");
  const result = await db.$queryRaw<{ count: number }[]>`
    INSERT INTO "AdmissionBucket" ("key", "count", "resetAt") VALUES (${key}, 1, ${resetAt})
    ON CONFLICT ("key") DO UPDATE SET
    "count" = CASE WHEN "AdmissionBucket"."resetAt" <= ${now} THEN 1 ELSE "AdmissionBucket"."count" + 1 END,
    "resetAt" = CASE WHEN "AdmissionBucket"."resetAt" <= ${now} THEN ${resetAt} ELSE "AdmissionBucket"."resetAt" END
    RETURNING "count"`;
  return { allowed: result[0].count <= limit, remaining: Math.max(0, limit - result[0].count), retryAfter: Math.max(1, Math.ceil((resetAt.getTime() - now.getTime()) / 1000)) };
}
