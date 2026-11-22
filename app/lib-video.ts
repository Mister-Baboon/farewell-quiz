"use client";

export const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

// url -> in-memory blob URL, filled by preloadVideos().
const cache = new Map<string, string>();
const loading = new Set<string>();

// Download clips into memory at low priority so they start instantly later
// (same idea as preloadAudio, and it works where preload="auto" is ignored).
export function preloadVideos(urls: string[]) {
  for (const url of urls) {
    if (cache.has(url) || loading.has(url)) continue;
    loading.add(url);
    fetch(url, { priority: "low" })
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
      .then((b) => {
        cache.set(url, URL.createObjectURL(new Blob([b], { type: b.type || "video/mp4" })));
      })
      .catch(() => {}) // fall back to streaming from the network
      .finally(() => loading.delete(url));
  }
}

export const videoSrc = (url: string) => cache.get(url) ?? url;
