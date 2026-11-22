"use client";

import { useSyncExternalStore } from "react";
import { ACCOUNTS, GUEST, type Account } from "./data/players";

// Which player this browser/device is. Stored locally; no server involved.
const KEY = "quiz:player";
const EVENT = "quiz:player-change";

function read(): Account | null {
  try {
    const v = localStorage.getItem(KEY);
    return ACCOUNTS.find((p) => p === v) ?? null;
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

export function setPlayer(p: Account | null) {
  try {
    if (p) localStorage.setItem(KEY, p);
    else localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

// undefined while hydrating, then Account | null.
export function usePlayer(): Account | null | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}

// A guest types a name; it is sent to the results sheet as "Гость <name>".
const GUEST_KEY = "quiz:guest-name";

export function getGuestName(): string {
  try {
    return localStorage.getItem(GUEST_KEY) ?? "";
  } catch {
    return "";
  }
}

// A different guest on the same device starts from scratch.
export function setGuestName(name: string) {
  try {
    if (getGuestName() !== name) {
      localStorage.removeItem(`quiz:progress:${GUEST}`);
      localStorage.removeItem(`quiz:submitted:${GUEST}`);
      window.dispatchEvent(new Event("quiz:progress-change"));
    }
    localStorage.setItem(GUEST_KEY, name);
  } catch {}
}
