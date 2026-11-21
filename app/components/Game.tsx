"use client";

import { useEffect } from "react";
import { CATEGORIES } from "../data/categories";
import { asset } from "../lib-asset";
import { preloadAudio } from "../lib-audio";
import { setPlayer, usePlayer } from "../lib-player";
import PlayerSelect from "./PlayerSelect";
import Round from "./Round";
import styles from "./screens.module.css";

export default function Game() {
  const player = usePlayer();

  // Start downloading every track as soon as the page opens.
  useEffect(() => {
    preloadAudio(
      CATEGORIES.flatMap((c) => c.questions)
        .flatMap((q) => (q.audio ? [asset(q.audio)] : [])),
    );
    // Warm the browser cache with the photos too.
    for (const q of CATEGORIES.flatMap((c) => c.questions)) {
      if (q.image) new Image().src = asset(q.image);
    }
  }, []);

  if (player === undefined) return null; // hydrating
  if (player === null) return <PlayerSelect />;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span>
          Играет: <b>{player}</b>
        </span>
        <button className={styles.ghost} onClick={() => setPlayer(null)}>
          Это не я
        </button>
      </header>
      <Round key={player} player={player} />
    </div>
  );
}
