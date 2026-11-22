"use client";

import { useEffect, useRef, useState } from "react";
import { type Category } from "../data/categories";
import { type Player } from "../data/players";
import MemeCarousel from "./MemeCarousel";
import { asset } from "../lib-asset";
import styles from "./screens.module.css";

export default function ReviewScreen({
  category,
  index,
  guess,
  playing,
  seconds,
  elapsed,
  onReplay,
  onNext,
}: {
  category: Category;
  index: number;
  guess: Player | undefined;
  playing: boolean;
  seconds: number;
  elapsed: number; // seconds played so far
  onReplay: () => void;
  onNext: () => void;
}) {
  const q = category.questions[index];
  const track = q.track;
  const correct = guess === q.answer;
  const last = index + 1 === category.questions.length;

  // No audio to drive the countdown (photo rounds): run our own timer and
  // move on by itself when it runs out.
  const silent = !q.audio;
  const [ownElapsed, setOwnElapsed] = useState(0);
  const nextRef = useRef(onNext);
  useEffect(() => {
    nextRef.current = onNext;
  });
  useEffect(() => {
    if (!silent) return;
    const start = Date.now();
    const id = setInterval(() => {
      const t = (Date.now() - start) / 1000;
      if (t >= seconds) {
        clearInterval(id);
        setOwnElapsed(seconds);
        nextRef.current();
      } else {
        setOwnElapsed(t);
      }
    }, 100);
    return () => clearInterval(id);
  }, [silent, seconds]);
  const shown = silent ? ownElapsed : elapsed;

  return (
    <section className={styles.section}>
      <div className={styles.meta}>
        Ответы · {category.title} · {index + 1} из {category.questions.length}
      </div>

      <div className={styles.reviewTrack}>
        {track && (
          <div className={styles.cover}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(track.cover)} alt="" width={240} height={240} />
          </div>
        )}
        {q.images && <MemeCarousel key={index} images={q.images} />}
        {!track && q.image && (
          <div className={styles.photo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(q.image)} alt="" />
          </div>
        )}
        {!track && (q.caption ?? q.revealCaption) && (
          <div className={styles.caption}>{q.caption ?? q.revealCaption}</div>
        )}
        {track && (
          <div className={styles.reviewText}>
            <div className={styles.artist}>{track.artist}</div>
            <div className={styles.song}>{track.title}</div>
          </div>
        )}
      </div>

      <div className={`${styles.verdict} ${correct ? styles.ok : styles.bad}`}>
        <div>
          <span className={styles.verdictLabel}>Твой ответ</span>
          <b>{guess ?? "—"}</b>
        </div>
        <div>
          <span className={styles.verdictLabel}>Правильный ответ</span>
          <b>{q.answer}</b>
        </div>
        <div className={styles.mark}>{correct ? "✓" : "✗"}</div>
      </div>

      <div className={styles.countdown} aria-hidden>
        <div
          className={styles.countdownFill}
          style={{ width: `${Math.min(100, (shown / seconds) * 100)}%` }}
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.primary} onClick={onNext}>
          {last ? "К категориям" : "Дальше"}
        </button>
        {!silent && (
          <button className={styles.ghost} type="button" onClick={onReplay}>
            {playing ? "♪ Играет…" : "↻ Повторить"} ({seconds} с)
          </button>
        )}
      </div>
    </section>
  );
}
