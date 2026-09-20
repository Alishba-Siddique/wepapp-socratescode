import { createHash } from "node:crypto";
import { Prisma, type PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";
import { z } from "zod";
import { answer, getPuzzle, integer, trace } from "../../contracts/learning.js";
const stateSchema = z.object({
  stage: z.number().int().min(0).max(4), prediction: z.string().max(20),
  traceIndex: z.number().int().min(0).max(7), choice: z.number().int().min(-1).max(2),
  modifiedLimit: z.number().int().min(2).max(6), modifiedPrediction: z.string().max(20),
  makeLimit: z.number().int().min(2).max(6), reflection: z.string().max(600),
  hints: z.number().int().min(0).max(999), completed: z.boolean(), updatedAt: z.number().finite().min(0),
}).strict();
const entrySchema = z.object({ labSlug: z.string().max(80), labVersion: z.literal(1), state: z.string().max(5000) }).strict();
export const fail = (message: string, code: string): never => { throw new GraphQLError(message, { extensions: { code } }); };
function parseEntry(value: unknown) {
  const entry = entrySchema.safeParse(value);
  if (!entry.success) return fail("Invalid progress input.", "BAD_USER_INPUT");
  const puzzle = getPuzzle(entry.data.labSlug);
  if (!puzzle) return fail("Unknown lab or version.", "BAD_USER_INPUT");
  let parsed: unknown;
  try { parsed = JSON.parse(entry.data.state); } catch { return fail("Invalid progress state.", "BAD_USER_INPUT"); }
  const state = stateSchema.safeParse(parsed);
  if (!state.success) return fail("Invalid progress state.", "BAD_USER_INPUT");
  const s = state.data;
  if (s.completed && (s.stage !== 4 || integer(s.prediction) === null || s.traceIndex < trace(puzzle).length - 1 || s.choice !== puzzle.correct || s.modifiedLimit === puzzle.limit || integer(s.modifiedPrediction) !== answer(puzzle, s.modifiedLimit) || answer(puzzle, s.makeLimit) !== puzzle.target || s.reflection.trim().length < 12)) return fail("Complete the lab activities before saving completion.", "BAD_USER_INPUT");
  return { labSlug: entry.data.labSlug, labVersion: 1, state: s };
}
const display = (row: { labSlug: string; labVersion: number; revision: number; state: Prisma.JsonValue; updatedAt: Date }) => ({ ...row, state: JSON.stringify(row.state), updatedAt: row.updatedAt.toISOString() });
export function progressService(db: PrismaClient, userId: string) {
  const list = async () => (await db.progress.findMany({ where: { userId }, orderBy: { labSlug: "asc" } })).map(display);
  return {
    myProgress: list,
    saveProgress: async ({ input }: { input: Record<string, unknown> }) => {
      const { expectedRevision, ...value } = input;
      if (!Number.isInteger(expectedRevision) || (expectedRevision as number) < 0) return fail("Invalid revision.", "BAD_USER_INPUT");
      const entry = parseEntry(value);
      try {
        const row = await db.$transaction(async tx => {
          if (expectedRevision === 0) return tx.progress.create({ data: { userId, ...entry } });
          const result = await tx.progress.updateMany({ where: { userId, labSlug: entry.labSlug, revision: expectedRevision as number }, data: { ...entry, revision: { increment: 1 } } });
          if (result.count !== 1) return fail("This lab changed on another device. Reload account progress before saving.", "CONFLICT");
          return tx.progress.findUniqueOrThrow({ where: { userId_labSlug: { userId, labSlug: entry.labSlug } } });
        });
        return display(row);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return fail("This lab already has account progress. Reload before saving.", "CONFLICT");
        throw error;
      }
    },
    importGuestProgress: async ({ key, entries }: { key: string; entries: unknown[] }) => {
      if (!/^[a-zA-Z0-9-]{16,80}$/.test(key) || !Array.isArray(entries) || entries.length < 1 || entries.length > 50) return fail("Invalid import request.", "BAD_USER_INPUT");
      const parsed = entries.map(parseEntry).sort((a,b) => a.labSlug.localeCompare(b.labSlug));
      if (new Set(parsed.map(e => e.labSlug)).size !== parsed.length) return fail("Duplicate lab in import.", "BAD_USER_INPUT");
      const payloadHash = createHash("sha256").update(JSON.stringify(parsed)).digest("hex");
      try {
        await db.$transaction(async tx => {
          const prior = await tx.progressImport.findUnique({ where: { userId_key: { userId, key } } });
          if (prior) { if (prior.payloadHash !== payloadHash) fail("Import key was already used with different data.", "CONFLICT"); return; }
          await tx.progressImport.create({ data: { userId, key, payloadHash } });
          // Existing account progress wins. Guest data is never silently overwritten.
          await tx.progress.createMany({ data: parsed.map(e => ({ ...e, userId })), skipDuplicates: true });
        });
      } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")) throw error;
        const prior = await db.progressImport.findUnique({ where: { userId_key: { userId, key } } });
        if (prior?.payloadHash !== payloadHash) return fail("Import conflict. Refresh and try again.", "CONFLICT");
      }
      return list();
    },
  };
}
