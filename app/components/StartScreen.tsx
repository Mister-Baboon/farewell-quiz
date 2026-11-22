"use client";

import { start } from "../lib-start";
import styles from "./StartScreen.module.css";

// Just the poster and a button, no interface.
export default function StartScreen() {
  return (
    <div className={styles.root}>
      <button className={styles.button} onClick={start}>
        Начать
      </button>
    </div>
  );
}
