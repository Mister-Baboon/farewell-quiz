"use client";

import { useState } from "react";
import { ACCOUNTS, type Account } from "../data/players";
import AvatarPicker from "./AvatarPicker";
import { setPlayer } from "../lib-player";
import styles from "./PlayerSelect.module.css";

export default function PlayerSelect() {
  const [choice, setChoice] = useState<Account>(ACCOUNTS[0]);

  return (
    <form
      className={styles.card}
      onSubmit={(e) => {
        e.preventDefault();
        setPlayer(choice);
      }}
    >
      <h1 className={styles.title}>Кто ты?</h1>
      <p className={styles.note}>у нас 2 Леши, запомни кто К и кто Г</p>
      <AvatarPicker options={ACCOUNTS} label="Свайпни и выбери себя" value={choice} onChange={setChoice} />
      <button className={styles.primary} type="submit">
        Это я
      </button>
    </form>
  );
}
