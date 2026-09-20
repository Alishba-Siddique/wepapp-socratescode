"use client";
import { useMemo, useSyncExternalStore } from "react";
export type LessonProgress = {
  stage: number;
  prediction: string;
  traceIndex: number;
  choice: number;
  modifiedLimit: number;
  modifiedPrediction: string;
  makeLimit: number;
  reflection: string;
  hints: number;
  completed: boolean;
  updatedAt: number;
};
export const emptyProgress: LessonProgress = {
  stage: 0,
  prediction: "",
  traceIndex: 0,
  choice: -1,
  modifiedLimit: 4,
  modifiedPrediction: "",
  makeLimit: 4,
  reflection: "",
  hints: 0,
  completed: false,
  updatedAt: 0,
};
const key = "socratescode:lessons:v1";
const event = "socratescode:progress";
let memory = "{}";
let accountId: string | null = null;
let accountMemory = "{}";
export function guestProgress() {
  try { return parseProgress(localStorage.getItem(key) || memory); }
  catch { return parseProgress(memory); }
}
export function selectAccountProgress(id: string | null, progress: Record<string, LessonProgress> = {}) {
  accountId = id;
  accountMemory = JSON.stringify(progress);
  window.dispatchEvent(new Event(event));
}
export function currentProgress() { return parseProgress(snapshot()); }
function snapshot() {
  if (accountId) return accountMemory;
  try {
    return localStorage.getItem(key) || memory;
  } catch {
    return memory;
  }
}
function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(event, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(event, listener);
  };
}
const serverSnapshot = () => "{}";
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const count = (value: unknown, min: number, max: number, fallback: number) =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.max(min, Math.min(max, Math.trunc(value)))
    : fallback;
const text = (value: unknown, max = 600) =>
  typeof value === "string" ? value.slice(0, max) : "";
export function parseProgress(raw: string): Record<string, LessonProgress> {
  try {
    const value: unknown = JSON.parse(raw);
    if (!record(value)) return {};
    const result: Record<string, LessonProgress> = {};
    for (const [slug, data] of Object.entries(value)) {
      if (!/^[a-z0-9-]{1,80}$/.test(slug) || !record(data)) continue;
      const stage = count(data.stage, 0, 4, 0);
      result[slug] = {
        stage,
        prediction: text(data.prediction, 20),
        traceIndex: count(data.traceIndex, 0, 7, 0),
        choice: count(data.choice, -1, 2, -1),
        modifiedLimit: count(data.modifiedLimit, 2, 6, 4),
        modifiedPrediction: text(data.modifiedPrediction, 20),
        makeLimit: count(data.makeLimit, 2, 6, 4),
        reflection: text(data.reflection),
        hints: count(data.hints, 0, 999, 0),
        completed: data.completed === true && stage === 4,
        updatedAt:
          typeof data.updatedAt === "number" && Number.isFinite(data.updatedAt)
            ? data.updatedAt
            : 0,
      };
    }
    return result;
  } catch {
    return {};
  }
}
export function useProgress() {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return useMemo(() => parseProgress(raw), [raw]);
}
export function saveProgress(slug: string, change: Partial<LessonProgress>) {
  const current = parseProgress(snapshot());
  current[slug] = {
    ...emptyProgress,
    ...current[slug],
    ...change,
    updatedAt: Date.now(),
  };
  if (accountId) {
    accountMemory = JSON.stringify(current);
    window.dispatchEvent(new Event(event));
    return;
  }
  memory = JSON.stringify(current);
  try {
    localStorage.setItem(key, memory);
  } catch {
    /* Session memory remains usable when browser storage is unavailable. */
  }
  window.dispatchEvent(new Event(event));
}
