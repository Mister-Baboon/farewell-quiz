import type { NextConfig } from "next";

// On GitHub Pages a project site lives at https://<user>.github.io/<repo>/,
// so the GitHub Action sets BASE_PATH="/<repo>". Locally it stays empty.
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export", // static HTML/JS/CSS into ./out
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true }, // no image optimization server on Pages
};

export default nextConfig;
