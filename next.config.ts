import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // distDir: 'dist' // Cloudflare Pagesは'out'ディレクトリを期待するためコメントアウト
};

export default nextConfig;
