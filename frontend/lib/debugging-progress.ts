"use client";
import { useSyncExternalStore } from "react";
import { debuggingSteps, parseDebuggingProgress } from "./debugging-method";
export const debuggingKey = "socratescode:debugging-method:v1";
let completed = 0;
let temporary = false;
function snapshot() {
  if (!temporary) {
    try { completed = parseDebuggingProgress(localStorage.getItem(debuggingKey)); }
    catch { temporary = true; }
  }
  return `${temporary ? "1" : "0"}:${completed}`;
}
function subscribe(listener: () => void) {
  const storage = (event: StorageEvent) => { if (event.key === debuggingKey || event.key === null) listener(); };
  window.addEventListener("storage", storage);
  window.addEventListener("debugging-progress", listener);
  return () => { window.removeEventListener("storage", storage); window.removeEventListener("debugging-progress", listener); };
}
export function completeDebuggingStep(index: number) {
  snapshot();
  if (!Number.isInteger(index) || index < 0 || index > completed || index >= debuggingSteps.length) return;
  completed = Math.max(completed, index + 1);
  try { localStorage.setItem(debuggingKey, JSON.stringify({ version: 1, completed })); temporary = false; }
  catch { temporary = true; }
  window.dispatchEvent(new Event("debugging-progress"));
}
export function useDebuggingProgress() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "0:0");
  return { completed: Number(raw.slice(2)), temporary: raw[0] === "1" };
}
