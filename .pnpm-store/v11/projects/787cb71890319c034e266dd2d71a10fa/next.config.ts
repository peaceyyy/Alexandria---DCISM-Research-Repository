import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.8.159", "10.16.47.74"],
  experimental: {
    serverActions: {
      // Allows the agreed 10 MiB PDF plus submission metadata and multipart overhead.
      // Application validation still enforces an exact 10 MiB file maximum.
      bodySizeLimit: "11mb",
    },
  },
};

export default nextConfig;
