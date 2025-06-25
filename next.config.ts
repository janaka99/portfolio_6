import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://utfs.io/**"),
      new URL("https://9vjgqjrrj8.ufs.sh/**"),
    ],
  },
};

export default nextConfig;
