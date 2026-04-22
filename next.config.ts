import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "clips.snapfury.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },   // Google avatars
      { protocol: "https", hostname: "cdn.discordapp.com" },           // Discord avatars
      { protocol: "https", hostname: "static-cdn.jtvnw.net" },         // Twitch avatars
    ],
  },
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
