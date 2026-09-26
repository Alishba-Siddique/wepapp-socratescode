"use client";
import { useSyncExternalStore } from "react";
import { parseBeginner, emptyBeginner, type BeginnerProgress } from "./beginner";
export const beginnerKey = "socratescode:beginner:v1";
const initial = JSON.stringify(emptyBeginner);
let memory = initial;
let volatile = false;
function snapshot() {
  if (!volatile) {
    try { memory = JSON.stringify(parseBeginner(localStorage.getItem(beginnerKey))); }
    catch { volatile = true; }
  }
  return `${volatile ? "1" : "0"}${memory}`;
}
function subscribe(listener: () => void) {
  const storage = (event: StorageEvent) => { if (event.key === beginnerKey || event.key === null) listener(); };
  window.addEventListener("storage", storage);
  window.addEventListener("beginner-progress", listener);
  return () => { window.removeEventListener("storage", storage); window.removeEventListener("beginner-progress", listener); };
}
export function readBeginnerProgress() { return parseBeginner(snapshot().slice(1)); }
export function saveBeginnerProgress(progress: BeginnerProgress) {
  memory = JSON.stringify(parseBeginner(JSON.stringify(progress)));
  try { localStorage.setItem(beginnerKey, memory); volatile = false; }
  catch { volatile = true; }
  window.dispatchEvent(new Event("beginner-progress"));
}
export function useBeginnerProgress() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => `0${initial}`);
  return { progress: parseBeginner(raw.slice(1)), temporary: raw[0] === "1" };
}
