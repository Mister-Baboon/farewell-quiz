"use client";

// Keep references so the browser doesn't drop in-flight loads, and never
// request the same file twice.
const started = new Map<string, HTMLImageElement>();

export function preloadImages(urls: string[]) {
  for (const url of urls) {
    if (started.has(url)) continue;
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    started.set(url, img);
  }
}
