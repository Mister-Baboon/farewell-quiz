"use client";

import { useState } from "react";
import { PLAYERS, type Player } from "../data/players";
import { setPlayer } from "../lib-player";
import styles from "./PlayerSelect.module.css";

export default function PlayerSelect() {
  const [choice, setChoice] = useState<Player | "">("");

  return (
    <form
      className={styles.card}
      onSubmit={(e) => {
        e.preventDefault();
        if (choice) setPlayer(choice);
      }}
    >
      <h1 className={styles.title}>Кто ты?</h1>
      <select
        className={styles.select}
        value={choice}
        onChange={(e) => setChoice(e.target.value as Player | "")}
        aria-label="Выбери себя"
      >
        <option value="">— выбери себя —</option>
        {PLAYERS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <button className={styles.primary} type="submit" disabled={!choice}>
        Продолжить
      </button>
    </form>
  );
}
