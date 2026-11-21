"use client";

import { useMemo, useSyncExternalStore } from "react";
import { PLAYERS, type Player } from "./data/players";

// Per-player answers, kept in this browser: categoryId -> guesses in order.
export type Progress = Record<string, Player[]>;

const EVENT = "quiz:progress-change";
const key = (player: Player) => `quiz:progress:${player}`;

function readRaw(player: Player): string {
  try {
    return localStorage.getItem(key(player)) ?? "";
  } catch {
    return "";
  }
}

function parse(raw: string): Progress {
  try {
    const data = JSON.parse(raw || "{}");
    const out: Progress = {};
    for (const [cat, guesses] of Object.entries(data)) {
      if (Array.isArray(guesses)) {
        out[cat] = guesses.filter((g): g is Player =>
          PLAYERS.includes(g as Player),
        );
      }
    }
    return out;
  } catch {
    return {};
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

export function useProgress(player: Player): Progress {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(player),
    () => "",
  );
  return useMemo(() => parse(raw), [raw]);
}

export function saveAnswer(player: Player, categoryId: string, guess: Player) {
  const progress = parse(readRaw(player));
  progress[categoryId] = [...(progress[categoryId] ?? []), guess];
  try {
    localStorage.setItem(key(player), JSON.stringify(progress));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}
