"use client";

import { useSyncExternalStore } from "react";

// The start screen shows once per browser session (a reload keeps playing).
const KEY = "quiz:started";
const EVENT = "quiz:start-change";

function read(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

let startedInMemory = false; // fallback when sessionStorage is blocked

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

export function start() {
  startedInMemory = true;
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

// undefined while hydrating.
export function useStarted(): boolean | undefined {
  return useSyncExternalStore(
    subscribe,
    () => read() || startedInMemory,
    () => undefined,
  );
}
