import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'dist'
};

export default nextConfig;
