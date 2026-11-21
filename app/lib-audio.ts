"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// url -> in-memory blob URL, filled by preloadAudio().
const cache = new Map<string, string>();
const loading = new Map<string, Promise<void>>();

// Download tracks into memory so playback starts instantly (and works even
// where the browser ignores preload="auto", e.g. iOS Safari).
export function preloadAudio(urls: string[]) {
  for (const url of urls) {
    if (cache.has(url) || loading.has(url)) continue;
    loading.set(
      url,
      fetch(url)
        .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
        .then((b) => {
          const typed = new Blob([b], { type: b.type || "audio/mp4" });
          cache.set(url, URL.createObjectURL(typed));
        })
        .catch(() => {}) // fall back to streaming from the network
        .finally(() => loading.delete(url)),
    );
  }
}

// One long-lived <audio> for the whole round. play() must be called from a
// click handler: that is what lets iOS/Safari keep autoplaying later tracks.
export function useAudio(onFinish?: () => void) {
  const finishRef = useRef(onFinish);
  const firedRef = useRef(false);
  useEffect(() => {
    finishRef.current = onFinish;
  });
  const ref = useRef<HTMLAudioElement | null>(null);
  const limitRef = useRef<number | null>(null); // optional max seconds
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState({ current: 0, duration: 0 });

  useEffect(() => {
    const a = new Audio();
    a.preload = "auto";
    ref.current = a;

    // Called once per play: when the time limit hits or the track ends.
    const fire = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      finishRef.current?.();
    };
    const sync = () => {
      const limit = limitRef.current;
      if (limit !== null && a.currentTime >= limit) {
        a.pause();
        fire();
      }
      setTime({
        current: a.currentTime,
        duration: Number.isFinite(a.duration) ? a.duration : 0,
      });
    };
    const on = () => setPlaying(true);
    const off = () => setPlaying(false);
    const ended = () => {
      setPlaying(false);
      fire();
    };

    a.addEventListener("playing", on);
    a.addEventListener("pause", off);
    a.addEventListener("ended", ended);
    a.addEventListener("timeupdate", sync);
    a.addEventListener("loadedmetadata", sync);

    return () => {
      a.pause();
      a.removeAttribute("src");
      a.load();
      a.removeEventListener("playing", on);
      a.removeEventListener("pause", off);
      a.removeEventListener("ended", ended);
      a.removeEventListener("timeupdate", sync);
      a.removeEventListener("loadedmetadata", sync);
    };
  }, []);

  // maxSeconds: stop the track after that long (used on the answers screen).
  const play = useCallback((src: string, maxSeconds?: number) => {
    const a = ref.current;
    if (!a) return;
    limitRef.current = maxSeconds ?? null;
    firedRef.current = false;
    a.src = cache.get(src) ?? src;
    a.currentTime = 0;
    a.play().catch(() => {}); // blocked -> user can press replay
  }, []);

  const replay = useCallback(() => {
    const a = ref.current;
    if (!a) return;
    firedRef.current = false;
    a.currentTime = 0;
    a.play().catch(() => {});
  }, []);

  const stop = useCallback(() => {
    ref.current?.pause();
  }, []);

  return { playing, time, play, replay, stop };
}
