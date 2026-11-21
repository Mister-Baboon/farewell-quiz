"use client";

import { useState } from "react";
import { CATEGORIES } from "../data/questions";
import { PLAYERS, type Player } from "../data/players";
import styles from "./Board.module.css";

type Pick = { c: number; q: number };

export default function Board() {
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(PLAYERS.map((p) => [p, 0])),
  );
  const [pick, setPick] = useState<Pick | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [who, setWho] = useState<Player | "">("");

  const current = pick ? CATEGORIES[pick.c].questions[pick.q] : null;

  const close = () => {
    setPick(null);
    setRevealed(false);
    setWho("");
  };

  const finish = (award: boolean) => {
    if (!pick || !current) return;
    if (award && who) {
      setScores((s) => ({ ...s, [who]: s[who] + current.value }));
    }
    setUsed((u) => new Set(u).add(`${pick.c}-${pick.q}`));
    close();
  };

  return (
    <div className={styles.wrap}>
      <div
        className={styles.board}
        style={{ gridTemplateColumns: `repeat(${CATEGORIES.length}, 1fr)` }}
      >
        {CATEGORIES.map((cat) => (
          <div key={cat.title} className={styles.category}>
            {cat.title}
          </div>
        ))}
        {CATEGORIES[0].questions.map((_, q) =>
          CATEGORIES.map((cat, c) => {
            const done = used.has(`${c}-${q}`);
            return (
              <button
                key={`${c}-${q}`}
                className={styles.cell}
                disabled={done}
                onClick={() => setPick({ c, q })}
              >
                {done ? "" : cat.questions[q].value}
              </button>
            );
          }),
        )}
      </div>

      <ul className={styles.scores}>
        {PLAYERS.map((p) => (
          <li key={p}>
            <span>{p}</span>
            <b>{scores[p]}</b>
          </li>
        ))}
      </ul>

      {pick && current && (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <div className={styles.meta}>
              {CATEGORIES[pick.c].title} · {current.value}
            </div>
            <p className={styles.question}>{current.question}</p>

            {revealed ? (
              <p className={styles.answer}>{current.answer}</p>
            ) : (
              <button className={styles.secondary} onClick={() => setRevealed(true)}>
                Показать ответ
              </button>
            )}

            <label className={styles.label}>
              Кто отвечал?
              <select
                value={who}
                onChange={(e) => setWho(e.target.value as Player | "")}
              >
                <option value="">— выберите —</option>
                {PLAYERS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <div className={styles.actions}>
              <button className={styles.primary} disabled={!who} onClick={() => finish(true)}>
                Засчитать +{current.value}
              </button>
              <button className={styles.secondary} onClick={() => finish(false)}>
                Никто не ответил
              </button>
              <button className={styles.ghost} onClick={close}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
