"use client";

import { useState } from "react";
import { PLAYERS, type Player } from "../data/players";
import AvatarPicker from "./AvatarPicker";
import { setPlayer } from "../lib-player";
import styles from "./PlayerSelect.module.css";

export default function PlayerSelect() {
  const [choice, setChoice] = useState<Player>(PLAYERS[0]);

  return (
    <form
      className={styles.card}
      onSubmit={(e) => {
        e.preventDefault();
        setPlayer(choice);
      }}
    >
      <h1 className={styles.title}>Кто ты?</h1>
      <AvatarPicker label="Свайпни и выбери себя" value={choice} onChange={setChoice} />
      <button className={styles.primary} type="submit">
        Это я
      </button>
    </form>
  );
}
