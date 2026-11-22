"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "../lib-asset";
import { isVideo, videoSrc } from "../lib-video";
import styles from "./MemeCarousel.module.css";

const SWIPE_MIN = 50; // px of drag that counts as a swipe

// A clip that starts by itself when its slide appears, with a replay button.
function Clip({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const replay = () => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {}); // blocked -> the button is still there
  };
  useEffect(() => {
    ref.current?.play().catch(() => {});
  }, []);

  return (
    <>
      <video
        ref={ref}
        src={videoSrc(src)}
        playsInline
        preload="auto"
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <button
        type="button"
        className={styles.replay}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={replay}
      >
        {playing ? "▶ Играет…" : "↻ Повторить"}
      </button>
    </>
  );
}

// Several images for one question: swipe (or tap the arrows) to move on.
// It is cyclic, so after the last image you land on the first again.
export default function MemeCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const n = images.length;

  const go = (step: 1 | -1) => {
    if (n < 2) return;
    setDir(step);
    setIndex((i) => (i + step + n) % n);
  };

  // Read the drag distance from a ref, not state: a quick flick can end
  // before React re-rendered with the last pointermove, leaving dx stale.
  const dxRef = useRef(0);
  const end = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    const d = e.type === "pointerup" ? e.clientX - startX.current : dxRef.current;
    if (Math.abs(d) >= SWIPE_MIN) go(d < 0 ? 1 : -1);
    dxRef.current = 0;
    setDx(0);
  };

  return (
    <div className={styles.wrap}>
      <div
        className={styles.stage}
        role="group"
        tabIndex={0}
        aria-label={`Картинка ${index + 1} из ${n}`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          startX.current = e.clientX;
          dxRef.current = 0;
          setDragging(true);
        }}
        onPointerMove={(e) => {
          if (!dragging) return;
          dxRef.current = e.clientX - startX.current;
          setDx(dxRef.current);
        }}
        onPointerUp={end}
        onPointerCancel={end}
      >
        {/* key restarts the slide-in animation for every new image */}
        <div
          key={index}
          className={`${styles.slide} ${dragging ? styles.drag : dir === 1 ? styles.fromRight : styles.fromLeft}`}
          style={dragging ? { transform: `translateX(${dx}px)` } : undefined}
        >
          {isVideo(images[index]) ? (
            <Clip src={asset(images[index])} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={asset(images[index])} alt="" draggable={false} />
          )}
        </div>
        {n > 1 && (
          <>
            <button type="button" onPointerDown={(e) => e.stopPropagation()} className={`${styles.arrow} ${styles.prev}`} aria-label="Назад" onClick={() => go(-1)}>
              ‹
            </button>
            <button type="button" onPointerDown={(e) => e.stopPropagation()} className={`${styles.arrow} ${styles.next}`} aria-label="Дальше" onClick={() => go(1)}>
              ›
            </button>
          </>
        )}
      </div>
      {n > 1 && (
        <div className={styles.dots} aria-hidden>
          {images.map((src, i) => (
            <span key={src} className={i === index ? styles.dotOn : styles.dot} />
          ))}
        </div>
      )}
    </div>
  );
}
