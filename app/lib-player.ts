"use client";

import { useSyncExternalStore } from "react";
import { PLAYERS, type Player } from "./data/players";

// Which player this browser/device is. Stored locally; no server involved.
const KEY = "quiz:player";
const EVENT = "quiz:player-change";

function read(): Player | null {
  try {
    const v = localStorage.getItem(KEY);
    return PLAYERS.find((p) => p === v) ?? null;
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

export function setPlayer(p: Player | null) {
  try {
    if (p) localStorage.setItem(KEY, p);
    else localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

// undefined while hydrating, then Player | null.
export function usePlayer(): Player | null | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}
