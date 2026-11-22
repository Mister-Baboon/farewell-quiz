"use client";

import { useEffect } from "react";
import { CATEGORIES } from "../data/categories";
import { asset } from "../lib-asset";
import { AVATARS } from "../data/players";
import { preloadAudio } from "../lib-audio";
import { preloadImages } from "../lib-images";
import { isVideo, preloadVideos } from "../lib-video";
import { setPlayer, usePlayer } from "../lib-player";
import { useStarted } from "../lib-start";
import PlayerSelect from "./PlayerSelect";
import Round from "./Round";
import StartScreen from "./StartScreen";
import styles from "./screens.module.css";

export default function Game() {
  const player = usePlayer();
  const started = useStarted();

  // Avatars first (the picker needs them right away), then tracks and photos.
  useEffect(() => {
    preloadImages(Object.values(AVATARS).map(asset), "high");
    preloadAudio(
      CATEGORIES.flatMap((c) => c.questions)
        .flatMap((q) => (q.audio ? [asset(q.audio)] : [])),
    );
    // Same for every picture: question photos, meme sets, album covers.
    const questions = CATEGORIES.flatMap((c) => c.questions);
    const media = questions
      .flatMap((q) => [q.image, q.track?.cover, ...(q.images ?? [])])
      .filter((src): src is string => !!src)
      .map(asset);
    preloadImages(media.filter((src) => !isVideo(src)), "low");
    preloadVideos(media.filter(isVideo)); // clips last, low priority
  }, []);

  if (player === undefined || started === undefined) return null; // hydrating
  if (!started) return <StartScreen />;
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
