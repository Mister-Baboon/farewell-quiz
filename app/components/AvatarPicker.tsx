"use client";

import { useRef, useState } from "react";
import { AVATARS, PLAYERS, type Account, type Player } from "../data/players";
import { asset } from "../lib-asset";
import styles from "./AvatarPicker.module.css";

const STEP = 112; // px between sphere centers
const SWIPE_MIN = 36; // px of drag that counts as a swipe

export default function AvatarPicker<T extends Account = Player>({
  value,
  onChange,
  label,
  options = PLAYERS as unknown as readonly T[],
}: {
  value: T;
  onChange: (p: T) => void;
  label: string;
  options?: readonly T[];
}) {
  const index = options.indexOf(value);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const moved = useRef(false);

  const go = (i: number) => {
    const next = Math.max(0, Math.min(options.length - 1, i));
    if (next !== index) onChange(options[next]);
  };

  const end = () => {
    if (!dragging) return;
    setDragging(false);
    if (Math.abs(dx) >= SWIPE_MIN) {
      const jump = Math.max(1, Math.round(Math.abs(dx) / STEP));
      go(index + (dx < 0 ? jump : -jump));
    }
    setDx(0);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.label}>{label}</div>
      <div
        className={`${styles.stage} ${dragging ? styles.dragging : ""}`}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={1}
        aria-valuemax={options.length}
        aria-valuenow={index + 1}
        aria-valuetext={value}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1);
          if (e.key === "ArrowLeft") go(index - 1);
        }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          startX.current = e.clientX;
          moved.current = false;
          setDragging(true);
        }}
        onPointerMove={(e) => {
          if (!dragging) return;
          const d = e.clientX - startX.current;
          if (Math.abs(d) > 6) moved.current = true;
          setDx(d);
        }}
        onPointerUp={end}
        onPointerCancel={end}
      >
        {options.map((p, i) => {
          const offset = i - index + dx / STEP;
          const abs = Math.abs(offset);
          const active = i === index;
          return (
            <div
              key={p}
              className={styles.slot}
              style={{
                transform: `translateX(${offset * STEP}px) scale(${Math.max(0.5, 1 - 0.28 * abs)})`,
                opacity: Math.max(0, 1 - 0.38 * abs),
                zIndex: 10 - Math.round(abs),
                pointerEvents: abs > 2.5 ? "none" : "auto",
              }}
              onClick={() => {
                if (!moved.current) go(i);
              }}
            >
              <div className={`${styles.sphere} ${active ? styles.active : ""}`}>
                {p in AVATARS ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset(AVATARS[p as Player])}
                    alt=""
                    draggable={false}
                  />
                ) : (
                  <span className={styles.unknown}>?</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.name} aria-live="polite">
        {value}
      </div>
      <div className={styles.dots} aria-hidden>
        {options.map((p, i) => (
          <span key={p} className={i === index ? styles.dotOn : styles.dot} />
        ))}
      </div>
    </div>
  );
}
