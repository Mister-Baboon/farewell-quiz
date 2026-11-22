"use client";

import { CATEGORIES } from "./data/categories";
import { GUEST, type Account } from "./data/players";
import { getGuestName } from "./lib-player";
import { type Progress } from "./lib-progress";

// Google Apps Script web app (see docs/results-sheet.md). Hardcoded on purpose:
// short-lived app, the URL only lets someone append rows to one sheet.
const URL =
  process.env.NEXT_PUBLIC_RESULTS_URL ??
  "https://script.google.com/macros/s/AKfycbwtPmKjm6o4K6KFIHN5aarMvI6seiOtBWCsE6WwsaZN08JDFVSYB34Oy2e4fpMRe5Qg/exec";
const sentKey = (player: Account) => `quiz:submitted:${player}`;

export const isFinished = (progress: Progress) =>
  CATEGORIES.every((c) => (progress[c.id] ?? []).length >= c.questions.length);

function wasSent(player: Account) {
  try {
    return localStorage.getItem(sentKey(player)) === "1";
  } catch {
    return false;
  }
}

// Sends the finished player's results once. Safe to call repeatedly.
export async function submitResults(player: Account, progress: Progress) {
  if (!URL || wasSent(player) || !isFinished(progress)) return;

  const categories = CATEGORIES.map((c) => ({
    id: c.id,
    title: c.title,
    total: c.questions.length,
    correct: (progress[c.id] ?? []).filter((g, i) => g === c.questions[i].answer)
      .length,
    guesses: progress[c.id] ?? [],
  }));
  const payload = {
    player: player === GUEST ? `${GUEST} ${getGuestName()}`.trim() : player,
    finishedAt: new Date().toISOString(),
    total: categories.reduce((s, c) => s + c.total, 0),
    correct: categories.reduce((s, c) => s + c.correct, 0),
    categories,
  };

  try {
    // text/plain keeps this a "simple" request: Apps Script has no CORS preflight.
    await fetch(URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    localStorage.setItem(sentKey(player), "1");
  } catch {
    // Offline etc.: stays unsent, retried on the next visit.
  }
}
