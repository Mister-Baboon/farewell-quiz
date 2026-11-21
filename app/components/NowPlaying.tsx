"use client";

import styles from "./NowPlaying.module.css";

const BARS = 28;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export default function NowPlaying({
  playing,
  current,
  duration,
  onReplay,
}: {
  playing: boolean;
  current: number;
  duration: number;
  onReplay: () => void;
}) {
  const pct = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <div className={`${styles.player} ${playing ? styles.on : ""}`}>
      <div className={styles.disc} aria-hidden>
        <span className={styles.ring} />
        <span className={styles.ring} />
        <span className={styles.ring} />
        <span className={styles.vinyl}>
          <span className={styles.label}>♪</span>
        </span>
      </div>

      <div className={styles.bars} aria-hidden>
        {Array.from({ length: BARS }, (_, i) => (
          <span
            key={i}
            className={styles.bar}
            style={{
              animationDuration: `${0.5 + ((i * 37) % 11) / 12}s`,
              animationDelay: `${-((i * 53) % 17) / 10}s`,
            }}
          />
        ))}
      </div>

      <div className={styles.progress}>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${pct}%` }} />
        </div>
        <div className={styles.times}>
          <span>{fmt(current)}</span>
          <span>{duration ? fmt(duration) : "–:––"}</span>
        </div>
      </div>

      <button type="button" className={styles.replay} onClick={onReplay}>
        ↻ Повторить
      </button>
    </div>
  );
}
