import type { JsonValue } from "./coding-problems.ts";
export type PersonalTest = { name: string; input: JsonValue; expected: JsonValue };
export const maxPersonalTests = 6;
export function parseTestValue(raw: string): JsonValue {
  if (!raw.trim() || raw.length > 1500) throw new Error("Use valid JSON up to 1,500 characters.");
  const value: unknown = JSON.parse(raw);
  let nodes = 0;
  function valid(item: unknown, depth: number): item is JsonValue {
    if (++nodes > 500 || depth > 12) return false;
    if (item === null || typeof item === "boolean" || typeof item === "string") return true;
    if (typeof item === "number") return Number.isFinite(item);
    if (typeof item !== "object") return false;
    return Object.values(item).every(child => valid(child, depth + 1));
  }
  if (!valid(value, 0)) throw new Error("Use a small JSON example with finite numbers and at most 12 nesting levels.");
  return value;
}
export function parsePersonalTests(raw: string | null): PersonalTest[] {
  if (!raw || raw.length > 50000) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return [];
    const row = value as Record<string, unknown>;
    if (row.version !== 1 || !Array.isArray(row.cases) || row.cases.length > maxPersonalTests) return [];
    return row.cases.map((item: unknown) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error();
      const entry = item as Record<string, unknown>;
      if (typeof entry.name !== "string" || !entry.name.trim() || entry.name.length > 60) throw new Error();
      return { name: entry.name, input: parseTestValue(JSON.stringify(entry.input)), expected: parseTestValue(JSON.stringify(entry.expected)) };
    });
  } catch { return []; }
}
