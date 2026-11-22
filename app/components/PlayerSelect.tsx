"use client";

import { useState } from "react";
import { ACCOUNTS, GUEST, type Account } from "../data/players";
import AvatarPicker from "./AvatarPicker";
import { getGuestName, setGuestName, setPlayer } from "../lib-player";
import styles from "./PlayerSelect.module.css";

export default function PlayerSelect() {
  const [choice, setChoice] = useState<Account>(ACCOUNTS[0]);
  const [guestName, setGuestInput] = useState("");
  const isGuest = choice === GUEST;
  const name = guestName.trim();

  return (
    <form
      className={styles.card}
      onSubmit={(e) => {
        e.preventDefault();
        if (isGuest) {
          if (!name) return;
          setGuestName(name);
        }
        setPlayer(choice);
      }}
    >
      <h1 className={styles.title}>Кто ты?</h1>
      <p className={styles.note}>у нас 2 Леши, запомни кто К и кто Г</p>
      <AvatarPicker options={ACCOUNTS} label="Свайпни и выбери себя" value={choice} onChange={setChoice} />
      {isGuest && (
        <input
          className={styles.input}
          value={guestName}
          onChange={(e) => setGuestInput(e.target.value)}
          onFocus={() => guestName || setGuestInput(getGuestName())}
          placeholder="Как тебя зовут?"
          maxLength={30}
          autoComplete="off"
          aria-label="Имя гостя"
        />
      )}
      <button className={styles.primary} type="submit" disabled={isGuest && !name}>
        Это я
      </button>
    </form>
  );
}
